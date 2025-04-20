package com.smartshipd.order.service;

import com.smartshipd.common.dto.OrderRequest;
import com.smartshipd.order.entity.OrderEntity;
import com.smartshipd.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final NotificationClient notificationClient;
    
    @Autowired
    public OrderService(OrderRepository orderRepository, NotificationClient notificationClient) {
        this.orderRepository = orderRepository;
        this.notificationClient = notificationClient;
    }
    
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public List<OrderEntity> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
    
    public List<OrderEntity> getOrdersByDriverId(Long driverId) {
        return orderRepository.findByAssignedDriverId(driverId);
    }
    
    public List<OrderEntity> getOrdersByStatus(OrderEntity.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    public OrderEntity getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }
    
    @Transactional
    public OrderEntity createOrder(Long customerId, OrderRequest request) {
        OrderEntity order = new OrderEntity();
        order.setCustomerId(customerId);
        order.setProductDetails(request.getProductDetails());
        order.setPickupAddress(request.getPickupAddress());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        order.setStatus(OrderEntity.OrderStatus.PROCESSING);
        
        // Tính toán chi phí giao hàng dựa trên khoảng cách và trọng lượng
        BigDecimal deliveryCost = calculateDeliveryCost(request.getPickupAddress(), request.getDeliveryAddress(), request.getProductDetails());
        order.setDeliveryCost(deliveryCost);
        
        OrderEntity savedOrder = orderRepository.save(order);
        
        // Gửi thông báo
        notificationClient.sendNotification(
                "ORDER_CREATED",
                "Your order #" + savedOrder.getOrderId() + " has been created and is being processed.",
                customerId
        );
        
        return savedOrder;
    }
    
    @Transactional
    public OrderEntity updateOrder(Long orderId, Map<String, Object> updates) {
        OrderEntity order = getOrderById(orderId);
        
        if (updates.containsKey("status")) {
            OrderEntity.OrderStatus newStatus = OrderEntity.OrderStatus.valueOf(updates.get("status").toString());
            order.setStatus(newStatus);
            
            // Gửi thông báo khi trạng thái thay đổi
            notificationClient.sendNotification(
                    "ORDER_STATUS_CHANGED",
                    "Your order #" + orderId + " status has been updated to " + newStatus,
                    order.getCustomerId()
            );
        }
        
        if (updates.containsKey("assignedDriverId")) {
            Long driverId = Long.valueOf(updates.get("assignedDriverId").toString());
            order.setAssignedDriverId(driverId);
            
            // Gửi thông báo khi tài xế được phân công
            notificationClient.sendNotification(
                    "DRIVER_ASSIGNED",
                    "A driver has been assigned to your order #" + orderId,
                    order.getCustomerId()
            );
        }
        
        return orderRepository.save(order);
    }
    
    @Transactional
    public void deleteOrder(Long orderId) {
        OrderEntity order = getOrderById(orderId);
        orderRepository.delete(order);
        
        // Gửi thông báo khi đơn hàng bị xóa
        notificationClient.sendNotification(
                "ORDER_DELETED",
                "Your order #" + orderId + " has been deleted",
                order.getCustomerId()
        );
    }
    
    // Phương thức tính toán chi phí giao hàng
    private BigDecimal calculateDeliveryCost(String pickupAddress, String deliveryAddress, Map<String, Object> productDetails) {
        // Giả lập tính toán chi phí dựa trên khoảng cách và trọng lượng
        // Trong thực tế, có thể sử dụng API Google Maps để tính khoảng cách
        
        // Giả sử chi phí cơ bản là 50,000 VND
        BigDecimal baseCost = new BigDecimal("50000");
        
        // Giả sử chi phí theo trọng lượng là 10,000 VND/kg
        BigDecimal weightCost = BigDecimal.ZERO;
        if (productDetails.containsKey("weight")) {
            double weight = Double.parseDouble(productDetails.get("weight").toString());
            weightCost = new BigDecimal(weight * 10000);
        }
        
        // Tổng chi phí
        return baseCost.add(weightCost);
    }
}
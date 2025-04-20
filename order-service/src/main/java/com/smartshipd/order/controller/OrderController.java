package com.smartshipd.order.controller;

import com.smartshipd.common.dto.ApiResponse;
import com.smartshipd.common.dto.OrderRequest;
import com.smartshipd.order.entity.OrderEntity;
import com.smartshipd.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderEntity>>> getAllOrders() {
        List<OrderEntity> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<OrderEntity>>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<OrderEntity> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }
    
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<OrderEntity>>> getOrdersByDriverId(@PathVariable Long driverId) {
        List<OrderEntity> orders = orderService.getOrdersByDriverId(driverId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<OrderEntity>>> getOrdersByStatus(@PathVariable String status) {
        OrderEntity.OrderStatus orderStatus = OrderEntity.OrderStatus.valueOf(status);
        List<OrderEntity> orders = orderService.getOrdersByStatus(orderStatus);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderEntity>> getOrderById(@PathVariable Long orderId) {
        try {
            OrderEntity order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderEntity>> createOrder(
            @RequestHeader("X-User-ID") Long customerId,
            @Valid @RequestBody OrderRequest request) {
        try {
            OrderEntity order = orderService.createOrder(customerId, request);
            return ResponseEntity.ok(ApiResponse.success("Order created successfully", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderEntity>> updateOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> updates) {
        try {
            OrderEntity order = orderService.updateOrder(orderId, updates);
            return ResponseEntity.ok(ApiResponse.success("Order updated successfully", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
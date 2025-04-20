package com.smartshipd.common.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long orderId;
    private Long customerId;
    private Map<String, Object> productDetails;
    private OrderStatus status;
    private Long assignedDriverId;
    private String pickupAddress;
    private String deliveryAddress;
    private LocalDate expectedDeliveryDate;
    private BigDecimal deliveryCost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        PROCESSING, ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED
    }
}
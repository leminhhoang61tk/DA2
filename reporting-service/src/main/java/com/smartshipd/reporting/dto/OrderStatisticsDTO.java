package com.smartshipd.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticsDTO {
    private int totalOrders;
    private int processingOrders;
    private int assignedOrders;
    private int inTransitOrders;
    private int deliveredOrders;
    private int cancelledOrders;
    private BigDecimal totalRevenue;
    private Map<String, Integer> ordersByDate;
}
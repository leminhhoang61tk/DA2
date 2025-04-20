package com.smartshipd.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverPerformanceDTO {
    private List<DriverStatDTO> driverStats;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriverStatDTO {
        private Long driverId;
        private String driverName;
        private int totalOrders;
        private int deliveredOrders;
        private double averageDeliveryTime; // in minutes
        private double onTimeDeliveryRate; // percentage
    }
}
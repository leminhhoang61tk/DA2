package com.smartshipd.common.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    private Long driverId;
    private Long userId;
    private String name;
    private String phone;
    private DriverStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum DriverStatus {
        AVAILABLE, BUSY, OFFLINE
    }
}
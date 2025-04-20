package com.smartshipd.tracking.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "tracking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingDocument {
    @Id
    private String id;
    
    @Indexed
    private Long orderId;
    
    private Long driverId;
    
    private Location location;
    
    private LocalDateTime timestamp;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        private double latitude;
        private double longitude;
    }
}
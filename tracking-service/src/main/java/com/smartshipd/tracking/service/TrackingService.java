package com.smartshipd.tracking.service;

import com.smartshipd.tracking.document.TrackingDocument;
import com.smartshipd.tracking.repository.TrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrackingService {
    
    private final TrackingRepository trackingRepository;
    
    @Autowired
    public TrackingService(TrackingRepository trackingRepository) {
        this.trackingRepository = trackingRepository;
    }
    
    public TrackingDocument updateLocation(Long orderId, Long driverId, double latitude, double longitude) {
        TrackingDocument tracking = new TrackingDocument();
        tracking.setOrderId(orderId);
        tracking.setDriverId(driverId);
        
        TrackingDocument.Location location = new TrackingDocument.Location();
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        tracking.setLocation(location);
        
        tracking.setTimestamp(LocalDateTime.now());
        
        return trackingRepository.save(tracking);
    }
    
    public List<TrackingDocument> getLocationHistory(Long orderId) {
        return trackingRepository.findByOrderIdOrderByTimestampDesc(orderId);
    }
    
    public TrackingDocument getCurrentLocation(Long orderId) {
        return trackingRepository.findFirstByOrderIdOrderByTimestampDesc(orderId)
                .orElseThrow(() -> new RuntimeException("No tracking information found for order: " + orderId));
    }
}
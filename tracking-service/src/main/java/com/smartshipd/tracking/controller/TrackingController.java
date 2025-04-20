package com.smartshipd.tracking.controller;

import com.smartshipd.common.dto.ApiResponse;
import com.smartshipd.tracking.document.TrackingDocument;
import com.smartshipd.tracking.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracking")
public class TrackingController {
    
    private final TrackingService trackingService;
    
    @Autowired
    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }
    
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<TrackingDocument>> updateLocation(
            @RequestParam Long orderId,
            @RequestParam Long driverId,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        try {
            TrackingDocument tracking = trackingService.updateLocation(orderId, driverId, latitude, longitude);
            return ResponseEntity.ok(ApiResponse.success("Location updated successfully", tracking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<TrackingDocument>> getCurrentLocation(@PathVariable Long orderId) {
        try {
            TrackingDocument tracking = trackingService.getCurrentLocation(orderId);
            return ResponseEntity.ok(ApiResponse.success(tracking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{orderId}/history")
    public ResponseEntity<ApiResponse<List<TrackingDocument>>> getLocationHistory(@PathVariable Long orderId) {
        List<TrackingDocument> trackingHistory = trackingService.getLocationHistory(orderId);
        return ResponseEntity.ok(ApiResponse.success(trackingHistory));
    }
}
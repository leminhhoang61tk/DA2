package com.smartshipd.notification.controller;

import com.smartshipd.common.dto.ApiResponse;
import com.smartshipd.notification.entity.NotificationEntity;
import com.smartshipd.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<NotificationEntity>> sendNotification(
            @RequestParam String type,
            @RequestParam String content,
            @RequestParam Long recipientId) {
        try {
            NotificationEntity notification = notificationService.sendNotification(type, content, recipientId);
            return ResponseEntity.ok(ApiResponse.success("Notification sent successfully", notification));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<ApiResponse<List<NotificationEntity>>> getNotificationsByRecipientId(@PathVariable Long recipientId) {
        List<NotificationEntity> notifications = notificationService.getNotificationsByRecipientId(recipientId);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
    
    @GetMapping("/recipient/{recipientId}/unread")
    public ResponseEntity<ApiResponse<List<NotificationEntity>>> getUnreadNotificationsByRecipientId(@PathVariable Long recipientId) {
        List<NotificationEntity> notifications = notificationService.getUnreadNotificationsByRecipientId(recipientId);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
    
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationEntity>> markNotificationAsRead(@PathVariable Long notificationId) {
        try {
            NotificationEntity notification = notificationService.markNotificationAsRead(notificationId);
            return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/recipient/{recipientId}/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsAsRead(@PathVariable Long recipientId) {
        try {
            notificationService.markAllNotificationsAsRead(recipientId);
            return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
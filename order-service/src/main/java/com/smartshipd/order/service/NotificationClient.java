package com.smartshipd.order.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service")
public interface NotificationClient {
    
    @PostMapping("/notifications")
    void sendNotification(
            @RequestParam("type") String type,
            @RequestParam("content") String content,
            @RequestParam("recipientId") Long recipientId
    );
}
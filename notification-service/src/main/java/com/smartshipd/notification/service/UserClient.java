package com.smartshipd.notification.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service")
public interface UserClient {
    
    @GetMapping("/users/{userId}/email")
    String getUserEmail(@PathVariable("userId") Long userId);
}
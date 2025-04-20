package com.smartshipd.reporting.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@FeignClient(name = "driver-service")
public interface DriverClient {
    
    @GetMapping("/drivers")
    List<Map<String, Object>> getAllDrivers();
}
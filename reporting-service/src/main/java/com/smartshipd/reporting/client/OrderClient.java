package com.smartshipd.reporting.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "order-service")
public interface OrderClient {
    
    @GetMapping("/orders")
    List<Map<String, Object>> getAllOrders();
    
    @GetMapping("/orders/status/{status}")
    List<Map<String, Object>> getOrdersByStatus(@PathVariable("status") String status);
    
    @GetMapping("/orders/driver/{driverId}")
    List<Map<String, Object>> getOrdersByDriverId(@PathVariable("driverId") Long driverId);
}
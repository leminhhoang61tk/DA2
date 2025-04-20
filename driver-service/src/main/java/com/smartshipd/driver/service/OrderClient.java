package com.smartshipd.driver.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "order-service")
public interface OrderClient {

    @PutMapping("/orders/{orderId}")
    void updateOrder(@PathVariable("orderId") Long orderId, @RequestBody Map<String, Object> updates);
}
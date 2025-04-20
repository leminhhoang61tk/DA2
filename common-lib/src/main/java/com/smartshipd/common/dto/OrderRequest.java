package com.smartshipd.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Map<String, Object> productDetails;
    private String pickupAddress;
    private String deliveryAddress;
    private LocalDate expectedDeliveryDate;
}
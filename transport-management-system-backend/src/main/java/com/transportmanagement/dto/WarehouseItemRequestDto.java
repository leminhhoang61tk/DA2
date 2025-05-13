package com.transportmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WarehouseItemRequestDto {
    private Long warehouseId;
    private Long itemId;
    private Double quantity;
    private String position;

}
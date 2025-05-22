package com.transportmanagement.service;

import com.transportmanagement.dto.WarehouseRequestDto;
import com.transportmanagement.dto.WarehouseResponseDto;
import java.util.List;

public interface WarehouseService {
    WarehouseResponseDto createWarehouse(WarehouseRequestDto request);
    WarehouseResponseDto getWarehouseById(Long id);
    List<WarehouseResponseDto> getAllWarehouses();
    WarehouseResponseDto updateWarehouse(Long id, WarehouseRequestDto request);
    void deleteWarehouse(Long id);
}

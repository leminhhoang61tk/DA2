package com.transportmanagement.service;

import com.transportmanagement.dao.WarehouseDao;
import com.transportmanagement.dto.WarehouseRequestDto;
import com.transportmanagement.dto.WarehouseResponseDto;
import com.transportmanagement.entity.Warehouse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WarehouseServiceImpl implements WarehouseService {

    @Autowired
    private WarehouseDao warehouseDao;

    @Override
    public WarehouseResponseDto createWarehouse(WarehouseRequestDto request) {
        Warehouse warehouse = new Warehouse();
        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
        warehouse.setCapacity(request.getCapacity());
        warehouse.setStatus(request.getStatus());
        warehouse.setCreatedDate(LocalDateTime.now());
        warehouse.setLastModifiedDate(LocalDateTime.now());

        warehouse = warehouseDao.save(warehouse);
        return convertToDto(warehouse);
    }

    @Override
    public WarehouseResponseDto getWarehouseById(Long id) {
        Warehouse warehouse = warehouseDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kho với ID: " + id));
        return convertToDto(warehouse);
    }

    @Override
    public List<WarehouseResponseDto> getAllWarehouses() {
        List<Warehouse> warehouses = warehouseDao.findAll();
        return warehouses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public WarehouseResponseDto updateWarehouse(Long id, WarehouseRequestDto request) {
        Warehouse warehouse = warehouseDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kho với ID: " + id));

        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
        warehouse.setCapacity(request.getCapacity());
        warehouse.setStatus(request.getStatus());
        warehouse.setLastModifiedDate(LocalDateTime.now());

        warehouse = warehouseDao.save(warehouse);
        return convertToDto(warehouse);
    }

    @Override
    public void deleteWarehouse(Long id) {
        warehouseDao.deleteById(id);
    }

    private WarehouseResponseDto convertToDto(Warehouse warehouse) {
        WarehouseResponseDto dto = new WarehouseResponseDto();
        dto.setId(warehouse.getId());
        dto.setName(warehouse.getName());
        dto.setAddress(warehouse.getAddress());
        dto.setCapacity(warehouse.getCapacity());
        dto.setStatus(warehouse.getStatus());
        dto.setCreatedDate(warehouse.getCreatedDate());
        dto.setLastModifiedDate(warehouse.getLastModifiedDate());
        return dto;
    }
}

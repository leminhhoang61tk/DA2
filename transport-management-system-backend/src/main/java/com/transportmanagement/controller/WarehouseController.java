package com.transportmanagement.controller;

import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.WarehouseRequestDto;
import com.transportmanagement.dto.WarehouseResponseDto;
import com.transportmanagement.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    @PostMapping
    public ResponseEntity<CommonApiResponse> createWarehouse(@RequestBody WarehouseRequestDto request) {
        try {
            WarehouseResponseDto response = warehouseService.createWarehouse(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CommonApiResponse("Created warehouse successfully", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWarehouseById(@PathVariable Long id) {
        try {
            WarehouseResponseDto response = warehouseService.getWarehouseById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }

    @GetMapping
    public ResponseEntity<List<WarehouseResponseDto>> getAllWarehouses() {
        List<WarehouseResponseDto> warehouses = warehouseService.getAllWarehouses();
        return ResponseEntity.ok(warehouses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommonApiResponse> updateWarehouse(@PathVariable Long id, @RequestBody WarehouseRequestDto request) {
        try {
            WarehouseResponseDto response = warehouseService.updateWarehouse(id, request);
            return ResponseEntity.ok(new CommonApiResponse("Warehouse update successful", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CommonApiResponse> deleteWarehouse(@PathVariable Long id) {
        try {
            warehouseService.deleteWarehouse(id);
            return ResponseEntity.ok(new CommonApiResponse("Deleted inventory successfully", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }
}

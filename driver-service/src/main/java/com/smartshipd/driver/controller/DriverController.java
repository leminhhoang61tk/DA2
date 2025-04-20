package com.smartshipd.driver.controller;

import com.smartshipd.common.dto.ApiResponse;
import com.smartshipd.driver.entity.DriverEntity;
import com.smartshipd.driver.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    private final DriverService driverService;

    @Autowired
    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DriverEntity>>> getAllDrivers() {
        List<DriverEntity> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok(ApiResponse.success(drivers));
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<ApiResponse<DriverEntity>> getDriverById(@PathVariable Long driverId) {
        try {
            DriverEntity driver = driverService.getDriverById(driverId);
            return ResponseEntity.ok(ApiResponse.success(driver));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<DriverEntity>> getDriverByUserId(@PathVariable Long userId) {
        try {
            DriverEntity driver = driverService.getDriverByUserId(userId);
            return ResponseEntity.ok(ApiResponse.success(driver));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<DriverEntity>>> getDriversByStatus(@PathVariable String status) {
        DriverEntity.DriverStatus driverStatus = DriverEntity.DriverStatus.valueOf(status);
        List<DriverEntity> drivers = driverService.getDriversByStatus(driverStatus);
        return ResponseEntity.ok(ApiResponse.success(drivers));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DriverEntity>>> searchDriversByName(@RequestParam String name) {
        List<DriverEntity> drivers = driverService.searchDriversByName(name);
        return ResponseEntity.ok(ApiResponse.success(drivers));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DriverEntity>> createDriver(@Valid @RequestBody DriverEntity driver) {
        try {
            DriverEntity createdDriver = driverService.createDriver(driver);
            return ResponseEntity.ok(ApiResponse.success("Driver created successfully", createdDriver));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{driverId}")
    public ResponseEntity<ApiResponse<DriverEntity>> updateDriver(
            @PathVariable Long driverId,
            @RequestBody Map<String, Object> updates) {
        try {
            DriverEntity updatedDriver = driverService.updateDriver(driverId, updates);
            return ResponseEntity.ok(ApiResponse.success("Driver updated successfully", updatedDriver));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{driverId}")
    public ResponseEntity<ApiResponse<Void>> deleteDriver(@PathVariable Long driverId) {
        try {
            driverService.deleteDriver(driverId);
            return ResponseEntity.ok(ApiResponse.success("Driver deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{driverId}/assign/{orderId}")
    public ResponseEntity<ApiResponse<Void>> assignOrderToDriver(
            @PathVariable Long driverId,
            @PathVariable Long orderId) {
        try {
            driverService.assignOrderToDriver(orderId, driverId);
            return ResponseEntity.ok(ApiResponse.success("Order assigned to driver successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
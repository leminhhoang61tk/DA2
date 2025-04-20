package com.smartshipd.driver.service;

import com.smartshipd.driver.entity.DriverEntity;
import com.smartshipd.driver.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final OrderClient orderClient;

    @Autowired
    public DriverService(DriverRepository driverRepository, OrderClient orderClient) {
        this.driverRepository = driverRepository;
        this.orderClient = orderClient;
    }

    public List<DriverEntity> getAllDrivers() {
        return driverRepository.findAll();
    }

    public DriverEntity getDriverById(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + driverId));
    }

    public DriverEntity getDriverByUserId(Long userId) {
        return driverRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Driver not found with user id: " + userId));
    }

    public List<DriverEntity> getDriversByStatus(DriverEntity.DriverStatus status) {
        return driverRepository.findByStatus(status);
    }

    public List<DriverEntity> searchDriversByName(String name) {
        return driverRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public DriverEntity createDriver(DriverEntity driver) {
        // Kiểm tra xem user_id đã tồn tại chưa
        driverRepository.findByUserId(driver.getUserId()).ifPresent(d -> {
            throw new RuntimeException("Driver already exists with user id: " + driver.getUserId());
        });

        return driverRepository.save(driver);
    }

    @Transactional
    public DriverEntity updateDriver(Long driverId, Map<String, Object> updates) {
        DriverEntity driver = getDriverById(driverId);

        if (updates.containsKey("name")) {
            driver.setName(updates.get("name").toString());
        }

        if (updates.containsKey("phone")) {
            driver.setPhone(updates.get("phone").toString());
        }

        if (updates.containsKey("status")) {
            DriverEntity.DriverStatus newStatus = DriverEntity.DriverStatus.valueOf(updates.get("status").toString());
            driver.setStatus(newStatus);
        }

        return driverRepository.save(driver);
    }

    @Transactional
    public void deleteDriver(Long driverId) {
        DriverEntity driver = getDriverById(driverId);
        driverRepository.delete(driver);
    }

    @Transactional
    public void assignOrderToDriver(Long orderId, Long driverId) {
        // Kiểm tra xem tài xế có tồn tại không
        DriverEntity driver = getDriverById(driverId);

        // Kiểm tra xem tài xế có sẵn sàng không
        if (driver.getStatus() != DriverEntity.DriverStatus.AVAILABLE) {
            throw new RuntimeException("Driver is not available");
        }

        // Cập nhật trạng thái của tài xế
        driver.setStatus(DriverEntity.DriverStatus.BUSY);
        driverRepository.save(driver);

        // Cập nhật đơn hàng
        orderClient.updateOrder(orderId, Map.of(
                "assignedDriverId", driverId,
                "status", "ASSIGNED"
        ));
    }
}
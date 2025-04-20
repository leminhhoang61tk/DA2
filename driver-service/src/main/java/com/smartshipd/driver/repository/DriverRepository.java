package com.smartshipd.driver.repository;

import com.smartshipd.driver.entity.DriverEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<DriverEntity, Long> {
    Optional<DriverEntity> findByUserId(Long userId);
    List<DriverEntity> findByStatus(DriverEntity.DriverStatus status);
    List<DriverEntity> findByNameContainingIgnoreCase(String name);
}
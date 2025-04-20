package com.smartshipd.order.repository;

import com.smartshipd.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByCustomerId(Long customerId);
    List<OrderEntity> findByAssignedDriverId(Long driverId);
    List<OrderEntity> findByStatus(OrderEntity.OrderStatus status);
}
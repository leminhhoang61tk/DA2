package com.transportmanagement.dao;

import com.transportmanagement.entity.WarehouseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseItemDao extends JpaRepository<WarehouseItem, Long> {
    List<WarehouseItem> findByWarehouseId(Long warehouseId);
    List<WarehouseItem> findByItemId(Long itemId);
    WarehouseItem findByWarehouseIdAndItemId(Long warehouseId, Long itemId);
}

package com.transportmanagement.dao;

import com.transportmanagement.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryTransactionDao extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByWarehouseId(Long warehouseId);
    List<InventoryTransaction> findByItemId(Long itemId);
    List<InventoryTransaction> findByTransactionDateBetween(LocalDateTime start, LocalDateTime end);
    List<InventoryTransaction> findByReferenceId(String referenceId);
}

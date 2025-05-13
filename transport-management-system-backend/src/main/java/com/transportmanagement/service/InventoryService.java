package com.transportmanagement.service;

import com.transportmanagement.dto.InventoryTransactionRequestDto;
import com.transportmanagement.dto.WarehouseItemRequestDto;
import com.transportmanagement.entity.InventoryTransaction;
import com.transportmanagement.entity.WarehouseItem;
import java.util.List;
import java.time.LocalDateTime;

public interface InventoryService {
    WarehouseItem addItemToWarehouse(WarehouseItemRequestDto request);
    WarehouseItem updateWarehouseItem(Long warehouseItemId, WarehouseItemRequestDto request);
    List<WarehouseItem> getItemsByWarehouse(Long warehouseId);
    InventoryTransaction createTransaction(InventoryTransactionRequestDto request);
    List<InventoryTransaction> getTransactionsByWarehouse(Long warehouseId);
    List<InventoryTransaction> getTransactionsByItem(Long itemId);
    List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    List<InventoryTransaction> getTransactionsByReference(String referenceId);
}

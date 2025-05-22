package com.transportmanagement.service;

import com.transportmanagement.dao.InventoryTransactionDao;
import com.transportmanagement.dao.ItemDao;
import com.transportmanagement.dao.WarehouseDao;
import com.transportmanagement.dao.WarehouseItemDao;
import com.transportmanagement.dto.InventoryTransactionRequestDto;
import com.transportmanagement.dto.WarehouseItemRequestDto;
import com.transportmanagement.entity.InventoryTransaction;
import com.transportmanagement.entity.Item;
import com.transportmanagement.entity.Warehouse;
import com.transportmanagement.entity.WarehouseItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private WarehouseDao warehouseDao;

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private WarehouseItemDao warehouseItemDao;

    @Autowired
    private InventoryTransactionDao inventoryTransactionDao;

    @Override
    @Transactional
    public WarehouseItem addItemToWarehouse(WarehouseItemRequestDto request) {
        Warehouse warehouse = warehouseDao.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kho với ID: " + request.getWarehouseId()));

        Item item = itemDao.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hàng hóa với ID: " + request.getItemId()));

        WarehouseItem warehouseItem = warehouseItemDao.findByWarehouseIdAndItemId(
                request.getWarehouseId(), request.getItemId());

        if (warehouseItem == null) {
            warehouseItem = new WarehouseItem();
            warehouseItem.setWarehouse(warehouse);
            warehouseItem.setItem(item);
            warehouseItem.setQuantity(request.getQuantity());
            warehouseItem.setPosition(request.getPosition());
            warehouseItem.setCreatedDate(LocalDateTime.now());
            warehouseItem.setLastModifiedDate(LocalDateTime.now());
        } else {
            warehouseItem.setQuantity(warehouseItem.getQuantity() + request.getQuantity());
            warehouseItem.setPosition(request.getPosition());
            warehouseItem.setLastModifiedDate(LocalDateTime.now());
        }

        // Cập nhật số lượng tồn kho của item
        item.setQuantityInStock(item.getQuantityInStock() + request.getQuantity());
        itemDao.save(item);

        return warehouseItemDao.save(warehouseItem);
    }

    @Override
    public WarehouseItem updateWarehouseItem(Long warehouseItemId, WarehouseItemRequestDto request) {
        WarehouseItem warehouseItem = warehouseItemDao.findById(warehouseItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục kho với ID: " + warehouseItemId));

        // Lấy số lượng cũ để tính toán sự thay đổi
        Double oldQuantity = warehouseItem.getQuantity();
        Double quantityChange = request.getQuantity() - oldQuantity;

        warehouseItem.setQuantity(request.getQuantity());
        warehouseItem.setPosition(request.getPosition());
        warehouseItem.setLastModifiedDate(LocalDateTime.now());

        // Cập nhật số lượng tồn kho của item
        Item item = warehouseItem.getItem();
        item.setQuantityInStock(item.getQuantityInStock() + quantityChange);
        itemDao.save(item);

        return warehouseItemDao.save(warehouseItem);
    }

    @Override
    public List<WarehouseItem> getItemsByWarehouse(Long warehouseId) {
        return warehouseItemDao.findByWarehouseId(warehouseId);
    }

    @Override
    @Transactional
    public InventoryTransaction createTransaction(InventoryTransactionRequestDto request) {
        Warehouse warehouse = warehouseDao.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kho với ID: " + request.getWarehouseId()));

        Item item = itemDao.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hàng hóa với ID: " + request.getItemId()));

        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setWarehouse(warehouse);
        transaction.setItem(item);
        transaction.setTransactionType(request.getTransactionType());
        transaction.setQuantity(request.getQuantity());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setReferenceId(request.getReferenceId());
        transaction.setNotes(request.getNotes());
        transaction.setCreatedBy(request.getCreatedBy());

        // Cập nhật số lượng trong kho
        WarehouseItem warehouseItem = warehouseItemDao.findByWarehouseIdAndItemId(
                request.getWarehouseId(), request.getItemId());

        if (warehouseItem == null && "IMPORT".equals(request.getTransactionType())) {
            // Nếu là nhập kho và chưa có item trong kho
            WarehouseItemRequestDto warehouseItemRequest = new WarehouseItemRequestDto();
            warehouseItemRequest.setWarehouseId(request.getWarehouseId());
            warehouseItemRequest.setItemId(request.getItemId());
            warehouseItemRequest.setQuantity(request.getQuantity());
            warehouseItemRequest.setPosition("");
            addItemToWarehouse(warehouseItemRequest);
        } else if (warehouseItem != null) {
            // Nếu đã có item trong kho
            if ("IMPORT".equals(request.getTransactionType())) {
                warehouseItem.setQuantity(warehouseItem.getQuantity() + request.getQuantity());
                item.setQuantityInStock(item.getQuantityInStock() + request.getQuantity());
            } else if ("EXPORT".equals(request.getTransactionType())) {
                if (warehouseItem.getQuantity() < request.getQuantity()) {
                    throw new RuntimeException("Số lượng xuất kho vượt quá số lượng hiện có");
                }
                warehouseItem.setQuantity(warehouseItem.getQuantity() - request.getQuantity());
                item.setQuantityInStock(item.getQuantityInStock() - request.getQuantity());
            }
            warehouseItem.setLastModifiedDate(LocalDateTime.now());
            warehouseItemDao.save(warehouseItem);
            itemDao.save(item);
        } else {
            throw new RuntimeException("Không thể xuất kho vì không có hàng hóa trong kho");
        }

        return inventoryTransactionDao.save(transaction);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByWarehouse(Long warehouseId) {
        return inventoryTransactionDao.findByWarehouseId(warehouseId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByItem(Long itemId) {
        return inventoryTransactionDao.findByItemId(itemId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return inventoryTransactionDao.findByTransactionDateBetween(startDate, endDate);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByReference(String referenceId) {
        return inventoryTransactionDao.findByReferenceId(referenceId);
    }
}

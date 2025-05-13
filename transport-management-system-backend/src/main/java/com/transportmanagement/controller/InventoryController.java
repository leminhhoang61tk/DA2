package com.transportmanagement.controller;

import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.InventoryTransactionRequestDto;
import com.transportmanagement.dto.WarehouseItemRequestDto;
import com.transportmanagement.entity.InventoryTransaction;
import com.transportmanagement.entity.WarehouseItem;
import com.transportmanagement.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/warehouse-items")
    public ResponseEntity<CommonApiResponse> addItemToWarehouse(@RequestBody WarehouseItemRequestDto request) {
        try {
            inventoryService.addItemToWarehouse(request);
            CommonApiResponse response = new CommonApiResponse("Thêm hàng hóa vào kho thành công", true);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            CommonApiResponse response = new CommonApiResponse(e.getMessage(), false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/warehouse-items/{id}")
    public ResponseEntity<CommonApiResponse> updateWarehouseItem(@PathVariable Long id, @RequestBody WarehouseItemRequestDto request) {
        try {
            inventoryService.updateWarehouseItem(id, request);
            CommonApiResponse response = new CommonApiResponse("Cập nhật hàng hóa trong kho thành công", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CommonApiResponse response = new CommonApiResponse(e.getMessage(), false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/warehouse/{warehouseId}/items")
    public ResponseEntity<List<WarehouseItem>> getItemsByWarehouse(@PathVariable Long warehouseId) {
        List<WarehouseItem> items = inventoryService.getItemsByWarehouse(warehouseId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/transactions")
    public ResponseEntity<CommonApiResponse> createTransaction(@RequestBody InventoryTransactionRequestDto request) {
        try {
            inventoryService.createTransaction(request);
            CommonApiResponse response = new CommonApiResponse("Tạo giao dịch kho thành công", true);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            CommonApiResponse response = new CommonApiResponse(e.getMessage(), false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/transactions/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByWarehouse(@PathVariable Long warehouseId) {
        List<InventoryTransaction> transactions = inventoryService.getTransactionsByWarehouse(warehouseId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/item/{itemId}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByItem(@PathVariable Long itemId) {
        List<InventoryTransaction> transactions = inventoryService.getTransactionsByItem(itemId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/date-range")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<InventoryTransaction> transactions = inventoryService.getTransactionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/reference/{referenceId}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByReference(@PathVariable String referenceId) {
        List<InventoryTransaction> transactions = inventoryService.getTransactionsByReference(referenceId);
        return ResponseEntity.ok(transactions);
    }
}

package com.transportmanagement.controller;

import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.ItemRequestDto;
import com.transportmanagement.dto.ItemResponseDto;
import com.transportmanagement.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<CommonApiResponse> createItem(@RequestBody ItemRequestDto request) {
        try {
            ItemResponseDto response = itemService.createItem(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CommonApiResponse("Create successful items", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            ItemResponseDto response = itemService.getItemById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }

    @GetMapping
    public ResponseEntity<List<ItemResponseDto>> getAllItems() {
        List<ItemResponseDto> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ItemResponseDto>> getItemsByCategory(@PathVariable String category) {
        List<ItemResponseDto> items = itemService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ItemResponseDto>> searchItems(@RequestParam String keyword) {
        List<ItemResponseDto> items = itemService.searchItems(keyword);
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommonApiResponse> updateItem(@PathVariable Long id, @RequestBody ItemRequestDto request) {
        try {
            ItemResponseDto response = itemService.updateItem(id, request);
            return ResponseEntity.ok(new CommonApiResponse("Item update successful", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CommonApiResponse> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok(new CommonApiResponse("Deleted Item successfully", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CommonApiResponse(e.getMessage(), false));
        }
    }
}

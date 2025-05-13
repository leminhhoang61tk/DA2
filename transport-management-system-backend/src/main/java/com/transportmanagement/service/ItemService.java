package com.transportmanagement.service;

import com.transportmanagement.dto.ItemRequestDto;
import com.transportmanagement.dto.ItemResponseDto;
import java.util.List;

public interface ItemService {
    ItemResponseDto createItem(ItemRequestDto request);
    ItemResponseDto getItemById(Long id);
    List<ItemResponseDto> getAllItems();
    List<ItemResponseDto> getItemsByCategory(String category);
    List<ItemResponseDto> searchItems(String keyword);
    ItemResponseDto updateItem(Long id, ItemRequestDto request);
    void deleteItem(Long id);
}

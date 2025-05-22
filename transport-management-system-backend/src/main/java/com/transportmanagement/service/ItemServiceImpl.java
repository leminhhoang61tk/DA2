package com.transportmanagement.service;

import com.transportmanagement.dao.ItemDao;
import com.transportmanagement.dto.ItemRequestDto;
import com.transportmanagement.dto.ItemResponseDto;
import com.transportmanagement.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemDao itemDao;

    @Override
    public ItemResponseDto createItem(ItemRequestDto request) {
        Item item = new Item();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setUnit(request.getUnit());
        item.setUnitPrice(request.getUnitPrice());
        item.setQuantityInStock(request.getQuantityInStock());
        item.setStatus(request.getStatus());
        item.setCreatedDate(LocalDateTime.now());
        item.setLastModifiedDate(LocalDateTime.now());

        item = itemDao.save(item);
        return convertToDto(item);
    }

    @Override
    public ItemResponseDto getItemById(Long id) {
        Item item = itemDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hàng hóa với ID: " + id));
        return convertToDto(item);
    }

    @Override
    public List<ItemResponseDto> getAllItems() {
        List<Item> items = itemDao.findAll();
        return items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemResponseDto> getItemsByCategory(String category) {
        List<Item> items = itemDao.findByCategory(category);
        return items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemResponseDto> searchItems(String keyword) {
        List<Item> items = itemDao.findByNameContaining(keyword);
        return items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ItemResponseDto updateItem(Long id, ItemRequestDto request) {
        Item item = itemDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hàng hóa với ID: " + id));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setUnit(request.getUnit());
        item.setUnitPrice(request.getUnitPrice());
        item.setQuantityInStock(request.getQuantityInStock());
        item.setStatus(request.getStatus());
        item.setLastModifiedDate(LocalDateTime.now());

        item = itemDao.save(item);
        return convertToDto(item);
    }

    @Override
    public void deleteItem(Long id) {
        itemDao.deleteById(id);
    }

    private ItemResponseDto convertToDto(Item item) {
        ItemResponseDto dto = new ItemResponseDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setCategory(item.getCategory());
        dto.setUnit(item.getUnit());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantityInStock(item.getQuantityInStock());
        dto.setStatus(item.getStatus());
        dto.setCreatedDate(item.getCreatedDate());
        dto.setLastModifiedDate(item.getLastModifiedDate());
        return dto;
    }
}

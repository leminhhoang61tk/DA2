package com.transportmanagement.dao;

import com.transportmanagement.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemDao extends JpaRepository<Item, Long> {
    List<Item> findByCategory(String category);
    List<Item> findByNameContaining(String keyword);
}

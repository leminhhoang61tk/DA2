package com.transportmanagement.dao;

import com.transportmanagement.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseDao extends JpaRepository<Warehouse, Long> {

    Optional<Warehouse> findByName(String name);


    List<Warehouse> findByNameContaining(String keyword);


    List<Warehouse> findByAddressContaining(String keyword);


    List<Warehouse> findByStatus(String status);


    List<Warehouse> findByCapacityGreaterThanEqual(Double capacity);


    boolean existsByName(String name);
}

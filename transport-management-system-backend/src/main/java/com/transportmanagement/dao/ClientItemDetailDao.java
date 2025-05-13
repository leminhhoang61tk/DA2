package com.transportmanagement.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.ClientItemDetail;

@Repository
public interface ClientItemDetailDao extends JpaRepository<ClientItemDetail, Integer> {
    // Custom query methods (if any) can be added here
}

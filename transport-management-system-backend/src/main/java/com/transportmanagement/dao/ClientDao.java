package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.Client;

@Repository
public interface ClientDao extends JpaRepository<Client, Integer> {

	List<Client> findByStatus(String value);
    // Custom query methods (if any) can be added here

	List<Client> findByNameContainingIgnoreCaseAndStatus(String clientName, String status);
}

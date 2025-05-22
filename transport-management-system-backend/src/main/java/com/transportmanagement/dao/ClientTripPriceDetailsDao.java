package com.transportmanagement.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.ClientTripPriceDetails;

@Repository
public interface ClientTripPriceDetailsDao extends JpaRepository<ClientTripPriceDetails, Integer> {
    // Custom query methods (if any) can be added here
}

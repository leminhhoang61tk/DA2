package com.transportmanagement.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.ClientTripCharges;

@Repository
public interface ClientTripChargesDao extends JpaRepository<ClientTripCharges, Integer> {

}

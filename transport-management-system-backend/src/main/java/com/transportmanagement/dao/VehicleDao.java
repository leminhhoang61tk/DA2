package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.Vehicle;

@Repository
public interface VehicleDao extends JpaRepository<Vehicle, Integer> {

	List<Vehicle> findByVehicleNumber(String vehicleNumber);

	List<Vehicle> findByStatus(String status);

	Long countByStatus(String status);

}

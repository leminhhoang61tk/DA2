package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.Vehicle;

public interface VehicleService {
	Vehicle createVehicle(Vehicle vehicle);

	Vehicle updateVehicle(Vehicle vehicle);

	void deleteVehicle(int id);

	Vehicle getVehicleById(int id);

	List<Vehicle> getAllVehicles();

	List<Vehicle> getVehiclesByStatus(String status);

	List<Vehicle> getVehicleByNumber(String vehicleNumber);
	
	Long countByStatus(String status);

}

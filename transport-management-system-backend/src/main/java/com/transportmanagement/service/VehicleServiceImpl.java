package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.VehicleDao;
import com.transportmanagement.entity.Vehicle;

@Service
public class VehicleServiceImpl implements VehicleService {

	@Autowired
	private VehicleDao vehicleDao;

	@Override
	public Vehicle createVehicle(Vehicle vehicle) {
		return vehicleDao.save(vehicle);
	}

	@Override
	public Vehicle updateVehicle(Vehicle vehicle) {
		return vehicleDao.save(vehicle);
	}

	@Override
	public void deleteVehicle(int id) {
		vehicleDao.deleteById(id);
	}

	@Override
	public Vehicle getVehicleById(int id) {
		return vehicleDao.findById(id).orElse(null);
	}

	@Override
	public List<Vehicle> getAllVehicles() {
		return vehicleDao.findAll();
	}

	@Override
	public List<Vehicle> getVehiclesByStatus(String status) {
		// TODO Auto-generated method stub
		return vehicleDao.findByStatus(status);
	}

	@Override
	public List<Vehicle> getVehicleByNumber(String vehicleNumber) {
		// TODO Auto-generated method stub
		return vehicleDao.findByVehicleNumber(vehicleNumber);
	}

	@Override
	public Long countByStatus(String status) {
		return vehicleDao.countByStatus(status);
	}
}

package com.transportmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.VehicleAddRequestDto;
import com.transportmanagement.dto.VehicleResponseDto;
import com.transportmanagement.entity.Vehicle;
import com.transportmanagement.resource.VehicleResource;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/transport/vehicle")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

	@Autowired
	private VehicleResource vehicleResource;

	@PostMapping("/add")
	@Operation(summary = "Api to add vehicle")
	public ResponseEntity<CommonApiResponse> registerAdmin(VehicleAddRequestDto request) {
		return vehicleResource.addVehicle(request);
	}

	@PutMapping("/document/udpate")
	@Operation(summary = "Api to update the vehicle document!!!")
	public ResponseEntity<CommonApiResponse> updateVehicleDocument(VehicleAddRequestDto request) {
		return vehicleResource.updateVehicleDocument(request);
	}

	@PutMapping("/detail/udpate")
	@Operation(summary = "Api to update the vehicle detail!!!")
	public ResponseEntity<CommonApiResponse> updateVehicleDetail(@RequestBody Vehicle vehicle) {
		return vehicleResource.updateVehicleDetail(vehicle);
	}

	@GetMapping("/fetch/all")
	@Operation(summary = "Api to fetch all the vehicles!!!")
	public ResponseEntity<VehicleResponseDto> fetchAllVehicles() {
		return vehicleResource.fetchAllVehicles();
	}

	@GetMapping("/fetch")
	@Operation(summary = "Api to get Vehicle by Id")
	public ResponseEntity<VehicleResponseDto> fetchVehicleById(@RequestParam("vehicleId") int vehicleId) {
		return vehicleResource.fetchVehicleById(vehicleId);
	}
	
	@GetMapping("/fetch/vehicle-no-wise")
	@Operation(summary = "Api to fetch vehicle based on vehicle no!!!")
	public ResponseEntity<VehicleResponseDto> fetchVehiclesByVehicleNo(@RequestParam("vehicleNo") String vehicleNo) {
		return vehicleResource.fetchVehiclesByVehicleNo(vehicleNo);
	}

	@DeleteMapping("delete")
	@Operation(summary = "Api to delete the vehicle!!!")
	public ResponseEntity<CommonApiResponse> deleteVehicle(@RequestParam("vehicleId") int vehicleId) {

		return vehicleResource.deleteVehicle(vehicleId);
	}

}

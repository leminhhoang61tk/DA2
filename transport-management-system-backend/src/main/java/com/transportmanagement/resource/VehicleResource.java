package com.transportmanagement.resource;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.VehicleAddRequestDto;
import com.transportmanagement.dto.VehicleResponseDto;
import com.transportmanagement.entity.ClientTripFuelExpense;
import com.transportmanagement.entity.ClientTripOtherExpense;
import com.transportmanagement.entity.Vehicle;
import com.transportmanagement.service.VehicleService;
import com.transportmanagement.utility.Constants.ActiveStatus;
import com.transportmanagement.utility.StorageService;

@Component
public class VehicleResource {

	private final Logger LOG = LoggerFactory.getLogger(VehicleResource.class);

	@Autowired
	private VehicleService vehicleService;

	@Autowired
	private StorageService storageService;

	public ResponseEntity<CommonApiResponse> addVehicle(VehicleAddRequestDto request) {

		LOG.info("Received request for adding the vehicle!!");

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUploadDocuments() == null) {
			response.setResponseMessage("Select the Document please!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Vehicle> existingVehicles = this.vehicleService.getVehicleByNumber(request.getVehicleNumber());

		if (!CollectionUtils.isEmpty(existingVehicles)) {
			response.setResponseMessage("Vehicle with this Number already exists in the system!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle vehicle = VehicleAddRequestDto.toVehicleEntity(request);

		if (vehicle == null) {
			response.setResponseMessage("Internal Technical issue!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String document = this.storageService.store(request.getUploadDocuments());

		if (document == null) {
			response.setResponseMessage("Failed to upload the vehicle document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		vehicle.setStatus(ActiveStatus.ACTIVE.value());
		vehicle.setUploadDocuments(document);
		vehicle.setAddedDateTime(addedDateTime);

		Vehicle savedVehicle = this.vehicleService.createVehicle(vehicle);

		if (savedVehicle == null) {
			response.setResponseMessage("Failed to add the Vehicle!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Vehicle Added succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateVehicleDocument(VehicleAddRequestDto request) {

		LOG.info("Received request for updating the vehicle document!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getVehicleId() == 0 || request.getUploadDocuments() == null) {
			response.setResponseMessage("missing input!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle existingVehicle = this.vehicleService.getVehicleById(request.getVehicleId());

		if (existingVehicle == null) {
			response.setResponseMessage("Vehicle not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String newDocumentFileName = this.storageService.store(request.getUploadDocuments());

		String existingDocumentFileName = existingVehicle.getUploadDocuments();

		if (newDocumentFileName == null) {
			response.setResponseMessage("Failed to upload the vehicle document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		existingVehicle.setUploadDocuments(newDocumentFileName);
		Vehicle updatedVehicle = this.vehicleService.updateVehicle(existingVehicle);

		if (updatedVehicle == null) {
			response.setResponseMessage("Failed to update the Vehicle!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		this.storageService.delete(existingDocumentFileName);

		response.setResponseMessage("Vehicle Document Updated succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateVehicleDetail(Vehicle vehicle) {

		LOG.info("Received request for updating the vehicle document!!");

		CommonApiResponse response = new CommonApiResponse();

		if (vehicle == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (vehicle.getId() == 0) {
			response.setResponseMessage("Vehicle Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle existingVehicle = this.vehicleService.getVehicleById(vehicle.getId());

		if (existingVehicle == null) {
			response.setResponseMessage("Vehicle not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		vehicle.setUploadDocuments(existingVehicle.getUploadDocuments());

		Vehicle updatedVehicle = this.vehicleService.updateVehicle(vehicle);

		if (updatedVehicle == null) {
			response.setResponseMessage("Failed to update the Vehicle!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Vehicle Details Updated succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<VehicleResponseDto> fetchAllVehicles() {

		LOG.info("Received request for fetching the vehicles!!");

		VehicleResponseDto response = new VehicleResponseDto();

		List<Vehicle> vehicles = this.vehicleService.getVehiclesByStatus(ActiveStatus.ACTIVE.value());

		if (CollectionUtils.isEmpty(vehicles)) {
			response.setResponseMessage("Vehicles not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		response.setVehicles(vehicles);
		response.setResponseMessage("Vehicles fetched succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> deleteVehicle(int vehicleId) {

		LOG.info("Received request for delete the vehicle!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (vehicleId == 0) {
			response.setResponseMessage("Vehicle Id missing!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle vehicle = this.vehicleService.getVehicleById(vehicleId);

		if (vehicle == null) {
			response.setResponseMessage("vehicle not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		vehicle.setStatus(ActiveStatus.DEACTIVATED.value());
		vehicleService.updateVehicle(vehicle);

		response.setResponseMessage("Vehicle Deleted Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<VehicleResponseDto> fetchVehicleById(int vehicleId) {

		VehicleResponseDto response = new VehicleResponseDto();

		if (vehicleId == 0) {
			response.setResponseMessage("Invalid Input");
			response.setSuccess(false);
			return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle vehicle = this.vehicleService.getVehicleById(vehicleId);

		if (vehicle == null) {
			response.setResponseMessage("Vehicle Not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		if (!CollectionUtils.isEmpty(vehicle.getFuelExpenses())) {

			for (ClientTripFuelExpense expense : vehicle.getFuelExpenses()) {
				expense.setClientTripName(expense.getClientTrip().getName());
			}

		}

		if (!CollectionUtils.isEmpty(vehicle.getOtherExpenses())) {

			for (ClientTripOtherExpense expense : vehicle.getOtherExpenses()) {
				expense.setClientTripName(expense.getClientTrip().getName());
			}

		}

		response.setVehicles(Arrays.asList(vehicle));
		response.setResponseMessage("Vehicle fetched succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<VehicleResponseDto> fetchVehiclesByVehicleNo(String vehicleNo) {

		LOG.info("Received request for delete the vehicle!!!");

		VehicleResponseDto response = new VehicleResponseDto();

		if (StringUtils.isEmpty(vehicleNo)) {
			response.setResponseMessage("vehicle no is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Vehicle> vehicles = this.vehicleService.getVehicleByNumber(vehicleNo);

		if (CollectionUtils.isEmpty(vehicles)) {
			response.setResponseMessage("Vehicles not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.OK);
		}

		response.setVehicles(vehicles);
		response.setResponseMessage("Vehicles fetched succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<VehicleResponseDto>(response, HttpStatus.OK);
	}

}

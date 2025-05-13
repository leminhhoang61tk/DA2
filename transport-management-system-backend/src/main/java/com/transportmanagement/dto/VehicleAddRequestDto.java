package com.transportmanagement.dto;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.transportmanagement.entity.Vehicle;

import lombok.Data;

@Data
public class VehicleAddRequestDto {

	private int vehicleId; // for vehicle update
	
	private String name;

	private String vehicleNumber;

	private String companyName;

	private String passingType;

	private String registrationNumber;

	private String insuranceStartDate;

	private String expireInsuranceDate;

	private String smokeTestExpireDate;

	private String permitNumber;

	private String permitExpireDate;

	private String gareBoxExpireDate;

	private String oilChangeDate;

	private String vehiclePurchaseDate;

	private String remark;

	private MultipartFile uploadDocuments; // document in pdf

	public static Vehicle toVehicleEntity(VehicleAddRequestDto request) {
		Vehicle vehicle = new Vehicle();
		BeanUtils.copyProperties(request, vehicle, "uploadDocuments", "vehicleId");
		return vehicle;
	}

}

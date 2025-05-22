package com.transportmanagement.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Data
@Entity
public class Vehicle {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String name;

	private String addedDateTime;

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

//	private String driverName; // Assign from Driver entity

	private String remark;

	private String uploadDocuments; // document in pdf

	@JsonIgnore
	@ManyToMany(mappedBy = "vehicles")
	private List<ClientTrip> clientTrips;

	@ManyToMany(mappedBy = "vehicles")
	private List<ClientTripFuelExpense> fuelExpenses;
	
	@ManyToMany(mappedBy = "vehicles")
	private List<ClientTripOtherExpense> otherExpenses;

	private String status;

}

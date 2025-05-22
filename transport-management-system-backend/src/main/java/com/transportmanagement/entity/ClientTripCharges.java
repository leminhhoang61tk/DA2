package com.transportmanagement.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class ClientTripCharges {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private BigDecimal additionalCharges; // Additional Charges

	private BigDecimal serviceCharges; // Service Charges

	private BigDecimal pickupDropCharges; // PickUp/Drop Charges

	private BigDecimal otherCharges; // Other Charges

	private String gstApplicable; // GST Appliable (Yes, No)

	private String gstNumber; // GST Number

	private BigDecimal cgstRate; // CGST Rate%

	private BigDecimal sgstRate; // SGST Rate

	// One charges record can belong to one ClientTrip
	@JsonIgnore
	@OneToOne
	@JoinColumn(name = "client_trip_id", referencedColumnName = "id")
	private ClientTrip clientTrip;

}
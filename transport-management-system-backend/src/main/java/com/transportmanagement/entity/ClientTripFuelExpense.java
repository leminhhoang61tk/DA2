package com.transportmanagement.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Data
public class ClientTripFuelExpense {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String expenseTime;

	private String dateTime; // Date and Time

	private String fuelType; // Diesel, Petrol, Gas

	private String vendorName; // IOCL, BPL, Reliance

	private String startingKm;

	private String currentKm;

	private BigDecimal amount;

	private String fullOrPartial; // Full/Partial

	private BigDecimal fuelRatePerLitre;

	private BigDecimal filledLitre;

	private String paymentMode; // Account, Cash, UPI

	private String paymentDetails; // Payment specific information (e.g., UPI ID, Bank details)

	private String receiptUpload; // URL or path to the receipt document

	private String remark;

	@JsonIgnore
	@ManyToMany
	@JoinTable(name = "vehicle_fuel_expense", joinColumns = @JoinColumn(name = "fuel_expense_id"), inverseJoinColumns = @JoinColumn(name = "vehicle_id"))
	private List<Vehicle> vehicles;

	// Many fuel expenses can belong to one ClientTrip
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "client_trip_id", referencedColumnName = "id")
	private ClientTrip clientTrip;

	@Transient
	private String clientTripName;

}
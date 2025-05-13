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
public class ClientTripOtherExpense {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String dateTime; // Date and Time

	private String expenseTime;

	private String expenseType; // Type of expense

	private String vendorName; // Vendor Name

	private String locationDetails; // Location Details

	private String city;

	private String pinCode;

	private String state;

	private BigDecimal amount;

	private String paymentMode; // Account, Cash, UPI

	private String paymentDetails; // Payment specific information (e.g., UPI ID, Bank details)

	private String receiptUpload; // URL or path to the receipt document

	private String remark;

	// Many other expenses can belong to one ClientTrip
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "client_trip_id", referencedColumnName = "id")
	private ClientTrip clientTrip;

	@JsonIgnore
	@ManyToMany
	@JoinTable(name = "vehicle_other_expense", joinColumns = @JoinColumn(name = "other_expense_id"), inverseJoinColumns = @JoinColumn(name = "vehicle_id"))
	private List<Vehicle> vehicles;

	@Transient
	private String clientTripName;
}

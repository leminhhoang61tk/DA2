package com.transportmanagement.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Data
public class EmployeePaymentSalary {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String dateTime; // added time

//    private String employeeType; // Driver, Accountant, HR, Employee
//
//    private String employeeName; // Should reference Employee entity in the future

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "employee_id", referencedColumnName = "id")
	private Employee employee;

	@ManyToOne
	@JoinColumn(name = "vehicle_id", referencedColumnName = "id")
	private Vehicle vehicle; // Only applicable if EmployeeType is Driver

	private String salaryType; // Advance, Monthly, Trip, Part Payment

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "client_trip_id")
	private ClientTrip clientTrip;

	@Transient
	private String clientTripName;

	private BigDecimal amount;

	private String paymentMode; // Account, Cash, UPI, Other

	private String paymentDetails; // Payment specific information (UPI ID, Bank details, etc.)

	private String receiptUpload; // URL or path to the receipt document

	private String remark;

}
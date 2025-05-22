package com.transportmanagement.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class Employee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String fullName;

	private String panNumber;

	private String aadharNumber;

	private String licenseNumber; // if Driver

	private String role; // Driver, HR, Finance

	private String fullAddress;

	private String city;

	private String pinCode;

	private String state;

	private String country;

	private String licenseExpiryDate; // if Driver

	private String workStartDate;

	private String workEndDate;

	private String accountNumber;

	private String ifscNumber;

	private String status;

	private String comments;

	private String uploadDocuments; // document name pdf only

	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

	@OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
	private List<EmployeePaymentSalary> employeePaymentSalaries;

}
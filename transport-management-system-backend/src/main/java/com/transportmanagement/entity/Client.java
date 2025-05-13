package com.transportmanagement.entity;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Client {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String addedDateTime;

	private String name;

	private String pinCode;

	private String state;

	private String contactNumber;

	private String contactName;

	private String gstApplicable; // Yes, No

	private String gstNumber;

	private BigDecimal cgstRate; // Percentage stored as String to handle decimal points

	private BigDecimal sgstRate; // Percentage stored as String to handle decimal points

	private String comments;

	private String uploadDocuments; // URL or path to the document upload

	private String status;

	// One client can have multiple branches
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ClientBranch> branches;

}

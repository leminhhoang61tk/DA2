package com.transportmanagement.dto;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class EmployeeSalaryRequestDto {

	private int userId;

	private int vehicleId;

	private String salaryType; // Advance, Monthly, Trip, Part Payment

	private int tripId; // Applicable if SalaryType is Trip

	private BigDecimal amount;

	private String paymentMode; // Account, Cash, UPI, Other

	private String paymentDetails; // Payment specific information (UPI ID, Bank details, etc.)

	private MultipartFile receiptUpload; // URL or path to the receipt document

	private String remark;

}

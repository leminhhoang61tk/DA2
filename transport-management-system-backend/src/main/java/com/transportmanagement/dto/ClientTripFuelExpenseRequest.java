package com.transportmanagement.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.transportmanagement.entity.ClientTripFuelExpense;

import lombok.Data;

@Data
public class ClientTripFuelExpenseRequest {

	private String expenseTime;

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

	private MultipartFile receiptUpload; // URL or path to the receipt document

	private String remark;

	private int clientTripId;

	private int vehicleId;

	public static ClientTripFuelExpense toClientTripFuelExpenseEntity(ClientTripFuelExpenseRequest request) {
		ClientTripFuelExpense detail = new ClientTripFuelExpense();
		BeanUtils.copyProperties(request, detail, "clientTripId", "receiptUpload", "vehicleId");
		return detail;
	}

}
package com.transportmanagement.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.transportmanagement.entity.ClientTripOtherExpense;

import lombok.Data;

@Data
public class ClientTripOtherExpenseRequest {

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

	private MultipartFile receiptUpload;

	private String remark;

	private int clientTripId;

	private int vehicleId;

	public static ClientTripOtherExpense toClientTripOtherExpense(ClientTripOtherExpenseRequest request) {
		ClientTripOtherExpense detail = new ClientTripOtherExpense();
		BeanUtils.copyProperties(request, detail, "clientTripId", "receiptUpload", "vehicleId");
		return detail;
	}

}

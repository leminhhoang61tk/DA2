package com.transportmanagement.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;

import com.transportmanagement.entity.ClientTripCharges;

import lombok.Data;

@Data
public class ClientTripChargesRequestDto {

	private BigDecimal additionalCharges; // Additional Charges

	private BigDecimal serviceCharges; // Service Charges

	private BigDecimal pickupDropCharges; // PickUp/Drop Charges

	private BigDecimal otherCharges; // Other Charges

	private String gstApplicable; // GST Appliable (Yes, No)

	private String gstNumber; // GST Number

	private BigDecimal cgstRate; // CGST Rate%
	
	private BigDecimal sgstRate; // SGST Rate%

	private int clientTripId;

	public static ClientTripCharges toClientTripChargesEntity(ClientTripChargesRequestDto request) {
		ClientTripCharges detail = new ClientTripCharges();
		BeanUtils.copyProperties(request, detail, "clientTripId");
		return detail;
	}

}

package com.transportmanagement.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;

import com.transportmanagement.entity.Client;

import lombok.Data;

@Data
public class ClientDetailUpdateRequestDto {

	private int clientId;

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

	public static Client toClientEntity(VehicleAddRequestDto request) {
		Client client = new Client();
		BeanUtils.copyProperties(request, client, "clientId");
		return client;
	}

}

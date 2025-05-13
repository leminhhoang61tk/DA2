package com.transportmanagement.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.transportmanagement.entity.Client;

import lombok.Data;

@Data
public class ClientRequestDto {

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

	private MultipartFile uploadDocuments; // URL or path to the document upload

	public static Client toClientEntity(ClientRequestDto request) {
		Client client = new Client();
		BeanUtils.copyProperties(request, client, "uploadDocuments", "clientId");
		return client;
	}

}

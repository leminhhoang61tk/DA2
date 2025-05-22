package com.transportmanagement.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;

import com.transportmanagement.entity.ClientTripPriceDetails;

import lombok.Data;

@Data
public class ClientTripPriceDetailsRequest {

	private BigDecimal rate; // Rate

	private BigDecimal totalAmount; // Total Amount

	private BigDecimal advanceAmount; // Advance Amount

	private BigDecimal receivedAmount; // Received Amount

	private BigDecimal dueAmount; // Due Amount

	private String paymentStatus; // Payment (Paid, Advance, To be Pay)

	private int clientTripId;

	public static ClientTripPriceDetails toClientTripPriceDetailEntity(ClientTripPriceDetailsRequest request) {
		ClientTripPriceDetails detail = new ClientTripPriceDetails();
		BeanUtils.copyProperties(request, detail, "clientTripId");
		return detail;
	}

}
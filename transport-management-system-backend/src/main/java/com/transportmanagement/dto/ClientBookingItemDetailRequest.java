package com.transportmanagement.dto;

import org.springframework.beans.BeanUtils;

import com.transportmanagement.entity.ClientItemDetail;

import lombok.Data;

@Data
public class ClientBookingItemDetailRequest {

	private String itemNameDetails; // Item Name/Details

	private String itemQuantity; // Item Quantity

	private String actualWeight; // Actual Weight

	private String grossWeight; // Gross Weight

	private String weightType; // Weight Type

	private String rateAsPer; // Rate as per (KG, Ton, Package, Gram)

	private int clientTripId;

	public static ClientItemDetail toClientItemEntity(ClientBookingItemDetailRequest request) {
		ClientItemDetail detail = new ClientItemDetail();
		BeanUtils.copyProperties(request, detail, "clientTripId");
		return detail;
	}

}

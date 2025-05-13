package com.transportmanagement.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class TripDetail {

	private String invoice;

	private String fromClientName;

	private String toClientName;

	private String pickUpPoint;

	private String deliveryPoint;

	private BigDecimal totalAmount;

	private BigDecimal receivedAmount;

	private BigDecimal dueAmount;

}

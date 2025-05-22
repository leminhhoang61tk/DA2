package com.transportmanagement.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class ClientTripPriceDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private BigDecimal rate; // Rate

	private BigDecimal totalAmount; // Total Amount

	private BigDecimal advanceAmount; // Advance Amount

	private BigDecimal receivedAmount; // Received Amount

	private BigDecimal dueAmount; // Due Amount

	private String paymentStatus; // Payment (Paid, Advance, To be Pay)

	// One price details can belong to one ClientTrip
	@JsonIgnore
	@OneToOne
	@JoinColumn(name = "client_trip_id", referencedColumnName = "id")
	private ClientTrip clientTrip;

}
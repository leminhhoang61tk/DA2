package com.transportmanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ClientItemDetail {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String itemNameDetails; // Item Name/Details

	private String itemQuantity; // Item Quantity

	private String actualWeight; // Actual Weight

	private String grossWeight; // Gross Weight

	private String weightType; // Weight Type

	private String rateAsPer; // Rate as per (KG, Ton, Package, Gram)

	// Many item details can belong to one ClientTrip
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "client_trip_id", referencedColumnName = "id")
	private ClientTrip clientTrip;
}
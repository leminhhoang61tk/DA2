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
public class ClientBranch {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String addedDateTime;

	private String state;

	private String city;

	private String fullAddress;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "client_id", referencedColumnName = "id")
	private Client client;

}
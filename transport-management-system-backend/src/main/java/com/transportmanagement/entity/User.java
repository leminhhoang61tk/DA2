package com.transportmanagement.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String firstName;

	private String lastName;

	private String emailId;

	@JsonIgnore
	private String password;

	private String phoneNo;

	private String role;

	private String status;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private Employee employee;

	private String addedDateTime;

	// Many-to-Many relationship with ClientTrip
	@JsonIgnore
	@ManyToMany(mappedBy = "employees")
	private List<ClientTrip> clientTrips;

}

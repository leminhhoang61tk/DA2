package com.transportmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class AlertNotification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String vehicleNo;

	private String vehicleRegistrationNo;

	private String description; // alert message to show for e.g Permit is about to expiry, please take action

	private String lastDate;

	private String notificationViewed; // No

}

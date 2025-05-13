package com.transportmanagement.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class ClientTrip {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String name;

	private String addedDateTime;

	private String startDateTime; // Start Date and Time in epoch time from UI

	private String startKm; // Start KM

	private String vendorName; // Vender Name (Self, Third Party)

	private String closeKm; // Close KM

	private String deliveredDateTime; // in epoch time

	private String totalKm;

	private String transportationMode; // Transportation Mode (Road)

	private String paidBy; // Paid By (Bill To) (Consignor, Consignee)

	private String paymentPaidBy; // Payment Paid By (Consignor, Consignee)

	private String taxPaidBy; // Tax Paid By (Consignor, Consignee)

	private String status; // Status (Open/Close)

	private String deliveryStatus; // Delivery Status (In Transit, Pending, Delivered)

	private String invoiceName;

	private String invoiceNumber;

	private String paymentDueDate; // in epoch time

	private String paymentStatus; // Payment Status (Pending, Not Paid, Partial Paid, Done)

	private String comment;

	private String document;

	// One trip can have multiple item details
	@OneToMany(mappedBy = "clientTrip")
	private List<ClientItemDetail> itemDetails;

	@ManyToOne
	@JoinColumn(name = "from_client_id", referencedColumnName = "id")
	private Client fromClient; // Consignor

	@ManyToOne
	@JoinColumn(name = "to_client_id", referencedColumnName = "id")
	private Client toClient; // Consignee

	@ManyToOne
	@JoinColumn(name = "from_branch_id", referencedColumnName = "id")
	private ClientBranch bookingPointStation;

	@ManyToOne
	@JoinColumn(name = "to_branch_id", referencedColumnName = "id")
	private ClientBranch deliveryPointStation;

	// One trip can have one price details
	@OneToOne(mappedBy = "clientTrip")
	private ClientTripPriceDetails priceDetails;

	// One trip can have one charges details
	@OneToOne(mappedBy = "clientTrip")
	private ClientTripCharges chargesDetails;

	@OneToMany(mappedBy = "clientTrip")
	private List<ClientTripOtherExpense> otherExpenses;

	@OneToMany(mappedBy = "clientTrip")
	private List<ClientTripFuelExpense> fuelExpenses;

	// Many-to-Many relationship with Vehicles
	@ManyToMany
	@JoinTable(name = "client_trip_vehicle", joinColumns = @JoinColumn(name = "client_trip_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "vehicle_id", referencedColumnName = "id"))
	private List<Vehicle> vehicles;

	// Many-to-Many relationship with Users (Employees)
	@ManyToMany
	@JoinTable(name = "client_trip_user", joinColumns = @JoinColumn(name = "client_trip_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"))
	private List<User> employees;

}
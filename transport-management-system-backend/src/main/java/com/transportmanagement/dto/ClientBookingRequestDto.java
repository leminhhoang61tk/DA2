package com.transportmanagement.dto;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.transportmanagement.entity.ClientTrip;

import lombok.Data;

@Data
public class ClientBookingRequestDto {

	private int id;
	
	private String name;

	private String startDateTime; // Start Date and Time in epoch time from UI

	private String startKm; // Start KM

	private String vendorName; // Vender Name (Self, Third Party)

	private String closeKm; // Close KM

	private String totalKm;

	private String transportationMode; // Transportation Mode (Road)

	private String paidBy; // Paid By (Bill To) (Consignor, Consignee)

	private String paymentPaidBy; // Payment Paid By (Consignor, Consignee)

	private String taxPaidBy; // Tax Paid By (Consignor, Consignee)

	private String invoiceName; // Invoice Name

	private String invoiceNumber; // Invoice Number

	private String paymentDueDate; // in epoch

	private String paymentStatus; // Payment Status (Pending, Not Paid, Partial Paid, Done)

	private String comment;

	private MultipartFile document;

	private int fromClientId;

	private int toClientId;

	private int vehicleId;

	private int employeeId;

	private int bookingPointStationId; // client branch id

	private int deliveryPointStationId; // client branch id
	
	private String deliveredDateTime;
	
	private String deliveryStatus;
	
	private String status;

	public static ClientTrip toClientTripEntity(ClientBookingRequestDto request) {
		ClientTrip booking = new ClientTrip();
		BeanUtils.copyProperties(request, booking, "document", "fromClientId", "toClientId", "vehicleId", "employeeId",
				"deliveryPointStationId", "bookingPointStationId");
		return booking;
	}

}

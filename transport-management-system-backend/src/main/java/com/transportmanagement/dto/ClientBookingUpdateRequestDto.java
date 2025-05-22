package com.transportmanagement.dto;

import lombok.Data;

@Data
public class ClientBookingUpdateRequestDto {

	private int id;

	private String name;

	private String startDateTime; // in epoch time from UI

	private String paymentDueDate; // in epoch

	private String deliveredDateTime; // in epoch time from UI

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

	private String paymentStatus; // Payment Status (Pending, Not Paid, Partial Paid, Done)

	private String comment;

	private String deliveryStatus;

	private String status;

}

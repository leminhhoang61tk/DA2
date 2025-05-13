package com.transportmanagement.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.transportmanagement.entity.AlertNotification;

import lombok.Data;

@Data
public class DashBoardDataResponse extends CommonApiResponse {

	private int totalVehicle; // total active vehicle

	private int runningVehicle;

	private int stoppedVehicle;

	private int totalAlertNotification;

	private int totalBookedOrder;

	private int todayNewBooking;

	private BigDecimal totalAmountBooked;

	private BigDecimal totalNewBookedAmount;

	private BigDecimal totalDueAmount;

	private BigDecimal totalNewDueAmount;

	private BigDecimal todaysFuelExpense;

	private BigDecimal todaysOtherExpense;

	private BigDecimal todaysSalaryPaid;

	private BigDecimal todaysTotalExpense;

	private List<TripDetail> tripDetails;

	private List<AlertNotification> alertNotifications = new ArrayList<>();

}

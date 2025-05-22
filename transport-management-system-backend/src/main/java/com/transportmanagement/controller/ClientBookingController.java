package com.transportmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.transportmanagement.dto.ClientBookingItemDetailRequest;
import com.transportmanagement.dto.ClientBookingRequestDto;
import com.transportmanagement.dto.ClientBookingUpdateRequestDto;
import com.transportmanagement.dto.ClientTripChargesRequestDto;
import com.transportmanagement.dto.ClientTripFuelExpenseRequest;
import com.transportmanagement.dto.ClientTripOtherExpenseRequest;
import com.transportmanagement.dto.ClientTripPriceDetailsRequest;
import com.transportmanagement.dto.ClientTripResponse;
import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.DashBoardDataResponse;
import com.transportmanagement.resource.ClientBookingResource;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/transport/client/")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientBookingController {

	@Autowired
	private ClientBookingResource clientBookingResource;

	@PostMapping("/booking/add")
	@Operation(summary = "Api to add client booking")
	public ResponseEntity<CommonApiResponse> addClientBooking(ClientBookingRequestDto request) {
		return clientBookingResource.addClientBooking(request);
	}

	@PutMapping("/booking/document/udpate")
	@Operation(summary = "Api to update the client document!!!")
	public ResponseEntity<CommonApiResponse> updateClientDocument(ClientBookingRequestDto request) {
		return clientBookingResource.updateClientBookingDocument(request);
	}

	@PutMapping("/booking/details/udpate")
	@Operation(summary = "Api to update the client booking detail!!!")
	public ResponseEntity<CommonApiResponse> updateClientBookingDetails(
			@RequestBody ClientBookingUpdateRequestDto request) {
		return clientBookingResource.updateClientBookingDetails(request);
	}

	// api to add the Item Detail
	@PutMapping("/booking/item/add")
	@Operation(summary = "Api to add the item detail for client booking!!!")
	public ResponseEntity<ClientTripResponse> addItemDetailForBooking(
			@RequestBody ClientBookingItemDetailRequest request) {
		return clientBookingResource.addItemDetailForBooking(request);
	}

	// api to add the Employee
	@PutMapping("/booking/employee/add")
	@Operation(summary = "Api to add the employee for client booking!!!")
	public ResponseEntity<ClientTripResponse> addEmployeeForClientBooking(
			@RequestParam("employeeId") Integer employeeId, @RequestParam("bookingId") Integer bookingId) {
		return clientBookingResource.addEmployeeForClientBooking(employeeId, bookingId);
	}

	// api to add the Vehicle
	@PutMapping("/booking/vehicle/add")
	@Operation(summary = "Api to add the vehicle for client booking!!!")
	public ResponseEntity<ClientTripResponse> addVehicleForClientBooking(@RequestParam("vehicleId") Integer vehicleId,
			@RequestParam("bookingId") Integer bookingId) {
		return clientBookingResource.addVehicleForClientBooking(vehicleId, bookingId);
	}

	// api to add the trip charges
	@PutMapping("/booking/trip/charges/add")
	@Operation(summary = "Api to add the trip charges for client booking!!!")
	public ResponseEntity<ClientTripResponse> addTripChargesForClientBooking(
			@RequestBody ClientTripChargesRequestDto request) {
		return clientBookingResource.addTripChargesForClientBooking(request);
	}

	// api to add the other expense
	@PutMapping("/booking/other/expense/add")
	@Operation(summary = "Api to add the trip other expense for client booking!!!")
	public ResponseEntity<ClientTripResponse> addTripOtherExpenseForClientBooking(
			ClientTripOtherExpenseRequest request) {
		return clientBookingResource.addTripExpenseForClientBooking(request);
	}

	// api to add the fuel expense
	@PutMapping("/booking/fuel/expense/add")
	@Operation(summary = "Api to add the trip fuel expense for client booking!!!")
	public ResponseEntity<CommonApiResponse> addTripFuelExpenseForClientBooking(ClientTripFuelExpenseRequest request) {
		return clientBookingResource.addTripFuelExpenseForClientBooking(request);
	}

	// api to add the price detail
	@PutMapping("/booking/price/detail/add")
	@Operation(summary = "Api to add the trip price details for client booking!!!")
	public ResponseEntity<ClientTripResponse> addTripPriceDetailForClientBooking(
			@RequestBody ClientTripPriceDetailsRequest request) {
		return clientBookingResource.addTripPriceDetailForClientBooking(request);
	}

	@GetMapping("/booking/fetch")
	@Operation(summary = "Api to fetch the client booking by Id!!!")
	public ResponseEntity<ClientTripResponse> fetchClientBookingById(@RequestParam("bookingId") Integer bookingId) {
		return clientBookingResource.fetchClientBookingById(bookingId);
	}

	@GetMapping("/booking/fetch/all")
	@Operation(summary = "Api to fetch the bookings!!!")
	public ResponseEntity<ClientTripResponse> fetchBookings() {
		return clientBookingResource.fetchBookings();
	}

	@GetMapping("/booking/fetch/invoice-wise")
	@Operation(summary = "Api to fetch the bookings by invoice wise!!!")
	public ResponseEntity<ClientTripResponse> fetchBookingsByInvoiceNo(@RequestParam("invoiceNo") String invoiceNo) {
		return clientBookingResource.fetchBookingsByInvoiceNo(invoiceNo);
	}

	@GetMapping("/booking/fetch/client-wise")
	@Operation(summary = "Api to fetch the bookings client wise!!!")
	public ResponseEntity<ClientTripResponse> fetchBookingsByClientWise(@RequestParam("fromClientId") int fromClientId,
			@RequestParam("toClientId") int toClientId) {
		return clientBookingResource.fetchBookingsByClient(fromClientId, toClientId);
	}

	@GetMapping("/booking/generate/invoice")
	@Operation(summary = "Api to download the client booking invoice!!!")
	public ResponseEntity<byte[]> downloadClientBookingInvoice(@RequestParam("bookingId") Integer bookingId) {
		return clientBookingResource.downloadClientBookingInvoice(bookingId);
	}

	@GetMapping("/booking/admin/dashboard")
	@Operation(summary = "Api to fetch the dashboard data")
	public ResponseEntity<DashBoardDataResponse> fetchDashBoardData() {
		return clientBookingResource.fetchDashBoardData();
	}

	@GetMapping("/booking/search/date-time")
	@Operation(summary = "Api to fetch the bookings by start and endtime")
	public ResponseEntity<ClientTripResponse> fetchBookingsByStartAndEndTime(
			@RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime) {
		return clientBookingResource.fetchBookingsByStartAndEndTime(startTime, endTime);
	}

	@GetMapping("/booking/todays")
	@Operation(summary = "Api to fetch the todays bookings")
	public ResponseEntity<ClientTripResponse> fetchtodaysBookings() {
		return clientBookingResource.fetchtodaysBookings();
	}

	@GetMapping("/booking/dashboard/alert/read")
	@Operation(summary = "Api to fetch the todays bookings")
	public ResponseEntity<CommonApiResponse> readAlertNotification(@RequestParam("alertId") int alertId) {
		return clientBookingResource.readAlertNotification(alertId);
	}

}

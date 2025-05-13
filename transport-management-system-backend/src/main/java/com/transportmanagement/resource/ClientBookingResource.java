package com.transportmanagement.resource;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
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
import com.transportmanagement.dto.TripDetail;
import com.transportmanagement.entity.AlertNotification;
import com.transportmanagement.entity.Client;
import com.transportmanagement.entity.ClientBranch;
import com.transportmanagement.entity.ClientItemDetail;
import com.transportmanagement.entity.ClientTrip;
import com.transportmanagement.entity.ClientTripCharges;
import com.transportmanagement.entity.ClientTripFuelExpense;
import com.transportmanagement.entity.ClientTripOtherExpense;
import com.transportmanagement.entity.ClientTripPriceDetails;
import com.transportmanagement.entity.EmployeePaymentSalary;
import com.transportmanagement.entity.User;
import com.transportmanagement.entity.Vehicle;
import com.transportmanagement.service.AlertNotificationService;
import com.transportmanagement.service.ClientBranchService;
import com.transportmanagement.service.ClientItemDetailService;
import com.transportmanagement.service.ClientService;
import com.transportmanagement.service.ClientTripChargesService;
import com.transportmanagement.service.ClientTripFuelExpenseService;
import com.transportmanagement.service.ClientTripOtherExpenseService;
import com.transportmanagement.service.ClientTripPriceDetailsService;
import com.transportmanagement.service.ClientTripService;
import com.transportmanagement.service.EmployeePaymentSalaryService;
import com.transportmanagement.service.UserService;
import com.transportmanagement.service.VehicleService;
import com.transportmanagement.utility.Constants.ActiveStatus;
import com.transportmanagement.utility.Constants.BookingDeliveryStatus;
import com.transportmanagement.utility.Constants.BookingStatus;
import com.transportmanagement.utility.Constants.IsNotificationViewedStatus;
import com.transportmanagement.utility.Constants.UserRole;
import com.transportmanagement.utility.DateTimeUtils;
import com.transportmanagement.utility.StorageService;

@Component
public class ClientBookingResource {

	private final Logger LOG = LoggerFactory.getLogger(ClientResource.class);

	@Autowired
	private ClientService clientService;

	@Autowired
	private StorageService storageService;

	@Autowired
	private ClientBranchService clientBranchService;

	@Autowired
	private ClientTripService clientTripService;

	@Autowired
	private UserService userService;

	@Autowired
	private VehicleService vehicleService;

	@Autowired
	private ClientTripOtherExpenseService clientTripOtherExpenseService;

	@Autowired
	private ClientTripFuelExpenseService clientTripFuelExpenseService;

	@Autowired
	private ClientTripPriceDetailsService clientTripPriceDetailsService;

	@Autowired
	private ClientItemDetailService clientItemDetailService;

	@Autowired
	private ClientTripChargesService clientTripChargesService;

	@Autowired
	private EmployeePaymentSalaryService employeePaymentSalaryService;

	@Autowired
	private AlertNotificationService alertNotificationService;

	// Company Info
	@Value("${com.transportmanagement.company.name}")
	private String companyname;

	@Value("${com.transportmanagement.company.address}")
	private String companyaddress;

	@Value("${com.transportmanagement.company.email}")
	private String companyemail;

	@Value("${com.transportmanagement.company.contactNo}")
	private String companycontactNo;

	@Value("${com.transportmanagement.company.gstno}")
	private String companygstNo;

	// Bank Info
	@Value("${com.transportmanagement.company.bank.name}")
	private String bankName;

	@Value("${com.transportmanagement.company.bank.branch}")
	private String bankBranch;

	@Value("${com.transportmanagement.company.bank.accountNo}")
	private String bankAccountNo;

	@Value("${com.transportmanagement.company.bank.ifscCode}")
	private String bankIfscCode;

	// Goods Info
	@Value("${com.transportmanagement.company.goods.packages}")
	private String goodsPackages;

	@Value("${com.transportmanagement.company.goods.commodity}")
	private String goodsCommodity;

	@Value("${com.transportmanagement.company.goods.beNo}")
	private String goodsBeNo;

	@Value("${com.transportmanagement.company.goods.cbm}")
	private String goodsCbm;

	@Value("${com.transportmanagement.company.goods.gpNo}")
	private String goodsGpNo;

	@Value("${com.transportmanagement.company.goods.billNo}")
	private String goodsBillNo;

	@Value("${com.transportmanagement.company.goods.stNo}")
	private String goodsStNo;

	@Value("${com.transportmanagement.company.goods.ewayBill}")
	private String goodsEwayBill;

	@Value("${com.transportmanagement.company.goods.tpNo}")
	private String goodsTpNo;

	@Value("${com.transportmanagement.company.goods.billAmt}")
	private String goodsBillAmt;

	@Value("${com.transportmanagement.company.goods.weight}")
	private String goodsWeight;

	@Value("${com.transportmanagement.company.goods.freight}")
	private String goodsFreight;

	// Amount Info
	@Value("${com.transportmanagement.company.amount.totalFreight}")
	private String totalFreight;

	@Value("${com.transportmanagement.company.amount.gauranteeCharges}")
	private String gauranteeCharges;

	@Value("${com.transportmanagement.company.amount.bitlyCharges}")
	private String bitlyCharges;

	@Value("${com.transportmanagement.company.amount.advanceAmount}")
	private String advanceAmount;

	@Value("${com.transportmanagement.company.amount.roundOff}")
	private String roundOff;

	@Value("${com.transportmanagement.company.amount.freightToPay}")
	private String freightToPay;

	@Value("${com.transportmanagement.company.amount.advance}")
	private String advance;

	@Value("${com.transportmanagement.company.invoice.termsandconditionline1}")
	private String termsandconditionline1;

	@Value("${com.transportmanagement.company.invoice.termsandconditionline2}")
	private String termsandconditionline2;

	@Value("${com.transportmanagement.company.invoice.termsandconditionline3}")
	private String termsandconditionline3;

	@Value("${com.transportmanagement.company.invoice.termsandconditionline4}")
	private String termsandconditionline4;

	@Value("${com.transportmanagement.company.invoice.notice}")
	private String notice;

	public ResponseEntity<CommonApiResponse> addClientBooking(ClientBookingRequestDto request) {

		LOG.info("Received request for adding the client booking!!");

		CommonApiResponse response = new CommonApiResponse();

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getDocument() == null) {
			response.setResponseMessage("Select the Document please!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getFromClientId() == 0 || request.getToClientId() == 0 || request.getBookingPointStationId() == 0
				|| request.getDeliveryPointStationId() == 0 || request.getEmployeeId() == 0
				|| request.getVehicleId() == 0) {
			response.setResponseMessage("missing input!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client fromClient = this.clientService.getClientById(request.getFromClientId());

		if (fromClient == null) {
			response.setResponseMessage("From Client Not found");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client toClient = this.clientService.getClientById(request.getToClientId());

		if (toClient == null) {
			response.setResponseMessage("To Client Not found");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientBranch sourceBranch = this.clientBranchService.getClientBranchById(request.getBookingPointStationId());

		if (sourceBranch == null || sourceBranch.getClient().getId() != fromClient.getId()) {
			response.setResponseMessage("Select valid Source Client Branch!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientBranch toBranch = this.clientBranchService.getClientBranchById(request.getDeliveryPointStationId());

		if (toBranch == null || toBranch.getClient().getId() != toClient.getId()) {
			response.setResponseMessage("Select valid Destination Client Branch!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User employee = this.userService.getUserById(request.getEmployeeId());

		if (employee == null) {
			response.setResponseMessage("Employee Not found");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle vehicle = this.vehicleService.getVehicleById(request.getVehicleId());

		if (vehicle == null) {
			response.setResponseMessage("Vehicle Not found!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = ClientBookingRequestDto.toClientTripEntity(request);

		if (clientTrip == null) {
			response.setResponseMessage("Internal Technical issue!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String document = this.storageService.store(request.getDocument());

		if (document == null) {
			response.setResponseMessage("Failed to upload the vehicle document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		clientTrip.setFromClient(fromClient);
		clientTrip.setToClient(toClient);
		clientTrip.setBookingPointStation(sourceBranch);
		clientTrip.setDeliveryPointStation(toBranch);
		clientTrip.setVehicles(Arrays.asList(vehicle));
		clientTrip.setEmployees(Arrays.asList(employee));
		clientTrip.setAddedDateTime(addedDateTime);
		clientTrip.setDocument(document);

		ClientTrip addedTrip = this.clientTripService.createClientTrip(clientTrip);

		if (addedTrip == null) {
			response.setResponseMessage("Failed to add the client trip");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Client Booking Added succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateClientBookingDocument(ClientBookingRequestDto request) {

		LOG.info("Received request for updating the booking document!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getId() == 0 || request.getDocument() == null) {
			response.setResponseMessage("missing input!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip exitingClientTrip = this.clientTripService.getClientTripById(request.getId());

		if (exitingClientTrip == null) {
			response.setResponseMessage("Client Booking not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String newDocumentFileName = this.storageService.store(request.getDocument());

		String existingDocumentFileName = exitingClientTrip.getDocument();

		if (newDocumentFileName == null) {
			response.setResponseMessage("Failed to upload the booking document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		exitingClientTrip.setDocument(newDocumentFileName);
		ClientTrip updatedClientTrip = this.clientTripService.updateClientTrip(exitingClientTrip);

		if (updatedClientTrip == null) {
			response.setResponseMessage("Failed to update the Client Booking!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		this.storageService.delete(existingDocumentFileName);

		response.setResponseMessage("Client Booking Document Updated succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateClientBookingDetails(ClientBookingUpdateRequestDto request) {

		LOG.info("Received request for updating the client booking details!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getId() == 0) {
			response.setResponseMessage("Client Booking Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip existingClientTrip = this.clientTripService.getClientTripById(request.getId());

		if (existingClientTrip == null) {
			response.setResponseMessage("Client not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		// Setting all fields from the request DTO to the existing client trip entity
		existingClientTrip
				.setPaymentDueDate(StringUtils.isEmpty(request.getPaymentDueDate()) ? "" : request.getPaymentDueDate());
		existingClientTrip.setDeliveredDateTime(
				StringUtils.isEmpty(request.getDeliveredDateTime()) ? "" : request.getDeliveredDateTime());
		existingClientTrip
				.setStartDateTime(StringUtils.isEmpty(request.getStartDateTime()) ? "" : request.getStartDateTime());
		existingClientTrip.setStartKm(request.getStartKm());
		existingClientTrip.setVendorName(request.getVendorName());
		existingClientTrip.setCloseKm(request.getCloseKm());
		existingClientTrip.setTotalKm(request.getTotalKm());
		existingClientTrip.setTransportationMode(request.getTransportationMode());
		existingClientTrip.setPaidBy(request.getPaidBy());
		existingClientTrip.setPaymentPaidBy(request.getPaymentPaidBy());
		existingClientTrip.setTaxPaidBy(request.getTaxPaidBy());
		existingClientTrip.setInvoiceName(request.getInvoiceName());
		existingClientTrip.setInvoiceNumber(request.getInvoiceNumber());
		existingClientTrip.setPaymentStatus(request.getPaymentStatus());
		existingClientTrip.setComment(request.getComment());
		existingClientTrip.setStatus(request.getStatus());

		ClientTrip updatedClientTrip = this.clientTripService.updateClientTrip(existingClientTrip);

		if (updatedClientTrip == null) {
			response.setResponseMessage("Failed to update the Client trip!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Client Booking Updated succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> addItemDetailForBooking(ClientBookingItemDetailRequest request) {

		LOG.info("Received request for updating the client booking details!!");

		ClientTripResponse response = new ClientTripResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getClientTripId() == 0) {
			response.setResponseMessage("Client Trip Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(request.getClientTripId());

		if (clientTrip == null) {
			response.setResponseMessage("Client Booking not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientItemDetail itemDetail = ClientBookingItemDetailRequest.toClientItemEntity(request);
		itemDetail.setClientTrip(clientTrip);

		ClientItemDetail detail = this.clientItemDetailService.createClientItemDetail(itemDetail);

		if (detail == null) {
			response.setResponseMessage("Failed to update the detail!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip updatedClientTrip = this.clientTripService.getClientTripById(request.getClientTripId());
		response.setBooking(updatedClientTrip);
		response.setResponseMessage("Item Detail Successfully Added in Client Booking!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> addEmployeeForClientBooking(Integer employeeId, Integer bookingId) {

		LOG.info("Received request for updating the client booking details!!");

		ClientTripResponse response = new ClientTripResponse();

		if (employeeId == null || employeeId == 0) {
			response.setResponseMessage("missing Employee Id!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (bookingId == null || bookingId == 0) {
			response.setResponseMessage("missing Client Booking Id!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(bookingId);

		if (clientTrip == null) {
			response.setResponseMessage("Client Booking not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User employee = this.userService.getUserById(employeeId);

		if (employee == null || !employee.getRole().equals(UserRole.ROLE_EMPLOYEE.value())) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<User> employees = clientTrip.getEmployees();

		for (User user : employees) {
			if (user.getId() == employeeId) {
				response.setResponseMessage("Employee already added in selected Booking Trip!!!");
				response.setSuccess(false);

				return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
			}
		}

		if (CollectionUtils.isEmpty(employees)) {
			employees = Arrays.asList(employee);
		} else {
			employees.add(employee);
		}

		clientTrip.setEmployees(employees);

		ClientTrip updatedClientTrip = this.clientTripService.updateClientTrip(clientTrip);
		response.setBooking(updatedClientTrip);
		response.setResponseMessage("Employee Added For Client Booking!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> addVehicleForClientBooking(Integer vehicleId, Integer bookingId) {

		LOG.info("Received request for updating the client booking details!!");

		ClientTripResponse response = new ClientTripResponse();

		if (vehicleId == null || vehicleId == 0) {
			response.setResponseMessage("missing Vehicle Id!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (bookingId == null || bookingId == 0) {
			response.setResponseMessage("missing Client Booking Id!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(bookingId);

		if (clientTrip == null) {
			response.setResponseMessage("Client Booking not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle vehicle = this.vehicleService.getVehicleById(vehicleId);

		if (vehicle == null) {
			response.setResponseMessage("Vehicle not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Vehicle> vehicles = clientTrip.getVehicles();

		for (Vehicle v : vehicles) {
			if (v.getId() == vehicleId) {
				response.setResponseMessage("Vehicle already present for this Booking Trip");
				response.setSuccess(false);

				return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
			}
		}

		if (CollectionUtils.isEmpty(vehicles)) {
			vehicles = Arrays.asList(vehicle);
		} else {
			vehicles.add(vehicle);
		}

		clientTrip.setVehicles(vehicles);

		ClientTrip updatedClientTrip = this.clientTripService.updateClientTrip(clientTrip);
		response.setBooking(updatedClientTrip);
		response.setResponseMessage("Vehicle Added For Client Booking!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> addTripChargesForClientBooking(ClientTripChargesRequestDto request) {

		LOG.info("Received request for updating the client booking details!!");

		ClientTripResponse response = new ClientTripResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getClientTripId() == 0) {
			response.setResponseMessage("Client Trip Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(request.getClientTripId());

		if (clientTrip == null) {
			response.setResponseMessage("Client Trip not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTripCharges charge = ClientTripChargesRequestDto.toClientTripChargesEntity(request);
		charge.setClientTrip(clientTrip);

		ClientTripCharges addedCharge = this.clientTripChargesService.createClientTripCharges(charge);

		if (addedCharge == null) {
			response.setResponseMessage("Failed to update the client trip!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip updatedClientTrip = this.clientTripService.getClientTripById(request.getClientTripId());
		response.setBooking(updatedClientTrip);
		response.setResponseMessage("Item Detail Successfully Added in Client Booking!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> addTripExpenseForClientBooking(ClientTripOtherExpenseRequest request) {

		LOG.info("Received request for adding the client trip expense!!");

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		ClientTripResponse response = new ClientTripResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getClientTripId() == 0) {
			response.setResponseMessage("Client Trip Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(request.getClientTripId());

		if (clientTrip == null) {
			response.setResponseMessage("Client Booking not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle vehicle = this.vehicleService.getVehicleById(request.getVehicleId());

		if (vehicle == null) {
			response.setResponseMessage("Vehicle not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTripOtherExpense clientTripOtherExpense = ClientTripOtherExpenseRequest.toClientTripOtherExpense(request);

		if (clientTripOtherExpense == null) {
			response.setResponseMessage("Internal Server Error");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		String receiptFileName = this.storageService.store(request.getReceiptUpload());

		clientTripOtherExpense.setClientTrip(clientTrip);
		clientTripOtherExpense.setDateTime(addedDateTime);
		clientTripOtherExpense.setReceiptUpload(receiptFileName);

		// Create a new list for vehicles to avoid sharing the same collection reference
		List<Vehicle> vehicleList = new ArrayList<>();
		vehicleList.add(vehicle);

		// Set the new list of vehicles to ClientTripFuelExpense
		clientTripOtherExpense.setVehicles(vehicleList);

		ClientTripOtherExpense savedExpense = this.clientTripOtherExpenseService
				.createClientTripOtherExpense(clientTripOtherExpense);

		if (savedExpense == null) {
			response.setResponseMessage("Failed to update the trip other expense!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		// Now update the clientTrip with the new vehicle association
		List<Vehicle> clientTripVehicles = new ArrayList<>(clientTrip.getVehicles());
		if (!clientTripVehicles.contains(vehicle)) {
			clientTripVehicles.add(vehicle);
			clientTrip.setVehicles(clientTripVehicles);
			this.clientTripService.updateClientTrip(clientTrip);
		}

		ClientTrip updatedClientTrip = this.clientTripService.getClientTripById(request.getClientTripId());
		response.setBooking(updatedClientTrip);
		response.setResponseMessage("Expense Successfully Added for Client Booking!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> addTripFuelExpenseForClientBooking(ClientTripFuelExpenseRequest request) {

		LOG.info("Received request for adding the client trip fuel expense!!");

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("Request is null");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getClientTripId() == 0 || request.getVehicleId() == 0) {
			response.setResponseMessage("Client Trip or Vehicle Id is missing!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(request.getClientTripId());

		if (clientTrip == null) {
			response.setResponseMessage("Client Booking not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Vehicle vehicle = this.vehicleService.getVehicleById(request.getVehicleId());

		if (vehicle == null) {
			response.setResponseMessage("Vehicle not found!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTripFuelExpense clientTripFuelExpense = ClientTripFuelExpenseRequest
				.toClientTripFuelExpenseEntity(request);

		if (clientTripFuelExpense == null) {
			response.setResponseMessage("Internal Server Error");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		String receiptFileName = this.storageService.store(request.getReceiptUpload());

		// Set other fields for ClientTripFuelExpense
		clientTripFuelExpense.setClientTrip(clientTrip);
		clientTripFuelExpense.setDateTime(addedDateTime);
		clientTripFuelExpense.setReceiptUpload(receiptFileName);

		// Create a new list for vehicles to avoid sharing the same collection reference
		List<Vehicle> vehicleList = new ArrayList<>();
		vehicleList.add(vehicle);

		// Set the new list of vehicles to ClientTripFuelExpense
		clientTripFuelExpense.setVehicles(vehicleList);

		// Save the ClientTripFuelExpense
		ClientTripFuelExpense savedExpense = this.clientTripFuelExpenseService
				.createClientTripFuelExpense(clientTripFuelExpense);

		if (savedExpense == null) {
			response.setResponseMessage("Failed to update the trip fuel expense!!!");
			response.setSuccess(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Now update the clientTrip with the new vehicle association
		List<Vehicle> clientTripVehicles = new ArrayList<>(clientTrip.getVehicles());
		if (!clientTripVehicles.contains(vehicle)) {
			clientTripVehicles.add(vehicle);
			clientTrip.setVehicles(clientTripVehicles);
			this.clientTripService.updateClientTrip(clientTrip);
		}

		response.setResponseMessage("Fuel Expense Successfully Added!!!");
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> addTripPriceDetailForClientBooking(
			ClientTripPriceDetailsRequest request) {

		LOG.info("Received request for adding the price details for client booking!!");

		ClientTripResponse response = new ClientTripResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getClientTripId() == 0) {
			response.setResponseMessage("Client Trip Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(request.getClientTripId());

		if (clientTrip == null) {
			response.setResponseMessage("Client Trip not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTripPriceDetails priceDetail = ClientTripPriceDetailsRequest.toClientTripPriceDetailEntity(request);
		priceDetail.setClientTrip(clientTrip);

		ClientTripPriceDetails addedPriceDetail = this.clientTripPriceDetailsService
				.createClientTripPriceDetails(priceDetail);

		if (addedPriceDetail == null) {
			response.setResponseMessage("Failed to update the client trip price details!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip updatedClientTrip = this.clientTripService.getClientTripById(request.getClientTripId());
		response.setBooking(updatedClientTrip);
		response.setResponseMessage("Price Detail Successfully Added for Client Booking!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> fetchClientBookingById(Integer bookingId) {

		LOG.info("receieve request for client booking by using Id");

		ClientTripResponse response = new ClientTripResponse();

		if (bookingId == null || bookingId == 0) {
			response.setResponseMessage("booking id is null");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (bookingId == 0) {
			response.setResponseMessage("Client Trip Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip clientTrip = this.clientTripService.getClientTripById(bookingId);

		if (clientTrip == null) {
			response.setResponseMessage("Client Trip not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setBooking(clientTrip);
		response.setResponseMessage("Client Booking Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> fetchBookings() {

		LOG.info("receieve request for fetch all bookings");

		ClientTripResponse response = new ClientTripResponse();

		List<ClientTrip> clientTrips = this.clientTripService.getAllClientTrips();

		if (CollectionUtils.isEmpty(clientTrips)) {
			response.setResponseMessage("Client Orders not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setBookings(clientTrips);
		response.setResponseMessage("Client Orders Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<byte[]> downloadClientBookingInvoice(Integer bookingId) {

		if (bookingId == null || bookingId == 0) {
			LOG.error("Booking Id not found!!!");
		}

		ClientTrip booking = this.clientTripService.getClientTripById(bookingId);

		try {

			// Create PDF in memory
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			Document document = new Document(PageSize.A4);
			PdfWriter.getInstance(document, baos);

			document.open();

			// Fonts
			Font boldFont = new Font(Font.HELVETICA, 18, Font.BOLD); // Adjusted company name font size
			Font detailsboldFont = new Font(Font.NORMAL, 9, Font.BOLD);
			Font detailsFont = new Font(Font.NORMAL, 9, Font.NORMAL); // Adjusted address, email, and contact font size

			// Create a table with 3 columns
			PdfPTable headerTable = new PdfPTable(3);
			headerTable.setWidthPercentage(100); // Width 100% of page
			headerTable.setWidths(new float[] { 1, 3, 1 }); // Set relative width of the columns

			// Add company logo to the left (replace with your actual image)
			Image logo = Image.getInstance("classpath:image/logo.png"); // Add your logo path here
			logo.scaleToFit(40, 40); // Adjusted logo size (smaller)
			PdfPCell logoCell = new PdfPCell(logo);
			logoCell.setBorder(Rectangle.NO_BORDER); // No borders for a cleaner look
			logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE); // Center vertically
			logoCell.setHorizontalAlignment(Element.ALIGN_LEFT); // Align logo to the left
			headerTable.addCell(logoCell);

			// Add company name, address, and email in the center
			PdfPCell companyDetailsCell = new PdfPCell();
			companyDetailsCell.setBorder(Rectangle.NO_BORDER); // No border
			companyDetailsCell.setVerticalAlignment(Element.ALIGN_MIDDLE); // Center vertically
			companyDetailsCell.setHorizontalAlignment(Element.ALIGN_CENTER); // Align content in the center

			Paragraph companyName = new Paragraph(companyname, boldFont);
			companyName.setAlignment(Element.ALIGN_CENTER); // Center text

			Paragraph companyAddress = new Paragraph(companyaddress, detailsFont);
			companyAddress.setAlignment(Element.ALIGN_CENTER); // Center text

			Paragraph companyEmail = new Paragraph("Email: " + companyemail, detailsFont);
			companyEmail.setAlignment(Element.ALIGN_CENTER); // Center text

			// Add all details to the center cell
			companyDetailsCell.addElement(companyName);
			companyDetailsCell.addElement(companyAddress);
			companyDetailsCell.addElement(companyEmail);
			headerTable.addCell(companyDetailsCell);

			// Add contact number to the right
			PdfPCell contactDetailsCell = new PdfPCell();
			contactDetailsCell.setBorder(Rectangle.NO_BORDER); // No border
			contactDetailsCell.setVerticalAlignment(Element.ALIGN_MIDDLE); // Center vertically
			contactDetailsCell.setHorizontalAlignment(Element.ALIGN_RIGHT); // Align content to the right

			Paragraph contactNumber = new Paragraph("Contact No: " + companycontactNo, detailsFont);
			contactNumber.setAlignment(Element.ALIGN_RIGHT); // Right align text
			contactDetailsCell.addElement(contactNumber);

			headerTable.addCell(contactDetailsCell);

			// Add the table to the document
			document.add(headerTable);

			// Optionally, add a blank paragraph to add extra space
			document.add(new Paragraph(" ")); // Add a blank line for extra space

			// Table creation with 3 columns
			PdfPTable invoiceTable = new PdfPTable(3); // 3 columns
			invoiceTable.setWidthPercentage(100); // Set table width to 100% of the page

			// Define the relative column widths (equal widths)
			invoiceTable.setWidths(new int[] { 1, 1, 1 }); // 3 equal columns

			// Invoice No Cell (Bold Label + Normal Value)
			Phrase invoicePhrase = new Phrase();
			invoicePhrase.add(new Chunk("Invoice No: ", detailsboldFont)); // Bold label
			invoicePhrase.add(new Chunk(booking.getInvoiceNumber(), detailsFont)); // Normal value (dynamic)
			PdfPCell invoiceNoCell = new PdfPCell(invoicePhrase);
			invoiceNoCell.setBorder(Rectangle.BOX); // Add border to the cell
			invoiceNoCell.setPadding(4); // Add some padding for better readability
			invoiceTable.addCell(invoiceNoCell);

			// GSTIN Cell (Bold Label + Normal Value)
			Phrase gstinPhrase = new Phrase();
			gstinPhrase.add(new Chunk("GSTIN: ", detailsboldFont)); // Bold label
			gstinPhrase.add(new Chunk(companygstNo, detailsFont)); // Normal value (dynamic)
			PdfPCell gstinCell = new PdfPCell(gstinPhrase);
			gstinCell.setBorder(Rectangle.BOX); // Add border to the cell
			gstinCell.setPadding(4); // Add some padding
			invoiceTable.addCell(gstinCell);

			// Trip From Cell (Bold Label + Normal Value)
			Phrase tripFromPhrase = new Phrase();
			tripFromPhrase.add(new Chunk("Trip From: ", detailsboldFont)); // Bold label
			tripFromPhrase.add(new Chunk(booking.getBookingPointStation().getCity(), detailsFont)); // Normal value
																									// (dynamic)
			PdfPCell tripFromCell = new PdfPCell(tripFromPhrase);
			tripFromCell.setBorder(Rectangle.BOX); // Add border to the cell
			tripFromCell.setPadding(4); // Add some padding
			invoiceTable.addCell(tripFromCell);

			// Date Cell (Bold Label + Normal Value)
			Phrase datePhrase = new Phrase();
			datePhrase.add(new Chunk("Date: ", detailsboldFont)); // Bold label
			datePhrase.add(
					new Chunk(DateTimeUtils.getProperDateFormatFromEpochTime(booking.getStartDateTime()), detailsFont)); // Normal
																															// value
																															// (dynamic)
			PdfPCell dateCell = new PdfPCell(datePhrase);
			dateCell.setBorder(Rectangle.BOX); // Add border to the cell
			dateCell.setPadding(4); // Add some padding for better readability
			invoiceTable.addCell(dateCell);

			// At Owner's Risk Cell (In Red)
			Font redFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.RED); // Red bold font
			PdfPCell riskCell = new PdfPCell(new Paragraph("At Owner's Risk", redFont));
			riskCell.setBorder(Rectangle.BOX); // Add border to the cell
			riskCell.setPadding(4); // Add padding
			riskCell.setHorizontalAlignment(Element.ALIGN_CENTER); // Center align the text
			invoiceTable.addCell(riskCell);

			// Trip To Cell (Bold Label + Normal Value)
			Phrase tripToPhrase = new Phrase();
			tripToPhrase.add(new Chunk("Trip To: ", detailsboldFont)); // Bold label
			tripToPhrase.add(new Chunk(booking.getDeliveryPointStation().getCity(), detailsFont)); // Normal value
																									// (dynamic)
			PdfPCell tripToCell = new PdfPCell(tripToPhrase);
			tripToCell.setBorder(Rectangle.BOX); // Add border to the cell
			tripToCell.setPadding(4); // Add padding
			invoiceTable.addCell(tripToCell);

			// Vehicle No Cell (Bold Label + Normal Value)
			Phrase vehicleNoPhrase = new Phrase();
			vehicleNoPhrase.add(new Chunk("Vehicle No: ", detailsboldFont)); // Bold label
			vehicleNoPhrase.add(new Chunk(booking.getVehicles().get(0).getRegistrationNumber(), detailsFont)); // Normal
																												// value
																												// (dynamic)
			PdfPCell vehicleNoCell = new PdfPCell(vehicleNoPhrase);
			vehicleNoCell.setBorder(Rectangle.BOX); // Add border to the cell
			vehicleNoCell.setPadding(4); // Add some padding for better readability
			invoiceTable.addCell(vehicleNoCell);

			// GST Paid Cell (with checkboxes for Consigner, Consignee, Transporter in a
			// row)
			Phrase gstPaidPhrase = new Phrase();
			gstPaidPhrase.add(new Chunk("GST Paid: ", detailsboldFont)); // Bold label

			// Simulating checkboxes using Unicode characters, aligned in a row
			gstPaidPhrase.add(new Chunk(booking.getTaxPaidBy(), detailsFont));

			PdfPCell gstPaidCell = new PdfPCell(gstPaidPhrase);
			gstPaidCell.setBorder(Rectangle.BOX); // Add border to the cell
			gstPaidCell.setPadding(4); // Add padding for better readability
			gstPaidCell.setHorizontalAlignment(Element.ALIGN_LEFT); // Align text to the left
			invoiceTable.addCell(gstPaidCell);

			// Driver No Cell (Bold Label + Normal Value)
			Phrase driverNoPhrase = new Phrase();
			driverNoPhrase.add(new Chunk("Driver No: ", detailsboldFont)); // Bold label
			driverNoPhrase.add(new Chunk(booking.getEmployees().get(0).getPhoneNo(), detailsFont)); // Normal value
																									// (dynamic)
			PdfPCell driverNoCell = new PdfPCell(driverNoPhrase);
			driverNoCell.setBorder(Rectangle.BOX); // Add border to the cell
			driverNoCell.setPadding(4); // Add padding
			invoiceTable.addCell(driverNoCell);

			// Add the table to the document
			document.add(invoiceTable);

			// Create a new row with 2 equal columns for Consigner and Consignee details
			PdfPTable consignerConsigneeTable = new PdfPTable(2); // 2 equal columns
			consignerConsigneeTable.setWidthPercentage(100); // Set table width to 100%
			consignerConsigneeTable.setWidths(new float[] { 1, 1 }); // Equal width for both columns

			// Consigner Cell (1st column)
			Phrase consignerPhrase = new Phrase();
			consignerPhrase.add(new Chunk("Consigner: " + booking.getFromClient().getName() + "\n", detailsboldFont)); // Bold
																														// Consigner
																														// label
			consignerPhrase.add(new Chunk(booking.getBookingPointStation().getFullAddress() + " "
					+ booking.getBookingPointStation().getCity() + " " + booking.getBookingPointStation().getState(),
					detailsFont)); // Normal text for
			// address
			PdfPCell consignerCell = new PdfPCell(consignerPhrase);
			consignerCell.setBorder(Rectangle.BOX); // Add border to the cell
			consignerCell.setPadding(8); // Add padding for better readability
			consignerConsigneeTable.addCell(consignerCell);

			// Consignee Cell (2nd column)
			Phrase consigneePhrase = new Phrase();
			consigneePhrase.add(new Chunk("Consignee: " + booking.getToClient().getName() + "\n", detailsboldFont)); // Bold
																														// Consignee
																														// label
			consigneePhrase.add(new Chunk(booking.getDeliveryPointStation().getFullAddress() + " "
					+ booking.getDeliveryPointStation().getCity() + " " + booking.getDeliveryPointStation().getState(),
					detailsFont)); // Normal text for
			// address
			PdfPCell consigneeCell = new PdfPCell(consigneePhrase);
			consigneeCell.setBorder(Rectangle.BOX); // Add border to the cell
			consigneeCell.setPadding(8); // Add padding for better readability
			consignerConsigneeTable.addCell(consigneeCell);

			// Add the Consigner/Consignee table to the document
			document.add(consignerConsigneeTable);

			// Create a new table with 2 columns for the G.S.T. row
			PdfPTable gstTable = new PdfPTable(2);
			gstTable.setWidthPercentage(100); // Set table width to 100% of the page
			gstTable.setWidths(new int[] { 1, 1 }); // 2 equal columns

			// G.S.T. No Cell for the 1st column (Bold Label + Normal Value)
			Phrase gst1Phrase = new Phrase();
			gst1Phrase.add(new Chunk("G.S.T. No: ", detailsboldFont)); // Bold label
			gst1Phrase.add(new Chunk(booking.getFromClient().getGstNumber(), detailsFont)); // Normal value

			PdfPCell gst1Cell = new PdfPCell(gst1Phrase);
			gst1Cell.setBorder(Rectangle.BOX); // Add border to the cell
			gst1Cell.setPadding(4); // Add some padding for better readability
			gstTable.addCell(gst1Cell);

			// G.S.T. No Cell for the 2nd column (Bold Label + Normal Value)
			Phrase gst2Phrase = new Phrase();
			gst2Phrase.add(new Chunk("G.S.T. No: ", detailsboldFont)); // Bold label
			gst2Phrase.add(new Chunk(booking.getToClient().getGstNumber(), detailsFont)); // Normal value

			PdfPCell gst2Cell = new PdfPCell(gst2Phrase);
			gst2Cell.setBorder(Rectangle.BOX); // Add border to the cell
			gst2Cell.setPadding(4); // Add some padding for better readability
			gstTable.addCell(gst2Cell);

			// Add the G.S.T. table to the document
			document.add(gstTable);

			// Create a new table with 6 columns for the next row
			PdfPTable goodsTable = new PdfPTable(6);
			goodsTable.setWidthPercentage(100); // Set table width to 100% of the page

			// Set custom widths for each column (small, half page, small, small, large,
			// small)
			goodsTable.setWidths(new float[] { 1, 4, 1, 1, 2, 1 });

			// 1st Column (Packages)
			PdfPCell packagesCell = new PdfPCell(new Phrase("Packages", detailsboldFont));
			packagesCell.setBorder(Rectangle.BOX); // Add border
			packagesCell.setPadding(4); // Add some padding
			packagesCell.setBackgroundColor(Color.LIGHT_GRAY);
			goodsTable.addCell(packagesCell);

			// 2nd Column (Nature of Goods)
			PdfPCell natureOfGoodsCell = new PdfPCell(new Phrase("Nature Of Goods", detailsboldFont));
			natureOfGoodsCell.setBorder(Rectangle.BOX); // Add border
			natureOfGoodsCell.setPadding(4); // Add some padding
			natureOfGoodsCell.setBackgroundColor(Color.LIGHT_GRAY);

			goodsTable.addCell(natureOfGoodsCell);

			// 3rd Column (Weight)
			PdfPCell weightCell = new PdfPCell(new Phrase("Weight", detailsboldFont));
			weightCell.setBorder(Rectangle.BOX); // Add border
			weightCell.setPadding(4); // Add some padding

			weightCell.setBackgroundColor(Color.LIGHT_GRAY);

			goodsTable.addCell(weightCell);

			// 4th Column (Freight)
			PdfPCell freightCell = new PdfPCell(new Phrase("Freight", detailsboldFont));
			freightCell.setBorder(Rectangle.BOX); // Add border
			freightCell.setPadding(4); // Add some padding
			freightCell.setBackgroundColor(Color.LIGHT_GRAY);

			goodsTable.addCell(freightCell);

			// 5th Column (Blank)
			PdfPCell blankCell = new PdfPCell(new Phrase("")); // Blank cell
			blankCell.setBorder(Rectangle.BOX); // Add border
			blankCell.setPadding(4); // Add some padding
			blankCell.setBackgroundColor(Color.LIGHT_GRAY);

			goodsTable.addCell(blankCell);

			// 6th Column (Amount)
			PdfPCell amountCell = new PdfPCell(new Phrase("Amount", detailsboldFont));
			amountCell.setBorder(Rectangle.BOX); // Add border
			amountCell.setPadding(4); // Add some padding
			amountCell.setBackgroundColor(Color.LIGHT_GRAY);

			goodsTable.addCell(amountCell);

			// Add the goods table to the document
			document.add(goodsTable);

			// Create a new table with 6 columns for the detailed row
			PdfPTable detailedRowTable = new PdfPTable(6);
			detailedRowTable.setWidthPercentage(100); // Set table width to 100% of the page
			detailedRowTable.setWidths(new float[] { 1, 4, 1, 1, 2, 1 }); // Custom column widths

			// 1st Column (Packages) - "LOOSE"
			PdfPCell packagesDetailCell = new PdfPCell(new Phrase(goodsPackages, detailsFont));
			packagesDetailCell.setBorder(Rectangle.BOX); // Add border
			packagesDetailCell.setPadding(4);
			detailedRowTable.addCell(packagesDetailCell);

			// 2nd Column (Nature of Goods) - Detailed content with multiple lines
			Phrase natureOfGoodsPhrase = new Phrase();
			natureOfGoodsPhrase.add(new Chunk("Commodity: " + goodsCommodity + "\n\n", detailsFont));
			natureOfGoodsPhrase.add(new Chunk("BE No: " + goodsBeNo + "   CBM: " + goodsCbm + "\n", detailsFont));
			natureOfGoodsPhrase
					.add(new Chunk("GP No: " + goodsGpNo + "   Bill No: " + goodsBillNo + "\n", detailsFont));
			natureOfGoodsPhrase
					.add(new Chunk("ST No: " + goodsStNo + "   E-Way Bill: " + goodsEwayBill + "\n", detailsFont));
			natureOfGoodsPhrase.add(new Chunk("TP No: " + goodsTpNo + "   Bill Amt: " + goodsBillAmt, detailsFont));

			PdfPCell natureOfGoodsDetailCell = new PdfPCell(natureOfGoodsPhrase);
			natureOfGoodsDetailCell.setBorder(Rectangle.BOX); // Add border
			natureOfGoodsDetailCell.setPadding(4);
			detailedRowTable.addCell(natureOfGoodsDetailCell);

			// 3rd Column (Weight) - "100 Kg"
			PdfPCell weightDetailCell = new PdfPCell(new Phrase(goodsWeight, detailsFont));
			weightDetailCell.setBorder(Rectangle.BOX); // Add border
			weightDetailCell.setPadding(4);
			detailedRowTable.addCell(weightDetailCell);

			// 4th Column (Freight) - "3250.00 MT"
			PdfPCell freightDetailCell = new PdfPCell(new Phrase(goodsFreight, detailsFont));
			freightDetailCell.setBorder(Rectangle.BOX); // Add border
			freightDetailCell.setPadding(4);
			detailedRowTable.addCell(freightDetailCell);

			// 5th Column (Blank with multiple rows for headings)
			Phrase blankColumnPhrase = new Phrase();
			blankColumnPhrase.add(new Chunk("Total Fright\n", detailsFont));
			blankColumnPhrase.add(new Chunk("Gaurantee Charges\n", detailsFont));
			blankColumnPhrase.add(new Chunk("Bilty Charges\n", detailsFont));
			blankColumnPhrase.add(new Chunk("Advance Amount\n", detailsFont));
			blankColumnPhrase.add(new Chunk("Round Off", detailsFont));

			PdfPCell blankDetailCell = new PdfPCell(blankColumnPhrase);
			blankDetailCell.setBorder(Rectangle.BOX); // Add border
			blankDetailCell.setPadding(4);
			blankDetailCell.setRowspan(5); // Span 5 rows
			detailedRowTable.addCell(blankDetailCell);

			// 6th Column (Amount with multiple rows for values)
			Phrase amountColumnPhrase = new Phrase();
			amountColumnPhrase.add(new Chunk(totalFreight + "\n", detailsFont));
			amountColumnPhrase.add(new Chunk(gauranteeCharges + "\n", detailsFont));
			amountColumnPhrase.add(new Chunk(bitlyCharges + "\n", detailsFont));
			amountColumnPhrase.add(new Chunk(advanceAmount + "\n", detailsFont));
			amountColumnPhrase.add(new Chunk(roundOff, detailsFont));

			PdfPCell amountDetailCell = new PdfPCell(amountColumnPhrase);
			amountDetailCell.setBorder(Rectangle.BOX); // Add border
			amountDetailCell.setPadding(4);
			amountDetailCell.setRowspan(5); // Span 5 rows
			detailedRowTable.addCell(amountDetailCell);

			// Add the detailed row table to the document
			document.add(detailedRowTable);

			// Create a new table with 3 columns
			PdfPTable noticeBankFreightTable = new PdfPTable(3);
			noticeBankFreightTable.setWidthPercentage(100); // Set table width to 100% of the page
			noticeBankFreightTable.setWidths(new float[] { 2, 1, 1 }); // 1st column half page, 2nd and 3rd equal

			// 1st Column (Notice with red color text in the center)
			Phrase noticePhrase = new Phrase();
			noticePhrase
					.add(new Chunk("Notice\n", FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, Color.RED))); // Red
																														// color
																														// bold
																														// Notice
																														// text
			noticePhrase.add(new Chunk("\n" + notice + "\n",
					FontFactory.getFont(FontFactory.HELVETICA, 7, Font.NORMAL, Color.DARK_GRAY)));

			PdfPCell noticeCell = new PdfPCell(noticePhrase);
			noticeCell.setPadding(10); // Add some padding
			noticeCell.setBorder(Rectangle.BOX); // Add border
			noticeBankFreightTable.addCell(noticeCell);

			// 2nd Column (Bank Details)
			Phrase bankDetailsPhrase = new Phrase();
			bankDetailsPhrase.add(new Chunk("Bank Details\n",
					FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, Color.BLACK))); // Red

			bankDetailsPhrase.add(new Chunk("Name: " + bankName + "\n", detailsFont));
			bankDetailsPhrase.add(new Chunk("Branch: " + bankBranch + "\n", detailsFont));
			bankDetailsPhrase.add(new Chunk("Acc No: " + bankAccountNo + "\n", detailsFont));
			bankDetailsPhrase.add(new Chunk("IFSC Code: " + bankIfscCode, detailsFont));

			PdfPCell bankDetailsCell = new PdfPCell(bankDetailsPhrase);
			bankDetailsCell.setPadding(10); // Add some padding
			bankDetailsCell.setBorder(Rectangle.BOX); // Add border
			noticeBankFreightTable.addCell(bankDetailsCell);

			// 3rd Column (Freight and Amount)
			PdfPTable freightAmountTable = new PdfPTable(2); // Nested table with 2 columns
			freightAmountTable.setWidths(new float[] { 1, 1 }); // First column smaller, second column larger

			// 1st Row (Freight to Pay and Amount)
			Phrase freightPhrase = new Phrase("Freight To Pay:",
					FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL)); // Freight label
			PdfPCell freightToPayCell = new PdfPCell(freightPhrase);
			freightToPayCell.setBorder(Rectangle.NO_BORDER);
			freightAmountTable.addCell(freightToPayCell);

			Phrase amountPhrase = new Phrase(freightToPay, FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL)); // Bold
																														// Amount
			PdfPCell frieghtamountCell = new PdfPCell(amountPhrase);
			frieghtamountCell.setHorizontalAlignment(Element.ALIGN_LEFT); // Align Amount to the right
			frieghtamountCell.setBorder(Rectangle.NO_BORDER);
			freightAmountTable.addCell(frieghtamountCell);

			// Add Freight and Amount row to the main table
			PdfPCell freightAmountMainCell = new PdfPCell(freightAmountTable);
			freightAmountMainCell.setBorder(Rectangle.BOX); // Add border around the nested table
			freightAmountMainCell.setPadding(10); // Add padding
			noticeBankFreightTable.addCell(freightAmountMainCell);

			// Add the noticeBankFreightTable to the document
			document.add(noticeBankFreightTable);

			// Create a new table with 3 columns (1st column for Terms & Conditions, 2nd for
			// Advance, 3rd for Signature)
			PdfPTable termsAdvanceSignatureTable = new PdfPTable(3);
			termsAdvanceSignatureTable.setWidthPercentage(100); // Set table width to 100% of the page
			termsAdvanceSignatureTable.setWidths(new float[] { 2, 1, 2 }); // 1st column normal, 2nd smaller, 3rd large
																			// for signature

			// 1st Column (Terms & Conditions with 3 to 4 lines)
			Phrase termsPhrase = new Phrase();
			termsPhrase.add(new Chunk("Terms & Conditions\n\n", detailsboldFont)); // Bold heading
			termsPhrase.add(new Chunk("1." + termsandconditionline1 + "\n",
					FontFactory.getFont(FontFactory.HELVETICA, 7, Font.NORMAL, Color.DARK_GRAY))); // Sample terms
			termsPhrase.add(new Chunk("2." + termsandconditionline2 + "\n",
					FontFactory.getFont(FontFactory.HELVETICA, 7, Font.NORMAL, Color.DARK_GRAY)));
			termsPhrase.add(new Chunk("3." + termsandconditionline3 + "\n",
					FontFactory.getFont(FontFactory.HELVETICA, 7, Font.NORMAL, Color.DARK_GRAY)));
			termsPhrase.add(new Chunk("4." + termsandconditionline4 + "\n",
					FontFactory.getFont(FontFactory.HELVETICA, 7, Font.NORMAL, Color.DARK_GRAY)));

			PdfPCell termsCell = new PdfPCell(termsPhrase);
			termsCell.setBorder(Rectangle.BOX); // Add border
			termsCell.setPadding(6);
			termsAdvanceSignatureTable.addCell(termsCell);

			// 2nd Column (Advance Rs 15,000/-)
			Phrase advancePhrase = new Phrase();
			advancePhrase.add(new Chunk("Advance\n", detailsboldFont)); // Bold heading
			advancePhrase.add(new Chunk(advance + "/-", detailsFont)); // Amount in normal text

			PdfPCell advanceCell = new PdfPCell(advancePhrase);
			advanceCell.setBorder(Rectangle.BOX); // Add border
			advanceCell.setPadding(6);
			termsAdvanceSignatureTable.addCell(advanceCell);

			// 3rd Column (Signature Section)
			Phrase signaturePhrase = new Phrase();
			signaturePhrase.add(new Chunk("Certified that the particulars given above are true and correct\n",
					FontFactory.getFont(FontFactory.HELVETICA, 8, Font.NORMAL, Color.BLACK))); // Small
			// font
			signaturePhrase.add(Chunk.NEWLINE); // Blank line

			signaturePhrase.add(new Chunk("For, " + companyname + "\n", detailsboldFont)); // Bold company name
																							// centered
			signaturePhrase.add(Chunk.NEWLINE); // Blank space for signature

			// Add blank lines for signature space
			for (int i = 0; i < 5; i++) {
				signaturePhrase.add(Chunk.NEWLINE);
			}

			signaturePhrase.add(new Chunk("Authorised Signature", detailsboldFont)); // Authorised Signature in bold on
																						// the right
			signaturePhrase.add(Chunk.NEWLINE);
			signaturePhrase.add(new Chunk("Subject to GANDHIDHAM Jurisdiction",
					FontFactory.getFont(FontFactory.HELVETICA, 8, Font.NORMAL, Color.BLACK))); // Small text for
			// jurisdiction

			PdfPCell signatureCell = new PdfPCell(signaturePhrase);
			signatureCell.setBorder(Rectangle.BOX); // Add border
			signatureCell.setPadding(6);
			signatureCell.setHorizontalAlignment(Element.ALIGN_RIGHT); // Align right for "Authorised Signature"
			signatureCell.setVerticalAlignment(Element.ALIGN_BOTTOM); // Align bottom for the signature-related text
			termsAdvanceSignatureTable.addCell(signatureCell);

			// Add this terms, advance, and signature table to the document
			document.add(termsAdvanceSignatureTable);

			// Close the document
			document.close();

			// Convert ByteArrayOutputStream to byte array for the response
			byte[] pdfBytes = baos.toByteArray();

			// Create the HTTP response
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDispositionFormData("attachment", "invoice-" + bookingId + ".pdf");

			return ResponseEntity.ok().headers(headers).body(pdfBytes);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).build();
		}
	}

	public ResponseEntity<ClientTripResponse> fetchBookingsByInvoiceNo(String invoiceNo) {
		LOG.info("receieve request for client booking by invoice no");

		ClientTripResponse response = new ClientTripResponse();

		if (StringUtils.isEmpty(invoiceNo)) {
			response.setResponseMessage("invoice no is missing");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<ClientTrip> clientTrips = this.clientTripService.getClientTripsByInvoiceNo(invoiceNo);

		if (CollectionUtils.isEmpty(clientTrips)) {
			response.setResponseMessage("Client Orders not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
		}

		response.setBookings(clientTrips);
		response.setResponseMessage("Client Orders Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> fetchBookingsByClient(int fromClientId, int toClientId) {
		LOG.info("receieve request for client booking client wise");

		ClientTripResponse response = new ClientTripResponse();

		if (fromClientId == 0 && toClientId == 0) {
			response.setResponseMessage("client id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<ClientTrip> clientTrips = null;

		Client fromClient = null;

		Client toClient = null;

		if (fromClientId != 0) {
			fromClient = this.clientService.getClientById(fromClientId);
		}

		if (toClientId != 0) {
			toClient = this.clientService.getClientById(toClientId);
		}

		if (fromClient != null && toClient == null) {
			clientTrips = this.clientTripService.getClientTripsByFromClient(fromClient);
		} else if (fromClient == null && toClient != null) {
			clientTrips = this.clientTripService.getClientTripsByToClient(toClient);
		} else {
			clientTrips = this.clientTripService.getClientTripsByFromClientAndToClient(fromClient, toClient);
		}

		if (CollectionUtils.isEmpty(clientTrips)) {
			response.setResponseMessage("Client Orders not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
		}

		response.setBookings(clientTrips);
		response.setResponseMessage("Client Orders Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<DashBoardDataResponse> fetchDashBoardData() {
		LOG.info("receieve request for getting the dashboard");

		DashBoardDataResponse response = new DashBoardDataResponse();

		// Get the current date
		LocalDate today = LocalDate.now();

		// Get the start of the day (12:00 AM)
		LocalDateTime startOfDay = today.atStartOfDay();

		// Convert the start of the day to milliseconds (Epoch time)
		long startOfDayMillis = startOfDay.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

		Long totalVehicleCount = this.vehicleService.countByStatus(ActiveStatus.ACTIVE.value());

		List<ClientTrip> runningTrips = clientTripService.findByStatusAndDeliveryStatusNotIn(BookingStatus.OPEN.value(),
				Arrays.asList(BookingDeliveryStatus.DELIVERED.value()));

		int runningVehilcesCount = CollectionUtils.isEmpty(runningTrips) ? 0 : runningTrips.size();

		int stoppedVehicleCount = totalVehicleCount.intValue() - runningVehilcesCount;

		List<ClientTrip> totalClientTrips = this.clientTripService.getAllBookedOrders();

		List<ClientTrip> newBookings = clientTripService
				.findByAddedDateTimeGreaterThan(String.valueOf(startOfDayMillis));

		int totalBookings = totalClientTrips.size();

		int totalNewBookings = newBookings.size();

		BigDecimal totalBookedAmount = totalClientTrips.stream().map(ClientTrip::getPriceDetails) // Get
																									// ClientTripPriceDetails
																									// from ClientTrip
				.filter(Objects::nonNull) // Ensure ClientTripPriceDetails is not null
				.map(ClientTripPriceDetails::getTotalAmount) // Get totalAmount from ClientTripPriceDetails
				.filter(Objects::nonNull) // Ensure totalAmount is not null
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the amounts

		// Sum of dueAmount in totalClientTrips
		BigDecimal totalDueAmount = totalClientTrips.stream().map(ClientTrip::getPriceDetails) // Get
																								// ClientTripPriceDetails
																								// from ClientTrip
				.filter(Objects::nonNull) // Ensure ClientTripPriceDetails is not null
				.map(ClientTripPriceDetails::getDueAmount) // Get dueAmount from ClientTripPriceDetails
				.filter(Objects::nonNull) // Ensure dueAmount is not null
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the due amounts

		// Sum of totalAmount in newBookings
		BigDecimal totalNewBookedAmount = newBookings.stream().map(ClientTrip::getPriceDetails) // Get
																								// ClientTripPriceDetails
																								// from ClientTrip
				.filter(Objects::nonNull) // Ensure ClientTripPriceDetails is not null
				.map(ClientTripPriceDetails::getTotalAmount) // Get totalAmount from ClientTripPriceDetails
				.filter(Objects::nonNull) // Ensure totalAmount is not null
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the total amounts

		// Sum of dueAmount in newBookings
		BigDecimal totalNewDueAmount = newBookings.stream().map(ClientTrip::getPriceDetails) // Get
																								// ClientTripPriceDetails
																								// from ClientTrip
				.filter(Objects::nonNull) // Ensure ClientTripPriceDetails is not null
				.map(ClientTripPriceDetails::getDueAmount) // Get dueAmount from ClientTripPriceDetails
				.filter(Objects::nonNull) // Ensure dueAmount is not null
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the due amounts

		List<AlertNotification> alertNotifications = alertNotificationService
				.findByNotificationViewed(IsNotificationViewedStatus.NO.value());

		response.setTotalAlertNotification(CollectionUtils.isEmpty(alertNotifications) ? 0 : alertNotifications.size());
		response.setAlertNotifications(alertNotifications);
		response.setTotalVehicle(totalVehicleCount.intValue());
		response.setRunningVehicle(runningVehilcesCount);
		response.setStoppedVehicle(stoppedVehicleCount);
		response.setTotalBookedOrder(totalBookings);
		response.setTodayNewBooking(totalNewBookings);
		response.setTotalAmountBooked(totalBookedAmount);
		response.setTotalNewBookedAmount(totalNewBookedAmount);
		response.setTotalDueAmount(totalDueAmount);
		response.setTotalNewDueAmount(totalNewDueAmount);

		List<TripDetail> totalTripDetails = newBookings.stream().map(clientTrip -> {
			TripDetail tripDetail = new TripDetail();

			tripDetail.setInvoice(clientTrip.getInvoiceNumber()); // Set Invoice

			tripDetail.setFromClientName(
					clientTrip.getFromClient() != null ? clientTrip.getFromClient().getName() : null);

			tripDetail.setToClientName(clientTrip.getToClient() != null ? clientTrip.getToClient().getName() : null);

			tripDetail.setPickUpPoint(
					clientTrip.getBookingPointStation() != null ? clientTrip.getBookingPointStation().getFullAddress()
							: null); // Set Pick-Up Point

			tripDetail.setDeliveryPoint(
					clientTrip.getDeliveryPointStation() != null ? clientTrip.getDeliveryPointStation().getFullAddress()
							: null); // Set Delivery Point

			ClientTripPriceDetails priceDetails = clientTrip.getPriceDetails();

			if (priceDetails != null) {
				tripDetail.setTotalAmount(priceDetails.getTotalAmount()); // Set Total Amount
				tripDetail.setReceivedAmount(priceDetails.getReceivedAmount()); // Set Received Amount
				tripDetail.setDueAmount(priceDetails.getDueAmount()); // Set Due Amount
			}

			return tripDetail;
		}).collect(Collectors.toList());

		List<ClientTripFuelExpense> fuelExpenses = this.clientTripFuelExpenseService
				.findByDateTimeGreaterThan(String.valueOf(startOfDayMillis));

		List<ClientTripOtherExpense> otherExpense = this.clientTripOtherExpenseService
				.findByDateTimeGreaterThan(String.valueOf(startOfDayMillis));

		List<EmployeePaymentSalary> salaries = this.employeePaymentSalaryService
				.findByDateTimeGreaterThan(String.valueOf(startOfDayMillis));

		// Sum of amounts in fuelExpenses
		BigDecimal totalFuelExpenseAmount = fuelExpenses.stream().map(ClientTripFuelExpense::getAmount) // Get amount
																										// from
																										// ClientTripFuelExpense
				.filter(Objects::nonNull) // Ensure no null values are included
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the amounts

		// Sum of amounts in otherExpense
		BigDecimal totalOtherExpenseAmount = otherExpense.stream().map(ClientTripOtherExpense::getAmount) // Get amount
																											// from
																											// ClientTripOtherExpense
				.filter(Objects::nonNull) // Ensure no null values are included
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the amounts

		// Sum of amounts in salaries
		BigDecimal totalSalaryAmount = salaries.stream().map(EmployeePaymentSalary::getAmount) // Get amount from
																								// EmployeePaymentSalary
				.filter(Objects::nonNull) // Ensure no null values are included
				.reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up all the amounts

		BigDecimal totalExpense = totalFuelExpenseAmount.add(totalOtherExpenseAmount) // Add other expenses
				.add(totalSalaryAmount); // Add salaries

		response.setTodaysFuelExpense(totalFuelExpenseAmount);
		response.setTodaysOtherExpense(totalOtherExpenseAmount);
		response.setTodaysSalaryPaid(totalSalaryAmount);
		response.setTodaysTotalExpense(totalExpense);

		response.setTripDetails(totalTripDetails);
		response.setResponseMessage("Dashbaord data fetched successful!!");
		response.setSuccess(true);

		return new ResponseEntity<DashBoardDataResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> fetchBookingsByStartAndEndTime(String startTime, String endTime) {
		LOG.info("receieve request for client booking client wise");

		ClientTripResponse response = new ClientTripResponse();

		if (startTime == null && endTime == null) {
			response.setResponseMessage("start time or end time is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<ClientTrip> clientTrips = this.clientTripService.findByAddedDateTimeBetween(startTime, endTime);

		if (CollectionUtils.isEmpty(clientTrips)) {
			response.setResponseMessage("Client Orders not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
		}

		List<TripDetail> totalTripDetails = clientTrips.stream().map(clientTrip -> {
			TripDetail tripDetail = new TripDetail();

			tripDetail.setInvoice(clientTrip.getInvoiceNumber()); // Set Invoice

			tripDetail.setFromClientName(
					clientTrip.getFromClient() != null ? clientTrip.getFromClient().getName() : null);

			tripDetail.setToClientName(clientTrip.getToClient() != null ? clientTrip.getToClient().getName() : null);

			tripDetail.setPickUpPoint(
					clientTrip.getBookingPointStation() != null ? clientTrip.getBookingPointStation().getFullAddress()
							: null); // Set Pick-Up Point

			tripDetail.setDeliveryPoint(
					clientTrip.getDeliveryPointStation() != null ? clientTrip.getDeliveryPointStation().getFullAddress()
							: null); // Set Delivery Point

			ClientTripPriceDetails priceDetails = clientTrip.getPriceDetails();

			if (priceDetails != null) {
				tripDetail.setTotalAmount(priceDetails.getTotalAmount()); // Set Total Amount
				tripDetail.setReceivedAmount(priceDetails.getReceivedAmount()); // Set Received Amount
				tripDetail.setDueAmount(priceDetails.getDueAmount()); // Set Due Amount
			}

			return tripDetail;
		}).collect(Collectors.toList());

		response.setTripDetails(totalTripDetails);
		response.setResponseMessage("Client Orders Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientTripResponse> fetchtodaysBookings() {
		LOG.info("receieve request for todays client bookings");

		ClientTripResponse response = new ClientTripResponse();

		// Get the current date
		LocalDate today = LocalDate.now();

		// Get the start of the day (12:00 AM)
		LocalDateTime startOfDay = today.atStartOfDay();

		// Convert the start of the day to milliseconds (Epoch time)
		long startOfDayMillis = startOfDay.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

		List<ClientTrip> newBookings = clientTripService
				.findByAddedDateTimeGreaterThan(String.valueOf(startOfDayMillis));

		if (CollectionUtils.isEmpty(newBookings)) {
			response.setResponseMessage("Client Orders not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
		}

		List<TripDetail> totalTripDetails = newBookings.stream().map(clientTrip -> {
			TripDetail tripDetail = new TripDetail();

			tripDetail.setInvoice(clientTrip.getInvoiceNumber()); // Set Invoice

			tripDetail.setFromClientName(
					clientTrip.getFromClient() != null ? clientTrip.getFromClient().getName() : null);

			tripDetail.setToClientName(clientTrip.getToClient() != null ? clientTrip.getToClient().getName() : null);

			tripDetail.setPickUpPoint(
					clientTrip.getBookingPointStation() != null ? clientTrip.getBookingPointStation().getFullAddress()
							: null); // Set Pick-Up Point

			tripDetail.setDeliveryPoint(
					clientTrip.getDeliveryPointStation() != null ? clientTrip.getDeliveryPointStation().getFullAddress()
							: null); // Set Delivery Point

			ClientTripPriceDetails priceDetails = clientTrip.getPriceDetails();

			if (priceDetails != null) {
				tripDetail.setTotalAmount(priceDetails.getTotalAmount()); // Set Total Amount
				tripDetail.setReceivedAmount(priceDetails.getReceivedAmount()); // Set Received Amount
				tripDetail.setDueAmount(priceDetails.getDueAmount()); // Set Due Amount
			}

			return tripDetail;
		}).collect(Collectors.toList());

		response.setTripDetails(totalTripDetails);
		response.setResponseMessage("Client Orders Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientTripResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> readAlertNotification(int alertId) {
		LOG.info("receieve request for makring the alert as READ");

		CommonApiResponse response = new CommonApiResponse();

		if (alertId == 0) {
			response.setResponseMessage("Alert Id is missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		AlertNotification notification = alertNotificationService.getById(alertId);

		if (notification == null) {
			response.setResponseMessage("Failed to update the notification!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		notification.setNotificationViewed(IsNotificationViewedStatus.YES.value());
		alertNotificationService.add(notification);

		response.setResponseMessage("Notification Marked as Read successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

}

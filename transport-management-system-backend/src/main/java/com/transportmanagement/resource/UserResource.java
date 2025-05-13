package com.transportmanagement.resource;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.EmployeeRegisterRequestDto;
import com.transportmanagement.dto.EmployeeSalaryRequestDto;
import com.transportmanagement.dto.EmployeeUpdateRequestDto;
import com.transportmanagement.dto.RegisterUserRequestDto;
import com.transportmanagement.dto.UserDto;
import com.transportmanagement.dto.UserLoginRequest;
import com.transportmanagement.dto.UserLoginResponse;
import com.transportmanagement.dto.UserResponseDto;
import com.transportmanagement.entity.ClientTrip;
import com.transportmanagement.entity.Employee;
import com.transportmanagement.entity.EmployeePaymentSalary;
import com.transportmanagement.entity.User;
import com.transportmanagement.entity.Vehicle;
import com.transportmanagement.exception.UserSaveFailedException;
import com.transportmanagement.service.ClientService;
import com.transportmanagement.service.ClientTripService;
import com.transportmanagement.service.EmployeePaymentSalaryService;
import com.transportmanagement.service.EmployeeService;
import com.transportmanagement.service.UserService;
import com.transportmanagement.service.VehicleService;
import com.transportmanagement.utility.Constants.ActiveStatus;
import com.transportmanagement.utility.Constants.EmployeeType;
import com.transportmanagement.utility.Constants.UserRole;
import com.transportmanagement.utility.JwtUtils;
import com.transportmanagement.utility.StorageService;

import jakarta.servlet.http.HttpServletResponse;

@Component
public class UserResource {

	private final Logger LOG = LoggerFactory.getLogger(UserResource.class);

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private StorageService storageService;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private VehicleService vehicleService;

	@Autowired
	private EmployeePaymentSalaryService employeePaymentSalaryService;

	@Autowired
	private ClientService clientService;

	@Autowired
	private ClientTripService clientTripService;

	public ResponseEntity<CommonApiResponse> registerAdmin(RegisterUserRequestDto registerRequest) {

		LOG.info("Request received for Register Admin");

		CommonApiResponse response = new CommonApiResponse();

		if (registerRequest == null) {
			response.setResponseMessage("user is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (registerRequest.getEmailId() == null || registerRequest.getPassword() == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userService.getUserByEmailAndStatus(registerRequest.getEmailId(),
				ActiveStatus.ACTIVE.value());

		if (existingUser != null) {
			response.setResponseMessage("User already register with this Email");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		User user = RegisterUserRequestDto.toUserEntity(registerRequest);

		user.setAddedDateTime(addedDateTime);
		user.setRole(UserRole.ROLE_ADMIN.value());
		user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
		user.setStatus(ActiveStatus.ACTIVE.value());

		existingUser = this.userService.addUser(user);

		if (existingUser == null) {
			response.setResponseMessage("failed to register admin");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Admin registered Successfully");
		response.setSuccess(true);

		LOG.info("Response Sent!!!");

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> registerUser(RegisterUserRequestDto request) {

		LOG.info("Received request for register user");

		CommonApiResponse response = new CommonApiResponse();

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		if (request == null) {
			response.setResponseMessage("user is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userService.getUserByEmailAndStatus(request.getEmailId(), ActiveStatus.ACTIVE.value());

		if (existingUser != null) {
			response.setResponseMessage("User with this Email Id already resgistered!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getRole() == null) {
			response.setResponseMessage("bad request ,Role is missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = RegisterUserRequestDto.toUserEntity(request);

		String encodedPassword = passwordEncoder.encode(user.getPassword());

		user.setStatus(ActiveStatus.ACTIVE.value());
		user.setPassword(encodedPassword);
		user.setAddedDateTime(addedDateTime);

		existingUser = this.userService.addUser(user);

		if (existingUser == null) {
			throw new UserSaveFailedException("Registration Failed because of Technical issue:(");
		}

		response.setResponseMessage("User registered Successfully");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserLoginResponse> login(UserLoginRequest loginRequest) {

		LOG.info("Received request for User Login");

		UserLoginResponse response = new UserLoginResponse();

		if (loginRequest == null) {
			response.setResponseMessage("Missing Input");
			response.setSuccess(false);

			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String jwtToken = null;
		User user = null;

		user = this.userService.getUserByEmailid(loginRequest.getEmailId());

		if (user == null) {
			response.setResponseMessage("User with this Email Id not registered in System!!!");
			response.setSuccess(false);

			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority(user.getRole()));

		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmailId(),
					loginRequest.getPassword(), authorities));
		} catch (Exception ex) {
			response.setResponseMessage("Invalid email or password.");
			response.setSuccess(false);
			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

		jwtToken = jwtUtils.generateToken(loginRequest.getEmailId());

		if (!user.getStatus().equals(ActiveStatus.ACTIVE.value())) {
			response.setResponseMessage("User is not active");
			response.setSuccess(false);

			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

		UserDto userDto = UserDto.toUserDtoEntity(user);

		// user is authenticated
		if (jwtToken != null) {
			response.setUser(userDto);
			response.setResponseMessage("Logged in sucessful");
			response.setSuccess(true);
			response.setJwtToken(jwtToken);

			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.OK);
		}

		else {
			response.setResponseMessage("Failed to login");
			response.setSuccess(false);
			return new ResponseEntity<UserLoginResponse>(response, HttpStatus.BAD_REQUEST);
		}

	}

	public ResponseEntity<UserResponseDto> getUsersByRole(String role) {

		UserResponseDto response = new UserResponseDto();

		if (role == null) {
			response.setResponseMessage("missing role");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<User> users = new ArrayList<>();

		users = this.userService.getUserByRoleAndStatus(role, ActiveStatus.ACTIVE.value());

		if (users.isEmpty()) {
			response.setResponseMessage("No Users Found");
			response.setSuccess(false);
		}

		List<UserDto> userDtos = new ArrayList<>();

		for (User user : users) {

			UserDto dto = UserDto.toUserDtoEntity(user);
			userDtos.add(dto);

		}

		response.setUsers(userDtos);
		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserResponseDto> getUserById(int userId) {

		UserResponseDto response = new UserResponseDto();

		if (userId == 0) {
			response.setResponseMessage("Invalid Input");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<User> users = new ArrayList<>();

		User user = this.userService.getUserById(userId);
		users.add(user);

		if (users.isEmpty()) {
			response.setResponseMessage("No Users Found");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
		}

		List<UserDto> userDtos = new ArrayList<>();

		for (User u : users) {

			UserDto dto = UserDto.toUserDtoEntity(u);

			if (dto.getEmployee() != null && !CollectionUtils.isEmpty(dto.getEmployee().getEmployeePaymentSalaries())) {
				for (EmployeePaymentSalary salary : dto.getEmployee().getEmployeePaymentSalaries()) {
					salary.setClientTripName(
							salary.getClientTrip().getName() + " [ " + salary.getClientTrip().getFromClient().getName()
									+ " (" + salary.getClientTrip().getBookingPointStation().getCity() + ")" + " - "
									+ salary.getClientTrip().getToClient().getName() + " ("
									+ salary.getClientTrip().getDeliveryPointStation().getCity() + ") " + "]");
				}
			}

			userDtos.add(dto);

		}

		response.setUsers(userDtos);
		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserResponseDto> getEmployeesByRoleAndStatus(String role, String status) {

		UserResponseDto response = new UserResponseDto();

		if (role == null) {
			response.setResponseMessage("missing role");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<User> users = new ArrayList<>();

		users = this.userService.getEmployeesWithRole(Arrays.asList(status), role);

		if (users.isEmpty()) {
			response.setResponseMessage("No Employees Found");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);

		}

		List<UserDto> userDtos = new ArrayList<>();

		for (User user : users) {

			UserDto dto = UserDto.toUserDtoEntity(user);
			userDtos.add(dto);

		}

		response.setUsers(userDtos);
		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
	}

	@Transactional
	public ResponseEntity<CommonApiResponse> registerEmployee(EmployeeRegisterRequestDto request) {

		LOG.info("Received request for register employee");

		CommonApiResponse response = new CommonApiResponse();

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUploadDocuments() == null) {
			response.setResponseMessage("Select the Document please!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userService.getUserByEmailid(request.getEmailId());

		if (existingUser != null) {
			response.setResponseMessage("User with this Email Id already resgistered!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = EmployeeRegisterRequestDto.toUserEntity(request);

		Employee employee = EmployeeRegisterRequestDto.toEmployeeEntity(request);

		user.setAddedDateTime(addedDateTime);
		user.setRole(UserRole.ROLE_EMPLOYEE.value());
		user.setStatus(ActiveStatus.ACTIVE.value());

//		user.setEmployee(addedEmployee);
		User savedUser = this.userService.addUser(user);

		String document = this.storageService.store(request.getUploadDocuments());

		if (document == null) {
			response.setResponseMessage("Failed to upload the employee document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		employee.setUploadDocuments(document);
		employee.setStatus(ActiveStatus.ACTIVE.value());
		employee.setUser(savedUser);

		Employee addedEmployee = this.employeeService.createEmployee(employee);

		if (addedEmployee == null) {
			response.setResponseMessage("Failed to add the Employee!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		savedUser.setEmployee(addedEmployee);
		this.userService.addUser(savedUser);

		response.setResponseMessage("Employee Registered Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<Resource> downloadDocumemt(String documentFileName, HttpServletResponse response) {

		Resource resource = storageService.load(documentFileName);
		if (resource == null) {
			// Handle file not found
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Document\"")
				.body(resource);

	}

	public ResponseEntity<CommonApiResponse> updateEmployee(EmployeeUpdateRequestDto request) {

		LOG.info("Received request for updating the employee detail!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userService.getUserById(request.getUserId());

		if (existingUser == null) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (existingUser.getEmployee() == null) {
			response.setResponseMessage("Employee Details not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Employee existingEmployee = existingUser.getEmployee();

		existingUser.setFirstName(request.getFirstName());
		existingUser.setLastName(request.getLastName());
		existingUser.setEmailId(request.getEmailId());
		existingUser.setPhoneNo(request.getPhoneNo());
		User updatedUser = this.userService.updateUser(existingUser);

		if (updatedUser == null) {
			response.setResponseMessage("Failed to update the user!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		existingEmployee.setFullName(request.getFullName());
		existingEmployee.setPanNumber(request.getPanNumber());
		existingEmployee.setAadharNumber(request.getAadharNumber());
		existingEmployee.setLicenseNumber(request.getLicenseNumber()); // if Driver
		existingEmployee.setRole(request.getRole()); // Driver, HR, Finance
		existingEmployee.setFullAddress(request.getFullAddress());
		existingEmployee.setCity(request.getCity());
		existingEmployee.setPinCode(request.getPinCode());
		existingEmployee.setState(request.getState());
		existingEmployee.setCountry(request.getCountry());
		existingEmployee.setLicenseExpiryDate(request.getLicenseExpiryDate()); // if Driver
		existingEmployee.setWorkStartDate(request.getWorkStartDate());
		existingEmployee.setWorkEndDate(request.getWorkEndDate());
		existingEmployee.setAccountNumber(request.getAccountNumber());
		existingEmployee.setIfscNumber(request.getIfscNumber());
		existingEmployee.setStatus(request.getStatus());
		existingEmployee.setComments(request.getComments());

		Employee updatedEmployee = this.employeeService.updateEmployee(existingEmployee);

		if (updatedEmployee == null) {
			response.setResponseMessage("Failed to update the employee!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Employee Details Updated Successful Successfully");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateEmployeeDocument(EmployeeRegisterRequestDto request) {
		LOG.info("Received request for updating the employee detail!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Employee employee = this.employeeService.getEmployeeById(request.getEmployeeId());

		if (employee == null) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String existingEmployeeDocumentFileNameToDelete = employee.getUploadDocuments();

		String newDocumentFileName = storageService.store(request.getUploadDocuments());

		employee.setUploadDocuments(newDocumentFileName);

		Employee updateEmployee = employeeService.updateEmployee(employee);

		if (updateEmployee == null) {
			response.setResponseMessage("Failed to update the Employee document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		this.storageService.delete(existingEmployeeDocumentFileNameToDelete);

		response.setResponseMessage("Employee document updated successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public ResponseEntity<CommonApiResponse> deleteTransporter(int transporterId) {

		LOG.info("Received request for delete the transporter id!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (transporterId == 0) {
			response.setResponseMessage("Transporter Id missing!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User transporter = this.userService.getUserById(transporterId);

		if (transporter == null || !transporter.getRole().equals(UserRole.ROLE_TRANSPORTER.value())) {
			response.setResponseMessage("Transporter not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		transporter.setStatus(ActiveStatus.DEACTIVATED.value());
		userService.updateUser(transporter);

		response.setResponseMessage("Transporter Deactivated Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> deleteEmployee(int employeeId) {

		LOG.info("Received request for delete the employee id!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (employeeId == 0) {
			response.setResponseMessage("Employee Id missing!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User employee = this.userService.getUserById(employeeId);

		if (employee == null || !employee.getRole().equals(UserRole.ROLE_EMPLOYEE.value())) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		employee.setStatus(ActiveStatus.DEACTIVATED.value());
		userService.updateUser(employee);

		response.setResponseMessage("Employee Deactivated Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> addEmployeeSalary(EmployeeSalaryRequestDto request) {

		LOG.info("Request received for adding the salary");

		CommonApiResponse response = new CommonApiResponse();

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUserId() == 0 || request.getTripId() == 0) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(request.getUserId());

		if (user == null || !user.getRole().equals(UserRole.ROLE_EMPLOYEE.value())) {
			response.setResponseMessage("Employee not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientTrip trip = this.clientTripService.getClientTripById(request.getTripId());

		Vehicle vehicle = null;

		if (user.getEmployee().getRole().equals(EmployeeType.DRIVER.value()) && request.getVehicleId() == 0) {
			response.setResponseMessage("Select Vehicle for Driver Payment!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		} else {
			vehicle = this.vehicleService.getVehicleById(request.getVehicleId());
		}

		Employee employee = user.getEmployee();

		String document = this.storageService.store(request.getReceiptUpload());

		EmployeePaymentSalary salary = new EmployeePaymentSalary();
		salary.setAmount(request.getAmount());
		salary.setClientTrip(trip);
		salary.setDateTime(addedDateTime);
		salary.setEmployee(employee);
		salary.setPaymentDetails(request.getPaymentDetails());
		salary.setPaymentMode(request.getPaymentMode());
		salary.setReceiptUpload(document);
		salary.setRemark(request.getRemark());
		salary.setVehicle(vehicle);
		salary.setSalaryType(request.getSalaryType());

		EmployeePaymentSalary addedSalary = this.employeePaymentSalaryService.createEmployeePaymentSalary(salary);

		if (addedSalary == null) {
			response.setResponseMessage("Failed to add the salary!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.setResponseMessage("Employee Payment Salary Added Successful!!!");
		response.setSuccess(true);

		LOG.info("Response Sent!!!");

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserResponseDto> fetchEmployeeWithName(String name) {

		UserResponseDto response = new UserResponseDto();

		if (name == null) {
			response.setResponseMessage("employee name missing");
			response.setSuccess(false);
			return new ResponseEntity<UserResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<User> users = new ArrayList<>();

		users = this.userService.getEmployeesWithName(name, UserRole.ROLE_EMPLOYEE.value(),
				ActiveStatus.ACTIVE.value());

		if (users.isEmpty()) {
			response.setResponseMessage("No Employees Found");
			response.setSuccess(false);
		}

		List<UserDto> userDtos = new ArrayList<>();

		for (User user : users) {

			UserDto dto = UserDto.toUserDtoEntity(user);
			userDtos.add(dto);

		}

		response.setUsers(userDtos);
		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		return new ResponseEntity<UserResponseDto>(response, HttpStatus.OK);
	}

}

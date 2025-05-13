package com.transportmanagement.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.lowagie.text.DocumentException;
import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.EmployeeRegisterRequestDto;
import com.transportmanagement.dto.EmployeeSalaryRequestDto;
import com.transportmanagement.dto.EmployeeUpdateRequestDto;
import com.transportmanagement.dto.RegisterUserRequestDto;
import com.transportmanagement.dto.UserLoginRequest;
import com.transportmanagement.dto.UserLoginResponse;
import com.transportmanagement.dto.UserResponseDto;
import com.transportmanagement.resource.UserResource;
import com.transportmanagement.utility.StorageService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private UserResource userResource;

	@Autowired
	private StorageService storageService;

	@PostMapping("/admin/register")
	@Operation(summary = "Api to register Admin")
	public ResponseEntity<CommonApiResponse> registerAdmin(@RequestBody RegisterUserRequestDto request) {
		return userResource.registerAdmin(request);
	}

	@PostMapping("transporter/register")
	@Operation(summary = "Api to register the transporter")
	public ResponseEntity<CommonApiResponse> registerUser(@RequestBody RegisterUserRequestDto request) {
		return this.userResource.registerUser(request);
	}

	@PostMapping("employee/register")
	@Operation(summary = "Api to register the employee")
	public ResponseEntity<CommonApiResponse> registerEmployee(EmployeeRegisterRequestDto request) {
		return this.userResource.registerEmployee(request);
	}

	@PostMapping("employee/salary/add")
	@Operation(summary = "Api to add the employee salary")
	public ResponseEntity<CommonApiResponse> addEmployeeSalary(EmployeeSalaryRequestDto request) {
		return this.userResource.addEmployeeSalary(request);
	}

	@PutMapping("employee/detail/update")
	@Operation(summary = "Api to update the employee")
	public ResponseEntity<CommonApiResponse> updateEmployee(@RequestBody EmployeeUpdateRequestDto request) {
		return this.userResource.updateEmployee(request);
	}

	@PutMapping("employee/document/update")
	@Operation(summary = "Api to update the employee document")
	public ResponseEntity<CommonApiResponse> updateEmployeeDocument(EmployeeRegisterRequestDto request) {
		return this.userResource.updateEmployeeDocument(request);
	}

	@PostMapping("login")
	@Operation(summary = "Api to login any User")
	public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest userLoginRequest) {
		return userResource.login(userLoginRequest);
	}

	@GetMapping("/fetch/role-wise")
	@Operation(summary = "Api to get Users By Role")
	public ResponseEntity<UserResponseDto> fetchAllUsersByRole(@RequestParam("role") String role)
			throws JsonProcessingException {
		return userResource.getUsersByRole(role);
	}

	@GetMapping("/fetch/employees")
	@Operation(summary = "Api to get Employee Details")
	public ResponseEntity<UserResponseDto> fetchEmployeeWithRoleAndStatus(@RequestParam("role") String role,
			@RequestParam("status") String status) throws JsonProcessingException {
		return userResource.getEmployeesByRoleAndStatus(role, status);
	}

	@GetMapping("/fetch/employee-name-wise")
	@Operation(summary = "Api to get Employee by using name")
	public ResponseEntity<UserResponseDto> fetchEmployeeWithName(@RequestParam("name") String name) {
		return userResource.fetchEmployeeWithName(name);
	}

	@GetMapping("/fetch/user-id")
	@Operation(summary = "Api to get User Detail By User Id")
	public ResponseEntity<UserResponseDto> fetchUserById(@RequestParam("userId") int userId) {
		return userResource.getUserById(userId);
	}

	@DeleteMapping("/transporter/delete")
	@Operation(summary = "Api to delete the Transporter")
	public ResponseEntity<CommonApiResponse> deleteTransporter(@RequestParam("transporterId") int transporterId) {
		return userResource.deleteTransporter(transporterId);
	}

	@DeleteMapping("/employee/delete")
	@Operation(summary = "Api to delete the Employee")
	public ResponseEntity<CommonApiResponse> deleteEmployee(@RequestParam("employeeId") int employeeId) {
		return userResource.deleteEmployee(employeeId);
	}

	@GetMapping("/document/{documentFileName}/download")
	@Operation(summary = "Api for downloading the Employee Resume")
	public ResponseEntity<Resource> downloadDocumemt(@PathVariable("documentFileName") String documentFileName,
			HttpServletResponse response) throws DocumentException, IOException {
		return this.userResource.downloadDocumemt(documentFileName, response);
	}

	@GetMapping("/document/{documentFileName}/view")
	@Operation(summary = "API for viewing the document in PDF viewer")
	public ResponseEntity<Resource> viewDocument(@PathVariable("documentFileName") String documentFileName) {
		Resource resource = storageService.load(documentFileName);
		if (resource == null) {
			// Handle file not found
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF) // Set content type to PDF
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + documentFileName + "\"") // Inline
																											// display
				.body(resource);
	}

}

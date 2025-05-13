package com.transportmanagement.dto;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.transportmanagement.entity.Employee;
import com.transportmanagement.entity.User;

import lombok.Data;

@Data
public class EmployeeRegisterRequestDto {

	private int employeeId;  // for update
	
	// user table detail
	private String firstName;

	private String lastName;

	private String emailId;

	private String phoneNo;

	// employee table detail
	private String fullName;

	private String panNumber;

	private String aadharNumber;

	private String licenseNumber; // if Driver

	private String role; // Driver, HR, Finance

	private String fullAddress;

	private String city;

	private String pinCode;

	private String state;

	private String country;

	private String licenseExpiryDate; // if Driver

	private String workStartDate;

	private String workEndDate;

	private String accountNumber;

	private String ifscNumber;

	private String status;

	private String comments;

	private MultipartFile uploadDocuments;

	public static Employee toEmployeeEntity(EmployeeRegisterRequestDto request) {
		Employee employee = new Employee();
		BeanUtils.copyProperties(request, employee, "uploadDocuments", "firstName", "lastName", "emailId", "phoneNo");
		return employee;
	}

	public static User toUserEntity(EmployeeRegisterRequestDto request) {
		User user = new User();
		BeanUtils.copyProperties(request, user, "role");
		return user;
	}

}

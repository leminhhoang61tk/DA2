package com.transportmanagement.dto;

import org.springframework.beans.BeanUtils;

import com.transportmanagement.entity.Employee;
import com.transportmanagement.entity.User;

import lombok.Data;

@Data
public class EmployeeUpdateRequestDto {

	private int userId; // for update

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

	public static Employee toEmployeeEntity(EmployeeUpdateRequestDto request) {
		Employee employee = new Employee();
		BeanUtils.copyProperties(request, employee, "userId","firstName", "lastName", "emailId", "phoneNo");
		return employee;
	}

	public static User toUserEntity(EmployeeUpdateRequestDto request) {
		User user = new User();
		BeanUtils.copyProperties(request, user, "userId", "fullName", "panNumber", "aadharNumber", "licenseNumber",
				"role", "fullAddress", "city", "pinCode", "state", "country", "licenseExpiryDate", "workStartDate",
				"workEndDate", "accountNumber", "ifscNumber", "status", "comments");
		return user;
	}

}

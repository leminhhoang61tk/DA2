package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.EmployeePaymentSalary;

public interface EmployeePaymentSalaryService {
	EmployeePaymentSalary createEmployeePaymentSalary(EmployeePaymentSalary employeePaymentSalary);

	EmployeePaymentSalary updateEmployeePaymentSalary(EmployeePaymentSalary employeePaymentSalary);

	void deleteEmployeePaymentSalary(int id);

	EmployeePaymentSalary getEmployeePaymentSalaryById(int id);

	List<EmployeePaymentSalary> getAllEmployeePaymentSalaries();

	List<EmployeePaymentSalary> findByDateTimeGreaterThan(String dateTime);

}

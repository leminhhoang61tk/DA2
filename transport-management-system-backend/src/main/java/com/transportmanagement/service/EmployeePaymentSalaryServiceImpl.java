package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.EmployeePaymentSalaryDao;
import com.transportmanagement.entity.EmployeePaymentSalary;

@Service
public class EmployeePaymentSalaryServiceImpl implements EmployeePaymentSalaryService {

	@Autowired
	private EmployeePaymentSalaryDao employeePaymentSalaryDao;

	@Override
	public EmployeePaymentSalary createEmployeePaymentSalary(EmployeePaymentSalary employeePaymentSalary) {
		return employeePaymentSalaryDao.save(employeePaymentSalary);
	}

	@Override
	public EmployeePaymentSalary updateEmployeePaymentSalary(EmployeePaymentSalary employeePaymentSalary) {
		return employeePaymentSalaryDao.save(employeePaymentSalary);
	}

	@Override
	public void deleteEmployeePaymentSalary(int id) {
		employeePaymentSalaryDao.deleteById(id);
	}

	@Override
	public EmployeePaymentSalary getEmployeePaymentSalaryById(int id) {
		return employeePaymentSalaryDao.findById(id).orElse(null);
	}

	@Override
	public List<EmployeePaymentSalary> getAllEmployeePaymentSalaries() {
		return employeePaymentSalaryDao.findAll();
	}

	@Override
	public List<EmployeePaymentSalary> findByDateTimeGreaterThan(String dateTime) {
		// TODO Auto-generated method stub
		return employeePaymentSalaryDao.findByDateTimeGreaterThan(dateTime);
	}
}

package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.EmployeePaymentSalary;

@Repository
public interface EmployeePaymentSalaryDao extends JpaRepository<EmployeePaymentSalary, Integer> {
	// Custom query methods (if any) can be added here

	List<EmployeePaymentSalary> findByDateTimeGreaterThan(String dateTime);
}

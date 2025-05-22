package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.ClientTripFuelExpense;

@Repository
public interface ClientTripFuelExpenseDao extends JpaRepository<ClientTripFuelExpense, Integer> {
	// Custom query methods (if any) can be added here

	List<ClientTripFuelExpense> findByDateTimeGreaterThan(String dateTime);

}

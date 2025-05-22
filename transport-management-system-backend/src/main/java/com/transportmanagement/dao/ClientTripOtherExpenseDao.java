package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.ClientTripOtherExpense;

@Repository
public interface ClientTripOtherExpenseDao extends JpaRepository<ClientTripOtherExpense, Integer> {
	// Custom query methods (if any) can be added here

	List<ClientTripOtherExpense> findByDateTimeGreaterThan(String dateTime);
}
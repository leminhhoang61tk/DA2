package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.ClientTripOtherExpense;

public interface ClientTripOtherExpenseService {
	ClientTripOtherExpense createClientTripOtherExpense(ClientTripOtherExpense clientTripOtherExpense);

	ClientTripOtherExpense updateClientTripOtherExpense(ClientTripOtherExpense clientTripOtherExpense);

	void deleteClientTripOtherExpense(int id);

	ClientTripOtherExpense getClientTripOtherExpenseById(int id);

	List<ClientTripOtherExpense> getAllClientTripOtherExpenses();

	List<ClientTripOtherExpense> findByDateTimeGreaterThan(String dateTime);
}

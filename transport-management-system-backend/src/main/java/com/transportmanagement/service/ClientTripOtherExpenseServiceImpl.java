package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientTripOtherExpenseDao;
import com.transportmanagement.entity.ClientTripOtherExpense;

@Service
public class ClientTripOtherExpenseServiceImpl implements ClientTripOtherExpenseService {

	@Autowired
	private ClientTripOtherExpenseDao clientTripOtherExpenseDao;

	@Override
	public ClientTripOtherExpense createClientTripOtherExpense(ClientTripOtherExpense clientTripOtherExpense) {
		return clientTripOtherExpenseDao.save(clientTripOtherExpense);
	}

	@Override
	public ClientTripOtherExpense updateClientTripOtherExpense(ClientTripOtherExpense clientTripOtherExpense) {
		return clientTripOtherExpenseDao.save(clientTripOtherExpense);
	}

	@Override
	public void deleteClientTripOtherExpense(int id) {
		clientTripOtherExpenseDao.deleteById(id);
	}

	@Override
	public ClientTripOtherExpense getClientTripOtherExpenseById(int id) {
		return clientTripOtherExpenseDao.findById(id).orElse(null);
	}

	@Override
	public List<ClientTripOtherExpense> getAllClientTripOtherExpenses() {
		return clientTripOtherExpenseDao.findAll();
	}

	@Override
	public List<ClientTripOtherExpense> findByDateTimeGreaterThan(String dateTime) {
		// TODO Auto-generated method stub
		return clientTripOtherExpenseDao.findByDateTimeGreaterThan(dateTime);
	}
}

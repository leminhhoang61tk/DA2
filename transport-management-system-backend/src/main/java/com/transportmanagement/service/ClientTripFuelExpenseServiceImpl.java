package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientTripFuelExpenseDao;
import com.transportmanagement.entity.ClientTrip;
import com.transportmanagement.entity.ClientTripFuelExpense;

@Service
public class ClientTripFuelExpenseServiceImpl implements ClientTripFuelExpenseService {

	@Autowired
	private ClientTripFuelExpenseDao clientTripFuelExpenseDao;

	@Override
	public ClientTripFuelExpense createClientTripFuelExpense(ClientTripFuelExpense clientTripFuelExpense) {
		return clientTripFuelExpenseDao.save(clientTripFuelExpense);
	}

	@Override
	public ClientTripFuelExpense updateClientTripFuelExpense(ClientTripFuelExpense clientTripFuelExpense) {
		return clientTripFuelExpenseDao.save(clientTripFuelExpense);
	}

	@Override
	public void deleteClientTripFuelExpense(int id) {
		clientTripFuelExpenseDao.deleteById(id);
	}

	@Override
	public ClientTripFuelExpense getClientTripFuelExpenseById(int id) {
		return clientTripFuelExpenseDao.findById(id).orElse(null);
	}

	@Override
	public List<ClientTripFuelExpense> getAllClientTripFuelExpenses() {
		return clientTripFuelExpenseDao.findAll();
	}

	@Override
	public List<ClientTripFuelExpense> findByDateTimeGreaterThan(String dateTime) {
		// TODO Auto-generated method stub
		return clientTripFuelExpenseDao.findByDateTimeGreaterThan(dateTime);
	}
}

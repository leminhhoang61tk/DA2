package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.ClientTripFuelExpense;

public interface ClientTripFuelExpenseService {
    ClientTripFuelExpense createClientTripFuelExpense(ClientTripFuelExpense clientTripFuelExpense);
    ClientTripFuelExpense updateClientTripFuelExpense(ClientTripFuelExpense clientTripFuelExpense);
    void deleteClientTripFuelExpense(int id);
    ClientTripFuelExpense getClientTripFuelExpenseById(int id);
    List<ClientTripFuelExpense> getAllClientTripFuelExpenses();
    List<ClientTripFuelExpense> findByDateTimeGreaterThan(String dateTime);
}


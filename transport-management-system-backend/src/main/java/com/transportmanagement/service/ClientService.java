package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.Client;

public interface ClientService {
	Client createClient(Client client);

	Client updateClient(Client client);

	void deleteClient(int id);

	Client getClientById(int id);

	List<Client> getAllClients();

	List<Client> getAllClientsByStatus(String value);

	List<Client> getAllClientsByName(String clientName, String status);
}
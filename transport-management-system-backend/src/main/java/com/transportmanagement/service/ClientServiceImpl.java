package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientDao;
import com.transportmanagement.entity.Client;

@Service
public class ClientServiceImpl implements ClientService {

	@Autowired
	private ClientDao clientDao;

	@Override
	public Client createClient(Client client) {
		return clientDao.save(client);
	}

	@Override
	public Client updateClient(Client client) {
		return clientDao.save(client);
	}

	@Override
	public void deleteClient(int id) {
		clientDao.deleteById(id);
	}

	@Override
	public Client getClientById(int id) {
		return clientDao.findById(id).orElse(null);
	}

	@Override
	public List<Client> getAllClients() {
		return clientDao.findAll();
	}

	@Override
	public List<Client> getAllClientsByStatus(String value) {
		// TODO Auto-generated method stub
		return clientDao.findByStatus(value);
	}

	@Override
	public List<Client> getAllClientsByName(String clientName, String status) {
		// TODO Auto-generated method stub
		return clientDao.findByNameContainingIgnoreCaseAndStatus(clientName, status);

	}

}

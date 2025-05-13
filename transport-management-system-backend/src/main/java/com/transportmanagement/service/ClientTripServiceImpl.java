package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientTripDao;
import com.transportmanagement.entity.Client;
import com.transportmanagement.entity.ClientTrip;

@Service
public class ClientTripServiceImpl implements ClientTripService {

	@Autowired
	private ClientTripDao clientTripDao;

	@Override
	public ClientTrip createClientTrip(ClientTrip clientTrip) {
		return clientTripDao.save(clientTrip);
	}

	@Override
	public ClientTrip updateClientTrip(ClientTrip clientTrip) {
		return clientTripDao.save(clientTrip);
	}

	@Override
	public void deleteClientTrip(int id) {
		clientTripDao.deleteById(id);
	}

	@Override
	public ClientTrip getClientTripById(int id) {
		return clientTripDao.findById(id).orElse(null);
	}

	@Override
	public List<ClientTrip> getAllClientTrips() {
		return clientTripDao.findAll();
	}

	@Override
	public List<ClientTrip> getClientTripsByInvoiceNo(String invoiceNo) {
		return clientTripDao.findByInvoiceNumber(invoiceNo);
	}

	@Override
	public List<ClientTrip> getClientTripsByFromClient(Client fromClient) {
		// TODO Auto-generated method stub
		return clientTripDao.findByFromClient(fromClient);
	}

	@Override
	public List<ClientTrip> getClientTripsByToClient(Client toClient) {
		// TODO Auto-generated method stub
		return clientTripDao.findByToClient(toClient);
	}

	@Override
	public List<ClientTrip> getClientTripsByFromClientAndToClient(Client fromClient, Client toClient) {
		// TODO Auto-generated method stub
		return clientTripDao.findByFromClientAndToClient(fromClient, toClient);
	}

	@Override
	public List<ClientTrip> findByAddedDateTimeGreaterThan(String startOfDayMillis) {
		// TODO Auto-generated method stub
		return clientTripDao.findByAddedDateTimeGreaterThanEqual(startOfDayMillis);
	}

	@Override
	public List<ClientTrip> findByStatusAndDeliveryStatusNotIn(String status, List<String> deliveryStatus) {
		// TODO Auto-generated method stub
		return clientTripDao.findByStatusAndDeliveryStatusNotIn(status, deliveryStatus);
	}

	@Override
	public List<ClientTrip> getAllBookedOrders() {
		// TODO Auto-generated method stub
		return clientTripDao.findAll();
	}

	@Override
	public List<ClientTrip> findByAddedDateTimeBetween(String startTime, String endTime) {
		// TODO Auto-generated method stub
		return clientTripDao.findByAddedDateTimeBetween(startTime, endTime);
	}

}

package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.Client;
import com.transportmanagement.entity.ClientTrip;

public interface ClientTripService {

	ClientTrip createClientTrip(ClientTrip clientTrip);

	ClientTrip updateClientTrip(ClientTrip clientTrip);

	void deleteClientTrip(int id);

	ClientTrip getClientTripById(int id);

	List<ClientTrip> getAllClientTrips();

	List<ClientTrip> getClientTripsByInvoiceNo(String invoiceNo);

	List<ClientTrip> getClientTripsByFromClient(Client fromClient);

	List<ClientTrip> getClientTripsByToClient(Client toClient);

	List<ClientTrip> getClientTripsByFromClientAndToClient(Client fromClient, Client toClient);

	List<ClientTrip> findByAddedDateTimeGreaterThan(String startOfDayMillis);

	List<ClientTrip> findByStatusAndDeliveryStatusNotIn(String status, List<String> deliveryStatus);

	List<ClientTrip> getAllBookedOrders();

	List<ClientTrip> findByAddedDateTimeBetween(String startTime, String endTime);

}

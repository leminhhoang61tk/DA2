package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.Client;
import com.transportmanagement.entity.ClientTrip;

@Repository
public interface ClientTripDao extends JpaRepository<ClientTrip, Integer> {

	List<ClientTrip> findByInvoiceNumber(String invoiceNo);
	// Custom query methods (if any) can be added here

	List<ClientTrip> findByFromClient(Client fromClient);

	List<ClientTrip> findByToClient(Client toClient);

	List<ClientTrip> findByFromClientAndToClient(Client fromClient, Client toClient);

	List<ClientTrip> findByAddedDateTimeGreaterThanEqual(String startOfDayMillis);

	List<ClientTrip> findByAddedDateTimeBetween(String startTime, String endTime);

	List<ClientTrip> findByStatusAndDeliveryStatusNotIn(String status, List<String> deliveryStatus);
}

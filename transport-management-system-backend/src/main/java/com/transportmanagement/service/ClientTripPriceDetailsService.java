package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.ClientTripPriceDetails;

public interface ClientTripPriceDetailsService {
    ClientTripPriceDetails createClientTripPriceDetails(ClientTripPriceDetails clientTripPriceDetails);
    ClientTripPriceDetails updateClientTripPriceDetails(ClientTripPriceDetails clientTripPriceDetails);
    void deleteClientTripPriceDetails(int id);
    ClientTripPriceDetails getClientTripPriceDetailsById(int id);
    List<ClientTripPriceDetails> getAllClientTripPriceDetails();
}


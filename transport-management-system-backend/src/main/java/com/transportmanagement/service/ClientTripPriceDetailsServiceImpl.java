package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientTripPriceDetailsDao;
import com.transportmanagement.entity.ClientTripPriceDetails;

@Service
public class ClientTripPriceDetailsServiceImpl implements ClientTripPriceDetailsService {

    @Autowired
    private ClientTripPriceDetailsDao clientTripPriceDetailsDao;

    @Override
    public ClientTripPriceDetails createClientTripPriceDetails(ClientTripPriceDetails clientTripPriceDetails) {
        return clientTripPriceDetailsDao.save(clientTripPriceDetails);
    }

    @Override
    public ClientTripPriceDetails updateClientTripPriceDetails(ClientTripPriceDetails clientTripPriceDetails) {
        return clientTripPriceDetailsDao.save(clientTripPriceDetails);
    }

    @Override
    public void deleteClientTripPriceDetails(int id) {
        clientTripPriceDetailsDao.deleteById(id);
    }

    @Override
    public ClientTripPriceDetails getClientTripPriceDetailsById(int id) {
        return clientTripPriceDetailsDao.findById(id).orElse(null);
    }

    @Override
    public List<ClientTripPriceDetails> getAllClientTripPriceDetails() {
        return clientTripPriceDetailsDao.findAll();
    }
}


package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientTripChargesDao;
import com.transportmanagement.entity.ClientTripCharges;

@Service
public class ClientTripChargesServiceImpl implements ClientTripChargesService {

    @Autowired
    private ClientTripChargesDao clientTripChargesDao;

    @Override
    public ClientTripCharges createClientTripCharges(ClientTripCharges clientTripCharges) {
        return clientTripChargesDao.save(clientTripCharges);
    }

    @Override
    public ClientTripCharges updateClientTripCharges(ClientTripCharges clientTripCharges) {
        return clientTripChargesDao.save(clientTripCharges);
    }

    @Override
    public void deleteClientTripCharges(int id) {
        clientTripChargesDao.deleteById(id);
    }

    @Override
    public ClientTripCharges getClientTripChargesById(int id) {
        return clientTripChargesDao.findById(id).orElse(null);
    }

    @Override
    public List<ClientTripCharges> getAllClientTripCharges() {
        return clientTripChargesDao.findAll();
    }
}


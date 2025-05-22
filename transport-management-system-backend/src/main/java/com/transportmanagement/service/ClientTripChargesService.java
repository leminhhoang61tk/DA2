package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.ClientTripCharges;

public interface ClientTripChargesService {
    ClientTripCharges createClientTripCharges(ClientTripCharges clientTripCharges);
    ClientTripCharges updateClientTripCharges(ClientTripCharges clientTripCharges);
    void deleteClientTripCharges(int id);
    ClientTripCharges getClientTripChargesById(int id);
    List<ClientTripCharges> getAllClientTripCharges();
}


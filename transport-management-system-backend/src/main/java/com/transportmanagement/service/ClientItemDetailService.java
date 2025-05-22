package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.ClientItemDetail;

public interface ClientItemDetailService {
    ClientItemDetail createClientItemDetail(ClientItemDetail clientItemDetail);
    ClientItemDetail updateClientItemDetail(ClientItemDetail clientItemDetail);
    void deleteClientItemDetail(int id);
    ClientItemDetail getClientItemDetailById(int id);
    List<ClientItemDetail> getAllClientItemDetails();
}


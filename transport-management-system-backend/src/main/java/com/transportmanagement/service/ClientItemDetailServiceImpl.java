package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientItemDetailDao;
import com.transportmanagement.entity.ClientItemDetail;

@Service
public class ClientItemDetailServiceImpl implements ClientItemDetailService {

    @Autowired
    private ClientItemDetailDao clientItemDetailDao;

    @Override
    public ClientItemDetail createClientItemDetail(ClientItemDetail clientItemDetail) {
        return clientItemDetailDao.save(clientItemDetail);
    }

    @Override
    public ClientItemDetail updateClientItemDetail(ClientItemDetail clientItemDetail) {
        return clientItemDetailDao.save(clientItemDetail);
    }

    @Override
    public void deleteClientItemDetail(int id) {
        clientItemDetailDao.deleteById(id);
    }

    @Override
    public ClientItemDetail getClientItemDetailById(int id) {
        return clientItemDetailDao.findById(id).orElse(null);
    }

    @Override
    public List<ClientItemDetail> getAllClientItemDetails() {
        return clientItemDetailDao.findAll();
    }
}

package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.ClientBranchDao;
import com.transportmanagement.entity.ClientBranch;

@Service
public class ClientBranchServiceImpl implements ClientBranchService {

	@Autowired
	private ClientBranchDao clientBranchDao;

	@Override
	public ClientBranch createClientBranch(ClientBranch clientBranch) {
		return clientBranchDao.save(clientBranch);
	}

	@Override
	public ClientBranch updateClientBranch(ClientBranch clientBranch) {
		return clientBranchDao.save(clientBranch);
	}

	@Override
	public void deleteClientBranch(int id) {
		clientBranchDao.deleteById(id);
	}

	@Override
	public ClientBranch getClientBranchById(int id) {
		return clientBranchDao.findById(id).orElse(null);
	}

	@Override
	public List<ClientBranch> getAllClientBranches() {
		return clientBranchDao.findAll();
	}
}

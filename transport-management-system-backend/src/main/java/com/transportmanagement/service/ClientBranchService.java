package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.ClientBranch;

public interface ClientBranchService {
	ClientBranch createClientBranch(ClientBranch clientBranch);

	ClientBranch updateClientBranch(ClientBranch clientBranch);

	void deleteClientBranch(int id);

	ClientBranch getClientBranchById(int id);

	List<ClientBranch> getAllClientBranches();
}

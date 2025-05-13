package com.transportmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.transportmanagement.dto.ClientBranchRequestDto;
import com.transportmanagement.dto.ClientRequestDto;
import com.transportmanagement.dto.ClientResponse;
import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.entity.Client;
import com.transportmanagement.resource.ClientResource;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/transport/client")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

	@Autowired
	private ClientResource clientResource;

	@PostMapping("/add")
	@Operation(summary = "Api to add client")
	public ResponseEntity<CommonApiResponse> addClient(ClientRequestDto request) {
		return clientResource.addClient(request);
	}

	@PutMapping("/document/udpate")
	@Operation(summary = "Api to update the client document!!!")
	public ResponseEntity<CommonApiResponse> updateClientDocument(ClientRequestDto request) {
		return clientResource.updateClientDocument(request);
	}

	@PutMapping("/detail/update")
	@Operation(summary = "Api to update the client detail!!!")
	public ResponseEntity<CommonApiResponse> updateVehicleDetail(@RequestBody Client client) {
		return clientResource.updateClientDetail(client);
	}

	@PostMapping("branch/add")
	@Operation(summary = "Api to add client")
	public ResponseEntity<CommonApiResponse> addClientBranch(@RequestBody ClientBranchRequestDto request) {
		return clientResource.addClientBranch(request);
	}

	@GetMapping("/fetch/all")
	@Operation(summary = "Api to fetch all the clients!!!")
	public ResponseEntity<ClientResponse> fetchAllClients() {
		return clientResource.fetchAllClients();
	}

	@GetMapping("/fetch/name-wise")
	@Operation(summary = "Api to fetch all the clients by client name!!!")
	public ResponseEntity<ClientResponse> fetchAllClientsByName(@RequestParam("clientName") String clientName) {
		return clientResource.fetchAllClientsByName(clientName);
	}

	@DeleteMapping("delete")
	@Operation(summary = "Api to delete the client!!!")
	public ResponseEntity<CommonApiResponse> deleteClient(@RequestParam("clientId") int clientId) {

		return clientResource.deleteClient(clientId);
	}

	@GetMapping("/fetch")
	@Operation(summary = "Api to fetch all the client by Id!!!")
	public ResponseEntity<ClientResponse> fetchClientById(@RequestParam("clientId") int clientId) {
		return clientResource.fetchClientById(clientId);
	}

}

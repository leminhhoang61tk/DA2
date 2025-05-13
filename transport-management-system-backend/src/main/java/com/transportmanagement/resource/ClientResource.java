package com.transportmanagement.resource;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.transportmanagement.dto.ClientBranchRequestDto;
import com.transportmanagement.dto.ClientRequestDto;
import com.transportmanagement.dto.ClientResponse;
import com.transportmanagement.dto.CommonApiResponse;
import com.transportmanagement.dto.VehicleResponseDto;
import com.transportmanagement.entity.Client;
import com.transportmanagement.entity.ClientBranch;
import com.transportmanagement.entity.Vehicle;
import com.transportmanagement.service.ClientBranchService;
import com.transportmanagement.service.ClientService;
import com.transportmanagement.utility.StorageService;
import com.transportmanagement.utility.Constants.ActiveStatus;

@Component
public class ClientResource {

	private final Logger LOG = LoggerFactory.getLogger(ClientResource.class);

	@Autowired
	private ClientService clientService;

	@Autowired
	private StorageService storageService;

	@Autowired
	private ClientBranchService clientBranchService;

	public ResponseEntity<CommonApiResponse> addClient(ClientRequestDto request) {

		LOG.info("Received request for adding the vehicle!!");

		CommonApiResponse response = new CommonApiResponse();

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUploadDocuments() == null) {
			response.setResponseMessage("Select the Document please!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client client = ClientRequestDto.toClientEntity(request);

		if (client == null) {
			response.setResponseMessage("Internal Technical issue!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String document = this.storageService.store(request.getUploadDocuments());

		if (document == null) {
			response.setResponseMessage("Failed to upload the vehicle document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		client.setAddedDateTime(addedDateTime);
		client.setUploadDocuments(document);
		client.setBranches(new ArrayList<>());
		client.setStatus(ActiveStatus.ACTIVE.value());

		Client existingClient = this.clientService.createClient(client);

		if (existingClient == null) {
			response.setResponseMessage("Failed to add the Client!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Client Added succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateClientDocument(ClientRequestDto request) {

		LOG.info("Received request for updating the vehicle document!!");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getClientId() == 0 || request.getUploadDocuments() == null) {
			response.setResponseMessage("missing input!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client existingClient = this.clientService.getClientById(request.getClientId());

		if (existingClient == null) {
			response.setResponseMessage("Client not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String newDocumentFileName = this.storageService.store(request.getUploadDocuments());

		String existingDocumentFileName = existingClient.getUploadDocuments();

		if (newDocumentFileName == null) {
			response.setResponseMessage("Failed to upload the vehicle document!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		existingClient.setUploadDocuments(newDocumentFileName);
		Client updatedClient = this.clientService.updateClient(existingClient);

		if (updatedClient == null) {
			response.setResponseMessage("Failed to update the Client!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		this.storageService.delete(existingDocumentFileName);

		response.setResponseMessage("Client Document Updated succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateClientDetail(Client client) {

		LOG.info("Received request for updating the client detail!!");

		CommonApiResponse response = new CommonApiResponse();

		if (client == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (client.getId() == 0) {
			response.setResponseMessage("Client Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client exitingclient = this.clientService.getClientById(client.getId());

		if (exitingclient == null) {
			response.setResponseMessage("Client not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		client.setUploadDocuments(exitingclient.getUploadDocuments());
		client.setBranches(exitingclient.getBranches());

		Client updatedClient = this.clientService.updateClient(client);

		if (updatedClient == null) {
			response.setResponseMessage("Failed to update the Client!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Client Details Updated succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> addClientBranch(ClientBranchRequestDto request) {

		LOG.info("Received request for adding the client branch!!");

		CommonApiResponse response = new CommonApiResponse();

		String addedDateTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getClientId() == 0) {
			response.setResponseMessage("Client Id is missing!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client exitingclient = this.clientService.getClientById(request.getClientId());

		if (exitingclient == null) {
			response.setResponseMessage("Client not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		ClientBranch branch = new ClientBranch();
		branch.setCity(request.getCity());
		branch.setFullAddress(request.getFullAddress());
		branch.setClient(exitingclient);
		branch.setState(request.getState());
		branch.setAddedDateTime(addedDateTime);

		ClientBranch updatedBranch = clientBranchService.createClientBranch(branch);

		if (updatedBranch == null) {
			response.setResponseMessage("Failed to update the client branch!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Client Branch Updated succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientResponse> fetchAllClients() {

		LOG.info("Received request for fetching the clients!!");

		ClientResponse response = new ClientResponse();

		List<Client> clients = this.clientService.getAllClientsByStatus(ActiveStatus.ACTIVE.value());

		if (CollectionUtils.isEmpty(clients)) {
			response.setResponseMessage("Clients not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setClients(clients);
		response.setResponseMessage("Clients fetched succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> deleteClient(int clientId) {

		LOG.info("Received request for delete the client!!!");

		CommonApiResponse response = new CommonApiResponse();

		if (clientId == 0) {
			response.setResponseMessage("Client Id missing!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client client = this.clientService.getClientById(clientId);

		if (client == null) {
			response.setResponseMessage("Client not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		client.setStatus(ActiveStatus.DEACTIVATED.value());
		clientService.updateClient(client);

		response.setResponseMessage("Client Deleted Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientResponse> fetchClientById(int clientId) {

		LOG.info("Received request for delete the client!!!");

		ClientResponse response = new ClientResponse();

		if (clientId == 0) {
			response.setResponseMessage("Client Id missing!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Client client = this.clientService.getClientById(clientId);

		if (client == null) {
			response.setResponseMessage("Client not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientResponse>(response, HttpStatus.BAD_REQUEST);
		}

		response.setClients(Arrays.asList(client));

		response.setResponseMessage("Client Fetched Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ClientResponse> fetchAllClientsByName(String clientName) {

		LOG.info("Received request for fetching the clients by client name!!");

		ClientResponse response = new ClientResponse();

		if (clientName == null) {
			response.setResponseMessage("Client Name not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Client> clients = this.clientService.getAllClientsByName(clientName, ActiveStatus.ACTIVE.value());

		if (CollectionUtils.isEmpty(clients)) {
			response.setResponseMessage("Clients not Found!!!");
			response.setSuccess(false);

			return new ResponseEntity<ClientResponse>(response, HttpStatus.OK);
		}

		response.setClients(clients);
		response.setResponseMessage("Clients fetched succesful!!!");
		response.setSuccess(true);

		return new ResponseEntity<ClientResponse>(response, HttpStatus.OK);
	}

}

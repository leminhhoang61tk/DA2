package com.transportmanagement.dto;

import java.util.ArrayList;
import java.util.List;

import com.transportmanagement.entity.Client;

import lombok.Data;

@Data
public class ClientResponse extends CommonApiResponse {

	private List<Client> clients = new ArrayList<>();

}

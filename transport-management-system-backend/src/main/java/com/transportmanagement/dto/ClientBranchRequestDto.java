package com.transportmanagement.dto;

import lombok.Data;

@Data
public class ClientBranchRequestDto {

	private int clientId;

	private String state;

	private String city;

	private String fullAddress;

}

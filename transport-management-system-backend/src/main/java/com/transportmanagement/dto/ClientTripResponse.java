package com.transportmanagement.dto;

import java.util.ArrayList;
import java.util.List;

import com.transportmanagement.entity.ClientTrip;

import lombok.Data;

@Data
public class ClientTripResponse extends CommonApiResponse {

	private List<ClientTrip> bookings = new ArrayList<>();

	private ClientTrip booking;

	private List<TripDetail> tripDetails = new ArrayList<>();;

}

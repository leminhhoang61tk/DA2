package com.transportmanagement.dto;

import java.util.ArrayList;
import java.util.List;

import com.transportmanagement.entity.Vehicle;

import lombok.Data;

@Data
public class VehicleResponseDto extends CommonApiResponse {

	private List<Vehicle> vehicles = new ArrayList<>();

}

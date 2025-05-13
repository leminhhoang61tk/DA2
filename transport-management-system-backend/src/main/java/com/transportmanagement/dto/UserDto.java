package com.transportmanagement.dto;

import org.springframework.beans.BeanUtils;

import com.transportmanagement.entity.Employee;
import com.transportmanagement.entity.User;

import lombok.Data;

@Data
public class UserDto {

	private int id;

	private String firstName;

	private String lastName;

	private String emailId;

	private String phoneNo;

	private String role;

	private String status;
	
	private Employee employee;

	public static UserDto toUserDtoEntity(User user) {
		UserDto userDto = new UserDto();
		BeanUtils.copyProperties(user, userDto);
		return userDto;
	}

}

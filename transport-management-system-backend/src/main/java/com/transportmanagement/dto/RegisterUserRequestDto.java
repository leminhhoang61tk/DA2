package com.transportmanagement.dto;

import org.springframework.beans.BeanUtils;

import com.transportmanagement.entity.User;

import lombok.Data;

@Data
public class RegisterUserRequestDto {

	private String firstName;

	private String lastName;

	private String emailId;

	private String password;

	private String phoneNo;

	private String role;

	public static User toUserEntity(RegisterUserRequestDto registerUserRequestDto) {
		User user = new User();
		BeanUtils.copyProperties(registerUserRequestDto, user);
		return user;
	}

}

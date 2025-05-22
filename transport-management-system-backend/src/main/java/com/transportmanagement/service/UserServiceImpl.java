package com.transportmanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.UserDao;
import com.transportmanagement.entity.Client;
import com.transportmanagement.entity.User;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;

	@Override
	public User addUser(User user) {
		return userDao.save(user);
	}

	@Override
	public User updateUser(User user) {
		return userDao.save(user);
	}

	@Override
	public User getUserByEmailAndStatus(String emailId, String status) {
		return userDao.findByEmailIdAndStatus(emailId, status);
	}

	@Override
	public User getUserByEmailid(String emailId) {
		return userDao.findByEmailId(emailId);
	}

	@Override
	public List<User> getUserByRole(String role) {
		return userDao.findByRole(role);
	}

	@Override
	public User getUserById(int userId) {

		Optional<User> optionalUser = this.userDao.findById(userId);

		if (optionalUser.isPresent()) {
			return optionalUser.get();
		} else {
			return null;
		}

	}

	@Override
	public User getUserByEmailIdAndRoleAndStatus(String emailId, String role, String status) {
		return this.userDao.findByEmailIdAndRoleAndStatus(emailId, role, status);
	}

	@Override
	public List<User> updateAllUser(List<User> users) {
		return this.userDao.saveAll(users);
	}

	@Override
	public List<User> getUserByRoleAndStatus(String role, String status) {
		return this.userDao.findByRoleAndStatus(role, status);
	}

	@Override
	public List<User> getEmployeesWithRole(List<String> status, String role) {
		// TODO Auto-generated method stub
		return this.userDao.findEmployeesWithRole(status, role);
	}

	@Override
	public List<User> getEmployeesWithName(String employeeName, String role, String status) {
		// TODO Auto-generated method stub
		return this.userDao.findByFirstNameContainingIgnoreCaseAndRoleAndStatus(employeeName, role, status);
	}

}

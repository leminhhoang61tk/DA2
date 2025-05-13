package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.User;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {

	User findByEmailId(String email);

	User findByEmailIdAndStatus(String email, String status);

	User findByRoleAndStatusIn(String role, List<String> status);

	List<User> findByRole(String role);

	User findByEmailIdAndRoleAndStatus(String emailId, String role, String status);

	List<User> findByRoleAndStatus(String role, String status);

	@Query("SELECT u FROM User u JOIN u.employee e WHERE u.role = 'Employee' AND u.status IN :status AND e.role = :role")
	List<User> findEmployeesWithRole(@Param("status") List<String> status, @Param("role") String role);

	List<User> findByFirstNameContainingIgnoreCaseAndRoleAndStatus(String employeeName, String role, String status);

}

package com.transportmanagement.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.AlertNotification;

@Repository
public interface AlertNotificationDao extends JpaRepository<AlertNotification, Integer> {

	List<AlertNotification> findByNotificationViewed(String status);

}

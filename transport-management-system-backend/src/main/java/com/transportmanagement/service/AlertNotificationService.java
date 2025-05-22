package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.AlertNotification;

public interface AlertNotificationService {

	AlertNotification add(AlertNotification notification);

	List<AlertNotification> findByNotificationViewed(String status);

	AlertNotification getById(int alertId);

}

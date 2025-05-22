package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.AlertNotificationDao;
import com.transportmanagement.entity.AlertNotification;

@Service
public class AlertNotificationServiceImpl implements AlertNotificationService {

	@Autowired
	private AlertNotificationDao alertNotificationDao;

	@Override
	public AlertNotification add(AlertNotification notification) {
		// TODO Auto-generated method stub
		return alertNotificationDao.save(notification);
	}

	@Override
	public List<AlertNotification> findByNotificationViewed(String status) {
		// TODO Auto-generated method stub
		return alertNotificationDao.findByNotificationViewed(status);
	}

	@Override
	public AlertNotification getById(int alertId) {
		return alertNotificationDao.findById(alertId).orElseGet(() -> null);
	}

}

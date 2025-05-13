package com.transportmanagement.scheduler;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.transportmanagement.entity.AlertNotification;
import com.transportmanagement.entity.Vehicle;
import com.transportmanagement.service.AlertNotificationService;
import com.transportmanagement.service.VehicleService;
import com.transportmanagement.utility.Constants.ActiveStatus;
import com.transportmanagement.utility.Constants.IsNotificationViewedStatus;

@Component
@EnableScheduling
public class VehicleMaintenanceNotificationAlertScheduler {

	private final Logger LOG = LoggerFactory.getLogger(VehicleMaintenanceNotificationAlertScheduler.class);

	@Autowired
	private VehicleService vehicleService;

	@Autowired
	private AlertNotificationService alertNotificationService;

	// Date format to parse the string date from the database
	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	@Scheduled(cron = "0 0 0 * * ?")
	public void updateProductOffers() {

		LOG.info("Starting Vehicle Maintenance Notification Alert Scheduler....");

		LocalDate now = LocalDate.now();

		List<Vehicle> vehicles = this.vehicleService.getVehiclesByStatus(ActiveStatus.ACTIVE.value());

		for (Vehicle vehicle : vehicles) {
			checkAndCreateAlert(vehicle, vehicle.getPermitExpireDate(),
					"Permit is about to expire, please take action.", now);
			checkAndCreateAlert(vehicle, vehicle.getInsuranceStartDate(),
					"Insurance is about to expire, please take action.", now);
			checkAndCreateAlert(vehicle, vehicle.getGareBoxExpireDate(),
					"Gear Box maintenance is due, please take action.", now);
			checkAndCreateAlert(vehicle, vehicle.getSmokeTestExpireDate(),
					"Smoke Test is about to expire, please take action.", now);
//			checkAndCreateAlert(vehicle, vehicle.getOilChangeDate(), "Oil Change is due, please take action.", now);
		}

		LOG.info("Stopping Vehicle Maintenance Notification Alert Scheduler....");

	}

	private void checkAndCreateAlert(Vehicle vehicle, String dateStr, String description, LocalDate now) {
		if (dateStr != null && !dateStr.isEmpty()) {
			LocalDate expiryDate = LocalDate.parse(dateStr, DATE_FORMATTER);
			LocalDate tenDaysFromNow = now.plusDays(10);

			// Check if the expiry date is within 10 days from now
			if (!expiryDate.isBefore(now) && expiryDate.isBefore(tenDaysFromNow)) {
				// Create a new AlertNotification
				AlertNotification alertNotification = new AlertNotification();
				alertNotification.setVehicleNo(vehicle.getVehicleNumber());
				alertNotification.setVehicleRegistrationNo(vehicle.getRegistrationNumber());
				alertNotification.setDescription(description);
				alertNotification.setLastDate(expiryDate.toString());
				alertNotification.setNotificationViewed(IsNotificationViewedStatus.NO.value());

				// Save alert notification to the database
				alertNotificationService.add(alertNotification);
				LOG.info("Created alert notification for vehicle: " + vehicle.getVehicleNumber() + " - " + description);
			}
		}
	}

}

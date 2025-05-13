package com.transportmanagement.utility;

public class Constants {

	public enum UserRole {
		ROLE_TRANSPORTER("Transporter"), ROLE_ADMIN("Admin"), ROLE_EMPLOYEE("Employee");

		private String role;

		private UserRole(String role) {
			this.role = role;
		}

		public String value() {
			return this.role;
		}
	}

	public enum ActiveStatus {
		ACTIVE("Active"), DEACTIVATED("Deactivated");

		private String status;

		private ActiveStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

	public enum EmployeeType {
		DRIVER("Driver"), ACCOUNTANT("Accountant"), HELPER("Helper");

		private String type;

		private EmployeeType(String type) {
			this.type = type;
		}

		public String value() {
			return this.type;
		}
	}

	public enum ClientType {
		CONSIGNORE("Consignore"), CONSIGNEE("Consignee"); // Consignor/Sender and Consignee/Receiver

		private String type;

		private ClientType(String type) {
			this.type = type;
		}

		public String value() {
			return this.type;
		}
	}

	public enum VendorType {
		SELF("Self"), THIRD_PARTY("Third Party");

		private String type;

		private VendorType(String type) {
			this.type = type;
		}

		public String value() {
			return this.type;
		}
	}

	public enum BookingStatus {
		OPEN("Open"), CLOSE("Closed");

		private String status;

		private BookingStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

	public enum ItemRateAsPerType {
		KG("KG"), TON("Ton"), PACKAGE("Package"), GRAM("Gram");

		private String type;

		private ItemRateAsPerType(String type) {
			this.type = type;
		}

		public String value() {
			return this.type;
		}
	}

	public enum BookingPaymentStatus {
		PENDING("Pending"), NOT_PAID("Not Paid"), PAID("Paid"), PARTIAL_PAID("Partial Paid"), DONE("Done");

		private String status;

		private BookingPaymentStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

	public enum BookingPriceDetailPaymentStatus {
		PAID("Paid"), ADVCANCE("Advance"), TO_BE_PAY("To be Pay");

		private String status;

		private BookingPriceDetailPaymentStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

	public enum IsGstApplicable {
		YES("Yes"), NO("No");

		private String status;

		private IsGstApplicable(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

	public enum TransportationMode {
		ROAD("Road");

		private String mode;

		private TransportationMode(String mode) {
			this.mode = mode;
		}

		public String value() {
			return this.mode;
		}
	}

	public enum BookingDeliveryStatus {
		IN_TRANSIT("In Transit"), PENDING("Pending"), DELIVERED("Delivered");

		private String status;

		private BookingDeliveryStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

	public enum PaymentMode {
		ACCOUNT("Account"), CASH("Cash"), UPI("UPI"), OTHER("Other");

		private String mode;

		private PaymentMode(String mode) {
			this.mode = mode;
		}

		public String value() {
			return this.mode;
		}
	}

	public enum SalaryType {
		ADVANCE("Advance"), MONTHLY("Monthly"), TRIP("Trip"), PART_PAYMENT("Part Payment");

		private String type;

		private SalaryType(String type) {
			this.type = type;
		}

		public String value() {
			return this.type;
		}
	}

	public enum FuelVendorName {
		IOCL("IOCL"), BPL("BPL"), RELAINCE("Relaince");

		private String name;

		private FuelVendorName(String name) {
			this.name = name;
		}

		public String value() {
			return this.name;
		}
	}

	public enum FuelType {
		DEISEL("Deisel"), PETROL("Petrol"), GAS("Gas");

		private String type;

		private FuelType(String type) {
			this.type = type;
		}

		public String value() {
			return this.type;
		}
	}

	public enum IsNotificationViewedStatus {
		YES("Yes"), NO("No");

		private String status;

		private IsNotificationViewedStatus(String status) {
			this.status = status;
		}

		public String value() {
			return this.status;
		}
	}

}

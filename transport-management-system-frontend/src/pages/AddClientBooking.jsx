import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Constants for API endpoints
const API_BASE_URL = "http://localhost:8080/api/transport";
const VEHICLE_API_URL = `${API_BASE_URL}/vehicle/fetch/all`;
const CLIENT_API_URL = `${API_BASE_URL}/client/fetch/all`;
const EMPLOYEE_API_URL = "http://localhost:8080/api/user/fetch/employees?role=Driver&status=Active";
const ADD_BOOKING_API_URL = `${API_BASE_URL}/client/booking/add`;

// Constants for Select Options
const VENDOR_OPTIONS = [
  { value: "", label: "Select Vendor Type" },
  { value: "Self", label: "Self" },
  { value: "Third Party", label: "Third Party" },
];

const TRANSPORTATION_MODE_OPTIONS = [{ value: "Road", label: "Road" }];

const PAID_BY_OPTIONS = [
  { value: "", label: "Select Paid By" },
  { value: "Consignore", label: "Consignore" },
  { value: "Consignee", label: "Consignee" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "Select Payment Status" },
  { value: "Pending", label: "Pending" },
  { value: "Not Paid", label: "Not Paid" },
  { value: "Paid", label: "Paid" },
  { value: "Partial Paid", label: "Partial Paid" },
  { value: "Done", label: "Done" },
];

const DELIVERY_STATUS_OPTIONS = [
  { value: "", label: "Select Delivery Status" },
  { value: "Pending", label: "Pending" },
  { value: "In Transit", label: "In Transit" },
  { value: "Delivered", label: "Delivered" },
];

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "Select Status" },
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Closed" },
];

const initialBookingState = {
  name: "",
  startDateTime: "",
  startKm: "",
  vendorName: "",
  closeKm: "",
  totalKm: "",
  transportationMode: "Road",
  paidBy: "",
  paymentPaidBy: "",
  taxPaidBy: "",
  invoiceName: "",
  invoiceNumber: "",
  paymentDueDate: "",
  paymentStatus: "",
  comment: "",
  fromClientId: "",
  toClientId: "",
  vehicleId: "",
  employeeId: "",
  bookingPointStationId: "",
  deliveryPointStationId: "",
  deliveredDateTime: "",
  deliveryStatus: "",
  status: "",
};

const AddClientBooking = () => {
  const [booking, setBooking] = useState(initialBookingState);
  const [vehicles, setVehicles] = useState([]);
  const [allEmployee, setAllEmployee] = useState([]);
  const [clients, setClients] = useState([]);
  const [fromClientBranches, setFromClientBranches] = useState([]);
  const [toClientBranches, setToClientBranches] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const retrieveAllVehicles = useCallback(async () => {
    // const admin_jwtToken = "your_token_here"; // Replace or manage token appropriately
    const response = await axios.get(VEHICLE_API_URL, {
      // headers: {
      //   Authorization: "Bearer " + admin_jwtToken,
      // },
    });
    return response.data;
  }, []);

  const retrieveAllClients = useCallback(async () => {
    const response = await axios.get(CLIENT_API_URL);
    return response.data;
  }, []);

  const retrieveAllUser = useCallback(async () => {
    const response = await axios.get(EMPLOYEE_API_URL);
    return response.data;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [vehicleResponse, clientResponse, usersResponse] =
          await Promise.all([
            retrieveAllVehicles(),
            retrieveAllClients(),
            retrieveAllUser(),
          ]);

        if (vehicleResponse?.vehicles) {
          setVehicles(vehicleResponse.vehicles);
        }
        if (clientResponse?.clients) {
          setClients(clientResponse.clients);
        }
        if (usersResponse?.users) {
          setAllEmployee(usersResponse.users);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setFetchError(
          "Could not load data. Please try refreshing the page."
        );
        toast.error("Failed to load initial data.", { autoClose: 2000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [retrieveAllVehicles, retrieveAllClients, retrieveAllUser]);

  const handleInput = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "fromClientId") {
        const selectedClient = clients.find(
          (client) => client.id === parseInt(value)
        );
        setFromClientBranches(selectedClient ? selectedClient.branches : []);
        setBooking((prevBooking) => ({
          ...prevBooking,
          fromClientId: value,
          bookingPointStationId: "", // Reset branch on client change
        }));
      } else if (name === "toClientId") {
        const selectedClient = clients.find(
          (client) => client.id === parseInt(value)
        );
        setToClientBranches(selectedClient ? selectedClient.branches : []);
        setBooking((prevBooking) => ({
          ...prevBooking,
          toClientId: value,
          deliveryPointStationId: "", // Reset branch on client change
        }));
      } else {
        setBooking((prevBooking) => ({
          ...prevBooking,
          [name]: value,
        }));
      }
    },
    [clients] // Dependency: clients array for find operation
  );

  const handleFileChange = useCallback((e) => {
    setSelectedDocument(e.target.files[0]);
  }, []);

  const convertToEpochTime = useCallback((dateString) => {
    if (!dateString) return "";
    const selectedDate = new Date(dateString);
    return selectedDate.getTime();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const formData = new FormData();

      Object.entries(booking).forEach(([key, value]) => {
        if (key === "startDateTime") {
          formData.append(key, convertToEpochTime(value));
        } else if (key === "deliveredDateTime") {
          formData.append(key, value ? convertToEpochTime(value) : "");
        } else {
          formData.append(key, value);
        }
      });

      if (selectedDocument) {
        formData.append("document", selectedDocument);
      }

      try {
        const resp = await axios.post(ADD_BOOKING_API_URL, formData);
        const response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });
          setTimeout(() => {
            navigate("/home"); // Or to a relevant page
          }, 1500); // Adjusted timeout slightly
        } else {
          toast.error(response.responseMessage, {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.responseMessage || "Server error. Please try again.",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [booking, selectedDocument, convertToEpochTime, navigate]
  );

  if (isLoading) {
    return (
      <div className="mt-5 d-flex justify-content-center">
        <h4>Loading form data...</h4>
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mt-5 d-flex justify-content-center text-danger">
        <h4>{fetchError}</h4>
      </div>
    );
  }

  return (
    <div className="mt-2 d-flex aligns-items-center justify-content-center mb-4 ms-3 me-3">
      <div className="card form-card shadow-lg" style={{ maxWidth: "1200px", width: "100%" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 text-center"
            style={{
              borderRadius: "1em",
              height: "45px",
            }}
          >
            <h5 className="card-title">Add Client Order Booking</h5>
          </div>
          <div className="card-body text-color">
            <form
              className="row g-3"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Name */}
              <div className="col-md-3 mb-3">
                <label htmlFor="name" className="form-label">
                  <b>Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={booking.name}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* Start Date Time */}
              <div className="col-md-3 mb-3">
                <label htmlFor="startDateTime" className="form-label">
                  <b>Start Date Time</b>
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="startDateTime"
                  name="startDateTime"
                  value={booking.startDateTime}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* From Client */}
              <div className="col-md-3 mb-3">
                <label htmlFor="fromClientId" className="form-label">
                  <b>Consignor / Sender</b>
                </label>
                <select
                  className="form-select"
                  id="fromClientId"
                  name="fromClientId"
                  value={booking.fromClientId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Consignor</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Point (Branch) */}
              <div className="col-md-3 mb-3">
                <label htmlFor="bookingPointStationId" className="form-label">
                  <b>Booking Point Station</b>
                </label>
                <select
                  className="form-select"
                  id="bookingPointStationId"
                  name="bookingPointStationId"
                  value={booking.bookingPointStationId}
                  onChange={handleInput}
                  required
                  disabled={!booking.fromClientId} // Disable if no client selected
                >
                  <option value="">Select Branch</option>
                  {fromClientBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {`${branch.state} - ${branch.city} - [${branch.fullAddress}]`}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Client */}
              <div className="col-md-3 mb-3">
                <label htmlFor="toClientId" className="form-label">
                  <b>Consignee</b>
                </label>
                <select
                  className="form-select"
                  id="toClientId"
                  name="toClientId"
                  value={booking.toClientId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Consignee</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Point (Branch) */}
              <div className="col-md-3 mb-3">
                <label htmlFor="deliveryPointStationId" className="form-label">
                  <b>Delivery Point Station</b>
                </label>
                <select
                  className="form-select"
                  id="deliveryPointStationId"
                  name="deliveryPointStationId"
                  value={booking.deliveryPointStationId}
                  onChange={handleInput}
                  required
                  disabled={!booking.toClientId} // Disable if no client selected
                >
                  <option value="">Select Branch</option>
                  {toClientBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {`${branch.state} - ${branch.city} - [${branch.fullAddress}]`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle */}
              <div className="col-md-3 mb-3">
                <label htmlFor="vehicleId" className="form-label">
                  <b>Vehicle</b>
                </label>
                <select
                  className="form-select"
                  id="vehicleId"
                  name="vehicleId"
                  value={booking.vehicleId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {`${vehicle.name} [${vehicle.vehicleNumber}]`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee (Driver) */}
              <div className="col-md-3 mb-3">
                <label htmlFor="employeeId" className="form-label">
                  <b>Driver</b>
                </label>
                <select
                  className="form-select"
                  id="employeeId"
                  name="employeeId"
                  value={booking.employeeId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Driver</option>
                  {allEmployee.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {`${employee.firstName} ${employee.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Starting Odometer */}
              <div className="col-md-3 mb-3">
                <label htmlFor="startKm" className="form-label">
                  <b>Starting Odometer</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="startKm"
                  name="startKm"
                  value={booking.startKm}
                  onChange={handleInput}
                  required
                  min="0"
                />
              </div>

              {/* Ending Odometer */}
              <div className="col-md-3 mb-3">
                <label htmlFor="closeKm" className="form-label">
                  <b>Ending Odometer</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="closeKm"
                  name="closeKm"
                  value={booking.closeKm}
                  onChange={handleInput}
                  required
                  min={booking.startKm || 0} // Ensure closeKm >= startKm
                />
              </div>

              {/* Distance Traveled */}
              <div className="col-md-3 mb-3">
                <label htmlFor="totalKm" className="form-label">
                  <b>Distance Traveled</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="totalKm"
                  name="totalKm"
                  value={booking.totalKm}
                  onChange={handleInput}
                  required
                  min="0"
                  // Consider making this read-only and auto-calculated
                  // value={booking.closeKm && booking.startKm ? booking.closeKm - booking.startKm : ""}
                  // readOnly
                />
              </div>

              {/* Invoice Name */}
              <div className="col-md-3 mb-3">
                <label htmlFor="invoiceName" className="form-label">
                  <b>Invoice Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="invoiceName"
                  name="invoiceName"
                  value={booking.invoiceName}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* Invoice Number */}
              <div className="col-md-3 mb-3">
                <label htmlFor="invoiceNumber" className="form-label">
                  <b>Invoice Number</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={booking.invoiceNumber}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* Payment Due Date */}
              <div className="col-md-3 mb-3">
                <label htmlFor="paymentDueDate" className="form-label">
                  <b>Payment Due Date</b>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="paymentDueDate"
                  name="paymentDueDate"
                  value={booking.paymentDueDate}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* Vendor Name */}
              <div className="col-md-3 mb-3">
                <label htmlFor="vendorName" className="form-label">
                  <b>Vendor Type</b>
                </label>
                <select
                  className="form-select"
                  id="vendorName"
                  name="vendorName"
                  value={booking.vendorName}
                  onChange={handleInput}
                  required
                >
                  {VENDOR_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Transportation Mode */}
              <div className="col-md-3 mb-3">
                <label htmlFor="transportationMode" className="form-label">
                  <b>Transportation Mode</b>
                </label>
                <select
                  className="form-select"
                  id="transportationMode"
                  name="transportationMode"
                  value={booking.transportationMode}
                  onChange={handleInput}
                  required
                >
                   {TRANSPORTATION_MODE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Paid By */}
              <div className="col-md-3 mb-3">
                <label htmlFor="paidBy" className="form-label">
                  <b>Paid By</b>
                </label>
                <select
                  className="form-select"
                  id="paidBy"
                  name="paidBy"
                  value={booking.paidBy}
                  onChange={handleInput}
                  required
                >
                  {PAID_BY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Tax Paid By */}
              <div className="col-md-3 mb-3">
                <label htmlFor="taxPaidBy" className="form-label">
                  <b>Tax Paid By</b>
                </label>
                <select
                  className="form-select"
                  id="taxPaidBy"
                  name="taxPaidBy"
                  value={booking.taxPaidBy}
                  onChange={handleInput}
                  required
                >
                  {PAID_BY_OPTIONS.map(opt => ( // Assuming same options as Paid By
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Payment Paid By */}
              <div className="col-md-3 mb-3">
                <label htmlFor="paymentPaidBy" className="form-label">
                  <b>Payment Paid By</b>
                </label>
                <select
                  className="form-select"
                  id="paymentPaidBy"
                  name="paymentPaidBy"
                  value={booking.paymentPaidBy}
                  onChange={handleInput}
                  required
                >
                   {PAID_BY_OPTIONS.map(opt => ( // Assuming same options as Paid By
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Payment Status */}
              <div className="col-md-3 mb-3">
                <label htmlFor="paymentStatus" className="form-label">
                  <b>Payment Status</b>
                </label>
                <select
                  className="form-select"
                  id="paymentStatus"
                  name="paymentStatus"
                  value={booking.paymentStatus}
                  onChange={handleInput}
                  required
                >
                  {PAYMENT_STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Date Time */}
              <div className="col-md-3 mb-3">
                <label htmlFor="deliveredDateTime" className="form-label">
                  <b>Delivery Date Time</b>
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="deliveredDateTime"
                  name="deliveredDateTime"
                  value={booking.deliveredDateTime}
                  onChange={handleInput}
                  // Not always required initially, depends on workflow
                />
              </div>

              {/* Delivery Status */}
              <div className="col-md-3 mb-3">
                <label htmlFor="deliveryStatus" className="form-label">
                  <b>Delivery Status</b>
                </label>
                <select
                  className="form-select"
                  id="deliveryStatus"
                  name="deliveryStatus"
                  value={booking.deliveryStatus}
                  onChange={handleInput}
                  required
                >
                  {DELIVERY_STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Order Status */}
              <div className="col-md-3 mb-3">
                <label htmlFor="status" className="form-label">
                  <b>Order Status</b>
                </label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={booking.status}
                  onChange={handleInput}
                  required
                >
                  {ORDER_STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div className="col-md-3 mb-3">
                <label htmlFor="document" className="form-label">
                  <b>Upload Document</b>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="document"
                  name="document"
                  onChange={handleFileChange}
                  // Consider if this is always required
                />
              </div>

              {/* Comment */}
              <div className="col-md-12 mb-3">
                <label htmlFor="comment" className="form-label">
                  <b>Comment</b>
                </label>
                <textarea
                  className="form-control"
                  id="comment"
                  name="comment"
                  value={booking.comment}
                  onChange={handleInput}
                  rows="3"
                  // Consider if this is always required
                />
              </div>

              <div className="col-md-12 text-center">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddClientBooking;

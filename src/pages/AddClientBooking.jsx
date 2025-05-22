import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddClientBooking = () => {
  const [booking, setBooking] = useState({
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
  });

  const [vehicles, setVehicles] = useState([]);
  const [allEmployee, setAllEmployee] = useState([]);
  const [clients, setClients] = useState([]);
  const [fromClientBranches, setFromClientBranches] = useState([]);
  const [toClientBranches, setToClientBranches] = useState([]);

  useEffect(() => {
    const getAllClients = async () => {
      const clientResponse = await retrieveAllClients();
      if (clientResponse) {
        setClients(clientResponse.clients);
      }
    };

    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllEmployee(allUsers.users);
      }
    };

    const getAllVehicles = async () => {
      const vehicleResponse = await retrieveAllVehicles();
      if (vehicleResponse) {
        setVehicles(vehicleResponse.vehicles);
      }
    };

    getAllVehicles();

    getAllUsers();
    getAllClients();
  }, []);

  const retrieveAllVehicles = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/vehicle/fetch/all",
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );

    return response.data;
  };

  const retrieveAllClients = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/fetch/all"
    );
    return response.data;
  };

  const retrieveAllUser = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/employees?role=Driver&status=Active"
    );
    return response.data;
  };

  let navigate = useNavigate();

  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "fromClientId") {
      const selectedClient = clients.find(
        (client) => client.id === parseInt(value)
      );
      setFromClientBranches(selectedClient ? selectedClient.branches : []);

      // Update booking with both fromClientId and reset bookingPointStationId in one go
      setBooking((prevBooking) => ({
        ...prevBooking,
        fromClientId: value,
        bookingPointStationId: "", // Reset branch on client change
      }));

      console.log(booking);
    } else if (name === "toClientId") {
      const selectedClient = clients.find(
        (client) => client.id === parseInt(value)
      );
      setToClientBranches(selectedClient ? selectedClient.branches : []);

      // Update booking with both toClientId and reset deliveryPointStationId in one go
      setBooking((prevBooking) => ({
        ...prevBooking,
        toClientId: value,
        deliveryPointStationId: "", // Reset branch on client change
      }));
      console.log(booking);
    } else {
      // For other fields, just update the booking state normally
      setBooking((prevBooking) => ({
        ...prevBooking,
        [name]: value,
      }));
      console.log(booking);
    }
  };

  const handleFileChange = (e) => {
    setSelectedDocument(e.target.files[0]);
  };

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", booking.name);
    formData.append("startDateTime", convertToEpochTime(booking.startDateTime));
    formData.append("startKm", booking.startKm);
    formData.append("vendorName", booking.vendorName);
    formData.append("closeKm", booking.closeKm);
    formData.append("totalKm", booking.totalKm);
    formData.append("transportationMode", booking.transportationMode);
    formData.append("paidBy", booking.paidBy);
    formData.append("paymentPaidBy", booking.paymentPaidBy);
    formData.append("taxPaidBy", booking.taxPaidBy);
    formData.append("invoiceName", booking.invoiceName);
    formData.append("invoiceNumber", booking.invoiceNumber);
    formData.append("paymentDueDate", booking.paymentDueDate);
    formData.append("paymentStatus", booking.paymentStatus);
    formData.append("comment", booking.comment);
    formData.append("fromClientId", booking.fromClientId);
    formData.append("toClientId", booking.toClientId);
    formData.append("vehicleId", booking.vehicleId);
    formData.append("employeeId", booking.employeeId);
    formData.append("bookingPointStationId", booking.bookingPointStationId);
    formData.append("deliveryPointStationId", booking.deliveryPointStationId);
    formData.append(
      "deliveredDateTime",
      booking.deliveredDateTime === ""
        ? ""
        : convertToEpochTime(booking.deliveredDateTime)
    );
    formData.append("deliveryStatus", booking.deliveryStatus);
    formData.append("status", booking.status);
    formData.append("document", selectedDocument);

    axios
      .post("http://localhost:8080/api/transport/client/booking/add", formData)
      .then((resp) => {
        let response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } else {
          toast.error(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        toast.error(
          error.response && error.response.data
            ? error.response.data.responseMessage
            : "It seems server is down",
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      });
  };

  return (
    <div className="mt-2 d-flex aligns-items-center justify-content-center mb-4 ms-3 me-3">
      <div className="card form-card shadow-lg">
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
              <div className="col-md-3 mb-3">
                <label htmlFor="startKm" className="form-label">
                  <b>Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={booking.name}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="startDateTime" className="form-label">
                  <b>Start Date Time</b>
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
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
                  name="fromClientId"
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
                  name="bookingPointStationId"
                  value={booking.bookingPointStationId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Branch</option>
                  {fromClientBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.state +
                        "-" +
                        branch.city +
                        "- [" +
                        branch.fullAddress +
                        "]"}
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
                  name="toClientId"
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
                  name="deliveryPointStationId"
                  value={booking.deliveryPointStationId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Branch</option>
                  {toClientBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.state +
                        "-" +
                        branch.city +
                        "- [" +
                        branch.fullAddress +
                        "]"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="employeeId" className="form-label">
                  <b>Vehicle</b>
                </label>
                <select
                  className="form-select"
                  name="vehicleId"
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name + " [" + vehicle.vehicleNumber + "]"}
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
                  name="employeeId"
                  value={booking.employeeId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Driver</option>
                  {allEmployee.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Km */}
              <div className="col-md-3 mb-3">
                <label htmlFor="startKm" className="form-label">
                  <b>Start Km</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="startKm"
                  value={booking.startKm}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* Close Km */}
              <div className="col-md-3 mb-3">
                <label htmlFor="closeKm" className="form-label">
                  <b>Close Km</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="closeKm"
                  value={booking.closeKm}
                  onChange={handleInput}
                  required
                />
              </div>

              {/* Total Km */}
              <div className="col-md-3 mb-3">
                <label htmlFor="totalKm" className="form-label">
                  <b>Total Km</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="totalKm"
                  value={booking.totalKm}
                  onChange={handleInput}
                  required
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
                  name="vendorName"
                  value={booking.vendorName}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Vendor Type</option>
                  <option value="Self">Self</option>
                  <option value="Third Party">Third Party</option>
                </select>
              </div>

              {/* Transportation Mode */}
              <div className="col-md-3 mb-3">
                <label htmlFor="transportationMode" className="form-label">
                  <b>Transportation Mode</b>
                </label>
                <select
                  className="form-select"
                  name="transportationMode"
                  value={booking.transportationMode}
                  onChange={handleInput}
                  required
                >
                  <option value="Road">Road</option> {/* Showing only Road */}
                </select>
              </div>

              {/* Paid By */}
              <div className="col-md-3 mb-3">
                <label htmlFor="paidBy" className="form-label">
                  <b>Paid By</b>
                </label>
                <select
                  className="form-select"
                  name="paidBy"
                  value={booking.paidBy}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Paid By</option>
                  <option value="Consignore">Consignore</option>
                  <option value="Consignee">Consignee</option>
                </select>
              </div>

              {/* Tax Paid By */}
              <div className="col-md-3 mb-3">
                <label htmlFor="taxPaidBy" className="form-label">
                  <b>Tax Paid By</b>
                </label>
                <select
                  className="form-select"
                  name="taxPaidBy"
                  value={booking.taxPaidBy}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Tax Paid By</option>
                  <option value="Consignore">Consignore</option>
                  <option value="Consignee">Consignee</option>
                </select>
              </div>

              {/* Payment Paid By */}
              <div className="col-md-3 mb-3">
                <label htmlFor="paymentPaidBy" className="form-label">
                  <b>Payment Paid By</b>
                </label>
                <select
                  className="form-select"
                  name="paymentPaidBy"
                  value={booking.paymentPaidBy}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Payment Paid By</option>
                  <option value="Consignore">Consignore</option>
                  <option value="Consignee">Consignee</option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="col-md-3 mb-3">
                <label htmlFor="paymentStatus" className="form-label">
                  <b>Payment Status</b>
                </label>
                <select
                  className="form-select"
                  name="paymentStatus"
                  value={booking.paymentStatus}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Payment Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Paid">Not Paid</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial Paid">Partial Paid</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="startDateTime" className="form-label">
                  <b>Delivery Date Time</b>
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="deliveredDateTime"
                  value={booking.deliveredDateTime}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="paymentStatus" className="form-label">
                  <b>Delivery Status</b>
                </label>
                <select
                  className="form-select"
                  name="deliveryStatus"
                  value={booking.deliveryStatus}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Delivery Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="paymentStatus" className="form-label">
                  <b>Order Status</b>
                </label>
                <select
                  className="form-select"
                  name="status"
                  value={booking.status}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
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
                  name="document"
                  onChange={handleFileChange}
                  required
                />
              </div>

              {/* Comment */}
              <div className="col-md-12 mb-3">
                <label htmlFor="comment" className="form-label">
                  <b>Comment</b>
                </label>
                <textarea
                  className="form-control"
                  name="comment"
                  value={booking.comment}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="col-md-12 text-center">
                <button type="submit" className="btn bg-color custom-bg-text">
                  Submit
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

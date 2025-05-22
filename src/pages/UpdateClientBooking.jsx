import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const UpdateClientBooking = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState({
    id: "", // int
    name: "", // String
    startDateTime: "", // String (epoch time from UI)
    paymentDueDate: "", // String (epoch)
    deliveredDateTime: "", // String (epoch time from UI)
    startKm: "", // Start KM
    vendorName: "", // Vendor Name (Self, Third Party)
    closeKm: "", // Close KM
    totalKm: "", // Total KM
    transportationMode: "Road", // Transportation Mode (Road)
    paidBy: "", // Paid By (Bill To) (Consignor, Consignee)
    paymentPaidBy: "", // Payment Paid By (Consignor, Consignee)
    taxPaidBy: "", // Tax Paid By (Consignor, Consignee)
    invoiceName: "", // Invoice Name
    invoiceNumber: "", // Invoice Number
    paymentStatus: "", // Payment Status (Pending, Not Paid, Partial Paid, Done)
    comment: "", // Comment
    deliveryStatus: "", // Delivery Status
    status: "", // Status
  });

  const [existingStartDateTime, setExistingStartDateTime] = useState("");
  const [existingDeliveredDateTime, setExistingDeliveredDateTime] =
    useState("");

  const [selectedStartDateTime, setSelectedStartDateTime] = useState("");
  const [selectedDeliveredDateTime, setSelectedDeliveredDateTime] =
    useState("");

  useEffect(() => {
    const getBooking = async () => {
      const fetchBooking = await retrieveBooking();
      if (fetchBooking) {
        const bookingData = fetchBooking.booking;

        setBooking(bookingData);

        setExistingDeliveredDateTime(bookingData.deliveredDateTime);
        setExistingStartDateTime(bookingData.startDateTime);
      }
    };
    getBooking();
  }, [bookingId]);

  const retrieveBooking = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/transport/client/booking/fetch?bookingId=${bookingId}`
    );
    return response.data;
  };

  let navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  const isNumber = (value) => {
    return typeof value === "number" && !isNaN(value);
  };

  const updateBooking = (e) => {
    e.preventDefault();

    if (!booking.id) {
      toast.error("Booking Id is missing!!!");
      return;
    }

    console.log("Selected Start Date Time: " + selectedStartDateTime);
    console.log("Selected Delivereed Date Time: " + selectedDeliveredDateTime);

    console.log("Existing Start Date Time: " + existingStartDateTime);
    console.log("Existing Delivereed Date Time: " + existingDeliveredDateTime);

    booking.startDateTime =
      selectedStartDateTime !== ""
        ? convertToEpochTime(selectedStartDateTime)
        : existingStartDateTime;

    booking.deliveredDateTime =
      selectedDeliveredDateTime !== ""
        ? convertToEpochTime(selectedDeliveredDateTime)
        : existingDeliveredDateTime;

    fetch("http://localhost:8080/api/transport/client/booking/details/udpate", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify(booking),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              navigate(`/admin/client/booking/${booking.id}/detail`);
            }, 2000); // Redirect after 3 seconds
          } else if (!res.success) {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 1000); // Redirect after 3 seconds
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000); // Redirect after 3 seconds
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
            <h5 className="card-title">Update Order Booking</h5>
          </div>
          <div className="card-body text-color">
            <form className="row g-3" onSubmit={updateBooking}>
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
                  <b>Start Time</b>
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startDateTime"
                  onChange={(e) => setSelectedStartDateTime(e.target.value)}
                  value={selectedStartDateTime}
                />
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
                  onChange={handleInput}
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
                  onChange={handleInput}
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
                  onChange={handleInput}
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
                  onChange={handleInput}
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
                  onChange={handleInput}
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
                  onChange={handleInput}
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
                <label htmlFor="deliveredDateTime" className="form-label">
                  <b>Delivery Date Time</b>
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="deliveredDateTime"
                  onChange={(e) => setSelectedDeliveredDateTime(e.target.value)}
                  value={selectedDeliveredDateTime}
                />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="paymentStatus" className="form-label">
                  <b>Delivery Status</b>
                </label>
                <select
                  className="form-select"
                  name="deliveryStatus"
                  onChange={handleInput}
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
                  onChange={handleInput}
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Comment */}
              <div className="col-md-9 mb-3">
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

export default UpdateClientBooking;

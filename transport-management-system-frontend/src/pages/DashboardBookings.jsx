import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

import * as XLSX from "xlsx";

const DashboardBookings = ({ item }) => {
  const [trips, setTrips] = useState(item ? item : []);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [tempStartTime, setTempStartTime] = useState("");
  const [tempEndTime, setTempEndTime] = useState("");

  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const getBookingDetails = async () => {
      if (startTime !== "" && endTime !== "") {
        const bookingData = await retrieveBookingsByStartTimeAndEndTime();
        if (bookingData) {
          setBookingData(bookingData.tripDetails);
        }
      } else {
        const bookingData = await retrieveTodaysBookings();
        if (bookingData) {
          setBookingData(bookingData.tripDetails);
        }
      }
    };

    getBookingDetails();
  }, [startTime, endTime]);

  const retrieveTodaysBookings = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/booking/todays"
    );
    return response.data;
  };

  const searchBookingTimeRange = (e) => {
    e.preventDefault();

    if (tempStartTime === "" || tempEndTime === "") {
      alert("Please select Start Time and End Time");
    } else {
      setStartTime(tempStartTime);
      setEndTime(tempEndTime);
    }
  };

  const getTodaysBookings = (e) => {
    e.preventDefault();

    setStartTime("");
    setEndTime("");
    setTempEndTime("");
    setTempStartTime("");
  };

  const convertToMillis = (startTime) => {
    if (!startTime) {
      return null; // Handle case where startTime is not provided
    }

    const date = new Date(startTime);
    return date.getTime();
  };

  const retrieveBookingsByStartTimeAndEndTime = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/booking/search/date-time?startTime=" +
        convertToMillis(startTime) +
        "&endTime=" +
        convertToMillis(endTime)
    );
    return response.data;
  };

  const downloadExcel = (tripDetails) => {
    if (!tripDetails || tripDetails.length <= 0) {
      alert("No Trip Details found!!!");
    } else {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(
        tripDetails.map((trip) => ({
          Invoice: trip.invoice,
          "From Client": trip.fromClientName,
          "To Client": trip.toClientName,
          "Pick Up Point": trip.pickUpPoint,
          "Delivery Point": trip.deliveryPoint,
          "Total Amount": trip.totalAmount,
          "Received Amount": trip.receivedAmount,
          "Due Amount": trip.dueAmount,
        }))
      );

      XLSX.utils.book_append_sheet(wb, ws, "Todays Booking");
      XLSX.writeFile(wb, "todaysbooking.xlsx");
    }
  };

  return (
    <div className="row mt-3 mb-5">
      <div className="col">
        <div className="card rounded-card shadow-lg">
          <div className="card-body">
            <div className="text-center">
              <h4>Client Bookings</h4>
            </div>
            <div
              style={{
                overflowY: "auto",
                height: "300px",
              }}
            >
              <form className="row g-3">
                <div className="col-auto">
                  <input
                    type="datetime-local"
                    className="form-control"
                    onChange={(e) => setTempStartTime(e.target.value)}
                    value={tempStartTime}
                    required
                  />
                </div>

                <div className="col-auto">
                  <input
                    type="datetime-local"
                    className="form-control"
                    onChange={(e) => setTempEndTime(e.target.value)}
                    value={tempEndTime}
                    required
                  />
                </div>

                <div className="col-auto">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text mb-3"
                    onClick={(e) => searchBookingTimeRange(e)}
                  >
                    Get Bookings
                  </button>
                </div>

                <div className="col-auto">
                  <button
                    type="button" // Change to type="button" to prevent form submission
                    className="btn bg-color custom-bg-text mb-3"
                    onClick={(e) => getTodaysBookings(e)}
                  >
                    Today's Bookings
                  </button>
                </div>
              </form>

              <div className="table-responsive mt-2">
                <table className="table table-hover text-color text-center">
                  <thead className="table-bordered border-color bg-color custom-bg-text">
                    <tr>
                      <th scope="col">Invoice</th>
                      <th scope="col">From Client</th>
                      <th scope="col">To Client</th>
                      <th scope="col">Pick Up Point</th>
                      <th scope="col">Delivery Point</th>
                      <th scope="col">Total Amount</th>
                      <th scope="col">Received Amount</th>
                      <th scope="col">Due Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingData.map((trip) => {
                      return (
                        <tr key={trip.invoice}>
                          <td>
                            <b>{trip.invoice}</b>
                          </td>
                          <td>
                            <b>{trip.fromClientName}</b>
                          </td>
                          <td>
                            <b>{trip.toClientName}</b>
                          </td>
                          <td>
                            <b>{trip.pickUpPoint}</b>
                          </td>
                          <td>
                            <b>{trip.deliveryPoint}</b>
                          </td>
                          <td>
                            <b>&#8377;{trip.totalAmount}</b>
                          </td>
                          <td>
                            <b>&#8377;{trip.receivedAmount}</b>
                          </td>
                          <td>
                            <b>&#8377;{trip.dueAmount}</b>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="d-flex justify-content-center">
                  <button
                    onClick={(e) => downloadExcel(bookingData)}
                    className="btn btn-sm bg-color custom-bg-text ms-2"
                  >
                    <b>Download Report</b>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBookings;

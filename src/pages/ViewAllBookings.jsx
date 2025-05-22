import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const ViewAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [fromClientId, setFromClientId] = useState("0");
  const [tempFromClientId, setTempFromClientId] = useState("0");

  const [toClientId, setToClientId] = useState("0");
  const [tempToClientId, setTempToClientId] = useState("0");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [tempInvoiceNo, setTempInvoiceNo] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  let navigate = useNavigate();

  useEffect(() => {
    const getAllBookings = async () => {
      if (invoiceNo === "" && fromClientId === "0" && toClientId === "0") {
        const bookings = await retrieveAllBookings();
        if (bookings) {
          setBookings(bookings.bookings);
        }
      } else {
        if (invoiceNo !== "") {
          const bookings = await retrieveAllBookingsByInvoice();
          if (bookings) {
            setBookings(bookings.bookings);
          }
        } else {
          const bookings = await retrieveAllBookingsByClient();
          if (bookings) {
            setBookings(bookings.bookings);
          }
        }
      }
    };

    const getAllClients = async () => {
      const clientResponse = await retrieveAllClients();
      if (clientResponse) {
        setClients(clientResponse.clients);
      }
    };

    getAllClients();

    getAllBookings();
  }, [invoiceNo, fromClientId, toClientId]);

  const retrieveAllClients = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/fetch/all",
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );

    return response.data;
  };

  const retrieveAllBookings = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/booking/fetch/all",
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );

    return response.data;
  };

  const retrieveAllBookingsByClient = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/transport/client/booking/fetch/client-wise?fromClientId=${fromClientId}&toClientId=${toClientId}`,
      {
        headers: {
          // Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );

    return response.data;
  };

  const searchBookingByInvoiceNo = (e) => {
    e.preventDefault();
    setInvoiceNo(tempInvoiceNo);
    setTempInvoiceNo("");
    setTempFromClientId("");
    setTempToClientId("");
    setFromClientId("0");
    setToClientId("0");
  };

  const searchBookingByClient = (e) => {
    console.log("temp from CLient id: " + tempFromClientId);
    console.log("temp to CLient id: " + tempToClientId);

    e.preventDefault();
    setFromClientId(tempFromClientId);
    setToClientId(tempToClientId);
    setInvoiceNo("");
    setTempInvoiceNo("");
  };

  const retrieveAllBookingsByInvoice = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/booking/fetch/invoice-wise?invoiceNo=" +
        invoiceNo,
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );

    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const viewBookingDetails = (bookingId) => {
    navigate(`/admin/client/booking/${bookingId}/detail`);
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2>All Bookings</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="d-flex aligns-items-center justify-content-center mt-3">
            <div className="row">
              <div className="d-flex align-items-end">
                <form className="row g-3 me-2">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control"
                      id="inputPassword2"
                      placeholder="Enter Invoice No..."
                      onChange={(e) => setTempInvoiceNo(e.target.value)}
                      style={{
                        width: "350px",
                      }}
                      value={tempInvoiceNo}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn bg-color custom-bg-text mb-3"
                      onClick={searchBookingByInvoiceNo}
                    >
                      Search
                    </button>
                  </div>
                </form>

                <form className="row g-3">
                  <div className="col-auto">
                    <select
                      onChange={(e) => setTempFromClientId(e.target.value)}
                      className="form-control"
                      required
                    >
                      <option value="0">Select From Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-auto">
                    <select
                      onChange={(e) => setTempToClientId(e.target.value)}
                      className="form-control"
                      required
                    >
                      <option value="0">Select To Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn bg-color custom-bg-text mb-3"
                      onClick={searchBookingByClient}
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Start Km</th>
                  <th scope="col">Close Km</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">Delivered Date</th>
                  <th scope="col">Delivery Status</th>
                  <th scope="col">Payment Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  return (
                    <tr key={booking.id}>
                      <td>
                        <b>{booking.name}</b>
                      </td>
                      <td>{booking.startKm}</td>
                      <td>{booking.closeKm}</td>
                      <td>{formatDateFromEpoch(booking.startDateTime)}</td>
                      <td>{formatDateFromEpoch(booking.deliveredDateTime)}</td>
                      <td>{booking.deliveryStatus}</td>
                      <td>{booking.paymentStatus}</td>
                      <td>
                        <button
                          onClick={() => viewBookingDetails(booking.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllBookings;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showTripChargesModal, setShowTripChargesModal] = useState(false);
  const [showTripPriceModal, setShowTripPriceModal] = useState(false);

  const [employeeId, setEmployeeId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [itmeDetail, setItemDetail] = useState({
    itemNameDetails: "",
    itemQuantity: "",
    actualWeight: "",
    grossWeight: "",
    weightType: "",
    rateAsPer: "",
    clientTripId: bookingId,
  });

  const [tripChargesDetail, setTripChargesDetail] = useState({
    additionalCharges: "",
    serviceCharges: "",
    pickupDropCharges: "",
    otherCharges: "",
    gstApplicable: "",
    gstNumber: "",
    cgstRate: "",
    sgstRate: "",
    clientTripId: bookingId,
  });

  const [tripPriceDetail, setTripPriceDetail] = useState({
    rate: "",
    totalAmount: "",
    advanceAmount: "",
    receivedAmount: "",
    dueAmount: "",
    paymentStatus: "",
    clientTripId: bookingId,
  });

  const handleItemInput = (e) => {
    setItemDetail({ ...itmeDetail, [e.target.name]: e.target.value });
  };

  const handleTripChargesInput = (e) => {
    setTripChargesDetail({
      ...tripChargesDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleTripPriceInput = (e) => {
    setTripPriceDetail({
      ...tripPriceDetail,
      [e.target.name]: e.target.value,
    });
  };

  const [allEmployee, setAllEmployee] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleBranchModalClose = () => setShowBranchModal(false);
  const handleBranchModalShow = () => setShowBranchModal(true);

  const handleVehicleModalClose = () => setShowVehicleModal(false);
  const handleVehicleModalShow = () => setShowVehicleModal(true);

  const handleItemModalClose = () => setShowItemModal(false);
  const handleItemModalShow = () => setShowItemModal(true);

  const handleTripChargesModalClose = () => setShowTripChargesModal(false);
  const handleTripChargesModalShow = () => setShowTripChargesModal(true);

  const handleTripPriceModalClose = () => setShowTripPriceModal(false);
  const handleTripPriceModalShow = () => setShowTripPriceModal(true);

  const [selectedDoc, setSelectedDoc] = useState("");

  const [showDocModal, setShowDocModal] = useState(false);
  const handleDocModalClose = () => setShowDocModal(false);
  const handleDocModalShow = () => setShowDocModal(true);

  const showReceiptDocModal = (docFileName) => {
    setSelectedDoc(docFileName);
    handleDocModalShow();
  };

  useEffect(() => {
    const getBookingDetails = async () => {
      const bookingDetails = await retrieveBookingDetails();
      if (bookingDetails) {
        setBooking(bookingDetails.booking);
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
    getBookingDetails();
  }, [bookingId]);

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

  const retrieveAllUser = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/role-wise?role=Employee"
    );
    return response.data;
  };

  const retrieveBookingDetails = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/transport/client/booking/fetch?bookingId=${bookingId}`
    );
    return response.data;
  };

  let navigate = useNavigate();

  if (!booking) return <p>Loading...</p>;

  const updateBookingDetails = () => {
    navigate(`/admin/booking/${bookingId}/update`, { state: booking });
  };

  const updateBookingDocument = () => {
    navigate("/admin/booking/document/update", { state: booking });
  };

  const handleEmployeeAddSubmit = (e) => {
    e.preventDefault();

    fetch(
      "http://localhost:8080/api/transport/client/booking/employee/add?bookingId=" +
        bookingId +
        "&employeeId=" +
        employeeId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + admin_jwtToken,
        },
      }
    )
      .then((result) => {
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
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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

  const handleVehicleAddSubmit = (e) => {
    e.preventDefault();

    fetch(
      "http://localhost:8080/api/transport/client/booking/vehicle/add?bookingId=" +
        bookingId +
        "&vehicleId=" +
        vehicleId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + admin_jwtToken,
        },
      }
    )
      .then((result) => {
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
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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

  const handleItemFormSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/transport/client/booking/item/add", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(itmeDetail),
    })
      .then((result) => {
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
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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

  const handleTripChargesFormSubmit = (e) => {
    e.preventDefault();

    fetch(
      "http://localhost:8080/api/transport/client/booking/trip/charges/add",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + admin_jwtToken,
        },
        body: JSON.stringify(tripChargesDetail),
      }
    )
      .then((result) => {
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
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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

  const handleTripPriceFormSubmit = (e) => {
    e.preventDefault();

    fetch(
      "http://localhost:8080/api/transport/client/booking/price/detail/add",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + admin_jwtToken,
        },
        body: JSON.stringify(tripPriceDetail),
      }
    )
      .then((result) => {
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
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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

  const downloadInvoicePDF = (e) => {
    e.preventDefault();

    fetch(
      "http://localhost:8080/api/transport/client/booking/generate/invoice?bookingId=" +
        bookingId,
      {
        method: "GET",
        headers: {
          Accept: "application/pdf", // This is key to accept PDF
          "Content-Type": "application/json",
          //    Authorization: "Bearer " + admin_jwtToken,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the PDF.");
        }
        return response.blob(); // Convert response to a Blob (binary data)
      })
      .then((blob) => {
        // Create a link element, set the download attribute, and trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf"; // You can set the file name here
        document.body.appendChild(a);
        a.click(); // Trigger the download
        a.remove(); // Clean up the DOM after the download
      })
      .catch((error) => {
        console.error("Error downloading the PDF:", error);
      });
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{ height: "auto" }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{ borderRadius: "1em", height: "50px" }}
        >
          <h2>Booking Details</h2>
        </div>
        <div className="card-body">
          {/* Basic Information */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Basic Information</h5>
              <p>
                <strong>Trip Name:</strong> {booking.name}
              </p>
              <p>
                <strong>Added Date:</strong>{" "}
                {new Date(parseInt(booking.addedDateTime)).toLocaleString()}
              </p>
              <p>
                <strong>Start Time:</strong>{" "}
                {new Date(parseInt(booking.startDateTime)).toLocaleString()}
              </p>
              <p>
                <strong>Vendor Name:</strong> {booking.vendorName}
              </p>
              <p>
                <strong>Start KM:</strong> {booking.startKm}
              </p>
              <p>
                <strong>Close KM:</strong> {booking.closeKm}
              </p>
              <p>
                <strong>Delivery Time:</strong>{" "}
                {new Date(parseInt(booking.deliveredDateTime)).toLocaleString()}
              </p>
              <p>
                <strong>Delivery Status:</strong> {booking.deliveryStatus}
              </p>
              <p>
                <strong>Document:</strong>
                <button
                  className="btn btn-sm bg-color custom-bg ms-2"
                  onClick={handleShow}
                >
                  View Document
                </button>
              </p>
            </div>

            {/* Payment and Status Information */}
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Payment and Status Information</h5>
              <p>
                <strong>Total KM:</strong> {booking.totalKm}
              </p>
              <p>
                <strong>Transportation Mode:</strong>{" "}
                {booking.transportationMode}
              </p>
              <p>
                <strong>Paid By:</strong> {booking.paidBy}
              </p>
              <p>
                <strong>Payment Paid By:</strong> {booking.paymentPaidBy}
              </p>
              <p>
                <strong>Tax Paid By:</strong> {booking.taxPaidBy}
              </p>
              <p>
                <strong>Invoice Name:</strong> {booking.invoiceName}
              </p>
              <p>
                <strong>Invoice Number:</strong> {booking.invoiceNumber}
              </p>
              <p>
                <strong>Payment Due Date:</strong> {booking.paymentDueDate}
              </p>
              <p>
                <strong>Payment Status:</strong> {booking.paymentStatus}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
            </div>
          </div>

          {/* From Client Details */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">From Client (Consignore)</h5>
              <p>
                <strong>Name:</strong> {booking.fromClient.name}
              </p>
              <p>
                <strong>Contact No:</strong> {booking.fromClient.contactNumber}
              </p>
              <p>
                <strong>GST No:</strong> {booking.fromClient.gstNumber}
              </p>
            </div>

            {/* To Client Details */}
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">To Client (Consignee)</h5>
              <p>
                <strong>Name:</strong> {booking.toClient.name}
              </p>
              <p>
                <strong>Contact No:</strong> {booking.toClient.contactNumber}
              </p>
              <p>
                <strong>GST No:</strong> {booking.toClient.gstNumber}
              </p>
            </div>
          </div>

          {/* Station Details */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Booking Point Station</h5>
              <p>
                <strong>City:</strong> {booking.bookingPointStation.city}
              </p>
              <p>
                <strong>State:</strong> {booking.bookingPointStation.state}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {booking.bookingPointStation.fullAddress}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Delivery Point Station</h5>
              <p>
                <strong>City:</strong> {booking.deliveryPointStation.city}
              </p>
              <p>
                <strong>State:</strong> {booking.deliveryPointStation.state}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {booking.deliveryPointStation.fullAddress}
              </p>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className="text-primary">Vehicles Used for Delivery</h5>
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Vehicle Name</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Registration No</th>
                    <th scope="col">Passing Type</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.name}</td>
                      <td>{vehicle.companyName}</td>
                      <td>{vehicle.registrationNumber}</td>
                      <td>{vehicle.passingType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employee Details */}
          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className="text-primary">
                Employees Involved in Client Trip
              </h5>
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Email</th>
                    <th scope="col">PAN No</th>
                    <th scope="col">Role</th>
                    <th scope="col">Aadhar No</th>
                    <th scope="col">License No</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td>{employee.phoneNo}</td>
                      <td>{employee.emailId}</td>
                      <td>{employee.employee.panNumber}</td>
                      <td>{employee.employee.role}</td>
                      <td>{employee.employee.aadharNumber}</td>
                      <td>{employee.employee.licenseNumber || "N/A"}</td>{" "}
                      {/* Display N/A if no license */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Item Details */}
          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className="text-primary">Item Details</h5>
              {booking.itemDetails && booking.itemDetails.length > 0 ? (
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Item Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Actual Weight</th>
                      <th scope="col">Gross Weight</th>
                      <th scope="col">Weight Type</th>
                      <th scope="col">Rate As Per</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.itemDetails.map((item) => (
                      <tr key={item.id}>
                        <td>{item.itemNameDetails}</td>
                        <td>{item.itemQuantity}</td>
                        <td>{item.actualWeight}</td>
                        <td>{item.grossWeight}</td>
                        <td>{item.weightType}</td>
                        <td>{item.rateAsPer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items present</p>
              )}
            </div>
          </div>

          {/* Charges Details */}
          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className="text-primary">Charges Details</h5>
              {booking.chargesDetails ? (
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Additional Charges</th>
                      <th scope="col">Service Charges</th>
                      <th scope="col">Pickup/Drop Charges</th>
                      <th scope="col">Other Charges</th>
                      <th scope="col">GST Applicable</th>
                      <th scope="col">GST Number</th>
                      <th scope="col">CGST Rate</th>
                      <th scope="col">SGST Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{booking.chargesDetails.additionalCharges}</td>
                      <td>{booking.chargesDetails.serviceCharges}</td>
                      <td>{booking.chargesDetails.pickupDropCharges}</td>
                      <td>{booking.chargesDetails.otherCharges}</td>
                      <td>{booking.chargesDetails.gstApplicable}</td>
                      <td>{booking.chargesDetails.gstNumber}</td>
                      <td>{booking.chargesDetails.cgstRate}%</td>
                      <td>{booking.chargesDetails.sgstRate}%</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No charges details present</p>
              )}
            </div>
          </div>

          {/* Price Details */}
          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className="text-primary">Price Details</h5>
              {booking.priceDetails ? (
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Rate</th>
                      <th scope="col">Total Amount</th>
                      <th scope="col">Advance Amount</th>
                      <th scope="col">Received Amount</th>
                      <th scope="col">Due Amount</th>
                      <th scope="col">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{booking.priceDetails.rate}</td>
                      <td>{booking.priceDetails.totalAmount}</td>
                      <td>{booking.priceDetails.advanceAmount}</td>
                      <td>{booking.priceDetails.receivedAmount}</td>
                      <td>{booking.priceDetails.dueAmount}</td>
                      <td>{booking.priceDetails.paymentStatus}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No price details present</p>
              )}
            </div>
          </div>

          {/* Fuel Expenses */}
          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className="text-primary">Fuel Expenses</h5>
              {booking.fuelExpenses && booking.fuelExpenses.length > 0 ? (
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Expense Time</th>
                      <th scope="col">Fuel Type</th>
                      <th scope="col">Vendor Name</th>
                      <th scope="col">Starting Km</th>
                      <th scope="col">Current Km</th>
                      <th scope="col">Filled Litres</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Payment Mode</th>
                      <th scope="col">Payment Details</th>
                      <th scope="col">Receipt</th>
                      <th scope="col">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.fuelExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>
                          {new Date(expense.expenseTime).toLocaleString()}
                        </td>
                        <td>{expense.fuelType}</td>
                        <td>{expense.vendorName}</td>
                        <td>{expense.startingKm}</td>
                        <td>{expense.currentKm}</td>
                        <td>{expense.filledLitre}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.paymentMode}</td>
                        <td>{expense.paymentDetails}</td>
                        <td>
                          <button
                            onClick={() =>
                              showReceiptDocModal(expense.receiptUpload)
                            }
                            className="btn btn-sm bg-color custom-bg-text ms-2"
                          >
                            View Receipt
                          </button>
                        </td>
                        <td>{expense.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No fuel expenses present for this Trip</p>
              )}
            </div>
          </div>
          <h5 className="text-primary mt-4">Other Expenses</h5>
          {booking.otherExpenses && booking.otherExpenses.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Expense Date</th>
                    <th>Vendor Name</th>
                    <th>Expense Type</th>
                    <th>Location</th>
                    <th>City</th>
                    <th>Pin Code</th>
                    <th>State</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.otherExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.expenseTime}</td>
                      <td>{expense.vendorName}</td>
                      <td>{expense.expenseType}</td>
                      <td>{expense.locationDetails}</td>
                      <td>{expense.city}</td>
                      <td>{expense.pinCode}</td>
                      <td>{expense.state}</td>
                      <td>{expense.amount}</td>
                      <td>{expense.paymentMode}</td>
                      <td>
                        <button
                          onClick={() =>
                            showReceiptDocModal(expense.receiptUpload)
                          }
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">
              Other expenses not present for this booking.
            </p>
          )}
        </div>

        {/* Footer Section */}
        <div className="card-footer">
          <div className="d-flex justify-content-center mt-3">
            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Add Employee"
              onClick={handleBranchModalShow}
            />

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Add Vehicle"
              onClick={handleVehicleModalShow}
            />

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Add Item"
              onClick={handleItemModalShow}
            />

            {(!booking.chargesDetails ||
              Object.keys(booking.chargesDetails).length === 0) && (
              <input
                type="button"
                className="btn custom-bg bg-color mb-3 ms-5"
                value="Add Trip Charges"
                onClick={handleTripChargesModalShow}
              />
            )}

            {(!booking.priceDetails ||
              Object.keys(booking.priceDetails).length === 0) && (
              <input
                type="button"
                className="btn custom-bg bg-color mb-3 ms-5"
                value="Add Trip Price"
                onClick={handleTripPriceModalShow}
              />
            )}

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Update Booking Details"
              onClick={updateBookingDetails}
            />

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-4"
              value="Update Booking Document"
              onClick={updateBookingDocument}
            />

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-4"
              value="Download Pdf"
              onClick={(e) => downloadInvoicePDF(e)}
            />
          </div>
        </div>
      </div>

      {/* Modal for Document Preview */}
      <Modal show={showModal} onHide={handleClose} fullscreen>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`http://localhost:8080/api/user/document/${booking.document}/view`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Document Preview"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBranchModal} onHide={handleBranchModalClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEmployeeAddSubmit}>
            <Form.Group controlId="city" className="mb-3">
              <Form.Label>
                <b>Employee</b>
              </Form.Label>
              <Form.Select
                name="employeeId"
                onChange={(e) => setEmployeeId(e.target.value)}
              >
                <option value="">Select Employee</option>
                {allEmployee.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName +
                      employee.lastName +
                      " [" +
                      employee.employee.role +
                      "]"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button className="btn bg-color custom-bg" type="submit">
              Add Employee
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showVehicleModal} onHide={handleVehicleModalClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleVehicleAddSubmit}>
            <Form.Group controlId="city" className="mb-3">
              <Form.Label>
                <b>Vehicle</b>
              </Form.Label>
              <Form.Select
                name="vehicleId"
                onChange={(e) => setVehicleId(e.target.value)}
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name + " [" + vehicle.passingType + "]"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button className="btn bg-color custom-bg" type="submit">
              Add Vehicle
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleVehicleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showItemModal} onHide={handleItemModalClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Item Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleItemFormSubmit}>
            <Form.Group controlId="itemNameDetails">
              <Form.Label>Item Name/Details</Form.Label>
              <Form.Control
                type="text"
                name="itemNameDetails"
                value={itmeDetail.itemNameDetails}
                onChange={handleItemInput}
                placeholder="Enter item name or details"
              />
            </Form.Group>

            <Form.Group controlId="itemQuantity" className="mt-3">
              <Form.Label>Item Quantity</Form.Label>
              <Form.Control
                type="text"
                name="itemQuantity"
                value={itmeDetail.itemQuantity}
                onChange={handleItemInput}
                placeholder="Enter item quantity"
              />
            </Form.Group>

            <Form.Group controlId="actualWeight" className="mt-3">
              <Form.Label>Actual Weight</Form.Label>
              <Form.Control
                type="text"
                name="actualWeight"
                value={itmeDetail.actualWeight}
                onChange={handleItemInput}
                placeholder="Enter actual weight"
              />
            </Form.Group>

            <Form.Group controlId="grossWeight" className="mt-3">
              <Form.Label>Gross Weight</Form.Label>
              <Form.Control
                type="text"
                name="grossWeight"
                value={itmeDetail.grossWeight}
                onChange={handleItemInput}
                placeholder="Enter gross weight"
              />
            </Form.Group>

            <Form.Group controlId="weightType" className="mt-3">
              <Form.Label>Weight Type</Form.Label>
              <Form.Control
                as="select"
                name="weightType"
                value={itmeDetail.weightType}
                onChange={handleItemInput}
              >
                <option value="">Select Weight Type</option>
                <option value="KG">KG</option>
                <option value="Ton">Ton</option>
                <option value="Package">Package</option>
                <option value="Gram">Gram</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="rateAsPer" className="mt-3">
              <Form.Label>Rate As Per</Form.Label>
              <Form.Control
                as="select"
                name="rateAsPer"
                value={itmeDetail.rateAsPer}
                onChange={handleItemInput}
              >
                <option value="">Select Rate As Per</option>
                <option value="KG">KG</option>
                <option value="Ton">Ton</option>
                <option value="Package">Package</option>
                <option value="Gram">Gram</option>
              </Form.Control>
            </Form.Group>

            <Button className="btn bg-color custom-bg mt-3" type="submit">
              Add Item
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleItemModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTripChargesModal} onHide={handleTripChargesModalClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Trip Charges Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTripChargesFormSubmit}>
            <Form.Group controlId="additionalCharges">
              <Form.Label>Additional Charges</Form.Label>
              <Form.Control
                type="text"
                name="additionalCharges"
                value={tripChargesDetail.additionalCharges}
                onChange={handleTripChargesInput}
                placeholder="Enter additional charges"
              />
            </Form.Group>

            <Form.Group controlId="serviceCharges" className="mt-3">
              <Form.Label>Service Charges</Form.Label>
              <Form.Control
                type="text"
                name="serviceCharges"
                value={tripChargesDetail.serviceCharges}
                onChange={handleTripChargesInput}
                placeholder="Enter service charges"
              />
            </Form.Group>

            <Form.Group controlId="pickupDropCharges" className="mt-3">
              <Form.Label>PickUp/Drop Charges</Form.Label>
              <Form.Control
                type="text"
                name="pickupDropCharges"
                value={tripChargesDetail.pickupDropCharges}
                onChange={handleTripChargesInput}
                placeholder="Enter pickup/drop charges"
              />
            </Form.Group>

            <Form.Group controlId="otherCharges" className="mt-3">
              <Form.Label>Other Charges</Form.Label>
              <Form.Control
                type="text"
                name="otherCharges"
                value={tripChargesDetail.otherCharges}
                onChange={handleTripChargesInput}
                placeholder="Enter other charges"
              />
            </Form.Group>

            <Form.Group controlId="gstApplicable" className="mt-3">
              <Form.Label>GST Applicable</Form.Label>
              <Form.Control
                as="select"
                name="gstApplicable"
                value={tripChargesDetail.gstApplicable}
                onChange={handleTripChargesInput}
              >
                <option value="">Select GST Applicable</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Control>
            </Form.Group>

            {/* Conditionally render GST Number and CGST Rate if GST is applicable */}
            {tripChargesDetail.gstApplicable === "Yes" && (
              <>
                <Form.Group controlId="gstNumber" className="mt-3">
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="gstNumber"
                    value={tripChargesDetail.gstNumber}
                    onChange={handleTripChargesInput}
                    placeholder="Enter GST number"
                  />
                </Form.Group>

                <Form.Group controlId="cgstRate" className="mt-3">
                  <Form.Label>CGST Rate</Form.Label>
                  <Form.Control
                    type="text"
                    name="cgstRate"
                    value={tripChargesDetail.cgstRate}
                    onChange={handleTripChargesInput}
                    placeholder="Enter CGST rate"
                  />
                </Form.Group>

                <Form.Group controlId="cgstRate" className="mt-3">
                  <Form.Label>SGST Rate</Form.Label>
                  <Form.Control
                    type="text"
                    name="sgstRate"
                    value={tripChargesDetail.sgstRate}
                    onChange={handleTripChargesInput}
                    placeholder="Enter SGST rate"
                  />
                </Form.Group>
              </>
            )}

            <Button className="btn bg-color custom-bg mt-3" type="submit">
              Add Trip Charges
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleTripChargesModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTripPriceModal} onHide={handleTripPriceModalClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Trip Price Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTripPriceFormSubmit}>
            <Form.Group controlId="rate">
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="text"
                name="rate"
                value={tripPriceDetail.rate}
                onChange={handleTripPriceInput}
                placeholder="Enter rate"
              />
            </Form.Group>

            <Form.Group controlId="totalAmount" className="mt-3">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="text"
                name="totalAmount"
                value={tripPriceDetail.totalAmount}
                onChange={handleTripPriceInput}
                placeholder="Enter total amount"
              />
            </Form.Group>

            <Form.Group controlId="advanceAmount" className="mt-3">
              <Form.Label>Advance Amount</Form.Label>
              <Form.Control
                type="text"
                name="advanceAmount"
                value={tripPriceDetail.advanceAmount}
                onChange={handleTripPriceInput}
                placeholder="Enter advance amount"
              />
            </Form.Group>

            <Form.Group controlId="receivedAmount" className="mt-3">
              <Form.Label>Received Amount</Form.Label>
              <Form.Control
                type="text"
                name="receivedAmount"
                value={tripPriceDetail.receivedAmount}
                onChange={handleTripPriceInput}
                placeholder="Enter received amount"
              />
            </Form.Group>

            <Form.Group controlId="dueAmount" className="mt-3">
              <Form.Label>Due Amount</Form.Label>
              <Form.Control
                type="text"
                name="dueAmount"
                value={tripPriceDetail.dueAmount}
                onChange={handleTripPriceInput}
                placeholder="Enter due amount"
              />
            </Form.Group>

            <Form.Group controlId="paymentStatus" className="mt-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                name="paymentStatus"
                value={tripPriceDetail.paymentStatus}
                onChange={handleTripPriceInput}
              >
                <option value="">Select Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Advance">Advance</option>
                <option value="To be Pay">To be Pay</option>
              </Form.Control>
            </Form.Group>

            <Button className="btn bg-color custom-bg mt-3" type="submit">
              Save Trip Price Details
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTripPriceModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDocModal} onHide={handleDocModalClose} fullscreen>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`http://localhost:8080/api/user/document/${selectedDoc}/view`}
            width="100%"
            height="100%" // Set height to 100% for full coverage
            style={{ border: "none" }}
            title="Document Preview"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDocModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const VehicleDetail = () => {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getVehicle = async () => {
      const fetchVehicle = await retrieveVehicle();
      if (fetchVehicle) {
        setVehicle(fetchVehicle.vehicles[0]);
      }
    };

    const getAllBookings = async () => {
      const bookings = await retrieveAllBookings();
      if (bookings) {
        setBookings(bookings.bookings);
      }
    };

    getAllBookings();
    getVehicle();
  }, [vehicleId]);

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

  const [selectedDoc, setSelectedDoc] = useState("");

  const [showDocModal, setShowDocModal] = useState(false);
  const handleDocModalClose = () => setShowDocModal(false);
  const handleDocModalShow = () => setShowDocModal(true);

  const showReceiptDocModal = (docFileName) => {
    setSelectedDoc(docFileName);
    handleDocModalShow();
  };

  const [showModal, setShowModal] = useState(false);
  const [showFuelExpenseModal, setShowFuelExpenseModal] = useState(false);

  const [showOtherExpenseModal, setShowOtherExpenseModal] = useState(false);

  const [selectedImage1, setSelectImage1] = useState(null);
  const [selectedImage, setSelectImage] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleFuelExpenseModalClose = () => setShowFuelExpenseModal(false);
  const handleFuelExpenseModalShow = () => setShowFuelExpenseModal(true);

  const handleOtherExpenseModalClose = () => setShowOtherExpenseModal(false);
  const handleOtherExpenseModalShow = () => setShowOtherExpenseModal(true);

  const [fuelExpense, setFuelExpense] = useState({
    expenseTime: "", // date time local
    fuelType: "", //  Diesel, Petrol, Gas
    vendorName: "", // IOCL, BPL, Reliance
    startingKm: "",
    currentKm: "",
    amount: "",
    fullOrPartial: "",
    fuelRatePerLitre: "",
    filledLitre: "",
    paymentMode: "", // Account, Cash, UPI
    paymentDetails: "",
    remark: "",
    clientTripId: "",
    vehicleId: vehicleId,
  });

  const [otheExpense, setOtherExpense] = useState({
    expenseTime: "",
    expenseType: "",
    vendorName: "",
    locationDetails: "",
    city: "",
    pinCode: "",
    state: "",
    amount: 0,
    paymentMode: "",
    paymentDetails: "",
    remark: "",
    clientTripId: 0,
    vehicleId: vehicleId,
  });

  const handleFuelExpenseInput = (e) => {
    setFuelExpense({ ...fuelExpense, [e.target.name]: e.target.value });
  };

  const handleOtherExpenseInput = (e) => {
    setOtherExpense({ ...otheExpense, [e.target.name]: e.target.value });
  };

  let navigate = useNavigate();

  const retrieveVehicle = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/transport/vehicle/fetch?vehicleId=${vehicleId}`
    );
    return response.data;
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  if (!vehicle) return <p>Loading...</p>;

  const updateVehicleDocument = () => {
    navigate("/admin/vehicle/document/update", { state: vehicle });
  };

  const updateVehicleDetails = () => {
    navigate(`/admin/vehicle/${vehicleId}/update/detail`, { state: vehicle });
  };

  const handleFuelExpenseFormSubmit = (e) => {
    e.preventDefault();
    if (fuelExpense === null) {
      toast.error("invalid input!!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    const formData = new FormData();

    formData.append("vehicleId", fuelExpense.vehicleId);
    formData.append("clientTripId", fuelExpense.clientTripId);
    formData.append("expenseTime", fuelExpense.expenseTime);
    formData.append("fuelType", fuelExpense.fuelType);
    formData.append("vendorName", fuelExpense.vendorName);
    formData.append("startingKm", fuelExpense.startingKm);
    formData.append("currentKm", fuelExpense.currentKm);
    formData.append("amount", fuelExpense.amount);
    formData.append("fullOrPartial", fuelExpense.fullOrPartial);
    formData.append("fuelRatePerLitre", fuelExpense.fuelRatePerLitre);
    formData.append("filledLitre", fuelExpense.filledLitre);
    formData.append("paymentMode", fuelExpense.paymentMode);
    formData.append("paymentDetails", fuelExpense.paymentDetails);
    formData.append("remark", fuelExpense.remark);
    formData.append("receiptUpload", selectedImage1); // Assuming 'selectedImage1' is the uploaded file

    axios
      .put(
        "http://localhost:8080/api/transport/client/booking/fuel/expense/add",
        formData,
        {
          headers: {
            //       Authorization: "Bearer " + guide_jwtToken, // Replace with your actual JWT token
          },
        }
      )
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

          //   setTimeout(() => {
          //     navigate("/home");
          //   }, 2000); // Redirect after 3 seconds
        } else if (!response.success) {
          toast.error(response.responseMessage, {
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
          // }, 2000); // Redirect after 3 seconds
        } else {
          toast.error("It Seems Server is down!!!", {
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
          // }, 2000); // Redirect after 3 seconds
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response ||
            error.response.data ||
            error.response.data.responseMessage
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
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 2000); // Redirect after 3 seconds
      });
  };

  const handleOtherExpenseFormSubmit = (e) => {
    e.preventDefault();
    if (otheExpense === null) {
      toast.error("invalid input!!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    const formData = new FormData();

    formData.append("vehicleId", otheExpense.vehicleId);
    formData.append("clientTripId", otheExpense.clientTripId);
    formData.append("expenseTime", otheExpense.expenseTime);
    formData.append("expenseType", otheExpense.expenseType);
    formData.append("vendorName", otheExpense.vendorName);
    formData.append("locationDetails", otheExpense.locationDetails);
    formData.append("city", otheExpense.city);
    formData.append("pinCode", otheExpense.pinCode);
    formData.append("state", otheExpense.state);
    formData.append("amount", otheExpense.amount);
    formData.append("paymentMode", otheExpense.paymentMode);
    formData.append("paymentDetails", otheExpense.paymentDetails);
    formData.append("remark", otheExpense.remark);

    // For receipt upload (image)
    formData.append("receiptUpload", selectedImage);

    axios
      .put(
        "http://localhost:8080/api/transport/client/booking/other/expense/add",
        formData,
        {
          headers: {
            //       Authorization: "Bearer " + guide_jwtToken, // Replace with your actual JWT token
          },
        }
      )
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
            window.location.reload(true);
          }, 2000); // Redirect after 3 seconds
        } else if (!response.success) {
          toast.error(response.responseMessage, {
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
          // }, 2000); // Redirect after 3 seconds
        } else {
          toast.error("It Seems Server is down!!!", {
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
          // }, 2000); // Redirect after 3 seconds
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response ||
            error.response.data ||
            error.response.data.responseMessage
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
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 2000); // Redirect after 3 seconds
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
          <h2>Vehicle Details</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Basic Information</h5>
              <p>
                <strong>Name:</strong> {vehicle.name}
              </p>
              <p>
                <strong>Vehicle No.:</strong> {vehicle.vehicleNumber}
              </p>
              <p>
                <strong>Company Name:</strong> {vehicle.companyName}
              </p>
              <p>
                <strong>Registration No.:</strong> {vehicle.registrationNumber}
              </p>
              <p>
                <strong>Passing Type:</strong> {vehicle.passingType}
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Insurance and Permit</h5>
              <p>
                <strong>Insurance Start Date:</strong>{" "}
                {vehicle.insuranceStartDate}
              </p>
              <p>
                <strong>Insurance Expiry Date:</strong>{" "}
                {vehicle.expireInsuranceDate}
              </p>
              <p>
                <strong>Permit No.:</strong> {vehicle.permitNumber}
              </p>
              <p>
                <strong>Permit Expiry Date:</strong> {vehicle.permitExpireDate}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Vehicle Maintenance</h5>
              <p>
                <strong>Smoke Test Expiry Date:</strong>{" "}
                {vehicle.smokeTestExpireDate}
              </p>
              <p>
                <strong>Gare Box Expiry Date:</strong>{" "}
                {vehicle.gareBoxExpireDate}
              </p>
              <p>
                <strong>Oil Change Date:</strong> {vehicle.oilChangeDate}
              </p>
              <p>
                <strong>Vehicle Purchase Date:</strong>{" "}
                {vehicle.vehiclePurchaseDate}
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Other Details</h5>
              <p>
                <strong>Remark:</strong> {vehicle.remark}
              </p>
              <div>
                <strong>Documents:</strong>
                <button
                  className="btn btn-sm bg-color custom-bg ms-2"
                  onClick={handleShowModal}
                >
                  View Document
                </button>
              </div>
            </div>
          </div>

          <h5 className="text-primary mt-4">Fuel Expenses</h5>
          {vehicle.fuelExpenses && vehicle.fuelExpenses.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Expense Date</th>
                    <th>Client Trip</th>
                    <th>Vendor Name</th>
                    <th>Fuel Type</th>
                    <th>Starting Km</th>
                    <th>Current Km</th>
                    <th>Filled Litres</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicle.fuelExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.expenseTime}</td>
                      <td>{expense.clientTripName}</td>
                      <td>{expense.vendorName}</td>
                      <td>{expense.fuelType}</td>
                      <td>{expense.startingKm}</td>
                      <td>{expense.currentKm}</td>
                      <td>{expense.filledLitre}</td>
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
              Fuel expense not present for this vehicle.
            </p>
          )}

          <h5 className="text-primary mt-4">Other Expenses</h5>
          {vehicle.otherExpenses && vehicle.otherExpenses.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Expense Date</th>
                    <th>Client Trip</th>
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
                  {vehicle.otherExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.expenseTime}</td>
                      <td>{expense.clientTripName}</td>
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

        {/* write the update vehicle detail and document update code here */}

        <div className="card-footer ">
          <div className="d-flex justify-content-center mt-3">
            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Add Fuel Expense"
              onClick={handleFuelExpenseModalShow}
            />

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Add Other Expense"
              onClick={handleOtherExpenseModalShow}
            />

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Update Vehicle Detail"
              onClick={updateVehicleDetails}
            />

            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-4"
              value="Update Vehicle Document"
              onClick={updateVehicleDocument}
            />
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} fullscreen>
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
            src={`http://localhost:8080/api/user/document/${vehicle.uploadDocuments}/view`}
            width="100%"
            height="100%" // Set height to 100% for full coverage
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

      <Modal
        show={showFuelExpenseModal}
        onHide={handleFuelExpenseModalClose}
        size="lg" // Makes the modal large
      >
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Fuel Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFuelExpenseFormSubmit}>
            <Row>
              {/* Fuel Type */}
              <Col md={4}>
                <Form.Group controlId="fuelType">
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select
                    name="fuelType"
                    value={fuelExpense.fuelType}
                    onChange={handleFuelExpenseInput}
                  >
                    <option value="">Select Type</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Gas">Gas</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Expense Time */}
              <Col md={4}>
                <Form.Group controlId="expenseTime" className="mt-3 mt-md-0">
                  <Form.Label>Expense Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="expenseTime"
                    value={fuelExpense.expenseTime}
                    onChange={handleFuelExpenseInput}
                  />
                </Form.Group>
              </Col>

              {/* Vendor Name */}
              <Col md={4}>
                <Form.Group controlId="vendorName" className="mt-3 mt-md-0">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Select
                    name="vendorName"
                    value={fuelExpense.vendorName}
                    onChange={handleFuelExpenseInput}
                  >
                    <option value="">Select Vendor</option>
                    <option value="IOCL">IOCL</option>
                    <option value="BPL">BPL</option>
                    <option value="Reliance">Reliance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Starting Km */}
              <Col md={4}>
                <Form.Group controlId="startingKm">
                  <Form.Label>Starting Kilometer</Form.Label>
                  <Form.Control
                    type="text"
                    name="startingKm"
                    value={fuelExpense.startingKm}
                    onChange={handleFuelExpenseInput}
                    placeholder="Enter starting KM"
                  />
                </Form.Group>
              </Col>

              {/* Current Km */}
              <Col md={4}>
                <Form.Group controlId="currentKm">
                  <Form.Label>Current Kilometer</Form.Label>
                  <Form.Control
                    type="text"
                    name="currentKm"
                    value={fuelExpense.currentKm}
                    onChange={handleFuelExpenseInput}
                    placeholder="Enter current KM"
                  />
                </Form.Group>
              </Col>

              {/* Amount */}
              <Col md={4}>
                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={fuelExpense.amount}
                    onChange={handleFuelExpenseInput}
                    placeholder="Enter amount"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Full or Partial */}
              <Col md={4}>
                <Form.Group controlId="fullOrPartial">
                  <Form.Label>Full or Partial</Form.Label>
                  <Form.Select
                    name="fullOrPartial"
                    value={fuelExpense.fullOrPartial}
                    onChange={handleFuelExpenseInput}
                  >
                    <option value="">Select Option</option>
                    <option value="Full">Full</option>
                    <option value="Partial">Partial</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Fuel Rate Per Litre */}
              <Col md={4}>
                <Form.Group controlId="fuelRatePerLitre">
                  <Form.Label>Fuel Rate Per Litre</Form.Label>
                  <Form.Control
                    type="number"
                    name="fuelRatePerLitre"
                    value={fuelExpense.fuelRatePerLitre}
                    onChange={handleFuelExpenseInput}
                    placeholder="Enter fuel rate per litre"
                  />
                </Form.Group>
              </Col>

              {/* Filled Litres */}
              <Col md={4}>
                <Form.Group controlId="filledLitre">
                  <Form.Label>Filled Litres</Form.Label>
                  <Form.Control
                    type="number"
                    name="filledLitre"
                    value={fuelExpense.filledLitre}
                    onChange={handleFuelExpenseInput}
                    placeholder="Enter litres filled"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Payment Mode */}
              <Col md={4}>
                <Form.Group controlId="paymentMode">
                  <Form.Label>Payment Mode</Form.Label>
                  <Form.Select
                    name="paymentMode"
                    value={fuelExpense.paymentMode}
                    onChange={handleFuelExpenseInput}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Account">Account</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Payment Details */}
              <Col md={4}>
                <Form.Group controlId="paymentDetails">
                  <Form.Label>Payment Details</Form.Label>
                  <Form.Control
                    type="text"
                    name="paymentDetails"
                    value={fuelExpense.paymentDetails}
                    onChange={handleFuelExpenseInput}
                    placeholder="Enter payment details"
                  />
                </Form.Group>
              </Col>

              {/* Remark */}
              <Col md={4}>
                <Form.Group controlId="remark">
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    type="text"
                    name="remark"
                    value={fuelExpense.remark}
                    onChange={handleFuelExpenseInput}
                    placeholder="Enter any remarks"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Client Trip */}
              <Col md={6}>
                <Form.Group controlId="clientTripId">
                  <Form.Label>Client Trip</Form.Label>
                  <Form.Select
                    name="clientTripId"
                    value={fuelExpense.clientTripId}
                    onChange={handleFuelExpenseInput}
                  >
                    <option value="">Select Trip</option>
                    {bookings.map((booking) => (
                      <option key={booking.id} value={booking.id}>
                        {booking.name +
                          " [ " +
                          booking.fromClient.name +
                          " (" +
                          booking.bookingPointStation.city +
                          ") - " +
                          booking.toClient.name +
                          " (" +
                          booking.deliveryPointStation.city +
                          ") " +
                          " ]"}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Receipt Upload */}
              <Col md={6}>
                <Form.Group controlId="uploadDocuments">
                  <Form.Label>Receipt</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setSelectImage1(e.target.files[0])}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button className="btn bg-color custom-bg mt-3" type="submit">
              Add Fuel Expense
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleFuelExpenseModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showOtherExpenseModal}
        onHide={handleOtherExpenseModalClose}
        size="lg" // Makes the modal large
      >
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Other Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOtherExpenseFormSubmit}>
            <Row>
              {/* Expense Time */}
              <Col md={4}>
                <Form.Group controlId="expenseTime" className="mt-3 mt-md-0">
                  <Form.Label>Expense Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="expenseTime"
                    value={otheExpense.expenseTime}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>

              {/* Expense Type */}
              <Col md={4}>
                <Form.Group controlId="expenseType" className="mt-3 mt-md-0">
                  <Form.Label>Expense Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="expenseType"
                    value={otheExpense.expenseType}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>

              {/* Vendor Name */}
              <Col md={4}>
                <Form.Group controlId="vendorName" className="mt-3 mt-md-0">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendorName"
                    value={otheExpense.vendorName}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Location Details */}
              <Col md={6}>
                <Form.Group controlId="locationDetails">
                  <Form.Label>Location Details</Form.Label>
                  <Form.Control
                    type="text"
                    name="locationDetails"
                    value={otheExpense.locationDetails}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>

              {/* City */}
              <Col md={6}>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={otheExpense.city}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Pin Code */}
              <Col md={4}>
                <Form.Group controlId="pinCode">
                  <Form.Label>Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="pinCode"
                    value={otheExpense.pinCode}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>

              {/* State */}
              <Col md={4}>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={otheExpense.state}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>

              {/* Amount */}
              <Col md={4}>
                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={otheExpense.amount}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Payment Mode */}
              <Col md={4}>
                <Form.Group controlId="paymentMode">
                  <Form.Label>Payment Mode</Form.Label>
                  <Form.Select
                    name="paymentMode"
                    onChange={handleOtherExpenseInput}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Account">Account</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Payment Details */}
              <Col md={4}>
                <Form.Group controlId="paymentDetails">
                  <Form.Label>Payment Details</Form.Label>
                  <Form.Control
                    type="text"
                    name="paymentDetails"
                    value={otheExpense.paymentDetails}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>

              {/* Remark */}
              <Col md={4}>
                <Form.Group controlId="remark">
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    type="text"
                    name="remark"
                    value={otheExpense.remark}
                    onChange={handleOtherExpenseInput}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Client Trip */}
              <Col md={6}>
                <Form.Group controlId="clientTripId">
                  <Form.Label>Client Trip</Form.Label>
                  <Form.Select
                    name="clientTripId"
                    value={otheExpense.clientTripId}
                    onChange={handleOtherExpenseInput}
                  >
                    <option value="">Select Trip</option>
                    {bookings.map((booking) => (
                      <option key={booking.id} value={booking.id}>
                        {booking.name +
                          " [ " +
                          booking.fromClient.name +
                          " (" +
                          booking.bookingPointStation.city +
                          ") - " +
                          booking.toClient.name +
                          " (" +
                          booking.deliveryPointStation.city +
                          ") " +
                          " ]"}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Receipt Upload */}
              <Col md={6}>
                <Form.Group controlId="uploadDocuments">
                  <Form.Label>Receipt</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setSelectImage(e.target.files[0])}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button className="btn bg-color custom-bg mt-3" type="submit">
              Add Other Expense
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleOtherExpenseModalClose}>
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

export default VehicleDetail;

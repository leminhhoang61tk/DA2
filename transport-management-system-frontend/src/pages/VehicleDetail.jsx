import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form, Col, Row, Card, Container, Spinner, Alert, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API URLs
const API_BASE_URL_TRANSPORT = "http://localhost:8080/api/transport";
const API_VEHICLE_FETCH = `${API_BASE_URL_TRANSPORT}/vehicle/fetch`;
const API_BOOKINGS_ALL = `${API_BASE_URL_TRANSPORT}/client/booking/fetch/all`;
const API_FUEL_EXPENSE_ADD = `${API_BASE_URL_TRANSPORT}/client/booking/fuel/expense/add`;
const API_OTHER_EXPENSE_ADD = `${API_BASE_URL_TRANSPORT}/client/booking/other/expense/add`;
const API_DOCUMENT_VIEW_BASE = "http://localhost:8080/api/user/document";


// Select Options
const FUEL_TYPE_OPTIONS = [
  { value: "", label: "Select Fuel Type" },
  { value: "Diesel", label: "Diesel" },
  { value: "Petrol", label: "Petrol" },
  { value: "Gas", label: "Gas" },
  { value: "Electric", label: "Electric" },
];

const FUEL_VENDOR_OPTIONS = [
  { value: "", label: "Select Vendor" },
  { value: "IOCL", label: "IOCL" },
  { value: "BPL", label: "BPL" },
  { value: "Reliance", label: "Reliance" },
  { value: "HPCL", label: "HPCL" },
  { value: "Shell", label: "Shell" },
  { value: "Other", label: "Other" },
];

const PAYMENT_MODE_OPTIONS = [
  { value: "", label: "Select Payment Mode" },
  { value: "Account", label: "Account Transfer" },
  { value: "Cash", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "Card", label: "Card" },
];

const FUEL_FILL_TYPE_OPTIONS = [
    { value: "", label: "Select Fill Type"},
    { value: "Full", label: "Full Tank"},
    { value: "Partial", label: "Partial Fill"},
];

// Initial State for Forms
const initialFuelExpenseState = {
  expenseTime: "",
  fuelType: "",
  vendorName: "",
  startingKm: "",
  currentKm: "",
  amount: "",
  fullOrPartial: "",
  fuelRatePerLitre: "",
  filledLitre: "",
  paymentMode: "",
  paymentDetails: "",
  remark: "",
  clientTripId: "", // This will be selected from a dropdown
  vehicleId: "",    // This will be set from useParams
};

const initialOtherExpenseState = {
  expenseTime: "",
  expenseType: "",
  vendorName: "",
  locationDetails: "",
  city: "",
  pinCode: "",
  state: "",
  amount: "",
  paymentMode: "",
  paymentDetails: "",
  remark: "",
  clientTripId: "", // This will be selected from a dropdown
  vehicleId: "",    // This will be set from useParams
};


const VehicleDetail = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Modal Visibility States
  const [modalVisibility, setModalVisibility] = useState({
    vehicleDocument: false,
    fuelExpense: false,
    otherExpense: false,
    receiptDocument: false,
  });

  // Form Data States
  const [fuelExpense, setFuelExpense] = useState({...initialFuelExpenseState, vehicleId });
  const [otherExpense, setOtherExpense] = useState({...initialOtherExpenseState, vehicleId });

  // File States for Uploads
  const [fuelReceiptFile, setFuelReceiptFile] = useState(null);
  const [otherExpenseReceiptFile, setOtherExpenseReceiptFile] = useState(null);
  const [selectedReceiptDocName, setSelectedReceiptDocName] = useState("");

  // Submission Loading States
  const [isSubmittingFuel, setIsSubmittingFuel] = useState(false);
  const [isSubmittingOther, setIsSubmittingOther] = useState(false);


  // --- API Call Functions (Memoized) ---
  const retrieveVehicleAPI = useCallback(async (id) => {
    return axios.get(`${API_VEHICLE_FETCH}?vehicleId=${id}`); // Add auth headers if needed
  }, []);

  const retrieveAllBookingsAPI = useCallback(async () => {
    return axios.get(API_BOOKINGS_ALL); // Add auth headers if needed
  }, []);

  // --- Initial Data Fetching ---
  const fetchVehicleData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [vehicleRes, bookingsRes] = await Promise.all([
        retrieveVehicleAPI(vehicleId),
        retrieveAllBookingsAPI(),
      ]);

      if (vehicleRes.data?.vehicles && vehicleRes.data.vehicles.length > 0) {
        setVehicle(vehicleRes.data.vehicles[0]);
      } else {
        throw new Error("Vehicle not found.");
      }

      if (bookingsRes.data?.bookings) {
        setBookings(bookingsRes.data.bookings);
      } else {
        // It's okay if there are no bookings, but log a warning if the structure is unexpected
        console.warn("No bookings found or unexpected bookings response structure.");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      const errMsg = error.response?.data?.responseMessage || error.message || "Failed to load vehicle data.";
      setFetchError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId, retrieveVehicleAPI, retrieveAllBookingsAPI]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);


  // --- Modal Handlers ---
  const handleModalShow = useCallback((modalName) => {
    setModalVisibility(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const handleModalClose = useCallback((modalName) => {
    setModalVisibility(prev => ({ ...prev, [modalName]: false }));
    // Reset form states and files when modals close
    if (modalName === 'fuelExpense') {
      setFuelExpense({...initialFuelExpenseState, vehicleId});
      setFuelReceiptFile(null);
    }
    if (modalName === 'otherExpense') {
      setOtherExpense({...initialOtherExpenseState, vehicleId});
      setOtherExpenseReceiptFile(null);
    }
    if (modalName === 'receiptDocument') {
        setSelectedReceiptDocName("");
    }
  }, [vehicleId]);

  const showReceiptDocModal = useCallback((docFileName) => {
    setSelectedReceiptDocName(docFileName);
    handleModalShow('receiptDocument');
  }, [handleModalShow]);


  // --- Form Input Handlers (Generic) ---
  const createInputHandler = useCallback((setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFuelExpenseInput = createInputHandler(setFuelExpense);
  const handleOtherExpenseInput = createInputHandler(setOtherExpense);


  // --- File Change Handlers ---
  const handleFuelReceiptChange = useCallback((e) => {
    setFuelReceiptFile(e.target.files[0]);
  }, []);

  const handleOtherReceiptChange = useCallback((e) => {
    setOtherExpenseReceiptFile(e.target.files[0]);
  }, []);

  // --- Form Submission Handlers ---
  const handleFuelExpenseFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!fuelExpense.clientTripId) {
        toast.warn("Please select a Client Trip for the expense.");
        return;
    }
    if (!fuelReceiptFile) {
        toast.warn("Please upload a receipt for fuel expense.");
        return;
    }
    setIsSubmittingFuel(true);
    const formData = new FormData();
    Object.entries(fuelExpense).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("receiptUpload", fuelReceiptFile);

    try {
      const response = await axios.put(API_FUEL_EXPENSE_ADD, formData, {
        // headers: { Authorization: "Bearer YOUR_TOKEN" } // Add auth
      });
      if (response.data?.success) {
        toast.success(response.data.responseMessage || "Fuel expense added successfully!");
        handleModalClose('fuelExpense');
        fetchVehicleData(); // Re-fetch to update expense list
      } else {
        toast.error(response.data?.responseMessage || "Failed to add fuel expense.");
      }
    } catch (error) {
      console.error("Error adding fuel expense:", error);
      toast.error(error.response?.data?.responseMessage || "Error adding fuel expense.");
    } finally {
      setIsSubmittingFuel(false);
    }
  }, [fuelExpense, fuelReceiptFile, handleModalClose, fetchVehicleData]);

  const handleOtherExpenseFormSubmit = useCallback(async (e) => {
    e.preventDefault();
     if (!otherExpense.clientTripId && otherExpense.clientTripId !== 0) { // Allow 0 if it's a valid ID for non-trip expenses
        toast.warn("Please select a Client Trip or indicate if it's a general vehicle expense.");
        // Potentially allow submission if clientTripId is explicitly set to 0 or null for non-trip expenses
    }
    if (!otherExpenseReceiptFile) {
        toast.warn("Please upload a receipt for other expense.");
        return;
    }
    setIsSubmittingOther(true);
    const formData = new FormData();
     Object.entries(otherExpense).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("receiptUpload", otherExpenseReceiptFile);

    try {
      const response = await axios.put(API_OTHER_EXPENSE_ADD, formData, {
        // headers: { Authorization: "Bearer YOUR_TOKEN" } // Add auth
      });
      if (response.data?.success) {
        toast.success(response.data.responseMessage || "Other expense added successfully!");
        handleModalClose('otherExpense');
        fetchVehicleData(); // Re-fetch to update expense list
      } else {
        toast.error(response.data?.responseMessage || "Failed to add other expense.");
      }
    } catch (error) {
      console.error("Error adding other expense:", error);
      toast.error(error.response?.data?.responseMessage || "Error adding other expense.");
    } finally {
      setIsSubmittingOther(false);
    }
  }, [otherExpense, otherExpenseReceiptFile, handleModalClose, fetchVehicleData]);


  // --- Navigation ---
  const updateVehicleDocument = useCallback(() => {
    navigate("/admin/vehicle/document/update", { state: vehicle });
  }, [navigate, vehicle]);

  const updateVehicleDetails = useCallback(() => {
    navigate(`/admin/vehicle/${vehicleId}/update/detail`, { state: vehicle });
  }, [navigate, vehicleId, vehicle]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    try {
        // Handles both epoch and standard date strings
        const date = new Date(isNaN(dateString) ? dateString : parseInt(dateString));
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString(undefined, options);
    } catch (e) {
        return "Invalid Date";
    }
  };


  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Loading Vehicle Details...</p>
      </Container>
    );
  }

  if (fetchError || !vehicle) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Vehicle Data</h4>
          <p>{fetchError || "Vehicle data could not be loaded."}</p>
          <Button onClick={fetchVehicleData} variant="primary">Try Again</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3 mb-5">
      <Card className="form-card shadow-lg">
        <Card.Header className="custom-bg-text text-center bg-color" style={{ borderRadius: "1em", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h2 className="mb-0">Vehicle Details: {vehicle.name} ({vehicle.vehicleNumber})</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Basic Information</h5>
              <p><strong>Name:</strong> {vehicle.name}</p>
              <p><strong>Vehicle No.:</strong> {vehicle.vehicleNumber}</p>
              <p><strong>Company Name:</strong> {vehicle.companyName}</p>
              <p><strong>Registration No.:</strong> {vehicle.registrationNumber}</p>
              <p><strong>Passing Type:</strong> {vehicle.passingType}</p>
            </Col>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Insurance & Permit</h5>
              <p><strong>Insurance Start Date:</strong> {formatDate(vehicle.insuranceStartDate)}</p>
              <p><strong>Insurance Expiry Date:</strong> {formatDate(vehicle.expireInsuranceDate)}</p>
              <p><strong>Permit No.:</strong> {vehicle.permitNumber || "N/A"}</p>
              <p><strong>Permit Expiry Date:</strong> {formatDate(vehicle.permitExpireDate)}</p>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Maintenance</h5>
              <p><strong>Inspection Expiry:</strong> {formatDate(vehicle.smokeTestExpireDate)}</p>
              <p><strong>Gare Box Expiry:</strong> {formatDate(vehicle.gareBoxExpireDate)}</p>
              <p><strong>Oil Change Date:</strong> {formatDate(vehicle.oilChangeDate)}</p>
              <p><strong>Purchase Date:</strong> {formatDate(vehicle.vehiclePurchaseDate)}</p>
            </Col>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Other Details</h5>
              <p><strong>Remark:</strong> {vehicle.remark || "N/A"}</p>
              <div>
                <strong>Documents:</strong>
                {vehicle.uploadDocuments ? (
                    <Button variant="info" size="sm" className="ms-2" onClick={() => handleModalShow('vehicleDocument')}>
                        View Document
                    </Button>
                ) : " No document uploaded"}
              </div>
            </Col>
          </Row>

          <h5 className="text-primary mt-4">Fuel Expenses</h5>
          {vehicle.fuelExpenses && vehicle.fuelExpenses.length > 0 ? (
            <Table striped bordered hover responsive size="sm" className="mt-2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trip</th>
                  <th>Vendor</th>
                  <th>Fuel Type</th>
                  <th>Start KM</th>
                  <th>Current KM</th>
                  <th>Litres</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {vehicle.fuelExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.expenseTime)}</td>
                    <td>{expense.clientTripName || "N/A"}</td>
                    <td>{expense.vendorName}</td>
                    <td>{expense.fuelType}</td>
                    <td>{expense.startingKm}</td>
                    <td>{expense.currentKm}</td>
                    <td>{expense.filledLitre}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.paymentMode}</td>
                    <td>
                      {expense.receiptUpload ? (
                        <Button variant="link" size="sm" onClick={() => showReceiptDocModal(expense.receiptUpload)}>View</Button>
                      ) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <p className="text-muted">No fuel expenses recorded for this vehicle.</p>}

          <h5 className="text-primary mt-4">Other Expenses</h5>
          {vehicle.otherExpenses && vehicle.otherExpenses.length > 0 ? (
            <Table striped bordered hover responsive size="sm" className="mt-2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trip</th>
                  <th>Vendor</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Location</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {vehicle.otherExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.expenseTime)}</td>
                    <td>{expense.clientTripName || "N/A"}</td>
                    <td>{expense.vendorName}</td>
                    <td>{expense.expenseType}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.paymentMode}</td>
                    <td>{expense.city}, {expense.state}</td>
                    <td>
                     {expense.receiptUpload ? (
                        <Button variant="link" size="sm" onClick={() => showReceiptDocModal(expense.receiptUpload)}>View</Button>
                      ) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <p className="text-muted">No other expenses recorded for this vehicle.</p>}
        </Card.Body>
        <Card.Footer>
          <div className="d-flex flex-wrap justify-content-center mt-3">
            <Button variant="success" className="m-2" onClick={() => handleModalShow('fuelExpense')}>Add Fuel Expense</Button>
            <Button variant="success" className="m-2" onClick={() => handleModalShow('otherExpense')}>Add Other Expense</Button>
            <Button variant="warning" className="m-2" onClick={updateVehicleDetails}>Update Vehicle Details</Button>
            <Button variant="warning" className="m-2" onClick={updateVehicleDocument}>Update Vehicle Document</Button>
          </div>
        </Card.Footer>
      </Card>

      {/* Vehicle Document Modal */}
      <Modal show={modalVisibility.vehicleDocument} onHide={() => handleModalClose('vehicleDocument')} fullscreen>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Vehicle Document</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '85vh' }}>
          {vehicle.uploadDocuments ? (
            <iframe
              src={`${API_DOCUMENT_VIEW_BASE}/${vehicle.uploadDocuments}/view`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Vehicle Document Preview"
            />
          ) : <p>No document available.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleModalClose('vehicleDocument')}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Receipt Document Modal */}
      <Modal show={modalVisibility.receiptDocument} onHide={() => handleModalClose('receiptDocument')} fullscreen>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Receipt Document</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '85vh' }}>
          {selectedReceiptDocName ? (
            <iframe
              src={`${API_DOCUMENT_VIEW_BASE}/${selectedReceiptDocName}/view`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Receipt Preview"
            />
          ) : <p>No receipt selected.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleModalClose('receiptDocument')}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Fuel Expense Modal */}
      <Modal show={modalVisibility.fuelExpense} onHide={() => handleModalClose('fuelExpense')} size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Add Fuel Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFuelExpenseFormSubmit}>
            <Row>
              <Col md={4}><Form.Group controlId="feExpenseTime"><Form.Label>Expense Time</Form.Label><Form.Control type="datetime-local" name="expenseTime" value={fuelExpense.expenseTime} onChange={handleFuelExpenseInput} required /></Form.Group></Col>
              <Col md={4}><Form.Group controlId="feFuelType"><Form.Label>Fuel Type</Form.Label><Form.Select name="fuelType" value={fuelExpense.fuelType} onChange={handleFuelExpenseInput} required>{FUEL_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group controlId="feVendorName"><Form.Label>Vendor Name</Form.Label><Form.Select name="vendorName" value={fuelExpense.vendorName} onChange={handleFuelExpenseInput} required>{FUEL_VENDOR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row className="mt-3">
              <Col md={4}><Form.Group controlId="feStartingKm"><Form.Label>Starting KM</Form.Label><Form.Control type="number" name="startingKm" value={fuelExpense.startingKm} onChange={handleFuelExpenseInput} /></Form.Group></Col>
              <Col md={4}><Form.Group controlId="feCurrentKm"><Form.Label>Current KM</Form.Label><Form.Control type="number" name="currentKm" value={fuelExpense.currentKm} onChange={handleFuelExpenseInput} required /></Form.Group></Col>
              <Col md={4}><Form.Group controlId="feAmount"><Form.Label>Amount (₫)</Form.Label><Form.Control type="number" step="any" name="amount" value={fuelExpense.amount} onChange={handleFuelExpenseInput} required /></Form.Group></Col>
            </Row>
            <Row className="mt-3">
              <Col md={4}><Form.Group controlId="feFullOrPartial"><Form.Label>Fill Type</Form.Label><Form.Select name="fullOrPartial" value={fuelExpense.fullOrPartial} onChange={handleFuelExpenseInput}>{FUEL_FILL_TYPE_OPTIONS.map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group controlId="feFuelRate"><Form.Label>Rate/Litre (₫)</Form.Label><Form.Control type="number" step="any" name="fuelRatePerLitre" value={fuelExpense.fuelRatePerLitre} onChange={handleFuelExpenseInput} /></Form.Group></Col>
              <Col md={4}><Form.Group controlId="feFilledLitre"><Form.Label>Litres Filled</Form.Label><Form.Control type="number" step="any" name="filledLitre" value={fuelExpense.filledLitre} onChange={handleFuelExpenseInput} /></Form.Group></Col>
            </Row>
             <Row className="mt-3">
              <Col md={6}><Form.Group controlId="fePaymentMode"><Form.Label>Payment Mode</Form.Label><Form.Select name="paymentMode" value={fuelExpense.paymentMode} onChange={handleFuelExpenseInput} required>{PAYMENT_MODE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group controlId="fePaymentDetails"><Form.Label>Payment Details (Ref#)</Form.Label><Form.Control type="text" name="paymentDetails" value={fuelExpense.paymentDetails} onChange={handleFuelExpenseInput} /></Form.Group></Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}><Form.Group controlId="feClientTripId"><Form.Label>Related Client Trip (Optional)</Form.Label><Form.Select name="clientTripId" value={fuelExpense.clientTripId} onChange={handleFuelExpenseInput}><option value="">None (General Expense)</option>{bookings.map(b => <option key={b.id} value={b.id}>{b.name} ({b.fromClient.name} to {b.toClient.name})</option>)}</Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group controlId="feReceiptUpload"><Form.Label>Upload Receipt</Form.Label><Form.Control type="file" onChange={handleFuelReceiptChange} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mt-3" controlId="feRemark"><Form.Label>Remark</Form.Label><Form.Control as="textarea" rows={2} name="remark" value={fuelExpense.remark} onChange={handleFuelExpenseInput} /></Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={isSubmittingFuel}>
              {isSubmittingFuel ? <><Spinner as="span" animation="border" size="sm" /> Submitting...</> : "Add Fuel Expense"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Other Expense Modal */}
      <Modal show={modalVisibility.otherExpense} onHide={() => handleModalClose('otherExpense')} size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Add Other Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOtherExpenseFormSubmit}>
            <Row>
              <Col md={4}><Form.Group controlId="oeExpenseTime"><Form.Label>Expense Time</Form.Label><Form.Control type="datetime-local" name="expenseTime" value={otherExpense.expenseTime} onChange={handleOtherExpenseInput} required /></Form.Group></Col>
              <Col md={4}><Form.Group controlId="oeExpenseType"><Form.Label>Expense Type</Form.Label><Form.Control type="text" name="expenseType" value={otherExpense.expenseType} onChange={handleOtherExpenseInput} placeholder="e.g., Toll, Maintenance, Parking" required /></Form.Group></Col>
              <Col md={4}><Form.Group controlId="oeVendorName"><Form.Label>Vendor Name</Form.Label><Form.Control type="text" name="vendorName" value={otherExpense.vendorName} onChange={handleOtherExpenseInput} /></Form.Group></Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}><Form.Group controlId="oeLocationDetails"><Form.Label>Location Details</Form.Label><Form.Control type="text" name="locationDetails" value={otherExpense.locationDetails} onChange={handleOtherExpenseInput} /></Form.Group></Col>
              <Col md={3}><Form.Group controlId="oeCity"><Form.Label>City</Form.Label><Form.Control type="text" name="city" value={otherExpense.city} onChange={handleOtherExpenseInput} /></Form.Group></Col>
               <Col md={3}><Form.Group controlId="oeState"><Form.Label>State</Form.Label><Form.Control type="text" name="state" value={otherExpense.state} onChange={handleOtherExpenseInput} /></Form.Group></Col>
            </Row>
            <Row className="mt-3">
              <Col md={3}><Form.Group controlId="oePinCode"><Form.Label>Pin Code</Form.Label><Form.Control type="text" name="pinCode" value={otherExpense.pinCode} onChange={handleOtherExpenseInput} /></Form.Group></Col>
              <Col md={3}><Form.Group controlId="oeAmount"><Form.Label>Amount (₫)</Form.Label><Form.Control type="number" step="any" name="amount" value={otherExpense.amount} onChange={handleOtherExpenseInput} required /></Form.Group></Col>
              <Col md={3}><Form.Group controlId="oePaymentMode"><Form.Label>Payment Mode</Form.Label><Form.Select name="paymentMode" value={otherExpense.paymentMode} onChange={handleOtherExpenseInput} required>{PAYMENT_MODE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group></Col>
              <Col md={3}><Form.Group controlId="oePaymentDetails"><Form.Label>Payment Details</Form.Label><Form.Control type="text" name="paymentDetails" value={otherExpense.paymentDetails} onChange={handleOtherExpenseInput} /></Form.Group></Col>
            </Row>
             <Row className="mt-3">
              <Col md={6}><Form.Group controlId="oeClientTripId"><Form.Label>Related Client Trip (Optional)</Form.Label><Form.Select name="clientTripId" value={otherExpense.clientTripId} onChange={handleOtherExpenseInput}><option value="">None (General Expense)</option>{bookings.map(b => <option key={b.id} value={b.id}>{b.name} ({b.fromClient.name} to {b.toClient.name})</option>)}</Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group controlId="oeReceiptUpload"><Form.Label>Upload Receipt</Form.Label><Form.Control type="file" onChange={handleOtherReceiptChange} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mt-3" controlId="oeRemark"><Form.Label>Remark</Form.Label><Form.Control as="textarea" rows={2} name="remark" value={otherExpense.remark} onChange={handleOtherExpenseInput} /></Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={isSubmittingOther}>
              {isSubmittingOther ? <><Spinner as="span" animation="border" size="sm" /> Submitting...</> : "Add Other Expense"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
};

export default VehicleDetail;


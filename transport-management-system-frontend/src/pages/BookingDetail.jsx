import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate }
from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form, Table, Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API URLs
const API_BASE_URL = "http://localhost:8080/api/transport/client/booking";
const VEHICLE_API_URL = "http://localhost:8080/api/transport/vehicle/fetch/all";
const USER_API_URL = "http://localhost:8080/api/user/fetch/role-wise?role=Employee"; // Assuming 'Employee' is the desired role
const DOCUMENT_VIEW_URL_BASE = "http://localhost:8080/api/user/document";


// Select Options
const WEIGHT_TYPE_OPTIONS = [
  { value: "", label: "Select Weight Type" },
  { value: "KG", label: "KG" },
  { value: "Ton", label: "Ton" },
  { value: "Package", label: "Package" },
  { value: "Gram", label: "Gram" },
];

const RATE_AS_PER_OPTIONS = [
  { value: "", label: "Select Rate As Per" },
  { value: "KG", label: "KG" },
  { value: "Ton", label: "Ton" },
  { value: "Package", label: "Package" },
  { value: "Gram", label: "Gram" },
];

const GST_APPLICABLE_OPTIONS = [
  { value: "", label: "Select GST Applicable" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "Select Payment Status" },
  { value: "Paid", label: "Paid" },
  { value: "Advance", label: "Advance" },
  { value: "To be Pay", label: "To be Pay" }, // Consider "To Be Paid" or "Unpaid" for clarity
  { value: "Pending", label: "Pending" },
];


// Initial states for forms
const initialItemDetailState = {
  itemNameDetails: "",
  itemQuantity: "",
  actualWeight: "",
  grossWeight: "",
  weightType: "",
  rateAsPer: "",
  clientTripId: "", // Will be set from bookingId
};

const initialTripChargesDetailState = {
  additionalCharges: "",
  serviceCharges: "",
  pickupDropCharges: "",
  otherCharges: "",
  gstApplicable: "",
  gstNumber: "",
  cgstRate: "",
  sgstRate: "",
  clientTripId: "", // Will be set from bookingId
};

const initialTripPriceDetailState = {
  rate: "",
  totalAmount: "",
  advanceAmount: "",
  receivedAmount: "",
  dueAmount: "",
  paymentStatus: "",
  clientTripId: "", // Will be set from bookingId
};


const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Modal visibility states
  const [modalStates, setModalStates] = useState({
    document: false,
    addEmployee: false,
    addVehicle: false,
    addItem: false,
    addTripCharges: false,
    addTripPrice: false,
    viewReceipt: false,
  });

  // Form data states
  const [employeeIdToAdd, setEmployeeIdToAdd] = useState("");
  const [vehicleIdToAdd, setVehicleIdToAdd] = useState("");
  const [itemDetail, setItemDetail] = useState(initialItemDetailState);
  const [tripChargesDetail, setTripChargesDetail] = useState(initialTripChargesDetailState);
  const [tripPriceDetail, setTripPriceDetail] = useState(initialTripPriceDetailState);

  // Submission states for modals
  const [isSubmitting, setIsSubmitting] = useState({
    employee: false,
    vehicle: false,
    item: false,
    tripCharges: false,
    tripPrice: false,
  });

  const [allEmployees, setAllEmployees] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [selectedReceiptDoc, setSelectedReceiptDoc] = useState("");

  // --- API Call Functions ---
  const retrieveBookingDetailsAPI = useCallback(async (id) => {
    return axios.get(`${API_BASE_URL}/fetch?bookingId=${id}`);
  }, []);

  const retrieveAllVehiclesAPI = useCallback(async () => {
    return axios.get(VEHICLE_API_URL); // Add headers if auth is needed
  }, []);

  const retrieveAllUsersAPI = useCallback(async () => {
    return axios.get(USER_API_URL); // Add headers if auth is needed
  }, []);

  // --- Data Fetching ---
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [bookingRes, vehiclesRes, usersRes] = await Promise.all([
        retrieveBookingDetailsAPI(bookingId),
        retrieveAllVehiclesAPI(),
        retrieveAllUsersAPI(),
      ]);

      if (bookingRes.data?.booking) {
        setBooking(bookingRes.data.booking);
        // Set clientTripId for forms
        const currentBookingId = bookingRes.data.booking.id || bookingId; // Prefer ID from fetched booking
        setItemDetail(prev => ({ ...prev, clientTripId: currentBookingId }));
        setTripChargesDetail(prev => ({ ...prev, clientTripId: currentBookingId }));
        setTripPriceDetail(prev => ({ ...prev, clientTripId: currentBookingId }));

      } else {
        throw new Error("Booking data not found.");
      }
      setAllVehicles(vehiclesRes.data?.vehicles || []);
      setAllEmployees(usersRes.data?.users || []);

    } catch (error) {
      console.error("Error fetching initial data:", error);
      setFetchError(error.response?.data?.responseMessage || error.message || "Failed to load data.");
      toast.error(fetchError || "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, retrieveBookingDetailsAPI, retrieveAllVehiclesAPI, retrieveAllUsersAPI, fetchError]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]); // bookingId is a dependency of fetchInitialData

  // --- Modal Handlers ---
  const handleModalShow = useCallback((modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const handleModalClose = useCallback((modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: false }));
    if (modalName === 'viewReceipt') setSelectedReceiptDoc("");
  }, []);

  const showReceiptDocModal = useCallback((docFileName) => {
    setSelectedReceiptDoc(docFileName);
    handleModalShow('viewReceipt');
  }, [handleModalShow]);


  // --- Form Input Handlers ---
  const createFormInputHandler = useCallback((setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleItemInput = createFormInputHandler(setItemDetail);
  const handleTripChargesInput = createFormInputHandler(setTripChargesDetail);
  const handleTripPriceInput = createFormInputHandler(setTripPriceDetail);


  // --- Generic Submit Handler ---
  const handleGenericSubmit = useCallback(async (
    submitType,
    url,
    payload,
    method = "PUT",
    isQueryParam = false
  ) => {
    setIsSubmitting(prev => ({ ...prev, [submitType]: true }));
    try {
      const config = {
        method,
        url,
        headers: {
          "Accept": "application/json",
          // "Content-Type": isQueryParam ? undefined : "application/json", // Axios handles FormData content type
          // Authorization: "Bearer YOUR_TOKEN_HERE", // Add token if needed
        },
      };

      if (isQueryParam) {
        // For query params, URL is already constructed. No data body.
      } else if (payload instanceof FormData) {
        config.data = payload;
         config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.data = payload;
        config.headers["Content-Type"] = "application/json";
      }
      
      const result = await axios(config);
      const res = result.data;

      if (res.success) {
        toast.success(res.responseMessage || "Operation successful!");
        handleModalClose(`add${submitType.charAt(0).toUpperCase() + submitType.slice(1)}`); // e.g., addEmployee
        fetchInitialData(); // Re-fetch booking details to show updates
      } else {
        toast.error(res.responseMessage || "Operation failed.");
      }
    } catch (error) {
      console.error(`Error submitting ${submitType}:`, error);
      toast.error(error.response?.data?.responseMessage || `Failed to submit ${submitType}.`);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [submitType]: false }));
    }
  }, [fetchInitialData, handleModalClose]);


  // --- Specific Submit Handlers ---
  const handleEmployeeAddSubmit = useCallback((e) => {
    e.preventDefault();
    if (!employeeIdToAdd) {
      toast.warn("Please select an employee.");
      return;
    }
    const url = `${API_BASE_URL}/employee/add?bookingId=${bookingId}&employeeId=${employeeIdToAdd}`;
    handleGenericSubmit("employee", url, null, "PUT", true);
  }, [bookingId, employeeIdToAdd, handleGenericSubmit]);

  const handleVehicleAddSubmit = useCallback((e) => {
    e.preventDefault();
    if (!vehicleIdToAdd) {
      toast.warn("Please select a vehicle.");
      return;
    }
    const url = `${API_BASE_URL}/vehicle/add?bookingId=${bookingId}&vehicleId=${vehicleIdToAdd}`;
    handleGenericSubmit("vehicle", url, null, "PUT", true);
  }, [bookingId, vehicleIdToAdd, handleGenericSubmit]);

  const handleItemFormSubmit = useCallback((e) => {
    e.preventDefault();
    handleGenericSubmit("item", `${API_BASE_URL}/item/add`, itemDetail);
  }, [itemDetail, handleGenericSubmit]);

  const handleTripChargesFormSubmit = useCallback((e) => {
    e.preventDefault();
    const payload = { ...tripChargesDetail };
    if (payload.gstApplicable === "No") {
        payload.gstNumber = "";
        payload.cgstRate = "";
        payload.sgstRate = "";
    }
    handleGenericSubmit("tripCharges", `${API_BASE_URL}/trip/charges/add`, payload);
  }, [tripChargesDetail, handleGenericSubmit]);

  const handleTripPriceFormSubmit = useCallback((e) => {
    e.preventDefault();
    handleGenericSubmit("tripPrice", `${API_BASE_URL}/price/detail/add`, tripPriceDetail);
  }, [tripPriceDetail, handleGenericSubmit]);


  // --- Navigation and Other Actions ---
  const updateBookingDetails = useCallback(() => {
    navigate(`/admin/booking/${bookingId}/update`, { state: booking });
  }, [navigate, bookingId, booking]);

  const updateBookingDocument = useCallback(() => {
    navigate("/admin/booking/document/update", { state: booking });
  }, [navigate, booking]);

  const downloadInvoicePDF = useCallback(async (e) => {
    e.preventDefault();
    toast.info("Generating invoice...", { autoClose: 2000 });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/generate/invoice?bookingId=${bookingId}`,
        {
          responseType: 'blob', // Important for handling binary data
          headers: {
            Accept: "application/pdf",
            // Authorization: "Bearer YOUR_TOKEN_HERE", // Add token
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(error.response?.data?.message || "Failed to download invoice.");
    }
  }, [bookingId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(parseInt(timestamp));
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString();
  };


  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading booking details...</p>
      </Container>
    );
  }

  if (fetchError || !booking) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{fetchError || "Booking details could not be loaded."}</p>
          <Button onClick={fetchInitialData} variant="primary">Try Again</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3 mb-5">
      <Card className="form-card shadow-lg">
        <Card.Header
          className="custom-bg-text text-center bg-color"
          style={{ borderRadius: "1em", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <h2 className="mb-0">Booking Details</h2>
        </Card.Header>
        <Card.Body>
          {/* Basic Information & Payment/Status */}
          <Row>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Basic Information</h5>
              <p><strong>Trip Name:</strong> {booking.name}</p>
              <p><strong>Added Date:</strong> {formatDate(booking.addedDateTime)}</p>
              <p><strong>Start Time:</strong> {formatDate(booking.startDateTime)}</p>
              <p><strong>Vendor Name:</strong> {booking.vendorName}</p>
              <p><strong>Starting Odometer:</strong> {booking.startKm}</p>
              <p><strong>Ending Odometer:</strong> {booking.closeKm}</p>
              <p><strong>Delivery Time:</strong> {formatDate(booking.deliveredDateTime)}</p>
              <p><strong>Delivery Status:</strong> {booking.deliveryStatus}</p>
              <p>
                <strong>Document:</strong>
                <Button
                  variant="info"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleModalShow('document')}
                >
                  View Document
                </Button>
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Payment and Status</h5>
              <p><strong>Distance Traveled:</strong> {booking.totalKm}</p>
              <p><strong>Transportation Mode:</strong> {booking.transportationMode}</p>
              <p><strong>Paid By:</strong> {booking.paidBy}</p>
              <p><strong>Payment Paid By:</strong> {booking.paymentPaidBy}</p>
              <p><strong>Tax Paid By:</strong> {booking.taxPaidBy}</p>
              <p><strong>Invoice Name:</strong> {booking.invoiceName}</p>
              <p><strong>Invoice Number:</strong> {booking.invoiceNumber}</p>
              <p><strong>Payment Due Date:</strong> {booking.paymentDueDate ? new Date(booking.paymentDueDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </Col>
          </Row>

          {/* Client Details */}
          <Row>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">From Client (Consignor)</h5>
              <p><strong>Name:</strong> {booking.fromClient?.name || 'N/A'}</p>
              <p><strong>Contact No:</strong> {booking.fromClient?.contactNumber || 'N/A'}</p>
              <p><strong>GST No:</strong> {booking.fromClient?.gstNumber || 'N/A'}</p>
            </Col>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">To Client (Consignee)</h5>
              <p><strong>Name:</strong> {booking.toClient?.name || 'N/A'}</p>
              <p><strong>Contact No:</strong> {booking.toClient?.contactNumber || 'N/A'}</p>
              <p><strong>GST No:</strong> {booking.toClient?.gstNumber || 'N/A'}</p>
            </Col>
          </Row>

          {/* Station Details */}
          <Row>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Booking Point Station</h5>
              <p><strong>City:</strong> {booking.bookingPointStation?.city || 'N/A'}</p>
              <p><strong>State:</strong> {booking.bookingPointStation?.state || 'N/A'}</p>
              <p><strong>Address:</strong> {booking.bookingPointStation?.fullAddress || 'N/A'}</p>
            </Col>
            <Col md={6} className="mb-3">
              <h5 className="text-primary">Delivery Point Station</h5>
              <p><strong>City:</strong> {booking.deliveryPointStation?.city || 'N/A'}</p>
              <p><strong>State:</strong> {booking.deliveryPointStation?.state || 'N/A'}</p>
              <p><strong>Address:</strong> {booking.deliveryPointStation?.fullAddress || 'N/A'}</p>
            </Col>
          </Row>

          {/* Vehicles Table */}
          <h5 className="text-primary mt-3">Vehicles Used</h5>
          {booking.vehicles && booking.vehicles.length > 0 ? (
            <Table striped bordered hover responsive size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Vehicle Name</th>
                  <th>Company Name</th>
                  <th>Registration No</th>
                  <th>Passing Type</th>
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
            </Table>
          ) : <p>No vehicles assigned.</p>}

          {/* Employees Table */}
          <h5 className="text-primary mt-3">Employees Involved</h5>
          {booking.employees && booking.employees.length > 0 ? (
            <Table striped bordered hover responsive size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>PAN No</th>
                  <th>Role</th>
                  <th>Aadhar No</th>
                  <th>License No</th>
                </tr>
              </thead>
              <tbody>
                {booking.employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.phoneNo}</td>
                    <td>{emp.emailId}</td>
                    <td>{emp.employee?.panNumber || 'N/A'}</td>
                    <td>{emp.employee?.role || 'N/A'}</td>
                    <td>{emp.employee?.aadharNumber || 'N/A'}</td>
                    <td>{emp.employee?.licenseNumber || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <p>No employees assigned.</p>}
          
          {/* Item Details Table */}
          <h5 className="text-primary mt-3">Item Details</h5>
          {booking.itemDetails && booking.itemDetails.length > 0 ? (
            <Table striped bordered hover responsive size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Actual Weight</th>
                  <th>Gross Weight</th>
                  <th>Weight Type</th>
                  <th>Rate As Per</th>
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
            </Table>
          ) : <p>No item details present.</p>}

          {/* Charges Details Table */}
          <h5 className="text-primary mt-3">Charges Details</h5>
          {booking.chargesDetails ? (
            <Table striped bordered hover responsive size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Additional Charges</th>
                  <th>Service Charges</th>
                  <th>Pickup/Drop Charges</th>
                  <th>Other Charges</th>
                  <th>GST Applicable</th>
                  <th>GST Number</th>
                  <th>CGST Rate</th>
                  <th>SGST Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{booking.chargesDetails.additionalCharges}</td>
                  <td>{booking.chargesDetails.serviceCharges}</td>
                  <td>{booking.chargesDetails.pickupDropCharges}</td>
                  <td>{booking.chargesDetails.otherCharges}</td>
                  <td>{booking.chargesDetails.gstApplicable}</td>
                  <td>{booking.chargesDetails.gstNumber || 'N/A'}</td>
                  <td>{booking.chargesDetails.cgstRate ? `${booking.chargesDetails.cgstRate}%` : 'N/A'}</td>
                  <td>{booking.chargesDetails.sgstRate ? `${booking.chargesDetails.sgstRate}%` : 'N/A'}</td>
                </tr>
              </tbody>
            </Table>
          ) : <p>No charges details present.</p>}

          {/* Price Details Table */}
          <h5 className="text-primary mt-3">Price Details</h5>
          {booking.priceDetails ? (
            <Table striped bordered hover responsive size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Rate</th>
                  <th>Total Amount</th>
                  <th>Advance Amount</th>
                  <th>Received Amount</th>
                  <th>Due Amount</th>
                  <th>Payment Status</th>
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
            </Table>
          ) : <p>No price details present.</p>}
          
          {/* Fuel Expenses Table */}
          <h5 className="text-primary mt-3">Fuel Expenses</h5>
          {booking.fuelExpenses && booking.fuelExpenses.length > 0 ? (
            <Table striped bordered hover responsive size="sm" className="mb-3">
               <thead>
                <tr>
                  <th>Expense Time</th>
                  <th>Fuel Type</th>
                  <th>Vendor</th>
                  <th>Start Km</th>
                  <th>Current Km</th>
                  <th>Litres</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Details</th>
                  <th>Receipt</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {booking.fuelExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.expenseTime)}</td>
                    <td>{expense.fuelType}</td>
                    <td>{expense.vendorName}</td>
                    <td>{expense.startingKm}</td>
                    <td>{expense.currentKm}</td>
                    <td>{expense.filledLitre}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.paymentMode}</td>
                    <td>{expense.paymentDetails}</td>
                    <td>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => showReceiptDocModal(expense.receiptUpload)}
                      >
                        View
                      </Button>
                    </td>
                    <td>{expense.remark}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <p>No fuel expenses recorded.</p>}

          {/* Other Expenses Table */}
          <h5 className="text-primary mt-3">Other Expenses</h5>
          {booking.otherExpenses && booking.otherExpenses.length > 0 ? (
            <Table striped bordered hover responsive size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>City</th>
                  <th>Pin</th>
                  <th>State</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {booking.otherExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.expenseTime)}</td>
                    <td>{expense.vendorName}</td>
                    <td>{expense.expenseType}</td>
                    <td>{expense.locationDetails}</td>
                    <td>{expense.city}</td>
                    <td>{expense.pinCode}</td>
                    <td>{expense.state}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.paymentMode}</td>
                    <td>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => showReceiptDocModal(expense.receiptUpload)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <p>No other expenses recorded.</p>}

        </Card.Body>
        <Card.Footer>
          <div className="d-flex flex-wrap justify-content-center mt-3">
            <Button variant="primary" className="m-2" onClick={() => handleModalShow('addEmployee')}>Add Employee</Button>
            <Button variant="primary" className="m-2" onClick={() => handleModalShow('addVehicle')}>Add Vehicle</Button>
            <Button variant="primary" className="m-2" onClick={() => handleModalShow('addItem')}>Add Item</Button>
            {(!booking.chargesDetails || Object.keys(booking.chargesDetails).length === 0) && (
              <Button variant="primary" className="m-2" onClick={() => handleModalShow('addTripCharges')}>Add Trip Charges</Button>
            )}
            {(!booking.priceDetails || Object.keys(booking.priceDetails).length === 0) && (
              <Button variant="primary" className="m-2" onClick={() => handleModalShow('addTripPrice')}>Add Trip Price</Button>
            )}
            <Button variant="secondary" className="m-2" onClick={updateBookingDetails}>Update Booking Details</Button>
            <Button variant="secondary" className="m-2" onClick={updateBookingDocument}>Update Booking Document</Button>
            <Button variant="success" className="m-2" onClick={downloadInvoicePDF}>Download Invoice PDF</Button>
          </div>
        </Card.Footer>
      </Card>

      {/* --- Modals --- */}
      {/* Document Preview Modal */}
      <Modal show={modalStates.document} onHide={() => handleModalClose('document')} fullscreen>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Document Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
          {booking.document ? (
            <iframe
              src={`${DOCUMENT_VIEW_URL_BASE}/${booking.document}/view`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Document Preview"
            />
          ) : <p>No document available for this booking.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleModalClose('document')}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Receipt Preview Modal */}
      <Modal show={modalStates.viewReceipt} onHide={() => handleModalClose('viewReceipt')} fullscreen>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Receipt Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
          {selectedReceiptDoc ? (
            <iframe
              src={`${DOCUMENT_VIEW_URL_BASE}/${selectedReceiptDoc}/view`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Receipt Preview"
            />
          ) : <p>No receipt selected or available.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleModalClose('viewReceipt')}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Employee Modal */}
      <Modal show={modalStates.addEmployee} onHide={() => handleModalClose('addEmployee')}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add Employee to Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEmployeeAddSubmit}>
            <Form.Group className="mb-3" controlId="formEmployeeSelect">
              <Form.Label><b>Select Employee</b></Form.Label>
              <Form.Select
                name="employeeIdToAdd"
                value={employeeIdToAdd}
                onChange={(e) => setEmployeeIdToAdd(e.target.value)}
                required
              >
                <option value="">-- Select Employee --</option>
                {allEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} [{emp.employee?.role || 'N/A'}]
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting.employee}>
              {isSubmitting.employee ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Add Employee'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal show={modalStates.addVehicle} onHide={() => handleModalClose('addVehicle')}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add Vehicle to Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleVehicleAddSubmit}>
            <Form.Group className="mb-3" controlId="formVehicleSelect">
              <Form.Label><b>Select Vehicle</b></Form.Label>
              <Form.Select
                name="vehicleIdToAdd"
                value={vehicleIdToAdd}
                onChange={(e) => setVehicleIdToAdd(e.target.value)}
                required
              >
                <option value="">-- Select Vehicle --</option>
                {allVehicles.map((veh) => (
                  <option key={veh.id} value={veh.id}>
                    {veh.name} [{veh.vehicleNumber}] - {veh.passingType}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting.vehicle}>
              {isSubmitting.vehicle ? <Spinner as="span" animation="border" size="sm" /> : 'Add Vehicle'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Item Modal */}
      <Modal show={modalStates.addItem} onHide={() => handleModalClose('addItem')}>
        <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Add Item Detail</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleItemFormSubmit}>
            <Form.Group className="mb-3" controlId="itemNameDetails"><Form.Label>Item Name/Details</Form.Label><Form.Control type="text" name="itemNameDetails" value={itemDetail.itemNameDetails} onChange={handleItemInput} required /></Form.Group>
            <Form.Group className="mb-3" controlId="itemQuantity"><Form.Label>Quantity</Form.Label><Form.Control type="number" name="itemQuantity" value={itemDetail.itemQuantity} onChange={handleItemInput} required /></Form.Group>
            <Form.Group className="mb-3" controlId="actualWeight"><Form.Label>Actual Weight</Form.Label><Form.Control type="number" step="any" name="actualWeight" value={itemDetail.actualWeight} onChange={handleItemInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="grossWeight"><Form.Label>Gross Weight</Form.Label><Form.Control type="number" step="any" name="grossWeight" value={itemDetail.grossWeight} onChange={handleItemInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="weightType"><Form.Label>Weight Type</Form.Label><Form.Select name="weightType" value={itemDetail.weightType} onChange={handleItemInput}>{WEIGHT_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group>
            <Form.Group className="mb-3" controlId="rateAsPer"><Form.Label>Rate As Per</Form.Label><Form.Select name="rateAsPer" value={itemDetail.rateAsPer} onChange={handleItemInput}>{RATE_AS_PER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting.item}>{isSubmitting.item ? <Spinner as="span" animation="border" size="sm" /> : 'Add Item'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Trip Charges Modal */}
      <Modal show={modalStates.addTripCharges} onHide={() => handleModalClose('addTripCharges')}>
        <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Add Trip Charges</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTripChargesFormSubmit}>
            <Form.Group className="mb-3" controlId="additionalCharges"><Form.Label>Additional Charges</Form.Label><Form.Control type="number" step="any" name="additionalCharges" value={tripChargesDetail.additionalCharges} onChange={handleTripChargesInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="serviceCharges"><Form.Label>Service Charges</Form.Label><Form.Control type="number" step="any" name="serviceCharges" value={tripChargesDetail.serviceCharges} onChange={handleTripChargesInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="pickupDropCharges"><Form.Label>Pickup/Drop Charges</Form.Label><Form.Control type="number" step="any" name="pickupDropCharges" value={tripChargesDetail.pickupDropCharges} onChange={handleTripChargesInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="otherCharges"><Form.Label>Other Charges</Form.Label><Form.Control type="number" step="any" name="otherCharges" value={tripChargesDetail.otherCharges} onChange={handleTripChargesInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="gstApplicableCharges"><Form.Label>GST Applicable</Form.Label><Form.Select name="gstApplicable" value={tripChargesDetail.gstApplicable} onChange={handleTripChargesInput}>{GST_APPLICABLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group>
            {tripChargesDetail.gstApplicable === "Yes" && (
              <>
                <Form.Group className="mb-3" controlId="gstNumberCharges"><Form.Label>GST Number</Form.Label><Form.Control type="text" name="gstNumber" value={tripChargesDetail.gstNumber} onChange={handleTripChargesInput} /></Form.Group>
                <Form.Group className="mb-3" controlId="cgstRateCharges"><Form.Label>CGST Rate (%)</Form.Label><Form.Control type="number" step="any" name="cgstRate" value={tripChargesDetail.cgstRate} onChange={handleTripChargesInput} /></Form.Group>
                <Form.Group className="mb-3" controlId="sgstRateCharges"><Form.Label>SGST Rate (%)</Form.Label><Form.Control type="number" step="any" name="sgstRate" value={tripChargesDetail.sgstRate} onChange={handleTripChargesInput} /></Form.Group>
              </>
            )}
            <Button variant="primary" type="submit" disabled={isSubmitting.tripCharges}>{isSubmitting.tripCharges ? <Spinner as="span" animation="border" size="sm" /> : 'Add Charges'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Trip Price Modal */}
      <Modal show={modalStates.addTripPrice} onHide={() => handleModalClose('addTripPrice')}>
        <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Add Trip Price</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTripPriceFormSubmit}>
            <Form.Group className="mb-3" controlId="ratePrice"><Form.Label>Rate</Form.Label><Form.Control type="number" step="any" name="rate" value={tripPriceDetail.rate} onChange={handleTripPriceInput} required /></Form.Group>
            <Form.Group className="mb-3" controlId="totalAmountPrice"><Form.Label>Total Amount</Form.Label><Form.Control type="number" step="any" name="totalAmount" value={tripPriceDetail.totalAmount} onChange={handleTripPriceInput} required /></Form.Group>
            <Form.Group className="mb-3" controlId="advanceAmountPrice"><Form.Label>Advance Amount</Form.Label><Form.Control type="number" step="any" name="advanceAmount" value={tripPriceDetail.advanceAmount} onChange={handleTripPriceInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="receivedAmountPrice"><Form.Label>Received Amount</Form.Label><Form.Control type="number" step="any" name="receivedAmount" value={tripPriceDetail.receivedAmount} onChange={handleTripPriceInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="dueAmountPrice"><Form.Label>Due Amount</Form.Label><Form.Control type="number" step="any" name="dueAmount" value={tripPriceDetail.dueAmount} onChange={handleTripPriceInput} /></Form.Group>
            <Form.Group className="mb-3" controlId="paymentStatusPrice"><Form.Label>Payment Status</Form.Label><Form.Select name="paymentStatus" value={tripPriceDetail.paymentStatus} onChange={handleTripPriceInput} required>{PAYMENT_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting.tripPrice}>{isSubmitting.tripPrice ? <Spinner as="span" animation="border" size="sm" /> : 'Add Price'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
};

export default BookingDetail;


import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Form, Card, Container, Row, Col, Spinner, Alert, Table } from "react-bootstrap";

// Image imports (assuming they are correctly placed in src/images)
import revenue_pic from "../images/revenue.png";
import salaryicon from "../images/salary_mng.png";
import totalbookings from "../images/totalbookings.png";
import newbookings from "../images/newbookings.png";
import newbookingsamount from "../images/newbookingamount.png";
import totalvehicles from "../images/vehicles.png";
import stoppedvehicle from "../images/stopped truck.png";
import runningvehicles from "../images/running trucks.png";
import notifications from "../images/notifications.png";
import newdueamount from "../images/newdueamount.png";
import totaldueamount from "../images/totaldueamounts.png";
import fuelexpenses from "../images/fuelexpenses.png";
import otherexpenses from "../images/otherexpenses.png";
import total_expenses from "../images/total_expenses.png";
import warehouse_icon from "../images/warehouse.png"; // Renamed for clarity
import totalProducts_icon from "../images/total_products.png"; // Renamed for clarity
import lowStock_icon from "../images/low_stock.png"; // Renamed for clarity
import outOfStock_icon from "../images/out_of_stock.png"; // Renamed for clarity

import DashboardBookings from "./DashboardBookings"; // Assuming this component exists

// API URLs
const API_BASE_URL_TRANSPORT = "http://localhost:8080/api/transport/client/booking";
const API_DASHBOARD_DATA = `${API_BASE_URL_TRANSPORT}/admin/dashboard`;
const API_WAREHOUSES = "http://localhost:8080/api/warehouses";
const API_ITEMS = "http://localhost:8080/api/items";
const API_BOOKINGS_BY_DATE = `${API_BASE_URL_TRANSPORT}/search/date-time`;
const API_TODAYS_BOOKINGS = `${API_BASE_URL_TRANSPORT}/todays`;
const API_MARK_NOTIFICATION_READ = `${API_BASE_URL_TRANSPORT}/dashboard/alert/read`;

const initialDashboardDataState = {
  tripDetails: [],
  alertNotifications: [],
  totalVehicle: 0,
  runningVehicle: 0,
  stoppedVehicle: 0,
  totalAlertNotification: 0,
  totalBookedOrder: 0,
  todayNewBooking: 0,
  totalAmountBooked: 0,
  totalNewBookedAmount: 0,
  totalDueAmount: 0,
  totalNewDueAmount: 0,
  todaysFuelExpense: 0,
  todaysOtherExpense: 0,
  todaysSalaryPaid: 0,
  todaysTotalExpense: 0,
};

const initialWarehouseDataState = {
  totalWarehouses: 0,
  totalProducts: 0,
  lowStockItems: 0,
  outOfStockItems: 0,
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(initialDashboardDataState);
  const [filteredTripDetails, setFilteredTripDetails] = useState([]);
  const [warehouseData, setWarehouseData] = useState(initialWarehouseDataState);

  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleNotificationModalClose = () => setShowNotificationModal(false);
  const handleNotificationModalShow = () => setShowNotificationModal(true);

  const convertToMillis = useCallback((dateTimeStr) => {
    if (!dateTimeStr) return null;
    const date = new Date(dateTimeStr);
    return date.getTime();
  }, []);

  // --- API Call Functions ---
  const fetchDashboardDataAPI = useCallback(async () => {
    return axios.get(API_DASHBOARD_DATA); // Add auth headers if needed
  }, []);

  const fetchWarehouseStatsAPI = useCallback(async () => {
    const [warehousesRes, itemsRes] = await Promise.all([
      axios.get(API_WAREHOUSES), // Add auth headers if needed
      axios.get(API_ITEMS),       // Add auth headers if needed
    ]);

    const warehouses = warehousesRes.data || [];
    const items = itemsRes.data || [];

    const lowStockCount = items.filter(item => item.quantityInStock > 0 && item.quantityInStock < 100).length;
    const outOfStockCount = items.filter(item => item.quantityInStock === 0).length;

    return {
      totalWarehouses: warehouses.length,
      totalProducts: items.length,
      lowStockItems: lowStockCount,
      outOfStockItems: outOfStockCount,
    };
  }, []);

  const fetchAllInitialData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [dashboardRes, warehouseRes] = await Promise.all([
        fetchDashboardDataAPI(),
        fetchWarehouseStatsAPI(),
      ]);

      if (dashboardRes.data) {
        setDashboardData(prev => ({ ...prev, ...dashboardRes.data }));
        // Assuming initial trip details might come with dashboard data or should be fetched separately
        setFilteredTripDetails(dashboardRes.data.tripDetails || []);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }

      setWarehouseData(warehouseRes);

    } catch (error) {
      console.error("Error fetching initial data:", error);
      const errMsg = error.response?.data?.responseMessage || error.message || "Failed to load initial data.";
      setFetchError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardDataAPI, fetchWarehouseStatsAPI]);

  useEffect(() => {
    fetchAllInitialData();
  }, [fetchAllInitialData]);

  const handleFilterBookingsByDate = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!startTime || !endTime) {
      toast.warn("Please select both start and end time.");
      return;
    }
    setIsFiltering(true);
    try {
      const response = await axios.get(API_BOOKINGS_BY_DATE, {
        params: {
          startTime: convertToMillis(startTime),
          endTime: convertToMillis(endTime),
        },
        // headers: { Authorization: "Bearer YOUR_TOKEN" } // Add auth
      });
      if (response.data?.success) {
        setFilteredTripDetails(response.data.tripDetails || []);
        toast.success("Bookings filtered successfully.");
      } else {
        toast.error(response.data?.responseMessage || "Failed to filter bookings.");
      }
    } catch (error) {
      console.error("Error filtering bookings:", error);
      toast.error(error.response?.data?.responseMessage || "Error filtering bookings.");
    } finally {
      setIsFiltering(false);
    }
  }, [startTime, endTime, convertToMillis]);

  const handleFetchTodaysBookings = useCallback(async () => {
    setIsFiltering(true);
    try {
      const response = await axios.get(API_TODAYS_BOOKINGS); // Add auth
      if (response.data?.success) {
        setFilteredTripDetails(response.data.tripDetails || []);
        toast.success("Fetched today's bookings.");
      } else {
        toast.error(response.data?.responseMessage || "Failed to fetch today's bookings.");
      }
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      toast.error(error.response?.data?.responseMessage || "Error fetching today's bookings.");
    } finally {
      setIsFiltering(false);
    }
  }, []);

  const handleMarkNotificationAsRead = useCallback(async (alertId) => {
    try {
      const response = await axios.get(API_MARK_NOTIFICATION_READ, {
        params: { alertId },
        // headers: { Authorization: "Bearer YOUR_TOKEN" } // Add auth
      });
      if (response.data?.success) {
        toast.success(response.data.responseMessage || "Notification marked as read.");
        // Re-fetch dashboard data to update notification list and count
        const updatedDashboardData = await fetchDashboardDataAPI();
        if (updatedDashboardData.data) {
            setDashboardData(prev => ({...prev, ...updatedDashboardData.data}));
        }
      } else {
        toast.error(response.data?.responseMessage || "Failed to mark notification as read.");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(error.response?.data?.responseMessage || "Error marking notification.");
    }
  }, [fetchDashboardDataAPI]);


  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Loading Dashboard...</p>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Dashboard</h4>
          <p>{fetchError}</p>
          <Button onClick={fetchAllInitialData}>Try Again</Button>
        </Alert>
      </Container>
    );
  }

  const DashboardCard = ({ imgSrc, title, value, unit = "" }) => (
    <Col md={3} className="mb-3">
      <Card className="rounded-card shadow-lg h-100">
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={3} className="text-center">
              <img src={imgSrc} alt={title} style={{ width: "50px", height: "auto" }} />
            </Col>
            <Col xs={9} style={{ whiteSpace: "nowrap" }}>
              <h3>{value !== undefined && value !== null ? `${unit}${value}` : 'N/A'}{title.includes("Amount") || title.includes("Expense") ? "/-" : ""}</h3>
              <div className="text-muted">{title}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
  
  const NotificationCard = ({ imgSrc, title, value, onClick }) => (
     <Col md={3} className="mb-3">
      <Card className="rounded-card shadow-lg h-100" onClick={onClick} style={{ cursor: "pointer" }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={3} className="text-center">
              <img src={imgSrc} alt={title} style={{ width: "50px", height: "auto" }} />
            </Col>
            <Col xs={9} style={{ whiteSpace: "nowrap" }}>
              <h3>{value !== undefined && value !== null ? value : 'N/A'}</h3>
              <div className="text-muted">{title}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );


  return (
    <Container fluid className="mt-3 mb-5">
      <div className="text-center text-color mb-4">
        <h2>Dashboard</h2>
      </div>

      <Row>
        <DashboardCard imgSrc={totalvehicles} title="Total Vehicles" value={dashboardData.totalVehicle} />
        <DashboardCard imgSrc={runningvehicles} title="Running Vehicles" value={dashboardData.runningVehicle} />
        <DashboardCard imgSrc={stoppedvehicle} title="Stopped Vehicles" value={dashboardData.stoppedVehicle} />
        <NotificationCard imgSrc={notifications} title="Alert Notifications" value={dashboardData.totalAlertNotification} onClick={handleNotificationModalShow} />
      </Row>

      <Row>
        <DashboardCard imgSrc={warehouse_icon} title="Total Warehouses" value={warehouseData.totalWarehouses} />
        <DashboardCard imgSrc={totalProducts_icon} title="Total Products" value={warehouseData.totalProducts} />
        <DashboardCard imgSrc={lowStock_icon} title="Low Stock Items" value={warehouseData.lowStockItems} />
        <DashboardCard imgSrc={outOfStock_icon} title="Out of Stock Items" value={warehouseData.outOfStockItems} />
      </Row>

      <Row>
        <DashboardCard imgSrc={totalbookings} title="Total Booked Orders" value={dashboardData.totalBookedOrder} />
        <DashboardCard imgSrc={newbookings} title="Today's New Bookings" value={dashboardData.todayNewBooking} />
        <DashboardCard imgSrc={revenue_pic} title="Total Booked Amount" value={dashboardData.totalAmountBooked} unit="₫" />
        <DashboardCard imgSrc={newbookingsamount} title="Today's New Booked Amount" value={dashboardData.totalNewBookedAmount} unit="₫" />
      </Row>

      <Row>
        <DashboardCard imgSrc={totaldueamount} title="Total Due Amount" value={dashboardData.totalDueAmount} unit="₫" />
        <DashboardCard imgSrc={newdueamount} title="Today's New Due Amount" value={dashboardData.totalNewDueAmount} unit="₫" />
        <DashboardCard imgSrc={fuelexpenses} title="Today's Fuel Expense" value={dashboardData.todaysFuelExpense} unit="₫" />
        <DashboardCard imgSrc={otherexpenses} title="Today's Other Expense" value={dashboardData.todaysOtherExpense} unit="₫" />
      </Row>
      
      <Row>
        <DashboardCard imgSrc={salaryicon} title="Today's Salary Paid" value={dashboardData.todaysSalaryPaid} unit="₫" />
        <DashboardCard imgSrc={total_expenses} title="Today's Total Expense" value={dashboardData.todaysTotalExpense} unit="₫" />
         {/* Placeholder for 2 more cards if needed */}
        <Col md={3} />
        <Col md={3} />
      </Row>
      
      {/* Date Filter Section */}
      <Card className="mt-4 mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleFilterBookingsByDate}>
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group controlId="startTime">
                  <Form.Label>Start Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="endTime">
                  <Form.Label>End Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button variant="primary" type="submit" className="w-100" disabled={isFiltering}>
                  {isFiltering ? <Spinner as="span" animation="border" size="sm" /> : "Filter Bookings"}
                </Button>
              </Col>
              <Col md={2}>
                <Button variant="info" onClick={handleFetchTodaysBookings} className="w-100" disabled={isFiltering}>
                  {isFiltering ? <Spinner as="span" animation="border" size="sm" /> : "Today's Bookings"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <DashboardBookings tripDetails={filteredTripDetails} isLoading={isFiltering} />

      <Modal show={showNotificationModal} onHide={handleNotificationModalClose} size="lg">
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>Alert Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dashboardData.alertNotifications && dashboardData.alertNotifications.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Vehicle No.</th>
                  <th>Registration No.</th>
                  <th>Description</th>
                  <th>Last Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.alertNotifications.map((alert) => (
                  <tr key={alert.id}>
                    <td>{alert.vehicleNo}</td>
                    <td>{alert.vehicleRegistrationNo}</td>
                    <td>{alert.description}</td>
                    <td>{new Date(alert.lastDate).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleMarkNotificationAsRead(alert.id)}
                      >
                        Mark Read
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No new notifications.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNotificationModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
};

export default Dashboard;


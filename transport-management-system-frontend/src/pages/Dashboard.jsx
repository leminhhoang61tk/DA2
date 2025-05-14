import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
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

// Thêm biểu tượng cho kho hàng
import warehouse from "../images/warehouse.png";
import totalProducts from "../images/total_products.png";
import lowStock from "../images/low_stock.png";
import outOfStock from "../images/out_of_stock.png";

import DashboardBookings from "./DashboardBookings";
import { Button, Modal, Form } from "react-bootstrap";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [data, setData] = useState({
    tripDetails: [],
    alertNotifications: [],
  });

  const [warehouseData, setWarehouseData] = useState({
    totalWarehouses: 0,
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const getDashboardData = async () => {
      const dashboardData = await retrieveDashboardData();
      if (dashboardData) {
        setData(dashboardData);
      }
    };

    // Lấy dữ liệu kho hàng
    const fetchWarehouseData = async () => {
      try {
        // Gọi API lấy danh sách kho
        const warehousesResponse = await fetch("http://localhost:8080/api/warehouses");
        const warehouses = await warehousesResponse.json();

        // Gọi API lấy danh sách sản phẩm
        const itemsResponse = await fetch("http://localhost:8080/api/items");
        const items = await itemsResponse.json();

        // Đếm số lượng kho và sản phẩm
        const warehouseCount = warehouses.length;
        const productCount = items.length;

        // Đếm số lượng sản phẩm sắp hết hàng (0 < số lượng < 100)
        const lowStockCount = items.filter(item =>
          item.quantityInStock > 0 && item.quantityInStock < 100
        ).length;

        // Đếm số lượng sản phẩm hết hàng (số lượng = 0)
        const outOfStockCount = items.filter(item =>
          item.quantityInStock === 0
        ).length;

        console.log("Tổng số kho:", warehouseCount);
        console.log("Tổng số sản phẩm:", productCount);
        console.log("Sản phẩm sắp hết:", lowStockCount);
        console.log("Sản phẩm hết hàng:", outOfStockCount);

        setWarehouseData({
          totalWarehouses: warehouseCount,
          totalProducts: productCount,
          lowStockItems: lowStockCount,
          outOfStockItems: outOfStockCount
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu kho:", error);
        toast.error("Không thể lấy dữ liệu kho hàng", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    getDashboardData();
    fetchWarehouseData();
  }, []);

  const retrieveDashboardData = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/booking/admin/dashboard"
    );
    return response.data;
  };

  const getBookingsUsingStartTimeAndEndTime = (e) => {
    e.preventDefault();

    fetch(
      "http://localhost:8080/api/transport/client/booking/search/date-time?startTime=" +
      convertToMillis(startTime) +
      "&endTime=" +
      convertToMillis(endTime),
      {
        method: "GET",
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
            setData((prevState) => ({
              ...prevState,
              tripDetails: res.tripDetails,
            }));
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
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 1000);
      });
  };

  const getTodaysBookings = (e) => {
    fetch("http://localhost:8080/api/transport/client/booking/todays", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + admin_jwtToken,
      },
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            data.tripDetails = res.tripDetails;
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
        }, 1000);
      });
  };

  const convertToMillis = (startTime) => {
    if (!startTime) {
      return null; // Handle case where startTime is not provided
    }

    const date = new Date(startTime);
    return date.getTime();
  };

  const markNotificationAsRead = (alertId) => {
    fetch(
      "http://localhost:8080/api/transport/client/booking/dashboard/alert/read?alertId=" +
      alertId,
      {
        method: "GET",
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
            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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
    <div className="container-fluid mt-3 mb-5">
      <div className="container">
        <div className="text-center text-color">
          <h2>Dashboard</h2>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={totalvehicles}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.totalVehicle}</h3>
                    <div className="text-muted">Total Vehicle</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={runningvehicles}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.runningVehicle}</h3>
                    <div className="text-muted">Running Vehicles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={stoppedvehicle}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3>{data.stoppedVehicle}</h3>
                    <div className="text-muted">Stopped Vehicle</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div
              className="card rounded-card shadow-lg"
              onClick={handleShow}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={notifications}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "62px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.totalAlertNotification}</h3>
                    <div className="text-muted">Alert Notification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng mới hiển thị thông tin kho hàng */}
        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={warehouse}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3>{warehouseData.totalWarehouses}</h3>
                    <div className="text-muted">Total number of warehouses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={totalProducts}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3>{warehouseData.totalProducts}</h3>
                    <div className="text-muted">Total product</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={lowStock}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3>{warehouseData.lowStockItems}</h3>
                    <div className="text-muted">Almost out of stock</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={outOfStock}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3>{warehouseData.outOfStockItems}</h3>
                    <div className="text-muted">Out of stock</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={totalbookings}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.totalBookedOrder}</h3>
                    <div className="text-muted">Total Booked Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={newbookings}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.todayNewBooking}</h3>
                    <div className="text-muted">New Bookings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={revenue_pic}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8363; {data.totalAmountBooked}/-</h3>
                    <div className="text-muted">Total Booked Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={newbookingsamount}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "62px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8363; {data.totalNewBookedAmount}/-</h3>
                    <div className="text-muted">New Booked Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={totaldueamount}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8363; {data.totalDueAmount}/-</h3>
                    <div className="text-muted">Total Due Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={newdueamount}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8363; {data.totalNewDueAmount}/-</h3>
                    <div className="text-muted">New Due Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={fuelexpenses}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8363;{data.todaysFuelExpense}/-</h3>
                    <div className="text-muted">Todays Fuel Expense</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={otherexpenses}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3>&#8363; {data.todaysOtherExpense}/-</h3>
                    <div className="text-muted">Todays Other Expense</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={salaryicon}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8363; {data.todaysSalaryPaid}/-</h3>
                    <div className="text-muted">Todays Salary Paid</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={total_expenses}
                      className="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "50px",
                      }}
                    />
                  </div>
                  <div className="col-md-9" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8363; {data.todaysTotalExpense}/-</h3>
                    <div className="text-muted">Todays Total Expense</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DashboardBookings />
      </div>

      <Modal show={showModal} onHide={handleClose} className="modal-lg">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title style={{ borderRadius: "1em" }}>
            Alert Notifications
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Vehicle No.</th>
                  <th scope="col">Registration No.</th>
                  <th scope="col">Description</th>
                  <th scope="col">Last Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.alertNotifications.map((alert) => (
                  <tr key={alert.id}>
                    <td>{alert.vehicleNo}</td>
                    <td>{alert.vehicleRegistrationNo}</td>
                    <td>{alert.description}</td>
                    <td>{alert.lastDate}</td>
                    <td>
                      <button
                        onClick={() => {
                          markNotificationAsRead(alert.id);
                        }}
                        className="btn btn-sm bg-color custom-bg-text ms-2 mt-2"
                      >
                        Mark Read
                      </button>
                      <ToastContainer />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;

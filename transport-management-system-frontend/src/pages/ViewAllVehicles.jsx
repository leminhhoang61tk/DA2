import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewAllVehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [tempVehicleNmber, setTempVehicleNumber] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  let navigate = useNavigate();

  useEffect(() => {
    const getAllVehicles = async () => {
      if (vehicleNumber === "") {
        const vehicleResponse = await retrieveAllVehicles();
        if (vehicleResponse) {
          setVehicles(vehicleResponse.vehicles);
        }
      } else {
        const vehicleResponse = await retrieveAllVehiclesByNumber();
        if (vehicleResponse) {
          setVehicles(vehicleResponse.vehicles);
        }
      }
    };

    getAllVehicles();
  }, [vehicleNumber]);

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

  const retrieveAllVehiclesByNumber = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/vehicle/fetch/vehicle-no-wise?vehicleNo=" +
        vehicleNumber,
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

  const deleteVehicle = (vehicleId, e) => {
    fetch(
      "http://localhost:8080/api/transport/vehicle/delete?vehicleId=" +
        vehicleId,
      {
        method: "DELETE",
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

  const viewVehicleDetails = (vehicleId) => {
    navigate(`/admin/vehicle/${vehicleId}/detail`);
  };

  const searchVehicleByNumber = (e) => {
    e.preventDefault();
    setVehicleNumber(tempVehicleNmber);
    setTempVehicleNumber("");
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
          <h2>All Vehicles</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          {" "}
          <div className="d-flex aligns-items-center justify-content-center mt-3">
            <div className="row">
              <div className="d-flex align-items-end">
                <form className="row g-3 me-2">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control"
                      id="inputPassword2"
                      placeholder="Enter Vehicle Number..."
                      onChange={(e) => setTempVehicleNumber(e.target.value)}
                      style={{
                        width: "350px",
                      }}
                      value={tempVehicleNmber}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn bg-color custom-bg-text mb-3"
                      onClick={searchVehicleByNumber}
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
                  <th scope="col">Vehicle No.</th>
                  <th scope="col">Company Name</th>
                  <th scope="col">Registration No.</th>
                  <th scope="col">Driver’s License</th>
                  <th scope="col">Insurance Expiry Dt.</th>
                  <th scope="col">Permit No.</th>
                  <th scope="col">Permit Expiry Dt.</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => {
                  return (
                    <tr key={vehicle.id}>
                      <td>
                        <b>{vehicle.name}</b>
                      </td>
                      <td>{vehicle.vehicleNumber}</td>
                      <td>{vehicle.companyName}</td>
                      <td>{vehicle.registrationNumber}</td>
                      <td>{vehicle.passingType}</td>
                      <td>{vehicle.expireInsuranceDate}</td>
                      <td>{vehicle.permitNumber}</td>
                      <td>{vehicle.permitExpireDate}</td>

                      <td>
                        <button
                          onClick={() => viewVehicleDetails(vehicle.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          View
                        </button>

                        <button
                          onClick={() => deleteVehicle(vehicle.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2 mt-2"
                        >
                          Delete
                        </button>
                        <ToastContainer />
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

export default ViewAllVehicles;

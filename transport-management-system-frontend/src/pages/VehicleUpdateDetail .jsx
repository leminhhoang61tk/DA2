import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const VehicleUpdateDetail = () => {
  const { vehicleId } = useParams();

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const transporter = JSON.parse(sessionStorage.getItem("active-transporter"));
  const transporter_jwtToken = sessionStorage.getItem("transporter-jwtToken");

  let navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    id: vehicleId,
    name: "",
    vehicleNumber: "",
    companyName: "",
    passingType: "",
    registrationNumber: "",
    insuranceStartDate: "",
    expireInsuranceDate: "",
    smokeTestExpireDate: "",
    permitNumber: "",
    permitExpireDate: "",
    gareBoxExpireDate: "",
    oilChangeDate: "",
    vehiclePurchaseDate: "",
    remark: "",
  });

  useEffect(() => {
    const getVehicle = async () => {
      const fetchVehicle = await retrieveVehicle();
      if (fetchVehicle) {
        setVehicle(fetchVehicle.vehicles[0]);
      }
    };
    getVehicle();

    console.log("vehicle detail after fetch ");
    console.log(vehicle);
  }, [vehicleId]);

  const retrieveVehicle = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/transport/vehicle/fetch?vehicleId=${vehicleId}`
    );
    return response.data;
  };

  const handleInput = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const updateVehicle = (e) => {
    e.preventDefault();
    if (vehicle === null) {
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

    if (vehicle.id === "") {
      toast.error("Vehicle Id is missing!!!", {
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

    fetch("http://localhost:8080/api/transport/vehicle/detail/udpate", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify(vehicle),
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
              navigate(`/admin/vehicle/${vehicle.id}/detail`);
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

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  return (
    <div>
      <div class="mt-2 d-flex aligns-items-center justify-content-center mb-4 ms-3 me-3">
        <div className="card form-card shadow-lg">
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 text-center"
              style={{
                borderRadius: "1em",
                height: "45px",
              }}
            >
              <h5 className="card-title">Add Vehicle</h5>
            </div>
            <div className="card-body text-color">
              <form className="row g-3">
                <div className="col-md-3 mb-3">
                  <label htmlFor="vehicleNumber" className="form-label">
                    <b>Vehicle Id</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="id"
                    onChange={handleInput}
                    value={vehicle.id}
                    required
                    readOnly
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="vehicleNumber" className="form-label">
                    <b>Vehicle Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={handleInput}
                    value={vehicle.name}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="vehicleNumber" className="form-label">
                    <b>Vehicle Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="vehicleNumber"
                    name="vehicleNumber"
                    onChange={handleInput}
                    value={vehicle.vehicleNumber}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="companyName" className="form-label">
                    <b>Company Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    name="companyName"
                    onChange={handleInput}
                    value={vehicle.companyName}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="passingType" className="form-label">
                    <b>Driver’s License</b>
                  </label>

                  <select
                    name="passingType"
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="8 Ton">8 Ton</option>
                    <option value="10 Ton">10 Ton</option>
                    <option value="20 Ton">20 Ton</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="registrationNumber" className="form-label">
                    <b>Registration Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registrationNumber"
                    name="registrationNumber"
                    onChange={handleInput}
                    value={vehicle.registrationNumber}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="insuranceStartDate" className="form-label">
                    <b>Insurance Start Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="insuranceStartDate"
                    name="insuranceStartDate"
                    onChange={handleInput}
                    value={vehicle.insuranceStartDate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="expireInsuranceDate" className="form-label">
                    <b>Insurance Expiry Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="expireInsuranceDate"
                    name="expireInsuranceDate"
                    onChange={handleInput}
                    value={vehicle.expireInsuranceDate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="smokeTestExpireDate" className="form-label">
                    <b>Vehicle Inspection Expiry Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="smokeTestExpireDate"
                    name="smokeTestExpireDate"
                    onChange={handleInput}
                    value={vehicle.smokeTestExpireDate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="permitNumber" className="form-label">
                    <b>Permit Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="permitNumber"
                    name="permitNumber"
                    onChange={handleInput}
                    value={vehicle.permitNumber}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="permitExpireDate" className="form-label">
                    <b>Permit Expiry Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="permitExpireDate"
                    name="permitExpireDate"
                    onChange={handleInput}
                    value={vehicle.permitExpireDate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="gareBoxExpireDate" className="form-label">
                    <b>Gare Box Expiry Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="gareBoxExpireDate"
                    name="gareBoxExpireDate"
                    onChange={handleInput}
                    value={vehicle.gareBoxExpireDate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="oilChangeDate" className="form-label">
                    <b>Oil Change Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="oilChangeDate"
                    name="oilChangeDate"
                    onChange={handleInput}
                    value={vehicle.oilChangeDate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="vehiclePurchaseDate" className="form-label">
                    <b>Vehicle Purchase Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="vehiclePurchaseDate"
                    name="vehiclePurchaseDate"
                    onChange={handleInput}
                    value={vehicle.vehiclePurchaseDate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="remark" className="form-label">
                    <b>Remark</b>
                  </label>
                  <textarea
                    className="form-control"
                    id="remark"
                    name="remark"
                    rows="2"
                    placeholder="Enter remarks..."
                    onChange={handleInput}
                    value={vehicle.remark}
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    onClick={updateVehicle}
                  >
                    Update Vehicle
                  </button>
                  <ToastContainer />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleUpdateDetail;

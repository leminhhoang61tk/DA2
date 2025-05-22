import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddVehiclePage = () => {
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const transporter = JSON.parse(sessionStorage.getItem("active-transporter"));
  const transporter_jwtToken = sessionStorage.getItem("transporter-jwtToken");

  let navigate = useNavigate();

  const [selectedImage1, setSelectImage1] = useState(null);

  const [vehicle, setVehicle] = useState({
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

  const handleInput = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const saveVehicle = (e) => {
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

    const formData = new FormData();
    formData.append("name", vehicle.name);
    formData.append("vehicleNumber", vehicle.vehicleNumber);
    formData.append("companyName", vehicle.companyName);
    formData.append("passingType", vehicle.passingType);
    formData.append("registrationNumber", vehicle.registrationNumber);
    formData.append("insuranceStartDate", vehicle.insuranceStartDate);
    formData.append("expireInsuranceDate", vehicle.expireInsuranceDate);
    formData.append("smokeTestExpireDate", vehicle.smokeTestExpireDate);
    formData.append("permitNumber", vehicle.permitNumber);
    formData.append("permitExpireDate", vehicle.permitExpireDate);
    formData.append("gareBoxExpireDate", vehicle.gareBoxExpireDate);
    formData.append("oilChangeDate", vehicle.oilChangeDate);
    formData.append("vehiclePurchaseDate", vehicle.vehiclePurchaseDate);
    formData.append("remark", vehicle.remark);
    formData.append("uploadDocuments", selectedImage1);

    axios
      .post("http://localhost:8080/api/transport/vehicle/add", formData, {
        headers: {
          //       Authorization: "Bearer " + guide_jwtToken, // Replace with your actual JWT token
        },
      })
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
                    <b>Passing Type</b>
                  </label>

                  <select
                    name="passingType"
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
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
                    <b>Smoke Test Expiry Date</b>
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
                <div className="col-md-3 mb-3">
                  <label htmlFor="uploadDocuments" className="form-label">
                    <b>Upload Documents</b>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={(e) => setSelectImage1(e.target.files[0])}
                    required
                  />
                </div>
                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    onClick={saveVehicle}
                  >
                    Add Vehicle
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

export default AddVehiclePage;

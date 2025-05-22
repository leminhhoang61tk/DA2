import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify

// Constants for API endpoints
const ADD_VEHICLE_API_URL = "http://localhost:8080/api/transport/vehicle/add";

// Constants for Select Options
const PASSING_TYPE_OPTIONS = [
  { value: "", label: "-- Select Passing Type --" },
  { value: "8 Ton", label: "8 Ton" },
  { value: "10 Ton", label: "10 Ton" },
  { value: "20 Ton", label: "20 Ton" },
  // Add more options as needed
];

const initialVehicleState = {
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
};

const AddVehiclePage = () => {
  // Retrieve user info from session storage
  // These might be used for authorization or conditional rendering not shown in the snippet
  // const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  // const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  // const transporter = JSON.parse(sessionStorage.getItem("active-transporter"));
  // const transporter_jwtToken = sessionStorage.getItem("transporter-jwtToken");

  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(initialVehicleState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    setVehicle((prevVehicle) => ({ ...prevVehicle, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setSelectedFile(e.target.files[0]);
  }, []);

  // Function to convert date string to epoch time (milliseconds)
  // Not currently used in saveVehicle for date fields, but available if backend expects epoch time.
  const convertToEpochTime = useCallback((dateString) => {
    if (!dateString) return "";
    const selectedDate = new Date(dateString);
    return selectedDate.getTime();
  }, []);

  const saveVehicle = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Basic validation: check if essential fields are filled
      // The 'required' attribute on inputs provides browser-level validation
      if (!vehicle.name || !vehicle.vehicleNumber || !vehicle.registrationNumber) {
        toast.error("Please fill in all required fields.", {
          position: "top-center",
          autoClose: 2000,
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Append all vehicle fields to formData
      Object.entries(vehicle).forEach(([key, value]) => {
        // If backend expects epoch time for dates, convert them here:
        // if (key.toLowerCase().includes("date") && value) {
        //   formData.append(key, convertToEpochTime(value));
        // } else {
        formData.append(key, value);
        // }
      });

      if (selectedFile) {
        formData.append("uploadDocuments", selectedFile);
      } else {
        // Handle case where file might be required
        // toast.error("Please upload a document.", { autoClose: 2000 });
        // setIsSubmitting(false);
        // return;
      }
      
      // For debugging formData:
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      try {
        // Determine which token to use based on logged-in user (example logic)
        // let authToken = admin_jwtToken || transporter_jwtToken;
        // if (!authToken && !admin_jwtToken) { // Fallback or specific token like guide_jwtToken
        //    authToken = "YOUR_FALLBACK_OR_GUIDE_TOKEN";
        // }

        const resp = await axios.post(ADD_VEHICLE_API_URL, formData, {
          headers: {
            // "Content-Type": "multipart/form-data", // Axios usually sets this automatically for FormData
            // Authorization: `Bearer ${authToken}`, // Uncomment and use the correct token
          },
        });

        const response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage || "Vehicle added successfully!", {
            position: "top-center",
            autoClose: 1500,
          });
          setVehicle(initialVehicleState); // Reset form
          setSelectedFile(null);
          // Optionally navigate after a short delay
          // setTimeout(() => {
          //   navigate("/vehicle-list"); // Or to a relevant page
          // }, 2000);
        } else {
          toast.error(response.responseMessage || "Failed to add vehicle.", {
            position: "top-center",
            autoClose: 2500,
          });
        }
      } catch (error) {
        console.error("Error saving vehicle:", error);
        const errorMessage =
          error.response?.data?.responseMessage ||
          "An error occurred. Please try again.";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [vehicle, selectedFile, navigate, /* convertToEpochTime if used */]
  );

  return (
    <div className="mt-2 d-flex align-items-center justify-content-center mb-4 ms-3 me-3">
      <div className="card form-card shadow-lg" style={{ maxWidth: "1000px", width: "100%" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 text-center"
            style={{
              borderRadius: "1em",
              height: "45px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h5 className="card-title mb-0">Add Vehicle</h5>
          </div>
          <div className="card-body text-color">
            <form className="row g-3" onSubmit={saveVehicle}>
              {/* Vehicle Name */}
              <div className="col-md-4 mb-3">
                <label htmlFor="name" className="form-label">
                  <b>Vehicle Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={handleInput}
                  value={vehicle.name}
                  required
                />
              </div>

              {/* Vehicle Number */}
              <div className="col-md-4 mb-3">
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
                  required
                />
              </div>

              {/* Company Name */}
              <div className="col-md-4 mb-3">
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

              {/* Passing Type */}
              <div className="col-md-4 mb-3">
                <label htmlFor="passingType" className="form-label">
                  <b>Passing Type</b>
                </label>
                <select
                  id="passingType"
                  name="passingType"
                  onChange={handleInput}
                  value={vehicle.passingType}
                  className="form-select form-control"
                  required
                >
                  {PASSING_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Registration Number */}
              <div className="col-md-4 mb-3">
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
                  required
                />
              </div>

              {/* Insurance Start Date */}
              <div className="col-md-4 mb-3">
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

              {/* Insurance Expiry Date */}
              <div className="col-md-4 mb-3">
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

              {/* Vehicle Inspection Expiry Date (Smoke Test) */}
              <div className="col-md-4 mb-3">
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

              {/* Permit Number */}
              <div className="col-md-4 mb-3">
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

              {/* Permit Expiry Date */}
              <div className="col-md-4 mb-3">
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

              {/* Gare Box Expiry Date */}
              <div className="col-md-4 mb-3">
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

              {/* Oil Change Date */}
              <div className="col-md-4 mb-3">
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

              {/* Vehicle Purchase Date */}
              <div className="col-md-4 mb-3">
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
              
              {/* Remark */}
              <div className="col-md-4 mb-3">
                <label htmlFor="remark" className="form-label">
                  <b>Remark</b>
                </label>
                <textarea
                  className="form-control"
                  id="remark"
                  name="remark"
                  rows="3" // Adjusted rows
                  placeholder="Enter remarks..."
                  onChange={handleInput}
                  value={vehicle.remark}
                />
              </div>

              {/* Upload Documents */}
              <div className="col-md-4 mb-3 align-self-center"> {/* Adjusted for better alignment */}
                <label htmlFor="uploadDocuments" className="form-label">
                  <b>Upload Documents</b>
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="uploadDocuments"
                  name="uploadDocuments" // Added name attribute
                  onChange={handleFileChange}
                  // Consider if this should be required
                />
              </div>

              {/* Submit Button */}
              <div className="col-12 text-center mt-3 mb-2">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text px-4 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* ToastContainer should ideally be at a higher level in the app,
          but placing it here is fine for a single-page component context. */}
      <ToastContainer />
    </div>
  );
};

export default AddVehiclePage;


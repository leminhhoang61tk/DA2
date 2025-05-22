import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Constants for API endpoints
const ADD_CLIENT_API_URL = "http://localhost:8080/api/transport/client/add";

// Constants for Select Options
const GST_APPLICABLE_OPTIONS = [
  { value: "", label: "-- Select --" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

// A more comprehensive list might be fetched from an API or a dedicated constants file
const STATE_OPTIONS = [
  { value: "", label: "-- Chọn Tỉnh/Thành Phố --" },
  { value: "An Giang", label: "An Giang" },
  { value: "Bà Rịa - Vũng Tàu", label: "Bà Rịa - Vũng Tàu" },
  { value: "Bắc Giang", label: "Bắc Giang" },
  { value: "Bắc Kạn", label: "Bắc Kạn" },
  { value: "Bạc Liêu", label: "Bạc Liêu" },
  { value: "Bắc Ninh", label: "Bắc Ninh" },
  { value: "Bến Tre", label: "Bến Tre" },
  { value: "Bình Định", label: "Bình Định" },
  { value: "Bình Dương", label: "Bình Dương" },
  { value: "Bình Phước", label: "Bình Phước" },
  { value: "Bình Thuận", label: "Bình Thuận" },
  { value: "Cà Mau", label: "Cà Mau" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Cao Bằng", label: "Cao Bằng" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Đắk Lắk", label: "Đắk Lắk" },
  { value: "Đắk Nông", label: "Đắk Nông" },
  { value: "Điện Biên", label: "Điện Biên" },
  { value: "Đồng Nai", label: "Đồng Nai" },
  { value: "Đồng Tháp", label: "Đồng Tháp" },
  { value: "Gia Lai", label: "Gia Lai" },
  { value: "Hà Giang", label: "Hà Giang" },
  { value: "Hà Nam", label: "Hà Nam" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Hà Tĩnh", label: "Hà Tĩnh" },
  { value: "Hải Dương", label: "Hải Dương" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Hậu Giang", label: "Hậu Giang" },
  { value: "Hòa Bình", label: "Hòa Bình" },
  { value: "Hưng Yên", label: "Hưng Yên" },
  { value: "Khánh Hòa", label: "Khánh Hòa" },
  { value: "Kiên Giang", label: "Kiên Giang" },
  { value: "Kon Tum", label: "Kon Tum" },
  { value: "Lai Châu", label: "Lai Châu" },
  { value: "Lâm Đồng", label: "Lâm Đồng" },
  { value: "Lạng Sơn", label: "Lạng Sơn" },
  { value: "Lào Cai", label: "Lào Cai" },
  { value: "Long An", label: "Long An" },
  { value: "Nam Định", label: "Nam Định" },
  { value: "Nghệ An", label: "Nghệ An" },
  { value: "Ninh Bình", label: "Ninh Bình" },
  { value: "Ninh Thuận", label: "Ninh Thuận" },
  { value: "Phú Thọ", label: "Phú Thọ" },
  { value: "Phú Yên", label: "Phú Yên" },
  { value: "Quảng Bình", label: "Quảng Bình" },
  { value: "Quảng Nam", label: "Quảng Nam" },
  { value: "Quảng Ngãi", label: "Quảng Ngãi" },
  { value: "Quảng Ninh", label: "Quảng Ninh" },
  { value: "Quảng Trị", label: "Quảng Trị" },
  { value: "Sóc Trăng", label: "Sóc Trăng" },
  { value: "Sơn La", label: "Sơn La" },
  { value: "Tây Ninh", label: "Tây Ninh" },
  { value: "Thái Bình", label: "Thái Bình" },
  { value: "Thái Nguyên", label: "Thái Nguyên" },
  { value: "Thanh Hóa", label: "Thanh Hóa" },
  { value: "Thừa Thiên Huế", label: "Thừa Thiên Huế" },
  { value: "Tiền Giang", label: "Tiền Giang" },
  { value: "TP Hồ Chí Minh", label: "TP Hồ Chí Minh" },
  { value: "Trà Vinh", label: "Trà Vinh" },
  { value: "Tuyên Quang", label: "Tuyên Quang" },
  { value: "Vĩnh Long", label: "Vĩnh Long" },
  { value: "Vĩnh Phúc", label: "Vĩnh Phúc" },
  { value: "Yên Bái", label: "Yên Bái" },
  { value: "Phú Quốc", label: "Phú Quốc" }, // Added based on original
];

const initialClientState = {
  name: "",
  pinCode: "",
  state: "",
  contactNumber: "",
  contactName: "",
  gstApplicable: "",
  gstNumber: "",
  cgstRate: "",
  sgstRate: "",
  comments: "",
};

const AddClientPage = () => {
  const [client, setClient] = useState(initialClientState);
  const [showGstFields, setShowGstFields] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setClient((prevClient) => {
      const updatedClient = { ...prevClient, [name]: value };

      // Show or hide GST fields based on the GST applicable dropdown
      // And clear GST fields if GST is not applicable
      if (name === "gstApplicable") {
        const isGstApplicable = value === "Yes";
        setShowGstFields(isGstApplicable);
        if (!isGstApplicable) {
          updatedClient.gstNumber = "";
          updatedClient.cgstRate = "";
          updatedClient.sgstRate = "";
        }
      }
      return updatedClient;
    });
  }, []);

  const handleFileChange = useCallback((e) => {
    setSelectedDocument(e.target.files[0]);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const formData = new FormData();

      // Append all client fields to formData
      // Ensure that GST fields are only appended if showGstFields is true
      Object.entries(client).forEach(([key, value]) => {
        if (
          (key === "gstNumber" || key === "cgstRate" || key === "sgstRate") &&
          !showGstFields
        ) {
          // Do not append these if GST is not applicable
          return;
        }
        formData.append(key, value);
      });

      if (selectedDocument) {
        formData.append("uploadDocuments", selectedDocument);
      }

      // Log formData for debugging (optional)
      // for (var pair of formData.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]);
      // }

      try {
        // const guide_jwtToken = "YOUR_TOKEN_HERE"; // Replace or manage token appropriately
        const resp = await axios.post(ADD_CLIENT_API_URL, formData, {
          // headers: {
          //   Authorization: "Bearer " + guide_jwtToken,
          // },
        });
        const response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });
          setClient(initialClientState); // Reset form
          setSelectedDocument(null);
          setShowGstFields(false);
          setTimeout(() => {
            navigate("/home"); // Or a client list page
          }, 1500);
        } else {
          toast.error(response.responseMessage, {
            position: "top-center",
            autoClose: 2000, // Longer for errors
          });
        }
      } catch (error) {
        console.error("Error submitting client data:", error);
        toast.error(
          error.response?.data?.responseMessage ||
            "Submission failed. Please try again.",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [client, selectedDocument, showGstFields, navigate]
  );

  return (
    <div className="mt-2 d-flex align-items-center justify-content-center mb-4 ms-3 me-3">
      <div className="card form-card shadow-lg" style={{ maxWidth: "900px", width: "100%" }}>
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
            <h5 className="card-title mb-0">Add Client</h5>
          </div>
          <div className="card-body text-color">
            <form
              className="row g-3"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Name */}
              <div className="col-md-4 mb-3">
                <label htmlFor="name" className="form-label">
                  <b>Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={client.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Pin Code */}
              <div className="col-md-4 mb-3">
                <label htmlFor="pinCode" className="form-label">
                  <b>Pin Code</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pinCode"
                  name="pinCode"
                  value={client.pinCode}
                  onChange={handleChange}
                  required
                  pattern="\d{5,6}" // Basic pincode validation (5 or 6 digits)
                  title="Pin code should be 5 or 6 digits."
                />
              </div>

              {/* State */}
              <div className="col-md-4 mb-3">
                <label htmlFor="state" className="form-label">
                  <b>State</b>
                </label>
                <select
                  className="form-select form-control" // Added form-select for Bootstrap styling
                  id="state"
                  name="state"
                  value={client.state}
                  onChange={handleChange}
                  required
                >
                  {STATE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Number */}
              <div className="col-md-4 mb-3">
                <label htmlFor="contactNumber" className="form-label">
                  <b>Contact Number</b>
                </label>
                <input
                  type="tel" // Use type="tel" for contact numbers
                  className="form-control"
                  id="contactNumber"
                  name="contactNumber"
                  value={client.contactNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10,12}" // Basic phone number validation
                  title="Contact number should be 10 to 12 digits."
                />
              </div>

              {/* Contact Name */}
              <div className="col-md-4 mb-3">
                <label htmlFor="contactName" className="form-label">
                  <b>Contact Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contactName"
                  name="contactName"
                  value={client.contactName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* GST Applicable */}
              <div className="col-md-4 mb-3">
                <label htmlFor="gstApplicable" className="form-label">
                  <b>GST Applicable</b>
                </label>
                <select
                  className="form-select form-control"
                  id="gstApplicable"
                  name="gstApplicable"
                  value={client.gstApplicable}
                  onChange={handleChange}
                  required
                >
                  {GST_APPLICABLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditionally render GST fields */}
              {showGstFields && (
                <>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="gstNumber" className="form-label">
                      <b>GST Number</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="gstNumber"
                      name="gstNumber"
                      value={client.gstNumber}
                      onChange={handleChange}
                      required={showGstFields} // Required only if shown
                      // Example pattern for GST: 2 numbers, 5 letters, 4 numbers, 1 letter, 1 number, Z, 1 digit/letter
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                      title="Enter a valid GST Number (e.g., 22AAAAA0000A1Z5)"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="cgstRate" className="form-label">
                      <b>CGST Rate (%)</b>
                    </label>
                    <input
                      type="number" // Use number for rates
                      className="form-control"
                      id="cgstRate"
                      name="cgstRate"
                      value={client.cgstRate}
                      onChange={handleChange}
                      required={showGstFields}
                      step="0.01" // Allow decimal values
                      min="0"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="sgstRate" className="form-label">
                      <b>SGST Rate (%)</b>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="sgstRate"
                      name="sgstRate"
                      value={client.sgstRate}
                      onChange={handleChange}
                      required={showGstFields}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </>
              )}

              {/* Comments */}
              <div className="col-md-8 mb-3"> {/* Adjusted width */}
                <label htmlFor="comments" className="form-label">
                  <b>Comments</b>
                </label>
                <textarea
                  className="form-control"
                  id="comments"
                  name="comments"
                  rows="3" // Increased rows for better visibility
                  value={client.comments}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Upload Documents */}
              <div className="col-md-4 mb-3"> {/* Adjusted width */}
                <label htmlFor="uploadDocuments" className="form-label">
                  <b>Upload Documents</b>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="uploadDocuments"
                  name="uploadDocuments"
                  onChange={handleFileChange}
                />
              </div>

              {/* Submit Button */}
              <div className="col-12 text-center mb-2">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text px-4 py-2" // Added some padding
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Client..." : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddClientPage;


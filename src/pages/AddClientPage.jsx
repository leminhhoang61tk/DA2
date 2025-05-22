import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddClientPage = () => {
  const [client, setClient] = useState({
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
  });

  const [showGstFields, setShowGstFields] = useState(false);

  let navigate = useNavigate();

  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });

    // Show or hide GST fields based on the GST applicable dropdown
    if (name === "gstApplicable") {
      setShowGstFields(value === "Yes");
    }
  };

  const handleFileChange = (e) => {
    setSelectedDocument(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", client.name);
    formData.append("pinCode", client.pinCode);
    formData.append("state", client.state);
    formData.append("contactNumber", client.contactNumber);
    formData.append("contactName", client.contactName);
    formData.append("gstApplicable", client.gstApplicable);
    if (showGstFields) {
      formData.append("gstNumber", client.gstNumber);
      formData.append("cgstRate", client.cgstRate);
      formData.append("sgstRate", client.sgstRate);
    }
    formData.append("comments", client.comments);
    formData.append("uploadDocuments", selectedDocument);

    axios
      .post("http://localhost:8080/api/transport/client/add", formData, {
        headers: {
          // Authorization: "Bearer " + guide_jwtToken, // Replace with your actual JWT token
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

          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } else {
          toast.error(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        toast.error(
          error.response && error.response.data
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
      });
  };

  return (
    <div className="mt-2 d-flex aligns-items-center justify-content-center mb-4 ms-3 me-3">
      <div className="card form-card shadow-lg">
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 text-center"
            style={{
              borderRadius: "1em",
              height: "45px",
            }}
          >
            <h5 className="card-title">Add Client</h5>
          </div>
          <div className="card-body text-color">
            <form
              className="row g-3"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="col-md-3 mb-3">
                <label htmlFor="name" className="form-label">
                  <b>Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={client.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="pinCode" className="form-label">
                  <b>Pin Code</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="pinCode"
                  value={client.pinCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="state" className="form-label">
                  <b>State</b>
                </label>
                <select
                  className="form-control"
                  name="state"
                  value={client.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn Tỉnh/Thành Phố --</option>
                  <option value="An Giang">An Giang</option>
                  <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                  <option value="Bắc Giang">Bắc Giang</option>
                  <option value="Bắc Kạn">Bắc Kạn</option>
                  <option value="Bạc Liêu">Bạc Liêu</option>
                  <option value="Bắc Ninh">Bắc Ninh</option>
                  <option value="Bến Tre">Bến Tre</option>
                  <option value="Bình Định">Bình Định</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Bình Phước">Bình Phước</option>
                  <option value="Bình Thuận">Bình Thuận</option>
                  <option value="Cà Mau">Cà Mau</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Cao Bằng">Cao Bằng</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Đắk Lắk">Đắk Lắk</option>
                  <option value="Đắk Nông">Đắk Nông</option>
                  <option value="Điện Biên">Điện Biên</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Đồng Tháp">Đồng Tháp</option>
                  <option value="Gia Lai">Gia Lai</option>
                  <option value="Hà Giang">Hà Giang</option>
                  <option value="Hà Nam">Hà Nam</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hà Tĩnh">Hà Tĩnh</option>
                  <option value="Hải Dương">Hải Dương</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Hậu Giang">Hậu Giang</option>
                  <option value="Hòa Bình">Hòa Bình</option>
                  <option value="Hưng Yên">Hưng Yên</option>
                  <option value="Khánh Hòa">Khánh Hòa</option>
                  <option value="Kiên Giang">Kiên Giang</option>
                  <option value="Kon Tum">Kon Tum</option>
                  <option value="Lai Châu">Lai Châu</option>
                  <option value="Lâm Đồng">Lâm Đồng</option>
                  <option value="Lạng Sơn">Lạng Sơn</option>
                  <option value="Lào Cai">Lào Cai</option>
                  <option value="Long An">Long An</option>
                  <option value="Nam Định">Nam Định</option>
                  <option value="Nghệ An">Nghệ An</option>
                  <option value="Ninh Bình">Ninh Bình</option>
                  <option value="Ninh Thuận">Ninh Thuận</option>
                  <option value="Phú Thọ">Phú Thọ</option>
                  <option value="Phú Yên">Phú Yên</option>
                  <option value="Quảng Bình">Quảng Bình</option>
                  <option value="Quảng Nam">Quảng Nam</option>
                  <option value="Quảng Ngãi">Quảng Ngãi</option>
                  <option value="Quảng Ninh">Quảng Ninh</option>
                  <option value="Quảng Trị">Quảng Trị</option>
                  <option value="Sóc Trăng">Sóc Trăng</option>
                  <option value="Sơn La">Sơn La</option>
                  <option value="Tây Ninh">Tây Ninh</option>
                  <option value="Thái Bình">Thái Bình</option>
                  <option value="Thái Nguyên">Thái Nguyên</option>
                  <option value="Thanh Hóa">Thanh Hóa</option>
                  <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  <option value="Tiền Giang">Tiền Giang</option>
                  <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
                  <option value="Trà Vinh">Trà Vinh</option>
                  <option value="Tuyên Quang">Tuyên Quang</option>
                  <option value="Vĩnh Long">Vĩnh Long</option>
                  <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                  <option value="Yên Bái">Yên Bái</option>
                  <option value="Phú Quốc">Phú Quốc</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="contactNumber" className="form-label">
                  <b>Contact Number</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  value={client.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="contactName" className="form-label">
                  <b>Contact Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="contactName"
                  value={client.contactName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="gstApplicable" className="form-label">
                  <b>GST Applicable</b>
                </label>
                <select
                  className="form-control"
                  name="gstApplicable"
                  value={client.gstApplicable}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Conditionally render GST fields based on GST applicable selection */}
              {showGstFields && (
                <>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="gstNumber" className="form-label">
                      <b>GST Number</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="gstNumber"
                      value={client.gstNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="cgstRate" className="form-label">
                      <b>CGST Rate</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="cgstRate"
                      value={client.cgstRate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="sgstRate" className="form-label">
                      <b>SGST Rate</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="sgstRate"
                      value={client.sgstRate}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="col-md-3 mb-3">
                <label htmlFor="comments" className="form-label">
                  <b>Comments</b>
                </label>
                <textarea
                  className="form-control"
                  name="comments"
                  rows="2"
                  value={client.comments}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="uploadDocuments" className="form-label">
                  <b>Upload Documents</b>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="uploadDocuments"
                  onChange={handleFileChange}
                />
              </div>

              <div className="col-12 text-center mb-2">
                <button type="submit" className="btn bg-color custom-bg-text">
                  Add Client
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

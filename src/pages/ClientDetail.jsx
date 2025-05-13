import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ClientDetail = () => {
  const statesCities = {
    Hanoi: ["Hoan Kiem", "Ba Dinh", "Dong Da", "Cau Giay", "Hai Ba Trung"],
    HoChiMinh: ["District 1", "District 3", "District 7", "Tan Binh", "Go Vap"],
    DaNang: ["Hai Chau", "Thanh Khe", "Son Tra", "Lien Chieu", "Ngu Hanh Son"],
    HaiPhong: ["Ngo Quyen", "Le Chan", "Kien An", "Do Son", "Thuy Nguyen"],
    CanTho: ["Ninh Kieu", "Cai Rang", "Binh Thuy", "O Mon", "Thot Not"],
    QuangNinh: ["Ha Long", "Cam Pha", "Uong Bi", "Mong Cai", "Dong Trieu"],
    ThanhHoa: ["Thanh Hoa City", "Sam Son", "Bim Son", "Nghi Son", "Tinh Gia"],
    NgheAn: ["Vinh", "Cua Lo", "Thai Hoa", "Quynh Luu", "Dien Chau"],
    Hue: ["Hue City", "Huong Thuy", "Huong Tra", "Phong Dien", "Quang Dien"],
    QuangNam: ["Tam Ky", "Hoi An", "Dien Ban", "Nui Thanh", "Thang Binh"],
    QuangNgai: ["Quang Ngai City", "Duc Pho", "Son Tinh", "Binh Son", "Mo Duc"],
    BinhDinh: ["Quy Nhon", "An Nhon", "Tuy Phuoc", "Phu Cat", "Hoai Nhon"],
    KhanhHoa: ["Nha Trang", "Cam Ranh", "Ninh Hoa", "Van Ninh", "Dien Khanh"],
    LamDong: ["Da Lat", "Bao Loc", "Duc Trong", "Di Linh", "Don Duong"],
    DakLak: ["Buon Ma Thuot", "Buon Don", "Ea Kar", "Krong Bong", "Krong Nang"],
    DakNong: ["Gia Nghia", "Dak Mil", "Dak Song", "Cu Jut", "Krong No"],
    GiaLai: ["Pleiku", "An Khe", "Ayun Pa", "Chu Se", "Dak Doa"],
    KonTum: ["Kon Tum City", "Dak Ha", "Ngoc Hoi", "Sa Thay", "Dak To"],
    NinhThuan: ["Phan Rang-Thap Cham", "Ninh Hai", "Ninh Phuoc", "Thuan Nam", "Thuan Bac"],
    BinhThuan: ["Phan Thiet", "La Gi", "Ham Tan", "Bac Binh", "Tuy Phong"],
    DongNai: ["Bien Hoa", "Long Khanh", "Trang Bom", "Vinh Cuu", "Nhon Trach"],
    BinhDuong: ["Thu Dau Mot", "Di An", "Tan Uyen", "Ben Cat", "Phu Giao"],
    BaRiaVungTau: ["Vung Tau", "Ba Ria", "Phu My", "Long Dien", "Xuyen Moc"],
    AnGiang: ["Long Xuyen", "Chau Doc", "Tan Chau", "Thoai Son", "Chau Phu"],
    KienGiang: ["Rach Gia", "Ha Tien", "Phu Quoc", "Kien Luong", "Giong Rieng"],
    DongThap: ["Cao Lanh", "Sa Dec", "Hong Ngu", "Lai Vung", "Lap Vo"],
    LongAn: ["Tan An", "Duc Hoa", "Ben Luc", "Can Giuoc", "Can Duoc"],
    TienGiang: ["My Tho", "Cai Lay", "Go Cong", "Cai Be", "Cho Gao"],
    BenTre: ["Ben Tre City", "Mo Cay", "Ba Tri", "Giong Trom", "Binh Dai"],
    VinhLong: ["Vinh Long City", "Binh Minh", "Tam Binh", "Mang Thit", "Tra On"],
    TraVinh: ["Tra Vinh City", "Cang Long", "Cau Ke", "Cau Ngang", "Duyen Hai"],
    SocTrang: ["Soc Trang City", "Nga Nam", "Vinh Chau", "My Xuyen", "Tran De"],
    BacLieu: ["Bac Lieu City", "Hong Dan", "Phuoc Long", "Vinh Loi", "Dong Hai"],
    CaMau: ["Ca Mau City", "Nam Can", "Dam Doi", "Ngoc Hien", "Thoi Binh"],
    BacGiang: ["Bac Giang City", "Lang Giang", "Viet Yen", "Tan Yen", "Hiep Hoa"],
    BacKan: ["Bac Kan City", "Ba Be", "Ngan Son", "Cho Don", "Cho Moi"],
    CaoBang: ["Cao Bang City", "Trung Khanh", "Ha Quang", "Quang Hoa", "Bao Lac"],
    LangSon: ["Lang Son City", "Cao Loc", "Loc Binh", "Huu Lung", "Chi Lang"],
    HaGiang: ["Ha Giang City", "Dong Van", "Meo Vac", "Quan Ba", "Yen Minh"],
    TuyenQuang: ["Tuyen Quang City", "Ham Yen", "Chiem Hoa", "Son Duong", "Na Hang"],
    LaoCai: ["Lao Cai City", "Sa Pa", "Bat Xat", "Bao Thang", "Bao Yen"],
    YenBai: ["Yen Bai City", "Nghia Lo", "Van Chan", "Luc Yen", "Tran Yen"],
    PhuTho: ["Viet Tri", "Phu Tho Town", "Lam Thao", "Thanh Son", "Doan Hung"],
    ThaiNguyen: ["Thai Nguyen City", "Song Cong", "Pho Yen", "Dai Tu", "Phu Luong"],
    HoaBinh: ["Hoa Binh City", "Mai Chau", "Lac Son", "Tan Lac", "Kim Boi"],
    SonLa: ["Son La City", "Moc Chau", "Mai Son", "Thuan Chau", "Quynh Nhai"],
    DienBien: ["Dien Bien Phu", "Muong Lay", "Muong Cha", "Tuan Giao", "Dien Bien Dong"],
    LaiChau: ["Lai Chau City", "Tam Duong", "Phong Tho", "Than Uyen", "Muong Te"],
    QuangBinh: ["Dong Hoi", "Ba Don", "Quang Trach", "Bo Trach", "Le Thuy"],
    QuangTri: ["Dong Ha", "Quang Tri Town", "Gio Linh", "Hai Lang", "Vinh Linh"],
    HaTinh: ["Ha Tinh City", "Hong Linh", "Ky Anh", "Cam Xuyen", "Thach Ha"],
    NinhBinh: ["Ninh Binh City", "Tam Diep", "Gia Vien", "Hoa Lu", "Kim Son"],
    NamDinh: ["Nam Dinh City", "My Loc", "Hai Hau", "Xuan Truong", "Giao Thuy"],
    ThaiBinh: ["Thai Binh City", "Dong Hung", "Hung Ha", "Kien Xuong", "Tien Hai"],
    HaNam: ["Phu Ly", "Duy Tien", "Kim Bang", "Thanh Liem", "Ly Nhan"],
    HungYen: ["Hung Yen City", "Van Lam", "My Hao", "Van Giang", "Khoai Chau"],
    VinhPhuc: ["Vinh Yen", "Phuc Yen", "Tam Dao", "Yen Lac", "Lap Thach"],
    HaiDuong: ["Hai Duong City", "Chi Linh", "Cam Giang", "Nam Sach", "Thanh Mien"],
  };

  const states = Object.keys(statesCities);

  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  const { clientId } = useParams();
  const [client, setClient] = useState({
    branches: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchForm, setBranchForm] = useState({
    city: "",
    fullAddress: "",
    state: "",
    clientId: clientId,
  });

  const handleInput = (e) => {
    setBranchForm({ ...branchForm, [e.target.name]: e.target.value });
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleBranchModalClose = () => setShowBranchModal(false);
  const handleBranchModalShow = () => setShowBranchModal(true);

  let navigate = useNavigate();

  // Fetch client data on component mount
  useEffect(() => {
    const getClient = async () => {
      const fetchClient = await retrieveClient();
      if (fetchClient) {
        setClient(fetchClient.clients[0]); // Adjusted to access the client object
      }
    };
    getClient();
  }, [clientId]);

  // Function to retrieve client data from the API
  const retrieveClient = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/transport/client/fetch?clientId=${clientId}`
    );
    return response.data;
  };

  // If client data is not loaded yet, show a loading message
  if (!client) return <p>Loading...</p>;

  // Function to navigate to the update client document page
  const updateClientDocument = () => {
    navigate("/admin/client/document/update", { state: client });
  };

  // Function to navigate to the update client details page
  const updateClientDetails = () => {
    navigate(`/admin/client/${clientId}/update/detail`, { state: client });
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const handleBranchFormSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/transport/client/branch/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(branchForm),
    })
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

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{ height: "auto" }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{ borderRadius: "1em", height: "50px" }}
        >
          <h2>Client Details</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Basic Information</h5>
              <p>
                <strong>Name:</strong> {client.name}
              </p>
              <p>
                <strong>Added Date:</strong>{" "}
                {formatDateFromEpoch(client.addedDateTime)}
              </p>
              <p>
                <strong>Contact Number:</strong> {client.contactNumber}
              </p>
              <p>
                <strong>Contact Name:</strong> {client.contactName}
              </p>
              <p>
                <strong>Pin Code:</strong> {client.pinCode}
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">GST Information</h5>
              <p>
                <strong>GST Applicable:</strong> {client.gstApplicable}
              </p>
              <p>
                <strong>GST Number:</strong> {client.gstNumber || "N/A"}
              </p>
              <p>
                <strong>CGST Rate:</strong> {client.cgstRate}%
              </p>
              <p>
                <strong>SGST Rate:</strong> {client.sgstRate}%
              </p>
              <p>
                <strong>State:</strong> {client.state}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Additional Details</h5>
              <p>
                <strong>Status:</strong> {client.status}
              </p>
              <p>
                <strong>Comments:</strong> {client.comments || "No Comments"}
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="text-primary">Documents</h5>
              <div>
                <strong>Uploaded Documents:</strong>
                <button
                  className="btn btn-sm bg-color custom-bg ms-2"
                  onClick={handleShow}
                >
                  View Document
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className="text-primary">Branches</h5>
              {client.branches.length > 0 ? (
                <ul className="list-group">
                  {client.branches.map((branch, index) => (
                    <li key={index} className="list-group-item">
                      <div className="row align-items-center">
                        <div className="col text-center">
                          <strong>Branch {index + 1}</strong>
                        </div>
                        <div className="col text-center">
                          <strong>City:</strong> {branch.city}
                        </div>
                        <div className="col text-center">
                          <strong>State:</strong> {branch.state}
                        </div>
                        <div className="col text-center">
                          <strong>Address:</strong> {branch.fullAddress}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No branches available for this client.</p>
              )}
            </div>
          </div>
        </div>

        {/* Update client detail and document update section */}
        <div className="card-footer">
          <div className="d-flex justify-content-center mt-3">
            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Add Branch"
              onClick={handleBranchModalShow}
            />
            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-5"
              value="Update Client Detail"
              onClick={updateClientDetails}
            />
            <input
              type="button"
              className="btn custom-bg bg-color mb-3 ms-4"
              value="Update Client Document"
              onClick={updateClientDocument}
            />
          </div>
        </div>
      </div>

      {/* Modal to show client documents */}
      <Modal show={showModal} onHide={handleClose} fullscreen>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title style={{ borderRadius: "1em" }}>Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`http://localhost:8080/api/user/document/${client.uploadDocuments}/view`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Document Preview"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBranchModal} onHide={handleBranchModalClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Add Client Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBranchFormSubmit}>
            <Form.Group controlId="state" className="mb-3">
              <Form.Label>
                <b>State</b>
              </Form.Label>
              <Form.Select
                name="state"
                onChange={(e) => {
                  handleInput(e);
                  setCities(statesCities[e.target.value]); // Update cities based on selected state
                }}
                value={branchForm.state}
              >
                <option value="">Select State</option>
                {Object.keys(statesCities).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="city" className="mb-3">
              <Form.Label>
                <b>City</b>
              </Form.Label>
              <Form.Select
                name="city"
                onChange={handleInput}
                value={branchForm.city}
                disabled={!branchForm.state} // Disable if no state is selected
              >
                <option value="">Select City</option>
                {branchForm.state &&
                  statesCities[branchForm.state]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="fullAddress" className="mb-3">
              <Form.Label>Full Address</Form.Label>
              <Form.Control
                as="textarea" // Change this line
                rows={3} // You can set the number of visible rows
                required
                name="fullAddress"
                value={branchForm.fullAddress}
                onChange={handleInput}
              />
            </Form.Group>

            <Button className="btn bg-color custom-bg" type="submit">
              Add Branch
            </Button>
            <ToastContainer />
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClientDetail;

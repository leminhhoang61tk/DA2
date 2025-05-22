import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const UpdateEmployeeDetailPage = () => {
  const location = useLocation();
  const { employeeId } = useParams();

  const [user, setUser] = useState(location.state || null);

  const [employee, setEmployee] = useState({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailId: user.emailId,
    phoneNo: user.phoneNo,
    fullName: user.employee.fullName,
    panNumber: user.employee.panNumber,
    aadharNumber: user.employee.aadharNumber,
    licenseNumber: user.employee.licenseNumber,
    role: user.employee.role,
    fullAddress: user.employee.fullAddress,
    city: user.employee.city,
    pinCode: user.employee.pinCode,
    state: user.employee.state,
    country: user.employee.country,
    licenseExpiryDate: user.employee.licenseExpiryDate,
    workStartDate: user.employee.workStartDate,
    workEndDate: user.employee.workEndDate,
    accountNumber: user.employee.accountNumber,
    ifscNumber: user.employee.ifscNumber,
    status: user.employee.status,
    comments: user.employee.comments,
  });

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  let navigate = useNavigate();

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

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setSelectedState(value);
      setCities(statesCities[value] || []); // Update cities based on selected state
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        city: "", // Reset city when state changes
        state: value,
      }));
    } else {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: value,
      }));
    }
  };

  const updateEmployee = (e) => {
    e.preventDefault();
    employee.userId = employeeId;
    if (employee === null) {
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

    if (employee.userId === "") {
      toast.error("Employee Id is missing!!!", {
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

    fetch("http://localhost:8080/api/user/employee/detail/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify(employee),
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
              navigate(`/admin/employee/${employeeId}/detail`);
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

  return (
    <div>
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
              <h5 className="card-title">Update Employee</h5>
            </div>
            <div className="card-body text-color">
              <form className="row g-3">
                <div className="col-md-4 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    <b>First Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    onChange={handleInput}
                    value={employee.firstName}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    <b>Last Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    onChange={handleInput}
                    value={employee.lastName}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="emailId" className="form-label">
                    <b>Email</b>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailId"
                    name="emailId"
                    onChange={handleInput}
                    value={employee.emailId}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="phoneNo" className="form-label">
                    <b>Phone Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNo"
                    name="phoneNo"
                    onChange={handleInput}
                    value={employee.phoneNo}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fullName" className="form-label">
                    <b>Full Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    onChange={handleInput}
                    value={employee.fullName}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="panNumber" className="form-label">
                    <b>PAN Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="panNumber"
                    name="panNumber"
                    onChange={handleInput}
                    value={employee.panNumber}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="aadharNumber" className="form-label">
                    <b>Aadhar Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="aadharNumber"
                    name="aadharNumber"
                    onChange={handleInput}
                    value={employee.aadharNumber}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="role" className="form-label">
                    <b>Role</b>
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    onChange={handleInput}
                    value={employee.role}
                  >
                    <option value="">Role</option>
                    <option value="Driver">Driver</option>
                    <option value="Helper">Helper</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>

                {/* Conditionally render License Number input field */}
                {employee.role === "Driver" && (
                  <div className="col-md-4 mb-3">
                    <label htmlFor="licenseNumber" className="form-label">
                      <b>License Number</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="licenseNumber"
                      name="licenseNumber"
                      onChange={handleInput}
                      value={employee.licenseNumber}
                    />
                  </div>
                )}

                <div className="col-md-4 mb-3">
                  <label htmlFor="fullAddress" className="form-label">
                    <b>Full Address</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullAddress"
                    name="fullAddress"
                    onChange={handleInput}
                    value={employee.fullAddress}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="state" className="form-label">
                    <b>State</b>
                  </label>
                  <select
                    className="form-select"
                    id="state"
                    name="state"
                    onChange={handleInput}
                    value={employee.state}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="city" className="form-label">
                    <b>City</b>
                  </label>
                  <select
                    className="form-select"
                    id="city"
                    name="city"
                    onChange={handleInput}
                    value={employee.city}
                    disabled={!selectedState}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="pinCode" className="form-label">
                    <b>Pin Code</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pinCode"
                    name="pinCode"
                    onChange={handleInput}
                    value={employee.pinCode}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="country" className="form-label">
                    <b>Country</b>
                  </label>
                  <select
                    className="form-select"
                    id="country"
                    name="country"
                    onChange={handleInput}
                    value={employee.country}
                  >
                    <option value="">-- Select Country --</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini">Eswatini</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Korea (North)">Korea (North)</option>
                    <option value="Korea (South)">Korea (South)</option>
                    <option value="Kosovo">Kosovo</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar (Burma)">Myanmar (Burma)</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestine">Palestine</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>

                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="licenseExpiryDate" className="form-label">
                    <b>License Expiry Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="licenseExpiryDate"
                    name="licenseExpiryDate"
                    onChange={handleInput}
                    value={employee.licenseExpiryDate}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="workStartDate" className="form-label">
                    <b>Work Start Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="workStartDate"
                    name="workStartDate"
                    onChange={handleInput}
                    value={employee.workStartDate}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="workEndDate" className="form-label">
                    <b>Work End Date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="workEndDate"
                    name="workEndDate"
                    onChange={handleInput}
                    value={employee.workEndDate}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="accountNumber" className="form-label">
                    <b>Account Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accountNumber"
                    name="accountNumber"
                    onChange={handleInput}
                    value={employee.accountNumber}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="ifscNumber" className="form-label">
                    <b>IFSC Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ifscNumber"
                    name="ifscNumber"
                    onChange={handleInput}
                    value={employee.ifscNumber}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="comments" className="form-label">
                    <b>Comments</b>
                  </label>
                  <textarea
                    className="form-control"
                    id="comments"
                    name="comments"
                    onChange={handleInput}
                    value={employee.comments}
                  />
                </div>

                <div className="col-md-12 text-center">
                  <button
                    className="btn bg-color custom-bg-text"
                    onClick={updateEmployee}
                  >
                    Update Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateEmployeeDetailPage;

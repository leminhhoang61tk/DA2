import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateEmployeeDocument = () => {
  const location = useLocation();
  const [user, setUser] = useState(location.state);

  let navigate = useNavigate();

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const [selectedImage1, setSelectImage1] = useState(null);

  const updateEmployeeDocument = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("employeeId", user.employee.id);
    formData.append("uploadDocuments", selectedImage1);

    axios
      .put(
        "http://localhost:8080/api/user/employee/document/update",
        formData,
        {
          headers: {
            //       Authorization: "Bearer " + guide_jwtToken, // Replace with your actual JWT token
          },
        }
      )
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
            navigate(`/admin/employee/${user.id}/detail`);
          }, 2000); // Redirect after 3 seconds
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
        // }, 2000); // Redirect after 3 seconds
      });
  };

  return (
    <div className="mb-5">
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card rounded-card h-100 shadow-lg"
          style={{ width: "45rem" }}
        >
          <div className="card-body text-color">
            <h3 className="card-title text-center">Update Employee Document</h3>

            <form className="mt-3">
              <div className="mb-3">
                <label for="formFile" class="form-label">
                  <b> Select Document</b>
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  name="image1"
                  onChange={(e) => setSelectImage1(e.target.files[0])}
                  required
                />
              </div>

              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  class="btn bg-color custom-bg-text"
                  onClick={updateEmployeeDocument}
                >
                  Update Document
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployeeDocument;

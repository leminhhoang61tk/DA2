import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewAllEmployees = () => {
  const [allEmployee, setAllEmployee] = useState([
    {
      employee: {
        role: "",
      },
    },
  ]);

  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");

  const [role, setRole] = useState("");
  const [tempRole, setTempRole] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  let navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      if (name === "" && role === "") {
        const allUsers = await retrieveAllUser();
        if (allUsers) {
          setAllEmployee(allUsers.users);
        }
      } else if (name !== "") {
        const allUsers = await retrieveAllUserByName();
        if (allUsers) {
          setAllEmployee(allUsers.users);
        }
      } else {
        const allUsers = await retrieveAllUserByRole();
        if (allUsers) {
          setAllEmployee(allUsers.users);
        }
      }
    };

    getAllUsers();
  }, [name, role]);

  const retrieveAllUser = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/role-wise?role=Employee",
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const retrieveAllUserByRole = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/employees?role=" +
        role +
        "&status=Active",
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const retrieveAllUserByName = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/employee-name-wise?name=" + name,
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const deleteEmployee = (employeeId, e) => {
    fetch(
      "http://localhost:8080/api/user/employee/delete?employeeId=" + employeeId,
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

  const viewEmployeeDetail = (employeeId) => {
    navigate(`/admin/employee/${employeeId}/detail`);
  };

  const searchEmployeeByName = (e) => {
    e.preventDefault();
    setName(tempName);
    setTempName("");
    setTempRole("");
    setRole("");
  };

  const searchEmployeeByRole = (e) => {
    e.preventDefault();
    setRole(tempRole);
    setTempRole("");
    setName("");
    setTempName("");
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
          <h2>All Employees</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="d-flex aligns-items-center justify-content-center mt-3">
            <div className="row">
              <div className="d-flex align-items-end">
                <form className="row g-3 me-2">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control"
                      id="inputPassword2"
                      placeholder="Enter Name..."
                      onChange={(e) => setTempName(e.target.value)}
                      style={{
                        width: "350px",
                      }}
                      value={tempName}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn bg-color custom-bg-text mb-3"
                      onClick={searchEmployeeByName}
                    >
                      Search
                    </button>
                  </div>
                </form>

                <form className="row g-3">
                  <div className="col-auto">
                    <select
                      onChange={(e) => setTempRole(e.target.value)}
                      className="form-control"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Driver">Driver</option>
                      <option value="Helper">Helper</option>
                      <option value="Accountant">Accountant</option>
                    </select>
                  </div>

                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn bg-color custom-bg-text mb-3"
                      onClick={searchEmployeeByRole}
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
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {allEmployee.map((employee) => {
                  return (
                    <tr>
                      <td>
                        <b>{employee.firstName}</b>
                      </td>
                      <td>
                        <b>{employee.lastName}</b>
                      </td>
                      <td>
                        <b>{employee.emailId}</b>
                      </td>
                      <td>
                        <b>{employee.phoneNo}</b>
                      </td>
                      <td>
                        <b>{employee.employee.role}</b>
                      </td>
                      <td>
                        <button
                          onClick={() => viewEmployeeDetail(employee.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          View
                        </button>

                        <button
                          onClick={() => deleteEmployee(employee.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
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

export default ViewAllEmployees;

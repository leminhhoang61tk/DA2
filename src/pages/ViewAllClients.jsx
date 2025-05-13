import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewAllClients = () => {
  const [clients, setClients] = useState([]);

  const [clientName, setClientName] = useState("");
  const [tempClientName, setTempClientName] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  let navigate = useNavigate();

  useEffect(() => {
    const getAllClients = async () => {
      if (clientName !== "") {
        const clientResponse = await retrieveAllClientsByName();
        if (clientResponse) {
          setClients(clientResponse.clients);
        }
      } else {
        const clientResponse = await retrieveAllClients();
        if (clientResponse) {
          setClients(clientResponse.clients);
        }
      }
    };

    getAllClients();
  }, [clientName]);

  const retrieveAllClients = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/fetch/all",
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );

    return response.data;
  };

  const retrieveAllClientsByName = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/transport/client/fetch/name-wise?clientName=" +
        clientName,
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );

    return response.data;
  };

  const deleteClient = (clientId, e) => {
    fetch(
      "http://localhost:8080/api/transport/client/delete?clientId=" + clientId,
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
            }, 1000);
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
            }, 1000);
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
        }, 1000);
      });
  };

  const viewClientDetails = (clientId) => {
    navigate(`/admin/client/${clientId}/detail`);
  };

  const searchClientByName = (e) => {
    e.preventDefault();
    setClientName(tempClientName);
    setTempClientName("");
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
          <h2>All Clients</h2>
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
                      placeholder="Enter Client Name..."
                      onChange={(e) => setTempClientName(e.target.value)}
                      style={{
                        width: "350px",
                      }}
                      value={tempClientName}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn bg-color custom-bg-text mb-3"
                      onClick={searchClientByName}
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
                  <th scope="col">State</th>
                  <th scope="col">Contact Number</th>
                  <th scope="col">Contact Name</th>
                  <th scope="col">GST Applicable</th>
                  <th scope="col">GST Number</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  return (
                    <tr key={client.id}>
                      <td>
                        <b>{client.name}</b>
                      </td>
                      <td>{client.state}</td>
                      <td>{client.contactNumber}</td>
                      <td>{client.contactName}</td>
                      <td>{client.gstApplicable}</td>
                      <td>{client.gstNumber}</td>
                      <td>
                        <button
                          onClick={() => viewClientDetails(client.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          View
                        </button>

                        <button
                          onClick={() => deleteClient(client.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2 "
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

export default ViewAllClients;

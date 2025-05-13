import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProfile = () => {
  const mentor = JSON.parse(sessionStorage.getItem("active-mentor"));
  const mentor_jwtToken = sessionStorage.getItem("mentor-jwtToken");

  let navigate = useNavigate();

  const [selectedProfile, setSelectedProfile] = useState(null);

  const [profile, setProfile] = useState({
    age: "",
    bio: "",
    highestQualification: "",
    profession: "",
    experience: "",
    mentorId: "",
  });

  const handleInput = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("age", profile.age);
    formData.append("bio", profile.bio);
    formData.append("highestQualification", profile.highestQualification);
    formData.append("profession", profile.profession);
    formData.append("experience", profile.experience);
    formData.append("profilePic", selectedProfile);
    formData.append("mentorId", mentor.id);

    axios
      .put("http://localhost:8080/api/user/mentor/detail/update", formData, {
        headers: {
          //    Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      })
      .then((resp) => {
        let response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            navigate("/mentor/profile");
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

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  return (
    <div>
      <div class="mt-2 d-flex aligns-items-center justify-content-center mb-4">
        <div class="card form-card shadow-lg" style={{ width: "60rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 text-center"
              style={{
                borderRadius: "1em",
                height: "45px",
              }}
            >
              <h5 class="card-title">Add Profile</h5>
            </div>
            <div class="card-body text-color">
              <form className="row g-3">
                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Bio</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bio"
                    name="bio"
                    onChange={handleInput}
                    value={profile.bio}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Profession</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="profession"
                    name="profession"
                    onChange={handleInput}
                    value={profile.profession}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Highest Qualification</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="highestQualification"
                    name="highestQualification"
                    onChange={handleInput}
                    value={profile.highestQualification}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Age</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    onChange={handleInput}
                    value={profile.age}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Experience</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="experience"
                    name="experience"
                    onChange={handleInput}
                    value={profile.experience}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label for="formFile" class="form-label">
                    <b> Select Profile Pic</b>
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    onChange={(e) => setSelectedProfile(e.target.files[0])}
                    required
                  />
                </div>
                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    class="btn bg-color custom-bg-text"
                    onClick={saveProfile}
                  >
                    Add Profile
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

export default AddProfile;

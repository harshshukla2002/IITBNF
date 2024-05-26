import React, { useEffect, useState } from "react";
import "../CSS/home.css";
import PdfViewer from "../Components/PDFViewer";
import { useNavigate } from "react-router-dom";
import Toast from "../Components/Toast";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Home = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({});
  const [viewPdf, setViewPdf] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("userId"));
  const token = JSON.parse(localStorage.getItem("token"));

  const HandleCVChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", "rfp8dbuf");
    // cloudinaryData.append(
    //   "cloud_name",
    //   process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    // );

    try {
      if (file) {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
          cloudinaryData
        );
        setUserData({ ...userData, cv: response.data.url });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handlePhotoChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", "rfp8dbuf");
    cloudinaryData.append(
      "cloud_name",
      process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    );

    try {
      if (file) {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          cloudinaryData
        );
        setUserData({ ...userData, photo: response.data.url });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const HandleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setMessage("Logout Success");
    setStatus("success");
    setShowToast(true);
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      setUserData(response.data.user);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage(error.response.data.message);
      setStatus("error");
      setShowToast(true);
    }
  };

  const HandleUpdate = async (id, data) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}update/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setStatus("success");
      setShowToast(true);
      getData();
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message);
      setStatus("error");
      setShowToast(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {showToast && <Toast {...{ message, status }} />}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="navbar">
        <h2>Profile</h2>
        <div className="disapprove-button" onClick={HandleLogout}>
          Logout
        </div>
      </div>
      {isEdit ? (
        <div className="edit-container">
          <div>
            <img
              src={userData?.photo}
              alt="user-profile"
              className="edit-profile-image"
            />
            <br />
            <input
              className="input"
              type="file"
              name="photo"
              accept=".jpeg,.jpg,.png"
              onChange={handlePhotoChange}
            />
          </div>
          <div>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              Username:
              <input
                className="input"
                type="text"
                name="username"
                placeholder="enter username"
                value={userData?.username}
                style={{ fontSize: "18px" }}
                onChange={handleChange}
              />
            </h2>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              Email:{" "}
              <input
                className="input"
                type="text"
                name="email"
                placeholder="enter username"
                value={userData?.email}
                style={{ fontSize: "18px" }}
                onChange={handleChange}
              />
            </h2>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              Dob:{" "}
              <input
                className="input"
                type="date"
                name="dob"
                value={userData?.dob}
                style={{ fontSize: "18px" }}
                onChange={handleChange}
              />
            </h2>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              CV:{" "}
              <input
                className="input"
                type="file"
                name="cv"
                accept=".pdf"
                onChange={HandleCVChange}
              />
            </h2>

            <div
              className="button-wrapper"
              onClick={() => {
                HandleUpdate(userId, userData);
                setIsEdit(false);
              }}
            >
              Edit
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="profile-container">
            <img
              src={userData?.photo}
              alt="user-profile"
              className="profile-image"
            />
            <div>
              <h2>
                Username: <span>{userData?.username}</span>
              </h2>
              <h2>
                Email: <span>{userData?.email}</span>
              </h2>
              <h2>
                Dob: <span>{userData?.dob}</span>
              </h2>
              <h2>
                CV:{" "}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setViewPdf(true)}
                >
                  Your CV
                </span>
              </h2>

              <div className="button-wrapper" onClick={() => setIsEdit(true)}>
                Edit
              </div>
            </div>
          </div>
          {viewPdf && <PdfViewer {...{ pdfUrl: userData?.cv, setViewPdf }} />}
        </>
      )}
    </div>
  );
};

export default Home;

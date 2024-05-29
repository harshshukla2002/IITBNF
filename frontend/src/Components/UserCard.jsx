import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const UserCard = ({ index, user, HandleAction, UpdateUser }) => {
  const [userData, setUserData] = useState(user);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return edit ? (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
              UpdateUser(userData._id, userData);
              setEdit(false);
            }}
          >
            Edit
          </div>
        </div>
      </div>{" "}
    </>
  ) : (
    <div className="user-card-wrapper">
      <h3>{index + 1}</h3>
      <img src={user.photo} alt={user.email} className="user-image" />
      <p style={{ width: "30%" }}>{user.email}</p>
      {user.status === "pending" ? (
        <div className="action-button-wrapper" style={{ width: "30%" }}>
          <div
            className="approve-button"
            onClick={() => HandleAction(user?._id, "approved")}
          >
            {" "}
            <FaCheck /> Approve
          </div>
          <div
            className="disapprove-button"
            onClick={() => HandleAction(user?._id, "disapproved")}
          >
            <ImCross /> Disapprove
          </div>
        </div>
      ) : user.status === "disapproved" ? (
        <div className="disapprove-badge" style={{ width: "10%" }}>
          Disapproved
        </div>
      ) : (
        <div className="approve-badge" style={{ width: "10%" }}>
          Approved
        </div>
      )}
      <div
        className="button-wrapper"
        style={{ width: "10%" }}
        onClick={() => setEdit(true)}
      >
        Edit
      </div>
    </div>
  );
};

export default UserCard;

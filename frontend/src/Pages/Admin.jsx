import React, { useEffect, useState } from "react";
import "../CSS/admin.css";
import UserCard from "../Components/UserCard";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Toast from "../Components/Toast";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");

  const getUsers = async (paramsObj) => {
    setLoading(true);
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: paramsObj,
      });
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const HandleAction = async (id, status) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}update/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setMessage(response.data.message);
      setStatus("success");
      setShowToast(true);
      getUsers();
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message);
      setStatus("error");
      setShowToast(true);
    }
  };

  const HandleLogout = () => {
    localStorage.removeItem("token");
    setMessage("Logout Success");
    setStatus("success");
    setShowToast(true);
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timeoutRef);
  }, [showToast]);

  useEffect(() => {
    const params = {};

    if (filterStatus) params.status = filterStatus;

    getUsers(params);
  }, [filterStatus]);

  const UpdateUser = async (userId, data) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}update/${userId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setStatus("success");
      setShowToast(true);
      getUsers();
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message);
      setStatus("error");
      setShowToast(true);
    }
  };

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
        <h2>Welcome Admin</h2>
        <div className="disapprove-button" onClick={HandleLogout}>
          Logout
        </div>
      </div>
      <div>
        <div className="table-header">
          <p style={{ fontSize: "30px" }}>User List</p>
          <select
            className="input"
            style={{ width: "30%" }}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="disapproved">Disapproved</option>
          </select>
        </div>
      </div>
      <div className="users-wrapper">
        {users.map((user, index) => {
          return (
            <UserCard
              key={index}
              {...{ index, user, HandleAction, UpdateUser }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Admin;

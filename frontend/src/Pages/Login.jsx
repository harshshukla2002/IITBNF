import React, { useEffect, useState } from "react";
import "../CSS/login.css";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Toast from "../Components/Toast";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const intialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [loginData, setLoginData] = useState(intialState);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const HandleLogin = async () => {
    if (loginData.username === "") {
      setMessage("username required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    if (loginData.password === "") {
      setMessage("password required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}login`,
        loginData
      );
      setLoading(false);
      setMessage(response.data.message);
      setStatus(response.data.token ? "success" : "error");
      setShowToast(true);
      if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("userId", JSON.stringify(response.data.userId));

        if (response.data.role === "admin") {
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMessage(error.response.data.message);
      setShowToast(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timeoutRef);
  }, [showToast]);

  return (
    <>
      {showToast && <Toast {...{ message, status }} />}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="login-container">
        <h1 className="header">Login</h1>
        <div className="form-wrapper">
          <div className="input-wrapper">
            <label className="input-label">Username</label> <br />
            <input
              className="input"
              type="text"
              placeholder="enter username"
              name="username"
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Password</label> <br />
            <div
              className="input"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <input
                style={{
                  outline: "none",
                  border: "none",
                  fontSize: "16px",
                  width: "100%",
                }}
                type={passwordShow ? "text" : "password"}
                placeholder="enter password"
                name="password"
                onChange={handleChange}
              />
              {passwordShow ? (
                <IoMdEyeOff
                  className="icon"
                  size={20}
                  onClick={() => setPasswordShow(false)}
                />
              ) : (
                <IoMdEye
                  className="icon"
                  size={20}
                  onClick={() => setPasswordShow(true)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="button-wrapper" onClick={HandleLogin}>
          Login
        </div>
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Don't have a account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </div>
    </>
  );
};

export default Login;

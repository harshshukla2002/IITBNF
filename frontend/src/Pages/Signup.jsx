import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import "../CSS/signup.css";
import Toast from "../Components/Toast";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ReCAPTCHA from "react-google-recaptcha";

const intialState = {
  email: "",
  password: "",
  username: "",
  dob: "",
  photo: "",
  cv: "",
};

const Signup = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [signupData, setSignupData] = useState(intialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef(null);

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
        setSignupData({ ...signupData, cv: response.data.url });
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
        setSignupData({ ...signupData, photo: response.data.url });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const HandleSignup = async () => {
    if (signupData.username === "") {
      setMessage("username required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    if (signupData.email === "") {
      setMessage("email required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    if (signupData.password === "") {
      setMessage("password required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    if (signupData.dob === "") {
      setMessage("dob required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    if (signupData.photo === "") {
      setMessage("photo required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    if (signupData.cv === "") {
      setMessage("cv required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    if (recaptchaToken === "") {
      setMessage("recaptcha verfication is required");
      setStatus("error");
      setShowToast(true);
      return;
    }
    setLoading(true);
    try {
      signupData.status = "pending";
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}signup`,
        { signupData, recaptchaToken }
      );

      console.log(response.data);

      setMessage(response?.data?.message);
      setStatus("success");
      setShowToast(true);
      setLoading(false);
      setSignupData(intialState);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      recaptchaRef.current.reset();
    } catch (error) {
      console.error(error);
      setMessage(error?.response?.data?.message);
      setStatus("error");
      setShowToast(true);
      setLoading(false);
      recaptchaRef.current.reset();
    }
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

      <div className="signup-container">
        <h1 className="header">Signup</h1>
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
            <label className="input-label">Email</label> <br />
            <input
              className="input"
              type="email"
              placeholder="enter email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <label className="input-label">DOB</label> <br />
            <input
              className="input"
              type="date"
              name="dob"
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
          <div className="input-wrapper">
            <label className="input-label">Photo</label> <br />
            <input
              className="input"
              type="file"
              name="photo"
              accept=".jpeg,.jpg,.png"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="input-wrapper">
            <label className="input-label">CV</label> <br />
            <input
              className="input"
              type="file"
              name="cv"
              accept="application/pdf"
              onChange={HandleCVChange}
            />
          </div>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
            onChange={(value) => setRecaptchaToken(value)}
          />
        </div>
        <div className="button-wrapper" onClick={HandleSignup}>
          Signup
        </div>
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Already have a account?{" "}
          <span className="signup-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </>
  );
};

export default Signup;

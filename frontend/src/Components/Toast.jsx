import React from "react";
import "../CSS/Toast.css";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

const Toast = ({ message, status }) => {
  return (
    <div className="toast-container">
      {status === "success" ? (
        <FaCircleCheck size={25} color="green" style={{ marginTop: "14px" }} />
      ) : (
        <MdOutlineError size={25} color="red" style={{ marginTop: "14px" }} />
      )}
      <p>{message}</p>
    </div>
  );
};

export default Toast;

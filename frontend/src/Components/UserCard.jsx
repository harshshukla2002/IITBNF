import React from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const UserCard = ({ index, user, HandleAction }) => {
  return (
    <div className="user-card-wrapper">
      <h3>{index + 1}</h3>
      <img src={user.photo} alt={user.email} className="user-image" />
      <p>{user.email}</p>
      {user.status === "pending" ? (
        <div className="action-button-wrapper">
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
        <div className="disapprove-badge">Disapproved</div>
      ) : (
        <div className="approve-badge">Approved</div>
      )}
    </div>
  );
};

export default UserCard;

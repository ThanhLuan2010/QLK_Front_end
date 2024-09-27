import React from "react";
import "./style.css";
import { convertMinutes } from "../../helper";

const PayslipItem = ({ icon, title, value }) => {
  return (
    <div
      style={{
        marginBottom: 12,
        flexDirection: "row",
        textAlign: "center",
      }}
      class="main-item"
    >
      <div class="left-item">
        <div style={{ marginRight: 4 }}>{icon}</div>
        <span>{title}</span>
      </div>
      <div style={{ marginLeft: 10 }} class="main-right-item">
        <span style={{ color: "#333333" }} class="right-item">
          {value == 0 || value == null ? 0 : convertMinutes(value)}
        </span>
      </div>
    </div>
  );
};

export default PayslipItem;

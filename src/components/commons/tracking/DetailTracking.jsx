import { Chip } from "@mui/material";
import React from "react";

const DetailTracking = ({ date, timeCheckin, timeCheckout }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingRight: 20,
        marginTop: 28,
        paddingBottom: 12,
        borderBottom: "1px solid #454545",
      }}
    >
      <div>20/10/2024</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Chip
            style={{ width: 60, color: "white", fontSize: 16 }}
            label="Vào"
            color="success"
          />
          <span>{timeCheckin && timeCheckin}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Chip
            style={{ width: 60, color: "white", fontSize: 16 }}
            label="Ra"
            color="warning"
          />
          <span>{timeCheckout ? timeCheckout : "Chưa cập nhập"}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailTracking;

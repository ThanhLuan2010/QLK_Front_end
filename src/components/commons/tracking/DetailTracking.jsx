import { Chip } from "@mui/material";
import React from "react";
import { convertISOToDateFormat, convertToHHandMM } from "../../../helper/XFunction";

const DetailTracking = ({ date, timeCheckin, timeCheckout, fined, checkinLate }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingRight: 20,
        marginTop: 28,
        paddingBottom: 12,
        // borderBottom: "1px solid #8c8c8c ",
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 20,
        padding: 10
      }}
    >
      <div>
        <p style={{ fontWeight: "inherit", fontSize: 16, color: "gray" }}>{convertISOToDateFormat(date)}</p>
        {fined > 0 && <p style={{ color: "red", fontSize: 16, marginTop: -12 }}>{`Bị trừ: ${fined} phút`}</p>
        }
        <div style={{
          width: '4rem', height: '2rem', backgroundColor: checkinLate > 0 ? "red" : "green", marginTop: -8,
          display: "flex", justifyContent: "center", alignItems: "center", color: "white", borderRadius: 10
        }}>{checkinLate > 0 ? `Vào trễ` : `Đúng giờ`}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Chip
            style={{ width: 50, color: "white", fontSize: 14 }}
            label="Vào"
            color="success"
          />
          <span>{timeCheckin && timeCheckin}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Chip
            style={{ width: 50, color: "white", fontSize: 14 }}
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

import React from "react";
import "./style.css";
import { convertMinutes } from "../../helper";
import { icons } from "../../utils/icons";

const PayslipItem = ({ data }) => {
  console.log("🚀 ~ PayslipItem ~ data:", data);
  const { TaskAltIcon, ErrorOutlineIcon, AlarmOnIcon } = icons;

  return (
    <div>
      <table>
        <tr style={{ display: "flex", marginBottom: 20 }}>
          <td
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              width: 320,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorOutlineIcon style={{ fontSize: "1.85rem", color: "red" }} />
              <span style={{ fontSize: 16, color: "gray" }}>
                Số lần vào làm trễ:
              </span>
            </div>
            <span style={{ fontSize: 16, color: "gray" }}>
              {data?.total_time_checkin_late || 0} lần
            </span>
          </td>
          <td
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              width: 320,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorOutlineIcon style={{ fontSize: "1.85rem", color: "red" }} />
              <span style={{ fontSize: 16, color: "gray" }}>
                Thời gian bị trừ:
              </span>
            </div>
            <span style={{ fontSize: 16, color: "gray" }}>
              {convertMinutes(data?.total_minutes_fined) || 0}
            </span>
          </td>
        </tr>
        <tr style={{ display: "flex", marginBottom: 20 }}>
          <td
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              width: 320,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorOutlineIcon style={{ fontSize: "1.85rem", color: "red" }} />
              <span style={{ fontSize: 16, color: "gray" }}>
                Số lần tan làm sớm:
              </span>
            </div>
            <span style={{ fontSize: 16, color: "gray" }}>
              {data?.total_time_checkout_early || 0} lần
            </span>
          </td>
          <td
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              width: 320,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TaskAltIcon style={{ fontSize: "1.85rem", color: "green" }} />
              <span style={{ fontSize: 16, color: "gray" }}>Thời gian OT:</span>
            </div>
            <span style={{ fontSize: 16, color: "gray" }}>
              {convertMinutes(data?.total_overtime) || 0}
            </span>
          </td>
        </tr>
        <tr style={{ display: "flex", marginBottom: 20 }}>
          <td
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              backgroundColor: "#0000",
              width: 320,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorOutlineIcon style={{ fontSize: "1.85rem", color: "red" }} />
              <span style={{ fontSize: 16, color: "gray" }}>
                Thời gian vào làm trễ:
              </span>
            </div>
            <span style={{ fontSize: 16, color: "gray" }}>
              {convertMinutes(data?.total_minutes_checkin_late) || 0}
            </span>
          </td>
          <td
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              width: 320,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AlarmOnIcon style={{ fontSize: "1.85rem", color: "blue" }} />
              <span style={{ fontSize: 16, color: "gray" }}>
                Tổng thời gian:
              </span>
            </div>
            <span style={{ fontSize: 16, color: "gray" }}>
              {convertMinutes(data?.total_time) || 0}
            </span>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default PayslipItem;

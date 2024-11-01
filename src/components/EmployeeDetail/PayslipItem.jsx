import React from "react";
import "./style.css";
import { convertMinutes } from "../../helper";
import { icons } from "../../utils/icons";
import i18n from "../../i18n/i18n";
import { Box } from "@mui/system";

const PayslipItem = ({ data }) => {
  const {
    ReportProblemIcon,
    AccessTimeIcon,
    AlarmOffIcon,
    RemoveCircleOutlineIcon,
    DoneOutlineIcon,
    ScheduleIcon,
  } = icons;

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "block", md: "block", lg: "block" },
        marginLeft: { xs: "none", sm: "12px", md: "0px", lg: "0px" },
        fontSize: { xs: "12px", sm: "12px", md: "12px", lg: "14px" },
      }}
    >
      <div>
        <table style={{ width: "100%" }}>
          <tr style={{ display: "flex", marginBottom: 20 }}>
            <td
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                width: "50%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ReportProblemIcon
                  className="icon-rgtrv"
                  style={{ fontSize: "1.25rem", color: "red" }}
                />
                <span className="font-payslip-dsadvcxd">
                  {" "}
                  {i18n.t("TOTAL_TIME_CHECKIN_LATER")}
                </span>
              </div>
              <span className="font-payslip-dsadvcxd">
                {data?.total_time_checkin_late || 0} {i18n.t("TOTAL_TIME")}
              </span>
            </td>
            <td
              style={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <RemoveCircleOutlineIcon
                  className="icon-rgtrv"
                  style={{ fontSize: "1.25rem", color: "#2196F3" }}
                />
                <span className="font-payslip-dsadvcxd">
                  {" "}
                  {i18n.t("TOTAL_MINUTES_MINUS")}
                </span>
              </div>
              <span className="font-payslip-dsadvcxd">
                {convertMinutes(data?.total_minutes_fined) || 0}
              </span>
            </td>
          </tr>
          <tr style={{ display: "flex", marginBottom: 20 }}>
            <td
              style={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <AccessTimeIcon
                  className="icon-rgtrv"
                  style={{ fontSize: "1.25rem", color: "#ffd700" }}
                />
                <span className="font-payslip-dsadvcxd">
                  {i18n.t("TOTAL_TIME_CHECKOUT_EARLY")}
                </span>
              </div>
              <span className="font-payslip-dsadvcxd">
                {data?.total_time_checkout_early || 0} {i18n.t("TOTAL_TIME")}
              </span>
            </td>
            <td
              style={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <DoneOutlineIcon
                  className="icon-rgtrv"
                  style={{ fontSize: "1.25rem", color: "green" }}
                />
                <span className="font-payslip-dsadvcxd">
                  {i18n.t("TOTAL_OVERTIME")}
                </span>
              </div>
              <span className="font-payslip-dsadvcxd">
                {convertMinutes(data?.total_overtime) || 0}
              </span>
            </td>
          </tr>
          <tr style={{ display: "flex", marginBottom: 20 }}>
            <td
              style={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                gap: 4,
                backgroundColor: "#0000",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <AlarmOffIcon
                  className="icon-rgtrv"
                  style={{ fontSize: "1.25rem", color: "#D32F2F" }}
                />
                <span className="font-payslip-dsadvcxd">
                  {i18n.t("TOTAL_MINUTES_CHECKIN_LATER")}
                </span>
              </div>
              <span className="font-payslip-dsadvcxd">
                {convertMinutes(data?.total_minutes_checkin_late) || 0}
              </span>
            </td>
            <td
              style={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ScheduleIcon
                  className="icon-rgtrv"
                  style={{ fontSize: "1.25rem", color: "#BDBDBD" }}
                />
                <span className="font-payslip-dsadvcxd">
                  {i18n.t("TOTAL_TIME_PAYSLIP")}
                </span>
              </div>
              <span className="font-payslip-dsadvcxd">
                {convertMinutes(data?.total_time) || 0}
              </span>
            </td>
          </tr>
        </table>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "gray",
              fontWeight: "bold",
            }}
          >
            {i18n.t("TOTAL")}
          </span>
          <span
            style={{
              fontSize: 16,
              color: "gray",
              fontWeight: "bold",
            }}
          >
            {convertMinutes(data?.total)}
          </span>
        </div>
      </div>
    </Box>
  );
};

export default PayslipItem;

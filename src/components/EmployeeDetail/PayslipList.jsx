import React from "react";
import "./style.css";
import { convertMinutes } from "../../helper";
import { icons } from "../../utils/icons";
import i18n from "../../i18n/i18n";
import { Box } from "@mui/system";

const PayslipList = ({ data }) => {
  const {
    ReportProblemIcon,
    AccessTimeIcon,
    AlarmOffIcon,
    RemoveCircleOutlineIcon,
    DoneOutlineIcon,
    ScheduleIcon,
  } = icons;

  return (
    <Box sx={{ display: { xs: "block", sm: "none", md: "none", lg: "none" } }} >
      <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", gap: 10 }}>

        <div style={{ display: "flex", gap: 3, textAlign: "center", alignItems: "center" }}>
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
        </div>

        <div style={{ display: "flex", gap: 3, textAlign: "center", alignItems: "center" }}>
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
        </div>

        <div style={{ display: "flex", gap: 3, textAlign: "center", alignItems: "center" }}>
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
        </div>

        <div style={{ display: "flex", gap: 3, textAlign: "center", alignItems: "center" }}>
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
        </div>

        <div style={{ display: "flex", gap: 3, textAlign: "center", alignItems: "center" }}>
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
        </div>

        <div style={{ display: "flex", gap: 3, textAlign: "center", alignItems: "center" }}>
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
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "gray",
              fontWeight: "bold"
            }}
          >
            {i18n.t("TOTAL")}
          </span>
          <span
            style={{
              fontSize: 18,
              color: "gray",
              fontWeight: "bold"
            }}
          >
            {convertMinutes(data?.total)}
          </span>
        </div>
      </div>
    </Box >
  );
};

export default PayslipList;

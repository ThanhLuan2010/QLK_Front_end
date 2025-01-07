import React from "react";
import "./style.css";
import { convertISOToDateFormat, convertMinutes } from "../../../helper";
import i18n from "../../../i18n/i18n";
import moment from "moment";

// const DATA_HEAD = [
//   `${i18n.t("TABLE_DAY")}`,
//   `${i18n.t("TABLE_CHECKIN")}`,
//   `${i18n.t("TABLE_CHECKOUT")}`,
//   `${i18n.t("TABLE_MINUS")}`,
// ];

const TableCustom = ({ data }) => {
  return (
    <div style={{ height: "100%" }}>
      {data?.length > 0 && (
        <div className="table-container">
          <table class="table-detail-tracking">
            <thead>
              <tr
                className="header-table-cvbna"
                style={{ fontSize: 16, color: "gray", fontWeight: "normal" }}
              >
                <th>{i18n.t("TABLE_DAY")}</th>
                <th>{i18n.t("TABLE_CHECKIN")}</th>
                <th>{i18n.t("TABLE_CHECKOUT")}</th>
                <th>{i18n.t("TABLE_MINUS")}</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className="body-table-cdsana"
                        style={{ fontWeight: "initial", fontSize: 16 }}
                      >
                        {convertISOToDateFormat(item?.createDate)}
                      </td>
                      <td
                        className="body-table-cdsana"
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          style={{
                            display: item?.startCheck ? "inline-block" : "none",
                            width: "auto",
                            paddingLeft: 10,
                            paddingRight: 10,
                            height: "1.5rem",
                            backgroundColor:
                              +item?.checkin_late > 0 ? "red" : "green",
                            lineHeight: "1.5rem",
                            color: "white",
                            borderRadius: 8,
                            textAlign: "center",
                          }}
                        >
                          {moment(item?.startCheck).format("HH:mm")}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          style={{
                            display: item?.endCheck ? "inline-block" : "none",
                            width: "auto",
                            paddingLeft: 10,
                            paddingRight: 10,
                            height: "1.5rem",
                            backgroundColor:
                              +item?.checkout_early > 0 ? "red" : "green",
                            lineHeight: "1.5rem",
                            color: "white",
                            borderRadius: 8,
                            textAlign: "center",
                          }}
                        >
                          {moment(item?.endCheck).format("HH:mm")}
                        </span>
                      </td>

                      <td
                        className="body-table-cdsana"
                        style={{ color: "red" }}
                      >{`${
                        item?.fined ? `${convertMinutes(item?.fined)}` : 0
                      }`}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableCustom;

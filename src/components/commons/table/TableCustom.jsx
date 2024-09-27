import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import "./style.css";
import { convertISOToDateFormat } from "../../../helper";

const DATA_HEAD = [
  "Mã nhân viên",
  "Tên nhân viên",
  "Chi nhánh",
  "Thời gian vào",
  "Thời gian ra",
  "Ngày",
];

const TableCustom = ({ data }) => {
  return (
    <TableContainer
      class="main-table"
      style={{
        marginBottom: 20,
        border: "1px solid #000",
        overflow: "hidden",
        overflowX: "auto",
        overflowY: "auto",
      }}
      component={Paper}
    >
      <Table
        sx={{
          width: "1100px",
          maxWidth: "100%",
        }}
        size="40px"
        aria-label="customized table"
        class="item-table"
      >
        <TableHead>
          <TableRow>
            {DATA_HEAD?.map((item, index) => {
              return index == 0 ? (
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#000",
                    fontSize: "16px",
                    borderBottom: "1px solid #00000",
                  }}
                >
                  {item}
                </TableCell>
              ) : (
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#000",
                    fontSize: "16px",
                    borderBottom: "1px solid #00000",
                  }}
                  align="right"
                >
                  {item}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => (
            <TableRow
              key={index}
              sx={{
                borderBottom: "none",
              }}
            >
              <TableCell
                sx={{
                  color: "#000",
                  fontSize: "18px",
                }}
                component="th"
                scope="row"
              >
                {item.staffid}
              </TableCell>
              <TableCell sx={{ color: "#000", fontSize: "16px" }} align="right">
                {item.staffName}
              </TableCell>
              <TableCell sx={{ color: "#000", fontSize: "16px" }} align="right">
                {item.branchID}
              </TableCell>
              <TableCell sx={{ color: "#000", fontSize: "16px" }} align="right">
                {item.startCheck}
              </TableCell>
              <TableCell sx={{ color: "#000", fontSize: "16px" }} align="right">
                {item.endCheck}
              </TableCell>
              <TableCell sx={{ color: "#000", fontSize: "16px" }} align="right">
                {convertISOToDateFormat(item.createDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableCustom;

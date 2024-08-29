import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { GridToolbar } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { converToName } from "../method";
import { GET_ALL_DOANHTHU_By_storeID_date } from "../debtor/handledoanhthu";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { confirmAlert } from "react-confirm-alert";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

import {
  Get_all_Store,
  Get_all_store_By_userid,
} from "../contacts/handlestore";
import HandleAccessAccount from "../handleAccess/handleAccess";
import i18n from "../../i18n/i18n";
import CommonStyle from "../../components/CommonStyle";
import {
  CalendarToday,
  Close,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";

const DOANHTHU = () => {
  const classes = CommonStyle();
  const nav = useNavigate();
  useTranslation();
  const theme = useTheme();
  const [stateStore, setStateStore] = useState([]); // Initialize as empty array
  const [selectionModel, setSelectionModel] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPopupNHAPHANG, setShowPopupNHAPHANG] = useState(false);
  const [stateContentModalNHAPHANG, setStatecontentModalNHAPHANG] = useState(
    []
  );
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [stateHoadon, setStateHoadon] = useState([]);
  const [stateTongtien, setStateTongtien] = useState({
    tongdoanhthu: 0,
    tongtienno: 0,
  });
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
  });

  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
  });

  const handleDateChange = (setter) => (date) => {
    setter(date);
  };
  const getMonthNameInVietnamese = (month) => {
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    return monthNames[month];
  };

  const handleDecrease = async () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate.getMonth() === 11) {
      newDate.setFullYear(newDate.getFullYear());
    }
    setCurrentDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${getMonthNameInVietnamese(
      newDate.getMonth()
    )}`;
    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
  };

  const handleExportExcel = async () => {
    let data = [];
    stateHoadon.forEach((element) => {
      let object = {
        [i18n.t("MADT_DT")]: element.id,
        [i18n.t("CN")]: converToName[element.storeID],
        [i18n.t("SOTIENTRATUCONNO")]: element.sotien,
        [i18n.t("SOTIENDOANHTHU")]: element.sotienThucte,
        [i18n.t("NGAYLAP_DT")]: element.thoidiem.split(" ")[0],
      };
      data.push(object);
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    const headerRow = worksheet.addRow([
      i18n.t("MADT_DT").toUpperCase(),
      i18n.t("MAKHO_DT").toUpperCase(),
      i18n.t("SOTIENTRATUCONNO").toUpperCase(),
      i18n.t("SOTIENDOANHTHU").toUpperCase(),
      i18n.t("NGAYLAP_DT").toUpperCase(),
    ]);
    headerRow.font = { bold: true, color: { argb: "FF000000" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    data.forEach((row) => {
      const rowData = Object.keys(row).map((key) => row[key]);
      worksheet.addRow(rowData);
    });
    worksheet.columns = [
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
    ];
    const columnD = worksheet.getColumn("D");
    columnD.alignment = { horizontal: "center", vertical: "middle" };
    columnD.numFmt = "#,##";
    const columnC = worksheet.getColumn("C");
    columnC.alignment = { horizontal: "center", vertical: "middle" };
    columnC.numFmt = "#,##";
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${i18n.t("DT")}-${converToName[statechinhanh]}.xlsx`;
    link.click();
  };

  const formattedDate = `${currentDate.getFullYear()}-${getMonthNameInVietnamese(
    currentDate.getMonth()
  )}`;

  const handleIncrease = async () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate.getMonth() === 0) {
      newDate.setFullYear(newDate.getFullYear());
    }
    setCurrentDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${getMonthNameInVietnamese(
      newDate.getMonth()
    )}`;
    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
  };

  const handleOpenPopupNHAPHANG = (content) => {
    setShowPopupNHAPHANG(true);
    setStatecontentModalNHAPHANG(content);
  };

  const handleClosePopupNHAPHANG = () => {
    setShowPopupNHAPHANG(false);
    setStatecontentModalNHAPHANG([]);
  };

  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
  };

  const [statelenghtID_bill, setstatelenghtID_bill] = useState(0);
  let chinhanhdau = "";
  let checkaccess = false;

  const convertStoreID = (params) => {
    const arrayObject = params.value;
    return (
      <>
        <span style={{ fontSize: "0.9rem" }}>
          {params.value} - {converToName[arrayObject]}
        </span>
      </>
    );
  };

  const checkAccess = async () => {
    const check = await HandleAccessAccount();
    if (check) {
      checkaccess = true;
    } else {
      checkaccess = false;
      nav("/");
    }
  };

  const colors = tokens(theme.palette.mode);

  const getlenghtID_Bill = () => {
    const arrayOfNumbers = stateHoadon.map((obj) =>
      parseInt(obj.id.replace(/[^\d]/g, ""), 10)
    );
    let maxNumber = Math.max(...arrayOfNumbers);
    if (maxNumber === -Infinity || maxNumber === Infinity) {
      maxNumber = 0;
    }
    setstatelenghtID_bill(maxNumber + 1);
  };

  function StatusMoney(params) {
    const arrayObject = params.value;
    const formattedNumber = parseInt(arrayObject).toLocaleString("en-US");
    return (
      <span
        style={{
          backgroundColor: "#22C75B",
          width: "100%",
          textAlign: "center",
          borderRadius: "40px",
          fontSize: "1rem",
          color: "white",
          padding: "2px",
        }}
      >
        {formattedNumber} VND
      </span>
    );
  }

  const formatDatetime = (params) => {
    const arrayObject = params.value.toString();
    const dateObject = new Date(arrayObject);
    const formattedDateTime = `${dateObject.getFullYear()}-${(
      dateObject.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateObject
      .getDate()
      .toString()
      .padStart(2, "0")} ${dateObject
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${dateObject
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    return <span>{formattedDateTime}</span>;
  };

  const columns = [
    { field: "id", flex: 1, headerName: `${i18n.t("MADT_DT")}` },
    {
      field: "storeID",
      headerName: `${i18n.t("MAKHO_DT")}`,
      flex: 1,
      renderCell: convertStoreID,
      cellClassName: "name-column--cell",
    },
    {
      field: "sotien",
      headerName: `${i18n.t("SOTIENTRATUCONNO")}`,
      renderCell: StatusMoney,
      flex: 1,
    },
    {
      field: "sotienThucte",
      headerName: `${i18n.t("TONGSOTIEN")}`,
      renderCell: StatusMoney,
      flex: 1,
    },
    {
      field: "Listdebtors",
      headerName: `${i18n.t("DSCONNO_DT")}`,
      renderCell: ArrayObjectCell,
      flex: 1,
    },
    {
      field: "ListOfCreditors",
      headerName: `${i18n.t("DSNOXACNHANNHAPHANG")}`,
      renderCell: ArrayObjectCellNHAPHANG,
      flex: 1,
    },
  ];

  const CustomPopup = ({ show, handleClose, content }) => {
    const sumSotienNo = content.reduce(
      (acc, debtor) => acc + parseFloat(debtor.sotienNo, 10),
      0
    );
    return (
      <Dialog
        open={show}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "10px",
            backgroundColor: "white",
            color: "black",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography
              variant="h3"
              fontWeight={"bold"}
              style={{ color: "black" }}
            >
              {i18n.t("MODAL_SOTIENNO")} : {sumSotienNo.toLocaleString("en-US")}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: "black", border: "2px solid black" }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "500px" }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã phiếu nợ</th>
                  <th>Chi nhánh nợ</th>
                  <th>Số tiền nợ</th>
                  <th>Thời điểm nợ</th>
                  <th>Lần cuối cập nhật số tiền</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.Debtor_BranchID} -{" "}
                      {converToName[item.Debtor_BranchID]}
                    </td>
                    <td>{item.sotienNo}</td>
                    <td>{item.ThoiDiemNo}</td>
                    <td>{item.LastPaymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  };

  const CustomPopupNHAPHANG = ({ show, handleClose, content }) => {
    const sumSotienNo = content.reduce(
      (acc, debtor) => acc + parseInt(debtor.sotien, 10),
      0
    );
    return (
      // <Modal show={show} onHide={handleClose} centered size="lg">
      //   <Modal.Header style={{ color: "black" }} closeButton>
      //     <Modal.Title>Tổng số tiền đã trả : {sumSotienNo}</Modal.Title>
      //   </Modal.Header>
      //   <Modal.Body
      //     style={{ maxWidth: "100%", overflow: "scroll", maxHeight: "500px" }}
      //   >
      //     <div className="table-container">
      //       <table className="custom-table">
      //         <thead>
      //           <tr>
      //             <th>Mã phiếu nhập</th>
      //             <th>Mã chi nhánh</th>
      //             <th>Số tiền trả</th>
      //             <th>Ngày lập phiếu</th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           {content.map((item) => (
      //             <tr key={item.id}>
      //               <td>{item.id}</td>
      //               <td>
      //                 {item.StoreID} - {converToName[item.StoreID]}
      //               </td>
      //               <td>{item.sotien}</td>
      //               <td>{item.ngaylap}</td>
      //             </tr>
      //           ))}
      //         </tbody>
      //       </table>
      //     </div>
      //   </Modal.Body>
      //   <Modal.Footer>
      //     <Button variant="secondary" onClick={handleClose}>
      //       Đóng
      //     </Button>
      //   </Modal.Footer>
      // </Modal>
      <Dialog
        open={show}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "10px",
            backgroundColor: "white",
            color: "black",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography
              variant="h3"
              fontWeight={"bold"}
              style={{ color: "black" }}
            >
              Tổng số tiền đã trả : {sumSotienNo}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: "black", border: "2px solid black" }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "500px" }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã phiếu nhập</th>
                  <th>Mã chi nhánh</th>
                  <th>Số tiền trả</th>
                  <th>Ngày lập phiếu</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.StoreID} - {converToName[item.StoreID]}
                    </td>
                    <td>{item.sotien}</td>
                    <td>{item.ngaylap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  };

  function ArrayObjectCellNHAPHANG(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Button
            className={classes.button}
            onClick={() => handleOpenPopupNHAPHANG(arrayObject)}
          >
            {numberOfItems} Items
          </Button>
        </Box>
      </div>
    );
  }

  function ArrayObjectCell(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Button
            className={classes.button}
            onClick={() => handleOpenPopup(arrayObject)}
          >
            {numberOfItems} Items
          </Button>
        </Box>
      </div>
    );
  }

  const handle_getAllDOANHTHU = async (e) => {
    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      e.target.value,
      formattedDate
    );
    setStatechinhanh(e.target.value);
  };

  const fetchingGetAllDoanhTHu_by_STOREID_year_month = async (x, y) => {
    const fetch = {
      storeID: x,
      thoidiem: y,
    };
    const check = await GET_ALL_DOANHTHU_By_storeID_date(fetch);
    let sotienthucte = 0;
    let sotienNo = 0;
    if (check instanceof Promise) {
      const resolvedResult = await check;
      const parsedResult = JSON.parse(resolvedResult);
      setStateHoadon(parsedResult);
      parsedResult.forEach((element) => {
        sotienthucte += parseFloat(element.sotienThucte);
        sotienNo += parseFloat(element.sotien);
      });
    } else {
      const parsedResult = JSON.parse(check);
      setStateHoadon(parsedResult);
      parsedResult.forEach((element) => {
        sotienthucte += parseFloat(element.sotienThucte);
        sotienNo += parseFloat(element.sotien);
      });
    }
    setStateTongtien({
      tongdoanhthu: sotienthucte,
      tongtienno: sotienNo,
    });
  };

  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      chinhanhdau,
      formattedDate
    );
    setStatechinhanh(chinhanhdau);
  };

  useEffect(() => {
    fetchingapi();
    getlenghtID_Bill();
  }, []);

  const handleSelectionModelChange = (newSelectionModel) => {
    if (
      newSelectionModel.some(
        (selectedId) =>
          statePhieuStore.find((row) => row.id === selectedId)?.status ===
          "DONE"
      )
    ) {
      return;
    }
    setSelectionModel(newSelectionModel);
  };

  const fetchingStore = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = await Get_all_Store();
      const parsedResult = JSON.parse(objBranch);

      setStateStore(parsedResult);
      chinhanhdau = parsedResult[0]?.id || "";
    } else {
      const objBranch = await Get_all_store_By_userid();
      const parsedResult = JSON.parse(objBranch);

      setStateStore(parsedResult);
      chinhanhdau = parsedResult[0]?.id || "";
    }
  };

  return (
    <Box m="20px">
      <Header
        title={i18n.t("TITLEDOANHTHU")}
        subtitle={i18n.t("DESDOANHTHU")}
      />
      <Box>
        <Typography
          ml={2}
          fontWeight="600"
          color={colors.grey[100]}
          variant="body2"
        >
          {i18n.t("CN")}
        </Typography>
        <FormControl sx={{ maxWidth: "300px", width: "100%" }}>
          <Select
            value={statechinhanh}
            onChange={handle_getAllDOANHTHU}
            className={classes.select}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#3f3f3f",
                  boxShadow: "none",
                  borderRadius: " 20px",
                  marginTop: "8px",
                  transition: "background-color 0.3s ease-in-out",
                  maxHeight: 300,
                  padding: 10,
                  overflowY: "hidden",
                },
              },
              MenuListProps: {
                className: "custom-scroll",
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            {stateStore &&
              stateStore.map((object, index) => (
                <MenuItem key={index} value={object.id}>
                  {object.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Box my={2}>
        <Typography color={colors.grey[100]} variant="h3">
          {i18n.t("THOIDIEMLAP")} YYYY-MM
        </Typography>
        <Box
          color={colors.grey[100]}
          display="flex"
          // justifyContent="center"
          flexDirection="row"
          alignItems="center"
          justifyContent={"center"}
          paddingY={0.5}
          gap={{ xs: 7, sm: 8, md: 8 }}
          borderRadius={"40px"}
          border={"1px #D7D7D7 solid "}
          maxWidth={"270px"}
          width={"100%"}
        >
          <IconButton
            onClick={handleDecrease}
            sx={{
              backgroundColor: colors.grey[200],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Typography fontWeight="bold" fontSize={"1rem"} variant="h5">
            {formattedDate}
          </Typography>
          <IconButton
            onClick={handleIncrease}
            sx={{
              backgroundColor: colors.grey[200],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
      <Box
        width={"100%"}
        display={"flex"}
        my={2}
        flexDirection={"row"}
        alignItems={"center"}
        gap={2}
      >
        <Box>
          <Typography
            ml={2}
            fontWeight="600"
            color={colors.grey[100]}
            variant="body2"
          >
            Từ ngày
          </Typography>
          <FormControl>
            <ReactDatePicker
              selected={startDate}
              onChange={handleDateChange(setStartDate)}
              dateFormat="dd/MM/yyyy"
              customInput={
                <TextField
                  name="thoidiem"
                  fullWidth
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarToday sx={{ color: colors.grey[100] }} />
                      </InputAdornment>
                    ),
                  }}
                />
              }
            />
          </FormControl>
        </Box>
        <Box>
          <Typography
            ml={2}
            fontWeight="600"
            color={colors.grey[100]}
            variant="body2"
          >
            Đến ngày
          </Typography>
          <FormControl>
            <ReactDatePicker
              selected={endDate}
              onChange={handleDateChange(setEndDate)}
              dateFormat="dd/MM/yyyy"
              customInput={
                <TextField
                  name="thoidiem"
                  fullWidth
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarToday sx={{ color: colors.grey[100] }} />
                      </InputAdornment>
                    ),
                  }}
                />
              }
            />
          </FormControl>
        </Box>
      </Box>
      <Box m="40px 0 0 0" height="75vh" className={classes.datagrid}>
        <Box>
          <Box
            gap={1}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <Typography color={colors.grey[100]}>
              *{i18n.t("TONGSOTIEN")} :{" "}
            </Typography>
            <Typography color={"red"} fontWeight="bold" variant="h4">
              {parseInt(stateTongtien.tongdoanhthu).toLocaleString("en-US")} VND
            </Typography>
          </Box>
          <Box
            gap={1}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <Typography color={colors.grey[100]}>
              *{i18n.t("SOTIENTRATUCONNO")} :{" "}
            </Typography>
            <Typography color={"red"} fontWeight="bold" variant="h4">
              {parseInt(stateTongtien.tongtienno).toLocaleString("en-US")} VND
            </Typography>
          </Box>

          <br />
        </Box>

        <Box>
          <Button className={classes.buttonExport} onClick={handleExportExcel}>
            {i18n.t("Export")}
          </Button>
        </Box>
        <br />
        <DataGrid
          editMode="row"
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rows={stateHoadon}
          columns={columns}
        />
      </Box>
      <CustomPopup
        show={showPopup}
        handleClose={handleClosePopup}
        content={stateContentModal}
      />
      <CustomPopupNHAPHANG
        show={showPopupNHAPHANG}
        handleClose={handleClosePopupNHAPHANG}
        content={stateContentModalNHAPHANG}
      />
    </Box>
  );
};

export default DOANHTHU;

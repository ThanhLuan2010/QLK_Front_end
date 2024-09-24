import {
  Box,
  Typography,
  useTheme,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import React from "react";
import { GridToolbar } from "@mui/x-data-grid";
import HandleAccessAccount from "../handleAccess/handleAccess";
import ExcelJS from "exceljs";
import {
  Get_all_Store,
  Get_all_store_By_userid,
} from "../contacts/handlestore";

import { Modal } from "react-bootstrap";
import { Update_SOTIEN_DOANHTHU_By_TWOid } from "./handlePhieustore";
import { Update_SOTIEN_Listdebtors } from "./handledoanhthu";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { converToName } from "../method";
import { GET_ALLDEBTOR_BY_Debtor_Year_month } from "./handleDebtor";
import * as XLSX from "xlsx";
import CommonStyle from "../../components/CommonStyle";
import {
  CalendarToday,
  Close,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
const DEBTORS = () => {
  const classes = CommonStyle();
  const nav = useNavigate();
  useTranslation();
  const theme = useTheme();
  const [stateStore, setStateStore] = useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [stateHoadon, setStateHoadon] = useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stateformDebtor, setstateformDebtor] = useState({
    Note: "",
    sotienNo: "",
  });
  const [statesotiencapnhat, setstatesotiencapnhat] = useState({
    sotiencapnhat: 0,
  });

  const [statelenghtID_bill, setstatelenghtID_bill] = useState(0);
  let chinhanhdau = "";
  let checkaccess = false;
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
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
    // await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
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
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
    //await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
  };
  const checkAccess = async () => {
    const check = HandleAccessAccount();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      if (resolvedResult === "true" || resolvedResult) {
        checkaccess = resolvedResult;
      } else {
        checkaccess = resolvedResult;
        nav("/");
      }
    } else {
      if (check === "true" || check) {
        checkaccess = true;
      } else {
        checkaccess = false;
        nav("/");
      }
    }
  };

  const handleExportExcel = async () => {
    // Mảng JSON chứa dữ liệu
    let data = [];
    stateHoadon.forEach((element) => {
      let object = {
        [i18n.t("MA_CN")]: element.id,
        [i18n.t("CHUNO_CN")]: converToName[element.Owner_BranchID],
        [i18n.t("CONNO")]: converToName[element.Debtor_BranchID],
        [i18n.t("THOIDIEMNO_CN")]: element.ThoiDiemNo.split(" ")[0],
        [i18n.t("SOTIENNO_CN")]: element.sotienNo,
        [i18n.t("GHICHU")]: element.Note,
        [i18n.t("LANCUOICAPNHAT")]: element.LastPaymentDate.split(" ")[0],
      };
      data.push(object);
    });
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Tạo dòng header tùy chỉnh
    const headerRow = worksheet.addRow([
      i18n.t("MA_CN").toUpperCase(),
      i18n.t("CHUNO_CN").toUpperCase(),
      i18n.t("CONNO").toUpperCase(),
      i18n.t("THOIDIEMNO_CN").toUpperCase(),
      i18n.t("SOTIENNO_CN").toUpperCase(),
      i18n.t("GHICHU").toUpperCase(),
      i18n.t("LANCUOICAPNHAT").toUpperCase(),
    ]);
    headerRow.font = { bold: true, color: { argb: "FF000000" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };

    // Đặt dữ liệu
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
      { width: 30 },
      { width: 30 },
    ];
    // Định dạng cột B
    const columnE = worksheet.getColumn("E");
    columnE.alignment = { horizontal: "center", vertical: "middle" };
    columnE.numFmt = "#,##";

    // Xuất workbook vào tệp Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `"Debtor"-${converToName[statechinhanh]}.xlsx`;
    link.click();
  };

  function ArrayObjectCell(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;
    let money = 0;
    arrayObject.forEach((element) => {
      money += parseFloat(element.sotien) * parseFloat(element.soluong);
    });
    return (
      <>
        <Box>
          <Button
            className={classes.button}
            onClick={() => handleOpenPopup(arrayObject)}
          >
            {" "}
            {numberOfItems} Items
          </Button>
        </Box>
      </>
    );
  }
  function StatusMoney(params) {
    const arrayObject = params.value;

    // Định dạng số thành chuỗi với dấu phân cách
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
  const convertStoreID = (params) => {
    const arrayObject = params.value;

    return (
      <>
        <span
          style={{
            width: "100%",
            fontSize: "0.9rem",
          }}
        >
          {arrayObject} - {converToName[arrayObject]}
        </span>
      </>
    );
  };
  const colors = tokens(theme.palette.mode);
  const getlenghtID_Bill = () => {
    // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên

    const arrayOfNumbers = stateHoadon.map((obj) =>
      parseInt(obj.id?.replace(/[^\d]/g, ""), 10)
    );

    // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
    let maxNumber = Math.max(...arrayOfNumbers);
    const result = 1 / 0;

    const negativeInfinity = -1 / 0;

    if (maxNumber === negativeInfinity || maxNumber === result) {
      maxNumber = 0;
    }
    let lenghtState = maxNumber + 1;

    setstatelenghtID_bill(lenghtState);
  };
  const CustomPopup = ({ show, handleClose, content, money }) => {
    return (
      <Dialog
        open={show}
        onClose={handleClose}
        maxWidth="sm"
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
              {i18n.t("DetailProduct")}
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
                  <th>{i18n.t("MASP_P")}</th>
                  <th>{i18n.t("TEN_P")}</th>
                  <th>{i18n.t("LOAI_P")}</th>
                  <th>{i18n.t("SOLUONG_P")}</th>
                  <th>{i18n.t("SOTIEN_NP")}</th>
                  {/* <th>Hình ảnh</th>
                   <th>Hành vi</th> */}
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.loai}</td>
                    <td>{item.soluong}</td>
                    <td>
                      {" "}
                      {parseInt(item.sotien).toLocaleString("en-US")} VND
                    </td>
                    {/* <td>
                      {item.picture ? (
                        <img width={200} height={100} src={item.picture}></img>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>{item.behavior}</td> */}
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
  const columns = [
    { field: "id", flex: 1, headerName: `${i18n.t("MA_CN")}` },
    {
      field: "OrderId",
      headerName: `${i18n.t("MAPN_PX")}`,
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Owner_BranchID",
      headerName: `${i18n.t("CHUNO_CN")}`,
      flex: 1.1,
      renderCell: convertStoreID,
      cellClassName: "name-column--cell",
    },

    {
      field: "ThoiDiemNo",
      headerName: `${i18n.t("THOIDIEMNO_CN")}`,
      flex: 1,
    },
    {
      field: "sotienNo",
      headerName: `${i18n.t("SOTIENNO_CN")}`,
      flex: 1,
      renderCell: StatusMoney,
    },
    {
      field: "Note",
      headerName: `Ghi chú`,
      flex: 1,
    },
    {
      field: "LastPaymentDate",
      headerName: `${i18n.t("LANCUOICAPNHAT")}`,
      flex: 1,
    },
    {
      field: "arrayProduct",
      headerName: `${i18n.t("SOLUONGSP_PX")}`,
      flex: 1,
      renderCell: ArrayObjectCell,
    },
  ];
  const onChangeNote = (event) => {
    setstateformDebtor({
      ...stateformDebtor,
      [event.target.name]: event.target.value,
    });
  };
  const onChangeSotiencapnhat = (event) => {
    let value = event.target.value;

    // Chuyển đổi giá trị thành số nguyên
    value = parseInt(value, 10);

    // Kiểm tra giới hạn giá trị từ 0 đến 200
    if (value < 0) {
      value = 0;
    } else if (value > stateformDebtor.sotienNo) {
      value = stateformDebtor.sotienNo;
    }

    setstatesotiencapnhat({
      ...statesotiencapnhat,
      [event.target.name]: value,
    });
  };
  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
  };
  const updateSotien = async () => {
    const formEdit = {
      id: stateformDebtor.id,
      Owner_BranchID: stateformDebtor.Owner_BranchID,
      Debtor_BranchID: stateformDebtor.Debtor_BranchID,
      sotienNo: statesotiencapnhat.sotiencapnhat,
      sotiencapnhat: Math.abs(
        statesotiencapnhat.sotiencapnhat - stateformDebtor.sotienNo
      ),
      Note: stateformDebtor.Note,
      ThoiDiemNo: stateformDebtor.ThoiDiemNo,
    };
    if (!formEdit.sotienNo) {
      formEdit.sotienNo = 0;
    }
    if (!formEdit.sotiencapnhat) {
      formEdit.sotiencapnhat = 0;
    }

    const check = await Update_SOTIEN_DOANHTHU_By_TWOid(formEdit);
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );

    if (JSON.parse(check).success) {
      alert(`${i18n.t("ALERT_CAPNHATSUCCESS")}`);
      const updateSoTienDoanhThuListdebtor = {
        storeID: formEdit.Owner_BranchID,
        storeIDNo: formEdit.Debtor_BranchID,
        DebtorId: JSON.parse(check).debtorupdate.id,
        thoidiem: JSON.parse(check).debtorupdate.ThoiDiemNo,
        sotien: parseFloat(formEdit.sotienNo),
        sotiencapnhat: parseFloat(formEdit.sotiencapnhat),
      };
      await Update_SOTIEN_Listdebtors(updateSoTienDoanhThuListdebtor);

      setstatesotiencapnhat({
        sotiencapnhat: 0,
      });
      setSelectionModel([]);
    }
  };
  const handle_getAllDOANHTHU = async (e) => {
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      e.target.value,
      formattedDate
    );
    setStatechinhanh(e.target.value);
  };
  const fetchingGetAllDEBTOR_by_STOREID_year_month = async (x, y) => {
    const req = {
      storeID: x,
      thoidiem: y,
    };

    const check = await GET_ALLDEBTOR_BY_Debtor_Year_month(req);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateHoadon(JSON.parse(resolvedResult));
    } else {
      setStateHoadon(JSON.parse(check));
    }
  };

  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
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
    if (newSelectionModel.length > 0) {
      const selectedId = newSelectionModel[0];
      const selectedRowData = stateHoadon.find((row) => row.id === selectedId);

      setSelectedRow(selectedRowData);

      const jsonString = JSON.stringify(selectedRowData);
      const parsedObject = JSON.parse(jsonString);

      setstateformDebtor(parsedObject);
    } else {
      setSelectedRow(null);
    }

    setSelectionModel(newSelectionModel);
  };
  const fetchingStore = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = Get_all_Store();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateStore(JSON.parse(resolvedResult));

        chinhanhdau = JSON.parse(resolvedResult)[0].id;
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
      }
    } else {
      const objBranch = Get_all_store_By_userid();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateStore(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].id;
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
      }
    }
  };

  return (
    <Box m="20px">
      <Header title={i18n.t("TITLECONNO")} subtitle={i18n.t("DESCONNO")} />
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
            displayEmpty
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
        <Button
          className={classes.buttonEdit}
          data-toggle="modal"
          data-target="#staticBackdropEdit"
          disabled={selectionModel.length !== 1}
        >
          {i18n.t("BTN_CAPNHATSOTIEN")}
        </Button>

        <div
          class="modal fade"
          id="staticBackdropEdit"
          data-backdrop="static"
          data-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5
                  style={{ color: "black" }}
                  class="modal-title"
                  id="staticBackdropLabel"
                >
                  {i18n.t("MODAL_DIEUCHINHTT")}
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" style={{ color: "black" }}>
                <label htmlFor="name" name="sotienNo">
                  {i18n.t("MODAL_SOTIENNO")}
                </label>
                <input
                  type="text"
                  value={stateformDebtor.sotienNo}
                  name="sotienNo"
                  disabled
                ></input>
                <label htmlFor="name" name="sotiencapnhat">
                  {i18n.t("MODAL_SOTIENTHU")}
                </label>
                <input
                  type="number"
                  min={0}
                  max={stateformDebtor.sotienNo}
                  value={statesotiencapnhat.sotiencapnhat}
                  onChange={onChangeSotiencapnhat}
                  name="sotiencapnhat"
                ></input>

                <label htmlFor="Note" name="Note">
                  Ghi chú
                </label>
                <textarea
                  rows={5}
                  name="Note"
                  cols={40}
                  type="text"
                  value={stateformDebtor.Note}
                  onChange={onChangeNote}
                ></textarea>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  {i18n.t("BTN_DONG")}
                </button>
                <button
                  type="button"
                  data-dismiss="modal"
                  class="btn btn-primary"
                  onClick={updateSotien}
                >
                  {i18n.t("BTN_XACNHAN")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <Box>
        {" "}
        <Typography color={colors.grey[100]} variant="h3">
          {i18n.t("LANCUOICAPNHATYYY")}
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
      <Box height="75vh" className={classes.datagrid}>
        <Box my={2}>
          <Button className={classes.buttonExport} onClick={handleExportExcel}>
            {i18n.t("Export")}
          </Button>
        </Box>
        <DataGrid
          editMode="row"
          checkboxSelection
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
    </Box>
  );
};

export default DEBTORS;

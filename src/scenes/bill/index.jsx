import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import React from "react";
import ExcelJS from "exceljs";
import { GridToolbar } from "@mui/x-data-grid";
import HandleAccessAccount from "../handleAccess/handleAccess";
import {
  Get_all_Store,
  Get_all_store_By_userid,
} from "../contacts/handlestore";

import { GET_ALLBILL_BY_NOIMUA_year_month } from "./handlebills";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConvertStoreIdTONAME, converToName } from "../method";
import CommonStyle from "../../components/CommonStyle";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
const DOANHTHU = () => {
  useTranslation();
  const classes = CommonStyle();
  const nav = useNavigate();
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stateStore, setStateStore] = useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [stateHoadon, setStateHoadon] = useState([]);

  const [statelenghtID_bill, setstatelenghtID_bill] = useState(0);
  let chinhanhdau = "";
  let checkaccess = false;

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

  const handleExportExcel = async () => {
    // Mảng JSON chứa dữ liệu
    let data = [];
    stateHoadon.forEach((element) => {
      let object = {
        [i18n.t("MAHD_HD")]: element.id,
        [i18n.t("MAPX_PX")]: element.OrderID,
        [i18n.t("NOIBAN_HD")]: converToName[element.noiban],
        [i18n.t("MODAL_GIAMUA")]: parseFloat(element.giamua),
        [i18n.t("GIABAN_HD")]: parseFloat(element.giaban),
      };
      data.push(object);
    });
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Tạo dòng header tùy chỉnh
    const headerRow = worksheet.addRow([
      i18n.t("MAHD_HD"),
      i18n.t("MAPX_PX"),
      i18n.t("NOIBAN_HD"),
      i18n.t("MODAL_GIAMUA"),
      i18n.t("GIABAN_HD"),
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
    ];

    const columnD = worksheet.getColumn("D");
    columnD.alignment = { horizontal: "center", vertical: "middle" };
    columnD.numFmt = "#,##";

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
    await fetchingGetAllHoaDon_by_STOREID_year_month(
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
    await fetchingGetAllHoaDon_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
    // await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
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
  const colors = tokens(theme.palette.mode);
  const getlenghtID_Bill = () => {
    // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên

    const arrayOfNumbers = stateHoadon.map((obj) =>
      parseInt(obj.id.replace(/[^\d]/g, ""), 10)
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
  function StatusMoney(params) {
    const arrayObject = params.value;

    // Định dạng số thành chuỗi với dấu phân cách
    const formattedNumber = parseInt(arrayObject).toLocaleString("en-US");
    return (
      <span
        style={{
          backgroundColor: "green",
          width: "100%",
          textAlign: "center",
          borderRadius: "40px",
          fontSize: "1.1rem",
          color: "white",
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
        <span>
          {" "}
          {arrayObject} - {converToName[arrayObject]}
        </span>
      </>
    );
  };
  const formatDatetime = (params) => {
    const arrayObject = params.value.toString();

    const isoString = arrayObject;

    // Tạo một đối tượng Date từ chuỗi ISO 8601
    const dateObject = new Date(isoString);

    // Định dạng ngày giờ theo định dạng mong muốn (năm-tháng-ngày giờ:phút:giây)
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

    return (
      <>
        <span>{formattedDateTime}</span>
      </>
    );
  };
  const columns = [
    { field: "id", flex: 1, headerName: `${i18n.t("MAHD_HD")}` },
    {
      field: "phieuxuatID",
      headerName: `${i18n.t("MAPX_PX")}`,
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "noiban",
      headerName: `${i18n.t("NOIBAN_HD")}`,
      renderCell: convertStoreID,
      flex: 1,
    },

    {
      field: "giaban",
      headerName: `${i18n.t("GIABAN_HD")}`,
      renderCell: StatusMoney,
      flex: 1,
    },
    {
      field: "giamua",
      headerName: `${i18n.t("GIAMUA_HD")}`,
      renderCell: StatusMoney,
      flex: 1,
    },

    {
      field: "CreateAt",
      headerName: `${i18n.t("NGAYLAP_HD")}`,
      renderCell: formatDatetime,
      flex: 1,
    },
  ];

  const handle_getAllHoadon = async (e) => {
    await fetchingGetAllHoaDon_by_STOREID_year_month(
      e.target.value,
      formattedDate
    );
    setStatechinhanh(e.target.value);
  };
  const fetchingGetAllHoaDon_by_STOREID_year_month = async (x, y) => {
    const request = {
      storeID: x,
      thoidiem: y,
    };
    const check = await GET_ALLBILL_BY_NOIMUA_year_month(request);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateHoadon(JSON?.parse(resolvedResult));
    } else {
      setStateHoadon(JSON?.parse(check));
    }
  };

  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGetAllHoaDon_by_STOREID_year_month(
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
      <Header title={i18n.t("TITLEHOADON")} subtitle={i18n.t("DESHOADON")} />
      <Box>
        <Typography
          ml={2}
          fontWeight="600"
          color={colors.grey[100]}
          variant="body2"
        >
          {i18n.t("CN")}
        </Typography>{" "}
        <FormControl sx={{ maxWidth: "300px", width: "100%" }}>
          <Select
            value={statechinhanh}
            onChange={handle_getAllHoadon}
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
      <div
        style={{
          display: "flex",
          maxWidth: "50%",
          justifyContent: "space-between",
          marginLeft: "0px",
        }}
        className="container"
      ></div>
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
      <Button className={classes.buttonExport} onClick={handleExportExcel}>
      {i18n.t("Export")}

      </Button>
      <Box m="40px 0 0 0" height="75vh" className={classes.datagrid}>
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
    </Box>
  );
};

export default DOANHTHU;

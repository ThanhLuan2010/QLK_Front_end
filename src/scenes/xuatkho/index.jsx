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
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import React from "react";
import { GridToolbar } from "@mui/x-data-grid";
import HandleAccessAccount from "../handleAccess/handleAccess";
import {
  Get_all_Store,
  Get_all_store_By_userid,
} from "../contacts/handlestore";
import { converToName } from "../method";
import { converIdToCODE } from "../method";
import { confirmAlert } from "react-confirm-alert";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import CSS của Bootstrap
import { Get_all_Order } from "./handlePhieustore";
import {
  createBills,
  Get_all_Bill_By_userID,
  Update_PhieuOrder_By_id,
} from "./handlebills";
import ExcelJS from "exceljs";
import { createProduct } from "../contacts/handleproduct";
import { Update_ListOfCreditors_Listdebtors_By_id } from "../doanhthu/handledoanhthu";
import { createDebtor, Get_all_DEBTOR } from "./handleCreateDebtor";
import { Update_DOANHTHU_BY_storeID_thoidiem } from "./handleCreateDebtor";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { EditProduct } from "../contacts/handleproduct";
import { DeletePhieuOrder } from "./handlePhieustore";
import { json, useNavigate } from "react-router-dom";
import { getAllOrder_BY_storeID } from "../Order/handleform";
import { CreateIdMaxValueOfarray, converToNameWithoutPTT } from "../method";
import {
  Update_PhieuStore_By_id_PENDING,
  Update_PhieuStore_By_id,
} from "../invoices/handlePhieustore";
import {
  UPdateProductStatusOrder,
  Get_all_Order_By_StoreID_Year_Month,
} from "./handlePhieustore";
import { Get_all_Product_By_StoreID } from "../contacts/handleproduct";
import * as XLSX from "xlsx";
import CommonStyle from "../../components/CommonStyle";
import {
  CalendarToday,
  Close,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import zIndex from "@mui/material/styles/zIndex";
import ReactDatePicker from "react-datepicker";
const Invoices = () => {
  useTranslation();
  const classes = CommonStyle();
  const theme = useTheme();
  const [stateStore, setStateStore] = useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [statePhieuStoreDeleted, setStatePhieuStoreDeleted] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [stateHoadon, setStateHoadon] = useState([]);
  const [selectedRow, setSelectedRow] = React.useState([]);
  const [isloading, setisloading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stateFormBills, setStateFormbills] = useState({
    id: "",
    OrderID: "",
    sotien: "",
    userID: "",
    noiban: "",
    noimua: "",
    giaban: 0,
    giamua: 0,
    phieuxuatID: "",
  });
  let chinhanhdau = "";
  let code = "";
  const [stateCode, setstateCode] = useState("");
  const [statelenghtID_bill, setstatelenghtID_bill] = useState(0);

  // Sử dụng state để lưu trạng thái của checkbox
  const [isCheckedNoiban, setIsCheckedNoiban] = useState(false);
  const [isCheckedNoimua, setIsCheckedNoimua] = useState(false);
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
    await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
    console.log(formattedDate);
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
    await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
  };

  // Hàm xử lý sự kiện khi checkbox thay đổi trạng thái
  const handleCheckboxNoibanChange = () => {
    setIsCheckedNoiban(!isCheckedNoiban); // Đảo ngược trạng thái hiện tại
    // Bạn có thể thực hiện các hành động khác ở đây nếu cần thiết
  };
  const [selectedOptionnoiban, setSelectedOptionnoiban] = useState("");
  const handleSelectChangeNoiban = (event) => {
    const selectedValue = event.target.value;
    setSelectedOptionnoiban(selectedValue);
  };

  const [selectedOptionnoimua, setSelectedOptionnoimua] = useState("");
  const handleSelectChangeNoimua = (event) => {
    const selectedValue = event.target.value;
    setSelectedOptionnoimua(selectedValue);
  };

  const handleCheckboxNoiMuaChange = () => {
    setIsCheckedNoimua(!isCheckedNoimua); // Đảo ngược trạng thái hiện tại
    // Bạn có thể thực hiện các hành động khác ở đây nếu cần thiết
  };
  const nav = useNavigate();
  const checkAccess = async () => {
    const check = HandleAccessAccount();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      if (resolvedResult === "true" || resolvedResult) {
      } else {
        nav("/");
      }
    } else {
      if (check === "true" || check) {
      } else {
        nav("/");
      }
    }
  };
  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
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
  const onChangeFormBills = (event) => {
    getlenghtID_Bill();

    setStateFormbills({
      ...stateFormBills,
      id: "HD" + statelenghtID_bill,
      OrderID: selectionModel[0],

      userID: localStorage.getItem("id"),
      [event.target.name]: event.target.value,
    });
  };
  const caculategiaban = () => {
    setStateFormbills({
      ...stateFormBills,
      giaban:
        parseFloat(stateFormBills.giamua) +
        parseFloat(stateFormBills.giamua) * 0.15,
    });
  };
  const CustomPopup = ({ show, handleClose, content }) => {
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
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.loai}</td>
                    <td>{item.soluong}</td>
                    <td>{parseInt(item.sotien).toLocaleString("en-US")} VND</td>
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
  const handleExportBill = async (id) => {
    const item = statePhieuStore.find((item) => item.id === id);
    if (!item) {
      console.error("Item not found");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Merge các ô từ A1 tới F2 để tạo tiêu đề
    worksheet.mergeCells("A1:F2");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "PHIẾU XUẤT KHO";
    titleCell.font = { size: 20, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Ngày lập phiếu
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    worksheet.getCell("F3").value = `Ngày lập phiếu: ${formattedDate}`;

    // Mã phiếu xuất
    worksheet.getCell("A4").value = `Mã phiếu xuất: ${item.id}`;

    // Nơi bán
    worksheet.getCell("A5").value = "Nơi bán: PHOTO TIME";

    // Lấy mã chi nhánh từ mã phiếu nhập
    const noimua = item.phieustoreID.split("-")[1];
    worksheet.getCell("A6").value = `Nơi mua: ${noimua}`;

    // Dòng trống
    worksheet.getCell("A7").value = "";

    // Tiêu đề bảng
    const headerRow = worksheet.addRow([
      "STT",
      "Mã sản phẩm",
      "Tên sản phẩm",
      "Số lượng",
      "Đơn giá",
      "Thành tiền",
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    // Dữ liệu bảng
    let totalAmount = 0;
    item.arrayProduct.forEach((product, index) => {
      const thanhTien = product.soluong * product.sotien;
      totalAmount += thanhTien;
      const row = worksheet.addRow([
        index + 1,
        product.id,
        product.loai,
        product.soluong,
        product.sotien,
        thanhTien,
      ]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Dòng tổng cộng
    worksheet.addRow([]);
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "Tổng cộng",
      totalAmount,
    ]);
    totalRow.getCell(5).font = { bold: true };
    totalRow.getCell(5).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Dòng trống
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Người lập phiếu và Người nhận hàng
    const footerRow = worksheet.addRow([
      "",
      "",
      "",
      "Người lập phiếu",
      "Người nhận hàng",
    ]);
    footerRow.getCell(4).font = { bold: true };
    footerRow.getCell(4).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    footerRow.getCell(5).font = { bold: true };
    footerRow.getCell(5).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    const signatureRow = worksheet.addRow([
      "",
      "",
      "",
      "(Ký, họ tên)",
      "(Ký, họ tên)",
    ]);

    signatureRow.getCell(4).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    signatureRow.getCell(5).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 20;
    worksheet.getColumn("D").width = 20;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 30;

    // Xuất workbook vào tệp Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `PhieuXuatKho-${item.id}.xlsx`;
    link.click();
  };

  const columns = [
    { field: "id", flex: 0.5, headerName: `${i18n.t("MAPX_PX")}` },
    {
      field: "phieustoreID",
      headerName: `${i18n.t("MAPN_PX")}`,
      flex: 0.5,
      cellClassName: "name-column--cell",
    },

    {
      field: "status",
      headerName: `${i18n.t("TINHTRANG_PX")}`,
      renderCell: StatusObjectCell,
      flex: 0.5,
    },

    {
      field: "CreateAt",
      headerName: `${i18n.t("NGAYLAP_PX")}`,
      renderCell: UpdatedateObjectCell,
      flex: 0.5,
    },
    {
      field: "updateDate",
      headerName: `${i18n.t("NGAYCAPNHAT_PX")}`,
      flex: 0.5,
    },
    {
      field: "arrayProduct",
      headerName: `${i18n.t("SOLUONGSP_PX")}`,
      flex: 1,
      renderCell: ArrayObjectCell,
    },
    {
      // field: "arrayProduct",
      headerName: "Hóa đơn",
      flex: 0.5,
      renderCell: (params) => (
        <Box height={"60%"}>
          <Button
            className={classes.buttonExport}
            onClick={() => handleExportBill(params.row.id)}
          >
            Export
          </Button>
        </Box>
      ),
    },
  ];

  function UpdatedateObjectCell(params) {
    const arrayObject = params.value;
    const originalDateString = arrayObject;
    const originalDate = new Date(originalDateString);

    // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = originalDate.getDate().toString().padStart(2, "0");
    const hours = originalDate.getHours().toString().padStart(2, "0");
    const minutes = originalDate.getMinutes().toString().padStart(2, "0");
    const seconds = originalDate.getSeconds().toString().padStart(2, "0");

    // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return (
      <span
        style={{
          width: "100%",
          fontSize: "0.9rem",
          padding: "2px",
        }}
      >
        {formattedDateString}
      </span>
    );
  }
  function StatusObjectCell(params) {
    let arrayObject = params.value;

    if (arrayObject.includes("DELETED")) {
      arrayObject = arrayObject.replace("DELETED", "").trim();
    }

    if (arrayObject === "PENDING") {
      return (
        <span
          style={{
            backgroundColor: "#FFC107",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    } else {
      return (
        <span
          style={{
            backgroundColor: "#22C75B",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    }
  }
  const deletedphieu = async () => {
    if (
      selectionModel.some(
        (selectedId) =>
          statePhieuStore.find((row) => row.id === selectedId)?.status ===
          "DONE"
      )
    ) {
      alert("Không thể xóa đơn đã DONE !!!");
      return;
    }
    setisloading(true);
    try {
      const checkde = await DeletePhieuOrder(selectedRow);

      if (JSON.parse(checkde).success) {
        alert("Đã xóa thành công");
        let arrayupdate = [];
        selectedRow.forEach((element) => {
          arrayupdate.push(element.phieustoreID);
        });
        await Update_PhieuStore_By_id_PENDING(arrayupdate);
        setisloading(false);
      }

      await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
    } catch (error) {
      console.log(error);
    }
  };
  const AcceptRequest = async () => {
    try {
      const checkde = await UPdateProductStatusOrder(selectedRow);

      if (JSON.parse(checkde).success) {
        alert("Đã update thành công");
        setSelectionModel([]);
      }

      await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
    } catch (error) {
      console.log(error);
    }
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
        <Box
          display={"flex"}
          gap={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Button
            className={classes.button}
            onClick={() => handleOpenPopup(arrayObject)}
          >
            {" "}
            {numberOfItems} Items
          </Button>
          <div
            style={{
              fontSize: "1rem",
              backgroundColor: "#22C75B",
              padding: "5px",
              borderRadius: "40px",
              color: "white",
            }}
          >
            {parseInt(money).toLocaleString("en-US")} VND
          </div>
        </Box>
      </>
    );
  }

  const fetchingGettAllPhieuXuat = async () => {
    const check = await Get_all_Order();

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStatePhieuStore(JSON.parse(resolvedResult));
    } else {
      setStatePhieuStore(JSON.parse(check));
    }
  };
  const fetchingGetAllHoaDon = async () => {
    const check = await Get_all_Bill_By_userID();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateHoadon(JSON.parse(resolvedResult));
    } else {
      setStateHoadon(JSON.parse(check));
    }
  };

  const fetchingapi = async () => {
    //  await fetchingOrderBy_storeID(statc);
    await fetchingStore();
    await fetchingGetAllHoaDon();

    await fetchingOrderBy_storeID_By_year_month(chinhanhdau, formattedDate);
    setStatechinhanh(chinhanhdau);
  };
  useEffect(() => {
    checkAccess();
    fetchingapi();
    getlenghtID_Bill();
  }, []);
  const createBill = async () => {
    if (
      selectionModel.some(
        (selectedId) =>
          statePhieuStore.find((row) => row.id === selectedId)?.status ===
          "DONE"
      )
    ) {
      alert("Không thể lập hóa đơn đã DONE !!!");
      return;
    }
    // console.log("select row " + JSON.stringify(selectedRow));
    const currentDate2 = new Date();

    // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
    const year2 = currentDate2.getFullYear();
    const month2 = (currentDate2.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day2 = currentDate2.getDate().toString().padStart(2, "0");
    const hours2 = currentDate2.getHours().toString().padStart(2, "0");
    const minutes2 = currentDate2.getMinutes().toString().padStart(2, "0");
    const seconds2 = currentDate2.getSeconds().toString().padStart(2, "0");
    const milliseconds2 = currentDate2
      .getMilliseconds()
      .toString()
      .padStart(3, "0");

    // Tạo chuỗi datetime
    const datetimeString = `${year2}-${month2}-${day2} ${hours2}:${minutes2}:${seconds2}.${milliseconds2}`;

    const addformbill = {
      id: stateFormBills.id,
      OrderID: stateFormBills.OrderID,
      createbill: datetimeString,
      userID: stateFormBills.userID,
      noiban: stateFormBills.noiban,
      noimua: stateFormBills.noimua,
      giaban: stateFormBills.giaban,
      giamua: stateFormBills.giamua,
      phieuxuatID: selectionModel[0],
    };
    if (!isCheckedNoiban) {
      addformbill.noiban = selectedOptionnoiban;
    }
    if (!isCheckedNoimua) {
      addformbill.noimua = selectedOptionnoimua;
    }

    const check = await createBills(addformbill);
    const originalDate = JSON.parse(check).newBills.CreateAt;
    const formattedDatex = new Date(originalDate);

    const year = formattedDatex.getFullYear();
    const month = String(formattedDatex.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDatex.getDate()).padStart(2, "0");

    const convertedDate = `${year}-${month}-${day}`;
    try {
      await createDEBTOR(convertedDate, addformbill);
      if (checkAccess) {
        await Update_PhieuOrder_By_id(selectionModel);
        let updateStatusPhieuStore = [];
        selectionModel.forEach(async (obj) => {
          updateStatusPhieuStore = statePhieuStore.filter(
            (item) => item.id === obj
          );
        });
        let arraytemp = [];
        if (updateStatusPhieuStore.length > 0) {
          let arraytemp2 = [];
          arraytemp2.push(updateStatusPhieuStore[0].phieustoreID);
          let jsontemp = {
            array: arraytemp2,
            newmoney: addformbill.giaban,
          };
          arraytemp.push(jsontemp);
        }
        console.log(arraytemp);
        await Update_PhieuStore_By_id(arraytemp);
        await fetchingOrderBy_storeID_By_year_month(
          statechinhanh,
          formattedDate
        );
        setstatelenghtID_bill(statelenghtID_bill + 1);

        const checktemp = await Get_all_Product_By_StoreID(
          selectedOptionnoimua
        );
        let lenghtState = 0;
        if (checktemp instanceof Promise) {
          // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
          const resolvedResult = await checktemp;
          let maxNumber = 0;
          selectedRow.forEach(async (obj) => {
            const updateMoney = statePhieuStore.filter(
              (item) => item.phieustoreID === obj.phieustoreID
            );

            updateMoney.forEach(async (obj) => {
              const a = obj.arrayProduct;
              let maxItem = null;
              const createProductPromises = a.map(async (obj, index) => {
                let createproduct = {};

                const filteredArray = JSON.parse(resolvedResult).filter(
                  (item) => item.id.startsWith(obj.id.split("-")[0])
                );
                if (filteredArray.length > 0) {
                  // Nếu có phần tử thì tìm số lớn nhất

                  filteredArray.forEach((item) => {
                    const number = parseInt(item.id.split("-")[1]);
                    if (!isNaN(number) && number > maxNumber) {
                      maxNumber = number;
                      maxItem = item;
                    }
                  });

                  createproduct = {
                    id:
                      obj.id.split("-")[0] + "-" + (parseFloat(maxNumber) + 1),
                    name: obj.name,
                    xuatxu: obj.xuatxu,
                    picture: obj.picture,
                    loai: obj.loai,
                    soluong: obj.soluong,
                    status: obj.status,
                    sotien: obj.sotien,
                    StoreID: selectedOptionnoimua,
                    behavior: obj.behavior,
                  };
                } else {
                  createproduct = {
                    id: obj.id,
                    name: obj.name,
                    xuatxu: obj.xuatxu,
                    picture: obj.picture,
                    loai: obj.loai,
                    soluong: obj.soluong,
                    status: obj.status,
                    sotien: obj.sotien,
                    StoreID: selectedOptionnoimua,
                    behavior: obj.behavior,
                  };
                }
                maxNumber++;
                // Trả về promise của createProduct
                return createProduct(createproduct);
              });
              await Promise.all(createProductPromises);
            });
          });
        } else {
          let maxNumber = 0;
          selectedRow.forEach(async (obj) => {
            const updateMoney = statePhieuStore.filter(
              (item) => item.phieustoreID === obj.phieustoreID
            );

            updateMoney.forEach(async (obj) => {
              const a = obj.arrayProduct;
              let maxItem = null;
              const createProductPromises = a.map(async (obj, index) => {
                let createproduct = {};

                const filteredArray = JSON.parse(checktemp).filter((item) =>
                  item.id.startsWith(obj.id.split("-")[0])
                );
                if (filteredArray.length > 0) {
                  // Nếu có phần tử thì tìm số lớn nhất

                  filteredArray.forEach((item) => {
                    const number = parseInt(item.id.split("-")[1]);
                    if (!isNaN(number) && number > maxNumber) {
                      maxNumber = number;
                      maxItem = item;
                    }
                  });

                  createproduct = {
                    id:
                      obj.id.split("-")[0] + "-" + (parseFloat(maxNumber) + 1),
                    name: obj.name,
                    xuatxu: obj.xuatxu,
                    picture: obj.picture,
                    loai: obj.loai,
                    soluong: obj.soluong,
                    status: obj.status,
                    sotien: obj.sotien,
                    StoreID: selectedOptionnoimua,
                    behavior: obj.behavior,
                  };
                } else {
                  createproduct = {
                    id: obj.id,
                    name: obj.name,
                    xuatxu: obj.xuatxu,
                    picture: obj.picture,
                    loai: obj.loai,
                    soluong: obj.soluong,
                    status: obj.status,
                    sotien: obj.sotien,
                    StoreID: selectedOptionnoimua,
                    behavior: obj.behavior,
                  };
                }
                maxNumber++;
                // Trả về promise của createProduct
                return createProduct(createproduct);
              });
              await Promise.all(createProductPromises);
            });
          });
        }

        await fetchingOrderBy_storeID_By_year_month(
          statechinhanh,
          formattedDate
        );
        alert(`${i18n.t("ALERT_LAPHOADONSUCCESS")}`);

        setStateFormbills({
          id: "",
          OrderID: "",
          sotien: "",
          userID: "",
          noiban: "",
          noimua: "",
          giaban: 0,
          giamua: 0,
          phieuxuatID: "",
        });
        setSelectionModel([]);
      }
    } catch (error) {
      console.log("lỗi " + error);
    }
  };

  const handleExportExcel = async () => {
    // Mảng JSON chứa dữ liệu
    let data = [];
    let filteredArray = [];
    if (selectedRow.length <= 0) {
      filteredArray = statePhieuStore.filter((obj) => {
        return obj.status === "DONE";
      });
    } else {
      filteredArray = selectedRow.filter((obj) => {
        return obj.status === "DONE";
      });
    }

    filteredArray.forEach((element) => {
      element.arrayProduct.forEach((child) => {
        let object = {
          NGAYCAPNHAT_PX: element.updateDate.split(" ")[0],
          TENCH: converToNameWithoutPTT[element.phieustoreID.split("-")[1]],
          MASP_P: child.id,
          TEN_P: child.name,
          LOAI_P: child.loai,
          SOLUONG_P: child.soluong,
          SOTIEN_NP: parseFloat(child.sotien),
          THUE: 0,
          THANHTIEN: 0,
          GHICHU: "",
        };
        data.push(object);
      });
    });
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Tạo dòng header tùy chỉnh
    const headerRow = worksheet.addRow([
      i18n.t("NGAYCAPNHAT_PX").toUpperCase(),
      i18n.t("TEN_B").toUpperCase(),
      i18n.t("MASP_P").toUpperCase(),
      i18n.t("TEN_P").toUpperCase(),
      i18n.t("LOAI_P").toUpperCase(),
      i18n.t("SOLUONG_P").toUpperCase(),

      i18n.t("SOTIEN_NP").toUpperCase(),
      i18n.t("THUE").toUpperCase(),
      i18n.t("THANHTIEN").toUpperCase(),
      i18n.t("GHICHU").toUpperCase(),
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
      { width: 15 },
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    // Định dạng cột
    const columnC = worksheet.getColumn("F");
    columnC.alignment = { horizontal: "center", vertical: "middle" };
    columnC.numFmt = "#,##";
    const columnG = worksheet.getColumn("G");
    columnG.alignment = { horizontal: "center", vertical: "middle" };
    columnG.numFmt = "#,##";
    // Định dạng cột C
    const columnH = worksheet.getColumn("H");
    columnH.alignment = { horizontal: "center", vertical: "middle" };
    const columnI = worksheet.getColumn("I");
    columnI.alignment = { horizontal: "center", vertical: "middle" };

    // Xuất workbook vào tệp Excel
    // Đặt dữ liệu

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${i18n.t("TITLEXUATKHO")}-${
      converToName[statechinhanh]
    }.xlsx`;
    link.click();
  };
  const createDEBTOR = async (x, addformbill) => {
    const check = await Get_all_DEBTOR();
    // Tạo một đối tượng Date hiện tại
    const currentDate = new Date();

    // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const milliseconds = currentDate
      .getMilliseconds()
      .toString()
      .padStart(3, "0");

    // Tạo chuỗi datetime
    const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    let lenghtState = 0;

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      const arrayOfNumbers = resolvedResult.map((obj) =>
        parseInt(obj.id.split("-")[2])
      );
      if (arrayOfNumbers) {
        // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
        let maxNumber = Math.max(...arrayOfNumbers);
        const result = 1 / 0;

        const negativeInfinity = -1 / 0;

        if (maxNumber === negativeInfinity || maxNumber === result) {
          maxNumber = 0;
        }
        lenghtState = maxNumber + 1;
      }

      const FormcreateDebTor = {
        id:
          "DEB" +
          "-" +
          converIdToCODE[selectedOptionnoimua] +
          "-" +
          lenghtState,
        Debtor_BranchID: stateFormBills.noimua,
        Owner_BranchID: stateFormBills.noiban,
        sotienNo: stateFormBills.giaban,
        ThoiDiemNo: datetimeString,
        LastPaymentDate: "...",
      };
      if (!isCheckedNoiban) {
        FormcreateDebTor.Owner_BranchID = selectedOptionnoiban;
      }
      if (!isCheckedNoimua) {
        FormcreateDebTor.Debtor_BranchID = selectedOptionnoimua;
      }

      const updateDoanhThu = {
        storeID: addformbill.noiban,
        thoidiem: x,
        ListOfCreditors: [],
        Listdebtors: FormcreateDebTor,
      };
      const updatesotiennoiban = {
        storeID: addformbill.noiban,
        thoidiem: x,
      };
      const updatesotiennoimua = {
        storeID: addformbill.noimua,
        thoidiem: x,
      };
      await createDebtor(FormcreateDebTor);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoiban);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoimua);
      await Update_ListOfCreditors_Listdebtors_By_id(updateDoanhThu);
    } else {
      const arrayOfNumbers = JSON.parse(check).map((obj) =>
        parseInt(obj.id.split("-")[2])
      );
      if (arrayOfNumbers) {
        let maxNumber = Math.max(...arrayOfNumbers);
        const result = 1 / 0;

        const negativeInfinity = -1 / 0;

        if (maxNumber === negativeInfinity || maxNumber === result) {
          maxNumber = 0;
        }
        lenghtState = maxNumber + 1;
      }

      const FormcreateDebTor = {
        id:
          "DEB" +
          "-" +
          converIdToCODE[selectedOptionnoimua] +
          "-" +
          lenghtState,
        Debtor_BranchID: stateFormBills.noimua,
        Owner_BranchID: stateFormBills.noiban,
        sotienNo: stateFormBills.giaban,
        ThoiDiemNo: datetimeString,
        LastPaymentDate: "...",
        Note: "....",
        arrayProduct: selectedRow[0].arrayProduct,
        OrderId: selectedRow[0].id,
      };

      if (!isCheckedNoiban) {
        FormcreateDebTor.Owner_BranchID = selectedOptionnoiban;
      }
      if (!isCheckedNoimua) {
        FormcreateDebTor.Debtor_BranchID = selectedOptionnoimua;
      }

      const updateDoanhThu = {
        storeID: addformbill.noiban,
        thoidiem: x,
        ListOfCreditors: [],
        Listdebtors: FormcreateDebTor,
      };
      const updatesotiennoiban = {
        storeID: addformbill.noiban,
        thoidiem: x,
      };
      const updatesotiennoimua = {
        storeID: addformbill.noimua,
        thoidiem: x,
      };
      await createDebtor(FormcreateDebTor);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoiban);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoimua);
      await Update_ListOfCreditors_Listdebtors_By_id(updateDoanhThu);
    }
  };
  const formatDateToYMD = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  console.log("startDate", formatDateToYMD(startDate));
  const fetchingOrderBy_storeID_By_year_month = async (storeID, thoidiem) => {
    const request = {
      storeID: storeID,
      thoidiem: thoidiem,
    };

    try {
      const check = await Get_all_Order_By_StoreID_Year_Month(request);

      if (check instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await check;

        const orders = JSON.parse(resolvedResult);

        // Separate orders with and without "DELETED" in their status
        const deletedOrders = orders.filter((order) =>
          order.status.includes("DELETED")
        );
        const nonDeletedOrders = orders.filter((order) =>
          order.status.includes("DONE")
        );

        setStatePhieuStore(nonDeletedOrders);
        setStatePhieuStoreDeleted(deletedOrders);
      } else {
        const orders = JSON.parse(check);

        // Separate orders with and without "DELETED" in their status
        const deletedOrders = orders.filter((order) =>
          order.status.includes("DELETED")
        );
        const nonDeletedOrders = orders.filter((order) =>
          order.status.includes("DONE")
        );

        setStatePhieuStore(nonDeletedOrders);
        setStatePhieuStoreDeleted(deletedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders by store ID and year-month", error);
    }
  };

  const handle_getAllProduct = async (e) => {
    setStatechinhanh(e.target.value);

    await fetchingOrderBy_storeID_By_year_month(e.target.value, formattedDate);
    const selectedStore = stateStore.find(
      (store) => store.id === e.target.value
    );
    if (selectedStore) {
      console.log("Selected Store:", selectedStore.id);
      const selectedId = selectedStore.id;
      setstateCode(selectedId);
    } else {
      console.log("Store not found");
    }
  };
  const handleSelectionModelChange = (newSelectionModel) => {
    // Lấy thông tin của các hàng được chọn

    const selectedRows = newSelectionModel.map((selectedId) =>
      statePhieuStore.find((row) => row.id === selectedId)
    );

    if (selectedRows) {
      setSelectedRow(selectedRows);
    }

    // if (
    // newSelectionModel.some(
    //   (selectedId) =>
    //     statePhieuStore.find((row) => row.id === selectedId)?.status ===
    //     "DONE"
    // )
    // ) {
    //   return;
    // }
    setSelectionModel(newSelectionModel);
  };

  const fetchingStore = async () => {
    const objBranch = Get_all_Store();

    if (objBranch instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await objBranch;

      setStateStore(JSON.parse(resolvedResult));

      chinhanhdau = JSON.parse(resolvedResult)[0].id;
      setStatechinhanh(chinhanhdau);
      code = JSON.parse(resolvedResult)[0].code;

      setstateCode(code);
    } else {
      // Nếu không phải là promise, cập nhật state ngay lập tức
      setStateStore(JSON.parse(objBranch));

      chinhanhdau = JSON.parse(objBranch)[0].id;
      setStatechinhanh(chinhanhdau);
      code = JSON.parse(objBranch)[0].code;

      setstateCode(code);
    }
  };

  const showAlertHuy = async () => {
    // if (selectionModelOff.length === 0) {
    //   alert("Hãy chọn dữ liệu xóa !!!!");
    //   return;
    // }
    // setIsloadingDeleted(true);
    // confirmAlert({
    //   title: `Xóa nhân viên khỏi hệ thống`,
    //   message: `Bạn có chắc là xóa chứ ???`,
    //   buttons: [
    //     {
    //       label: "Yes",
    //       onClick: async () => {
    //         try {
    //           const dataDeleted = selectRowOff.map(async (item) => {
    //             await HandleDeletedStaffOff(item);
    //           });
    //           await Promise.all(dataDeleted);
    //           setSelectionModelOff([]);
    //           setSelectRowOff([]);
    //           await fetchingGettAllStaftOff_by_branchID(statechinhanh);
    //           setIsloadingDeleted(false);
    //         } catch (error) {
    //           console.log(error);
    //         }
    //       },
    //     },
    //     {
    //       label: "No",
    //       onClick: () => alert(`${i18n.t("CLICKNO_NP")}`),
    //     },
    //   ],
    // });
  };
  const undostaff = async () => {
    try {
      const check = await UPdateProductStatusOrder(selectedRow);

      if (JSON.parse(check).success) {
        alert("Đã update thành công");
        setSelectionModel([]);
      }

      await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box m="20px">
      <Header
        title={`${i18n.t("TITLEXUATKHO")}`}
        subtitle={`${i18n.t("DESXUATKHO")}`}
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
            onChange={handle_getAllProduct}
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
        {/* <Button
          className={classes.buttonAdd}
          data-toggle="modal"
          data-target="#staticBackdropEdit"
          disabled={selectionModel.length !== 1}
        >
          {i18n.t("BTN_LAPHOADON")}
        </Button> */}
        {/* {isloading ? (
          <Button style={{ marginLeft: "1%" }} className={classes.buttonDelete}>
            <i class="fa fa-spinner fa-spin mr-1"></i> Deleting..
          </Button>
        ) : (
          <Button
            style={{ marginLeft: "1%" }}
            className={classes.buttonDelete}
            disabled={selectionModel.length === 0}
            onClick={deletedphieu}
          >
            {i18n.t("XOAPHIEUXUATKHO")}
          </Button>
        )} */}
        {/* //Xác nhận yêu cầu đơn nào thì sẽ chuyển trạng thái sang DONE, và tính và trừ
        vào so tiền thực tế của chi nhánh đó và đồng thời đưa sản phẩm vào trong kho */}
        {/* <button
          type="button"
          style={{ marginLeft: "1%", color: "whitesmoke" }}
          class="btn btn-info"
          disabled={selectionModel.length === 0}
          onClick={AcceptRequest}
        >
          {i18n.t("XACNHANYEUCAU")}
        </button> */}
      </Box>
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
                {i18n.t("BTN_LAPHOADON")}
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
              <div
                style={{
                  display: "flex",

                  justifyContent: "space-between",
                }}
              >
                <label htmlFor="noiban">{i18n.t("MODAL_NOIBAN")}</label>
                {/* <div style={{ display: "flex" }}>
                  <label
                    htmlFor="Nnoiban"
                    style={{ display: "flex", width: "100%" }}
                  >
                    {" "}
                    {i18n.t("MODAL_NHAPNOIBAN")}{" "}
                  </label>
                  <input
                    id="Nnoiban"
                    checked={isCheckedNoiban}
                    onChange={handleCheckboxNoibanChange}
                    style={{ width: "15%" }}
                    type="checkbox"
                  ></input>
                </div> */}
              </div>
              {isCheckedNoiban ? (
                <input
                  type="text"
                  onChange={onChangeFormBills}
                  value={stateFormBills.noiban}
                  name="noiban"
                ></input>
              ) : (
                <select
                  onChange={handleSelectChangeNoiban}
                  value={selectedOptionnoiban}
                  id="noiban"
                >
                  <option value={"0"}>
                    --------------------------------------------------
                  </option>
                  {stateStore &&
                    stateStore.map((object, index) => (
                      <React.Fragment key={index}>
                        <option value={object.id}>{object.name}</option>
                      </React.Fragment>
                    ))}
                </select>
              )}
              <label htmlFor="giaban">{i18n.t("MODAL_GIAMUA")}</label>
              <input
                type="number"
                onChange={onChangeFormBills}
                value={stateFormBills.giamua}
                name="giamua"
              ></input>

              <div
                style={{
                  display: "flex",

                  justifyContent: "space-between",
                }}
              >
                <label htmlFor="noimua">{i18n.t("MODAL_NOIMUA")}</label>
                {/* <div style={{ display: "flex" }}>
                  <label
                    htmlFor="Nnoimua"
                    style={{ display: "flex", width: "100%" }}
                  >
                    {" "}
                    {i18n.t("MODAL_NHAPNOIMUA")}{" "}
                  </label>
                  <input
                    id="Nnoimua"
                    value={isCheckedNoimua}
                    onChange={handleCheckboxNoiMuaChange}
                    style={{ width: "15%" }}
                    type="checkbox"
                  ></input>
                </div> */}
              </div>
              {isCheckedNoimua ? (
                <input
                  type="text"
                  onChange={onChangeFormBills}
                  value={stateFormBills.noimua}
                  name="noimua"
                ></input>
              ) : (
                <select
                  onChange={handleSelectChangeNoimua}
                  value={selectedOptionnoimua}
                  id="noimua"
                >
                  <option value={"0"}>
                    --------------------------------------------------
                  </option>
                  {stateStore &&
                    stateStore.map((object, index) => (
                      <React.Fragment key={index}>
                        <option value={object.id}>{object.name}</option>
                      </React.Fragment>
                    ))}
                </select>
              )}
              <button onClick={caculategiaban}>x15%</button>
              <label htmlFor="giaban"> {i18n.t("MODAL_GIABAN")}</label>
              <input
                type="number"
                onChange={onChangeFormBills}
                value={stateFormBills.giaban}
                name="giaban"
              ></input>
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
                onClick={createBill}
              >
                {i18n.t("BTN_XACNHAN")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Box my={2}>
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
      {/* <Button className={classes.buttonExport} onClick={handleExportExcel}>
        Export Excel
      </Button> */}

      <Box className={classes.datagrid} height="75vh">
        <DataGrid
          editMode="row"
          checkboxSelection
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rows={statePhieuStore}
          columns={columns}
        />
      </Box>
      {/* <Box mt={15} className={classes.datagrid} height="75vh">
        <Header title="PHIẾU ĐÃ XÓA"></Header>
        <Box display="flex" mb={3} gap={2}>
          <Button onClick={showAlertHuy} className={classes.buttonDelete}>
            Xóa phiếu
          </Button>

          <Button onClick={undostaff} className={classes.buttonEdit}>
            {i18n.t("OT_KHOIPHUCNV")}
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
          rows={statePhieuStoreDeleted}
          columns={columns}
        />
      </Box> */}
      <CustomPopup
        show={showPopup}
        handleClose={handleClosePopup}
        content={stateContentModal}
      />
    </Box>
  );
};

export default Invoices;

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Button,
  useTheme,
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
import DatePicker from "react-datepicker";
import { GridToolbar } from "@mui/x-data-grid";
import HandleAccessAccount from "../handleAccess/handleAccess";
import {
  Get_all_Store,
  Get_all_store_By_userid,
} from "../contacts/handlestore";
import {
  Update_PhieuStore_By_id_Invoces,
  Update_PhieuStore_By_id_CANCEL,
} from "./handlePhieustore";
import ExcelJS from "exceljs";
import { Update_SOTIENTHUCTE_By_DATE_STOREID } from "../doanhthu/handledoanhthu";
import {
  EditProduct,
  Get_all_Product_By_StoreID,
} from "../contacts/handleproduct";
import { confirmAlert } from "react-confirm-alert";
import { Modal } from "react-bootstrap";
import { createProduct } from "../contacts/handleproduct";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { Get_all_Phieu_Store_By_Year_Month } from "./handlePhieustore";

import { converToName } from "../method";
import CommonStyle from "../../components/CommonStyle";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { CalendarToday, Close } from "@mui/icons-material";
import { updateFirebasePhieuStore } from "../../utils/firebaseUtils";
const Invoices = () => {
  useTranslation();
  const theme = useTheme();
  const classes = CommonStyle();

  const [stateStore, setStateStore] = useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState([]);
  const [stateFormProduct, setStateFormProduct] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
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
  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
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
  const handleExportExcel = async () => {
    // Mảng JSON chứa dữ liệu
    let data = [];

    var filteredArray = statePhieuStore.filter((obj) => {
      return obj.status === "ACCEPT";
    });
    filteredArray.forEach((element) => {
      element.arrayProduct.forEach((child) => {
        let object = {
          MASP: child.id,
          LOAISP: child.loai,
          SOLUONGSP: parseFloat(child.soluong),
          SOTIENSP: parseFloat(child.sotien),
          SOTIENTT: element.sotienThucTe,
          MAPHIEU: element.id,
          LOAIPHIEU: element.loaiphieu,
          CHINHANH: converToName[child.StoreID],
          THOIDIEMTAO: element.ngaylap,

          UPDATEDATE: element.updateDate,
        };
        data.push(object);
      });
    });
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    let addrow = [
      i18n.t("MASP_P").toUpperCase(),
      i18n.t("LOAI_P").toUpperCase(),
      i18n.t("SOLUONG_P").toUpperCase(),
      i18n.t("SOTIEN_NP").toUpperCase(),
      i18n.t("SOTIENTTE"),
      i18n.t("MAPN_PX").toUpperCase(),
      i18n.t("LOAIPHIEU_NHAP").toUpperCase(),
      i18n.t("CN").toUpperCase(),
      i18n.t("THOIDIEMTAOPHIEU").toUpperCase(),
      i18n.t("NGAYCAPNHAT_NP").toUpperCase(),
    ];
    // Tạo dòng header tùy chỉnh
    const headerRow = worksheet.addRow(addrow);
    headerRow.font = { bold: true, color: { argb: "FF000000" } };
    for (let index = 1; index <= addrow.length; index++) {
      headerRow.getCell(index).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
    }

    // Đặt dữ liệu
    data.forEach((row) => {
      const rowData = Object.keys(row).map((key) => row[key]);
      worksheet.addRow(rowData);
    });

    worksheet.columns = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 10 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];
    // Định dạng cột B
    const columnB = worksheet.getColumn("D");
    columnB.alignment = { horizontal: "center", vertical: "middle" };
    columnB.numFmt = "#,##";
    // Định dạng cột C
    const columnC = worksheet.getColumn("C");
    columnC.alignment = { horizontal: "center", vertical: "middle" };
    columnC.numFmt = "#,##";

    const columnE = worksheet.getColumn("E");
    columnE.alignment = { horizontal: "center", vertical: "middle" };
    columnE.numFmt = "#,##";

    const columnG = worksheet.getColumn("G");
    columnG.alignment = { horizontal: "center", vertical: "middle" };

    const columnI = worksheet.getColumn("I");
    columnI.alignment = { horizontal: "center", vertical: "middle" };

    // Xuất workbook vào tệp Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${i18n.t("ALERT_PHIEUNHAP")}-${
      converToName[statechinhanh]
    }.xlsx`;
    link.click();
  };

  const PrintTableButton = () => {
    const handlePrintTable = () => {
      // Lấy đối tượng table có id="tabletemp"
      const tableToPrint = document.getElementById("tabletemp");

      // Tạo cửa sổ mới để in
      const printWindow = window.open("", "_blank");

      // HTML của bảng bạn muốn in
      const tableHTML = tableToPrint.outerHTML;

      // HTML của trang in, bao gồm chỉ bảng cần in
      const printHTML = `
        <html>
          <head>
            <title>Print Table</title>
            <style>
              body {
                display: none;
              }
              table {
                width: 100%;
              }
            </style>
          </head>
          <body>
            ${tableHTML}
          </body>
        </html>
      `;

      // Đưa HTML vào cửa sổ in
      printWindow.document.write(printHTML);

      // Hiển thị nội dung cần in và gọi hàm in của trình duyệt
      printWindow.document.body.style.display = "block";
      printWindow.document.close();
      printWindow.print();
    };

    return (
      <Button className={classes.buttonExport} onClick={handlePrintTable}>
        Print Table
      </Button>
    );
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
    await fetchingGettAllPhieu_by_StoreID_by_Year_month(
      statechinhanh,
      formattedDate
    );
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
    await fetchingGettAllPhieu_by_StoreID_by_Year_month(
      statechinhanh,
      formattedDate
    );
  };
  const colors = tokens(theme.palette.mode);
  let checkaccess = false;
  let chinhanhdau = "";
  const showAlert = async () => {
    const hasWAIT = selectionModel.some((selectedId) => {
      const selectedRow = statePhieuStore.find((row) => row.id === selectedId);
      return (
        selectedRow &&
        selectedRow.status === "WAITING" &&
        selectedRow.loaiphieu === "NK"
      );
    });

    if (hasWAIT) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      alert("Đơn này đang chờ được lập hóa đơn !!");
      return;
    }

    const hasAcceptedOrCancelled = selectionModel.some((selectedId) => {
      const selectedRow = statePhieuStore.find((row) => row.id === selectedId);
      return (
        selectedRow &&
        selectedRow.status === "PENDING" &&
        selectedRow.loaiphieu === "NK"
        //Loại phiếu trigger nhập từ kho
        // ||
        //   selectedRow.loaiphieu === "NK"
      );
    });

    if (hasAcceptedOrCancelled) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      alert("Các đơn này cần phải được xuất kho và lập hóa đơn !!");
      return;
    }
    confirmAlert({
      title: `${i18n.t("TITLE_ALERT_NP")}`,
      message: `${i18n.t("DES_ALERT_NP")}`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const respone = await Update_PhieuStore_By_id_Invoces(
              selectionModel
            );

            if (JSON.parse(respone).success) {
              alert(`${i18n.t("CAPNHAT_NP")}`);

              await fetchingGettAllPhieu_by_StoreID_by_Year_month(
                statechinhanh,
                formattedDate
              );
              const check = await Get_all_Product_By_StoreID(statechinhanh);
              let lenghtState = 0;
              if (check instanceof Promise) {
                // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
                const resolvedResult = JSON.parse(check);

                const arrayOfNumbers = resolvedResult.map((obj) =>
                  parseInt(obj.id?.replace(/[^\d]/g, ""), 10)
                );

                // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
                let maxNumber = Math.max(...arrayOfNumbers);
                const result = 1 / 0;

                const negativeInfinity = -1 / 0;

                if (maxNumber === negativeInfinity || maxNumber === result) {
                  maxNumber = 0;
                }
                lenghtState = maxNumber + 1;

                selectionModel.forEach(async (obj) => {
                  const updateMoney = statePhieuStore.filter(
                    (item) => item.id === obj
                  );

                  updateMoney.forEach(async (obj) => {
                    const a = obj.arrayProduct;
                    const createProductPromises = a.map(async (obj, index) => {
                      const existingProduct = resolvedResult.find(
                        (product) => product.id === obj.name
                      );
                      if (existingProduct) {
                        const updatedProduct = {
                          ...existingProduct,
                          soluong: existingProduct.soluong + obj.soluong,
                        };
                        console.log("Editing product:", updatedProduct);
                        return EditProduct(updatedProduct);
                      } else {
                        const createproduct = {
                          id: obj.name,
                          name: obj.name,
                          xuatxu: obj.xuatxu,
                          picture: obj.picture,
                          loai: obj.loai.toUpperCase(),
                          soluong: obj.soluong,
                          status: obj.status,
                          sotien: obj.sotien,
                          StoreID: obj.StoreID,
                          behavior: obj.behavior,
                        };
                        console.log("createproduct", createproduct);
                        console.log("updateMoney", updateMoney);

                        // Trả về promise của createProduct
                        return createProduct(createproduct);
                      }
                    });
                    await Promise.all(createProductPromises);
                    // updateFirebasePhieuStore(
                    //   updateMoney.id,
                    //   updateMoney.StoreID,
                    //   "done"
                    // );
                  });
                });
              } else {
                const resolvedResult = JSON.parse(check);

                const arrayOfNumbers = JSON.parse(check).map((obj) =>
                  parseInt(obj.id?.replace(/[^\d]/g, ""), 10)
                );

                // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
                let maxNumber = Math.max(...arrayOfNumbers);
                const result = 1 / 0;

                const negativeInfinity = -1 / 0;

                if (maxNumber === negativeInfinity || maxNumber === result) {
                  maxNumber = 0;
                }
                lenghtState = maxNumber + 1;
                selectionModel.forEach(async (obj) => {
                  const updateMoney = statePhieuStore.filter(
                    (item) => item.id === obj
                  );

                  updateMoney.forEach(async (obj) => {
                    const a = obj.arrayProduct;

                    const createProductPromises = a.map(async (obj, index) => {
                      const existingProduct = resolvedResult.find(
                        (product) => product.id === obj.name
                      );
                      if (existingProduct) {
                        const updatedProduct = {
                          ...existingProduct,
                          soluong: existingProduct.soluong + obj.soluong,
                        };
                        console.log("Editing product:", updatedProduct);
                        return EditProduct(updatedProduct);
                      } else {
                        const createproduct = {
                          id: obj.name,
                          name: obj.name,
                          xuatxu: obj.xuatxu,
                          picture: obj.picture,
                          loai: obj.loai.toUpperCase(),
                          soluong: obj.soluong,
                          status: obj.status,
                          sotien: obj.sotien,
                          StoreID: obj.StoreID,
                          behavior: obj.behavior,
                        };
                        lenghtState = lenghtState + 1;
                        console.log("createproduct", createproduct);
                        console.log("updateMoney", updateMoney);
                        // Trả về promise của createProduct
                        return createProduct(createproduct);
                      }
                    });
                    await Promise.all(createProductPromises);
                    // updateFirebasePhieuStore(
                    //   updateMoney.id,
                    //   updateMoney.StoreID,
                    //   "done"
                    // );
                  });
                });
              }

              const updateDataSOTIENTHUC = async (obj) => {
                if (parseFloat(obj.sotien) > 0) {
                  const UpdateVaoSotienthuc = {
                    storeID: obj.StoreID,
                    sotienThucte: parseFloat(obj.sotien),
                    thoidiem: obj.ngaylap,
                    access: stateCheckAccess,
                    dsmua: obj,
                  };
                  console.log("UpdateVaoSotienthuc", UpdateVaoSotienthuc);
                  return Update_SOTIENTHUCTE_By_DATE_STOREID(
                    UpdateVaoSotienthuc
                  );
                }
                return Promise.resolve(); // Nếu sotien không lớn hơn 0, trả về Promise đã giải quyết ngay lập tức
              };

              const updateSelectedRows = async (selectedRow) => {
                const promises = selectedRow.map(updateDataSOTIENTHUC);
                await Promise.all(promises);
              };

              // Sử dụng hàm updateSelectedRows
              updateSelectedRows(selectedRow)
                .then(() => {
                  console.log("Update completed");
                })
                .catch((error) => {
                  console.error("Error during update:", error);
                });
              setSelectionModel([]);
            }
          },
        },
        {
          label: "No",
          onClick: () => alert(`${i18n.t("CLICKNO_NP")}`),
        },
      ],
    });
  };
  const showAlertHuy = async () => {
    const hasWAIT = selectionModel.some((selectedId) => {
      const selectedRow = statePhieuStore.find((row) => row.id === selectedId);
      return (
        selectedRow &&
        selectedRow.status === "WAITING" &&
        selectedRow.loaiphieu === "NK"
      );
    });

    if (hasWAIT) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      alert("Đơn này đang chờ được lập hóa đơn, không thể hủy !!");
      return;
    }

    confirmAlert({
      title: `${i18n.t("TITLE_ALERT_NP")}`,
      message: `${i18n.t("DES_ALERT_NP_H")}`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const respone = await Update_PhieuStore_By_id_CANCEL(
              selectionModel
            );

            if (JSON.parse(respone).success) {
              alert(`${i18n.t("CAPNHAT_NP")}`);

              await fetchingGettAllPhieu_by_StoreID_by_Year_month(
                statechinhanh,
                formattedDate
              );

              setSelectionModel([]);
            }
          },
        },
        {
          label: "No",
          onClick: () => alert(`${i18n.t("CLICKNO_NP")}`),
        },
      ],
    });
  };
  const CustomPopup = ({ show, handleClose, content }) => {
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
            {/* <PrintTableButton /> */}
            <Typography variant="h3" fontWeight={"bold"}>
              {i18n.t("DetailProduct")}
            </Typography>
            <Box>
              <IconButton
                onClick={handleClose}
                sx={{ color: "black", border: "2px solid black" }}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "500px" }}>
          <div className="table-container">
            <table
              id="tabletemp"
              style={{ width: "100%" }}
              className="custom-table"
            >
              <thead>
                <tr>
                  <th>{i18n.t("MASP_P")}</th>
                  <th>{i18n.t("LOAI_P")}</th>
                  <th>{i18n.t("SOLUONG_P")}</th>

                  {stateCheckAccess ? (
                    <>
                      {" "}
                      <th>{i18n.t("SOTIEN_NP")}</th>
                    </>
                  ) : (
                    ""
                  )}
                  <th>{i18n.t("HINHANH_P")}</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.loai}</td>
                    <td>{item.soluong}</td>

                    {stateCheckAccess ? (
                      <>
                        {" "}
                        <th>{parseInt(item.sotien).toLocaleString("en-US")}</th>
                      </>
                    ) : (
                      ""
                    )}
                    <td>
                      <img width={100} height={100} src={item.picture}></img>
                    </td>
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
    { field: "id", flex: 1, headerName: `${i18n.t("MAKHO_NP")}` },
    // {
    //   field: "userID",
    //   headerName: `${i18n.t("MTK_NP")}`,
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },

    {
      field: "status",
      headerName: `${i18n.t("TINHTRANG_NP")}`,
      flex: 1,
      renderCell: StatusObjectCell,
    },
    {
      field: "loaiphieu",
      headerName: `${i18n.t("LOAIPHIEU_NHAP")}`,
      flex: 1,
      renderCell: StatusObjectCellLoai,
    },
    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      renderCell: StatusMoney,
      flex: 1,
    },
    {
      field: "sotienThucTe",
      headerName: `${i18n.t("SOTIENTTE")}`,
      renderCell: StatusMoney,
      flex: 1,
    },

    {
      field: "createDate",
      headerName: `${i18n.t("NGAYLAPPHIEU_NP")}`,
      renderCell: UpdatedateObjectCell,
      flex: 1,
    },
    {
      field: "updateDate",
      headerName: `${i18n.t("NGAYCAPNHAT_NP")}`,

      flex: 1,
    },
    {
      field: "arrayProduct",
      headerName: `${i18n.t("SOLUONGSP_NP")}`,
      flex: 1,
      renderCell: ArrayObjectCell,
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
    return <span style={{ fontSize: "0.9rem" }}>{formattedDateString}</span>;
  }
  function ChangeFormat(params) {
    const arrayObject = params;
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
    return arrayObject;
  }

  function StatusMoney(params) {
    const arrayObject = params.value;
    const getloaiphieu = params.row.loaiphieu;
    // Định dạng số thành chuỗi với dấu phân cách
    const formattedNumber = parseInt(arrayObject).toLocaleString("en-US");
    return (
      <span
        style={{
          backgroundColor: "#5D5D5D",
          width: "100%",
          textAlign: "center",
          borderRadius: "40px",
          color: "white",
          fontSize: "1rem",
          padding: "2px",
        }}
      >
        {stateCheckAccess ? (
          <> {formattedNumber} VND</>
        ) : (
          <>
            {getloaiphieu && getloaiphieu === "NN" ? (
              <>{formattedNumber} VND</>
            ) : (
              "###"
            )}
          </>
        )}
      </span>
    );
  }
  function StatusObjectCell(params) {
    const arrayObject = params.value;
    if (arrayObject === "ACCEPT") {
      return (
        <span
          style={{
            borderRadius: "40px",
            backgroundColor: "#22C75B",
            width: "100%",
            textAlign: "center",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    }
    if (arrayObject === "CANCEL") {
      return (
        <span
          style={{
            borderRadius: "40px",
            backgroundColor: "#ED3333",
            width: "100%",
            textAlign: "center",
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
            borderRadius: "40px",
            backgroundColor: "#FFC107",
            width: "100%",
            textAlign: "center",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    }
  }

  function StatusObjectCellLoai(params) {
    const arrayObject = params.value;
    if (arrayObject === "NK") {
      return (
        <span
          style={{
            backgroundColor: "#48E57E",
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
    if (arrayObject === "NN") {
      return (
        <span
          style={{
            backgroundColor: "#ED3333",
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
    }
  }
  function ArrayObjectCell(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;
    let sotien = 0;
    arrayObject.forEach((element) => {
      sotien += parseFloat(element.sotien);
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
  const checkAccess = async () => {
    const check = HandleAccessAccount();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      if (resolvedResult === "true" || resolvedResult) {
        checkaccess = resolvedResult;
        setstateCheckAccess(checkaccess);
      } else {
        checkaccess = resolvedResult;
        setstateCheckAccess(checkaccess);
      }
    } else {
      if (check === "true" || check) {
        checkaccess = true;
        setstateCheckAccess(checkaccess);
      } else {
        checkaccess = false;
        setstateCheckAccess(checkaccess);
      }
    }
  };
  const fetchingPhieuStore = async () => {
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
  const handle_getAllPhieustore = async (e) => {
    await fetchingGettAllPhieu_by_StoreID_by_Year_month(
      e.target.value,
      formattedDate
    );
    setStatechinhanh(e.target.value);
  };
  const fetchingGettAllPhieu_by_StoreID_by_Year_month = async (x, y) => {
    const request = {
      storeID: x,
      thoidiem: y,
    };
    const check = await Get_all_Phieu_Store_By_Year_Month(request);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;
      const sortedResult = JSON.parse(resolvedResult).sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );
      setStatePhieuStore(sortedResult);
    } else {
      const sortedResult = JSON.parse(check).sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );
      setStatePhieuStore(sortedResult);
    }
  };
  // console.log(statePhieuStore);
  const fetchingapi = async () => {
    await checkAccess();
    await fetchingPhieuStore();

    await fetchingGettAllPhieu_by_StoreID_by_Year_month(
      chinhanhdau,
      formattedDate
    );
    setStatechinhanh(chinhanhdau);
  };
  useEffect(() => {
    fetchingapi();
  }, []);
  const handleSelectionModelChange = (newSelectionModel) => {
    const hasAcceptedOrCancelled = newSelectionModel.some((selectedId) => {
      const selectedRow = statePhieuStore.find((row) => row.id === selectedId);
      return (
        selectedRow &&
        (selectedRow.status === "ACCEPT" || selectedRow.status === "CANCEL")
        //Loại phiếu trigger nhập từ kho
        // ||
        //   selectedRow.loaiphieu === "NK"
      );
    });

    if (hasAcceptedOrCancelled) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      return;
    }
    // Lấy thông tin của các hàng được chọn
    const selectedRows = newSelectionModel.map((selectedId) =>
      statePhieuStore.find((row) => row.id === selectedId)
    );

    setSelectedRow(selectedRows);

    setSelectionModel(newSelectionModel);
    // const updateMoney = statePhieuStore.filter(
    //   (item) => item.id === "PN-PTT-20240201-2"
    // );
    // console.log("statePhieuStore " + JSON.stringify(statePhieuStore));
    // console.log("update money click " + JSON.stringify(updateMoney));
  };

  return (
    <Box m="20px">
      <Header title={i18n.t("TITLENHAPKHO")} subtitle={i18n.t("DESNHAPKHO")} />
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
            onChange={handle_getAllPhieustore}
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
        {stateCheckAccess ? (
          <Button
            className={classes.buttonAdd}
            data-toggle="modal"
            data-target="#staticBackdropEdit"
            onClick={showAlert}
            disabled={selectionModel.length === 0}
          >
            {i18n.t("BTN_XACNHANYEUCAU_NP")}
          </Button>
        ) : (
          ""
        )}
        {stateCheckAccess ? (
          <Button
            className={classes.buttonDelete}
            style={{ marginLeft: "1%" }}
            disabled={selectionModel.length === 0}
            onClick={showAlertHuy}
          >
            {i18n.t("HUYYEUCAU")}
          </Button>
        ) : (
          ""
        )}
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
            <DatePicker
              // selected={statePhieu.thoidiem}
              // onChange={(date) => handleDateChange(date)}
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
            <DatePicker
              // selected={statePhieu.thoidiem}
              // onChange={(date) => handleDateChange(date)}
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
            <KeyboardArrowLeftIcon />
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
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Box>
      <Button className={classes.buttonExport} onClick={handleExportExcel}>
        {i18n.t("Export")}
      </Button>
      <Box height="75vh" className={classes.datagrid}>
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
      <CustomPopup
        show={showPopup}
        handleClose={handleClosePopup}
        content={stateContentModal}
      />
    </Box>
  );
};

export default Invoices;

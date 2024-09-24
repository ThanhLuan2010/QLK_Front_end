import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ExcelJS from "exceljs";
import Header from "../../components/Header";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { GridToolbar } from "@mui/x-data-grid";
import React from "react";
import { HandleUpload } from "../sendfileFTP/sendfileFTP";
import { Get_all_TIMEKEEPING_By_DateF_DateT_branchID } from "./handleTimekeeps";
import {
  Get_all_branch_By_userid,
  Get_all_User_By_branchID,
  Get_all_STAFFOFF_By_branchID,
  Get_all_branch,
} from "./handlebranch";
import { confirmAlert } from "react-confirm-alert";

import Loading from "react-loading";
import "./style.css";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { HandleCreateTimekeeps } from "./handleTimekeeps";
import {
  HandleCreateStaff,
  HandleDeletedStaff,
  HandleEditStaff,
  HandleCreateStaffOff,
  HandleDeletedStaffOff,
} from "./handlestaff";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import URL_IMG from "../../URL_GETIMG";
import { HandleEditTimekeeps } from "./handleTimekeeps";
import EmployeeDetailModal from "../../components/EmployeeDetail/EmployeeDetailModal";
import { endOfMonth, startOfMonth } from "date-fns";
import EmployeeInfo from "../../components/EmployeeDetail/EmployeeInfo";
import AddEmployeeModal from "../../components/EmployeeDetail/AddEmployeeModal";
import CommonStyle from "../../components/CommonStyle";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { handleCheckExistId, handleGetDayTime } from "../../helper";
import { ROLE_EMPLOYEE } from "../../utils/constant";

const Team = () => {
  useTranslation();

  // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
  const { day, month, year } = handleGetDayTime();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isError, setisError] = useState(false);
  const [stateimage, setStateimg] = useState("");
  const [stateimageTwo, setStateimgTwo] = useState("");
  const [stateimageFileName, setStateimgFileName] = useState("");
  const [stateimageTwoFileName, setStateimgTwoFileName] = useState("");
  const [stateimageEdit, setStateimgEdit] = useState("");
  const [stateimageTwoEdit, setStateimgTwoEdit] = useState("");
  const [stateimageFileNameEdit, setStateimgFileNameEdit] = useState("");
  const [stateimageTwoFileNameEdit, setStateimgTwoFileNameEdit] = useState("");
  const [stateViewimg, setstateViewimg] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [isloadingDeleted, setIsloadingDeleted] = useState(false);
  const [stateTimekeep, setStateTimekeep] = useState([]);
  const [ischecked, setIschecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // State để theo dõi giá trị được chọn trong select
  const [isLoadingTimekeeping, setIsLoadingTimekeeping] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedMonth, setSelectedMonth] = useState({
    year,
    month,
  });

  // Tạo chuỗi datetime
  const datetimeToday = `${year}-${month}-${day}`;
  const [startDate, setStartDate] = useState(
    startOfMonth(new Date(datetimeToday))
  );
  const [endDate, setEndDate] = useState(endOfMonth(new Date(datetimeToday)));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [totalTimeCheck, setTotalTimeCheck] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);

  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const handleDataUpdate = () => {
    setIsDataUpdated(!isDataUpdated);
  };

  const handleRowDoubleClick = (params) => {
    setSelectedEmployee(params.row);
    setOpenModal(true);
  };
  const handleClickAdd = () => {
    setOpenModalAdd(true);
  };

  const updateTimekeepingData = (updatedData) => {
    setStateTimekeep(updatedData);
  };
  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedEmployee(null);
    await fetchTimekeepingData();
  };
  const handleCloseModalAdd = async () => {
    setOpenModalAdd(false);
    await fetchTimekeepingData();
  };
  const handleCheckButtonClick = async () => {
    const start = new Date(`${datetimeToday}T${startTime}`);
    const end = new Date(`${datetimeToday}T${endTime}`);
    const diffMilliseconds = end - start;

    const totalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    setTotalTime(`${totalHours} giờ ${totalMinutes} phút`);

    try {
      const promises = selectedRowTimekeeps.map(async (item) => {
        let objUpdate = {
          id: item.id,
          branchID: statechinhanh,
          reason: "...",
          startCheck: startTime,
          endCheck: endTime,
          Total: diffMilliseconds,
        };

        await HandleEditTimekeeps(objUpdate);
      });

      await Promise.all(promises);
      alert("Cập nhật, chấm công thành công ");
      await fetchingTimekeep(statechinhanh, startDate, endDate);
      setSelectRowTimekeeps([]);
      setSelectionModelTimeKeep([]);
      setStartTime("");
      setEndTime("");
      setTotalTime("");
      setTotalTimeCheck("");
    } catch (error) {
      console.log("Có gì đó không đúng, không được để trống thời gian!!!!");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: `CCCD`,
      editable: true,
      width: 200,
      hide: isXsScreen,
    },
    {
      field: "name",
      headerName: `${i18n.t("TNV_TEAM")}`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
  ];
  const [stateBranch, setStateBranch] = useState([]);
  const [stateStaff, setStateStaff] = useState([]);
  const [stateStaffOff, setStateStaffOff] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectionModelTimeKeep, setSelectionModelTimeKeep] = useState([]);
  const [selectionModelOff, setSelectionModelOff] = useState([]);
  const [selectRowOff, setSelectRowOff] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowTimekeeps, setSelectRowTimekeeps] = useState([]);
  const classes = CommonStyle();
  useEffect(() => {
    if (statechinhanh) {
      fetchingGettAllStaft_by_branchID(statechinhanh);
    }
  }, [statechinhanh, isDataUpdated]);

  const handleSelectionModelChange = (newSelectionModel) => {
    const selectedRows = newSelectionModel.map((selectedId) =>
      stateStaff.find((row) => row.id === selectedId)
    );

    setSelectedRow(selectedRows);
    setSelectionModel(newSelectionModel);
  };

  const showAlertHuy = async () => {
    if (selectionModelOff.length === 0) {
      alert("Hãy chọn dữ liệu xóa !!!!");
      return;
    }

    setIsloadingDeleted(true);
    confirmAlert({
      title: `Xóa nhân viên khỏi hệ thống`,
      message: `Bạn có chắc là xóa chứ ???`,

      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const dataDeleted = selectRowOff.map(async (item) => {
                await HandleDeletedStaffOff(item);
              });
              await Promise.all(dataDeleted);
              setSelectionModelOff([]);
              setSelectRowOff([]);
              await fetchingGettAllStaftOff_by_branchID(statechinhanh);
              setIsloadingDeleted(false);
            } catch (error) {
              console.log(error);
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

  const undostaff = async () => {
    try {
      if (handleCheckExistId(stateStaff, selectRowOff)) {
        alert(
          "Không thể khôi phục, vì nhân viên này hiện tại đã có trong hệ thống !!!!"
        );
        return;
      }
      const dataDeleted = selectRowOff.map(async (item) => {
        await HandleDeletedStaffOff(item);
      });

      const undoastaffchoose = selectRowOff.map(async (item) => {
        await HandleCreateStaff(item);
      });
      await Promise.all(dataDeleted, undoastaffchoose);
      alert("Khôi phục dữ liệu thành công !!!");
      await fetchingGettAllStaft_by_branchID(statechinhanh);
      await fetchingGettAllStaftOff_by_branchID(statechinhanh);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectionModelChangeOff = (newSelectionModel) => {
    const selectedRows = newSelectionModel.map((selectedId) =>
      stateStaffOff.find((row) => row.id === selectedId)
    );

    setSelectRowOff(selectedRows);

    setSelectionModelOff(newSelectionModel);
  };

  function ChamCong(params) {
    const arrayObject = params.value;
    const originalDateString = arrayObject;
    const { day, minutes, hours, month, year } =
      handleGetDayTime(originalDateString);

    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}`;
    return <span>{formattedDateString}</span>;
  }

  function GhiChu(params) {
    return (
      <>
        <div className="container">
          <select className="w-100 " style={{ height: "45px" }} id="support">
            <option value={params.value}>{params.value}</option>
            {stateBranch &&
              stateBranch.map((object, index) => (
                <React.Fragment key={index}>
                  <option value={object.branchID}>{object.name}</option>
                </React.Fragment>
              ))}
          </select>
        </div>
      </>
    );
  }

  function UpdatedateObjectCell(params) {
    const arrayObject = params.value;
    const originalDateString = arrayObject;
    const { seconds, minutes, hours, day, month, year } =
      handleGetDayTime(originalDateString);

    // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return <span>{formattedDateString}</span>;
  }

  function ImageRole(params) {
    let getvalue = params.value;
    if (getvalue === ROLE_EMPLOYEE.MANAGER.VALUE) {
      getvalue = "QUẢN LÝ TRƯỞNG";
    } else if (getvalue === ROLE_EMPLOYEE.DEPUTY_MANAGER.VALUE) {
      getvalue = "PHÓ QUẢN LÝ";
    } else if (getvalue === ROLE_EMPLOYEE.STAFF.VALUE) {
      getvalue = "NHÂN VIÊN";
    }
    return (
      <>
        <span>{getvalue}</span>
      </>
    );
  }

  function ImageCell(params) {
    return (
      <>
        <img
          src={params.value}
          onDoubleClick={clickdoublegetimg}
          alt="Image"
          loading="lazy"
          width={100}
          height={50}
          style={{ cursor: "pointer" }}
        />
      </>
    );
  }

  const clickdoublegetimg = (e) => {
    setstateViewimg(e.target.src);
  };

  const handleSaveClick = async () => {
    try {
      if (handleCheckExistId(stateStaffOff, selectedRow)) {
        alert("Xóa thất bại, nhân viên này đã từng bị xóa và đang tồn tại !!!");
        return;
      }

      setIsloading(true);
      const selectedRows = stateStaff.filter((row) =>
        selectionModel.includes(row.id)
      );
      //create Staff off
      const handledelted = await HandleDeletedStaff(selectedRows);

      if (JSON.parse(handledelted).success) {
        setIsloading(false);
        alert("Deleted Successfully !!!");
        const promises = selectedRow.map(async (item) => {
          await HandleCreateStaffOff(item);
        });
        await Promise.all(promises);
      }
      setSelectionModel([]);
      setSelectedRow([]);
      await fetchingGettAllStaft_by_branchID(statechinhanh);
      await fetchingGettAllStaftOff_by_branchID(statechinhanh);
    } catch (error) {
      console.log(error);
    }

    // Thực hiện xử lý theo nhu cầu của bạn
  };

  const fetchTimekeepingData = async () => {
    setIsLoadingTimekeeping(true);
    // Gọi API lấy dữ liệu chấm công
    const jsonfetch = {
      branchID: statechinhanh,
      createDateF: startDate,
      createDateT: endDate,
    };
    const res = await Get_all_TIMEKEEPING_By_DateF_DateT_branchID(jsonfetch);
    if (res) {
      setStateTimekeep(JSON.parse(res));
    }
    setIsLoadingTimekeeping(false);
  };

  const getStartAndEndDatesOfMonth = (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return { startDate, endDate };
  };
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    setSelectedMonth({ year: currentYear, month: currentMonth });
  }, []);

  useEffect(() => {
    if (statechinhanh) {
      const { startDate, endDate } = getStartAndEndDatesOfMonth(
        selectedMonth.year,
        selectedMonth.month
      );
      fetchingTimekeep(statechinhanh, startDate, endDate);
    }
  }, [selectedMonth, statechinhanh]);
  console.log("statechinhanh", statechinhanh);
  const handleExportExcel = async () => {
    if (isLoadingTimekeeping || isInitialLoad) {
      alert(
        "Vui lòng chờ dữ liệu chấm công được tải xong trước khi xuất ra Excel."
      );
      return;
    }
    console.log(stateTimekeep);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng chấm công");
    const daysInMonth = new Date(
      selectedMonth.year,
      selectedMonth.month,
      0
    ).getDate();

    // Add title row with custom formatting
    const titleRow = worksheet.addRow(["BẢNG CHẤM CÔNG"]);
    titleRow.font = { size: 16, bold: true, color: { argb: "0000000" } };
    worksheet.mergeCells(1, 1, 1, 4 + daysInMonth);
    titleRow.alignment = { horizontal: "center" };

    // Add month-year row with custom formatting
    const monthYearRow = worksheet.addRow([
      `Tháng ${selectedMonth.month} năm ${selectedMonth.year}`,
    ]);
    monthYearRow.font = { size: 14, bold: true, color: { argb: "0000000" } };
    worksheet.mergeCells(2, 1, 2, 4 + daysInMonth);
    monthYearRow.alignment = { horizontal: "center" };

    // Add header rows with custom formatting
    const headerRow1 = worksheet.addRow([
      "TT",
      "Họ tên",
      "Chức vụ",
      "Ngày trong tháng",
      ...Array.from({ length: daysInMonth - 1 }, () => ""),
      "Tổng cộng",
    ]);
    worksheet.mergeCells(3, 1, 4, 1);
    worksheet.mergeCells(3, 2, 4, 2);
    worksheet.mergeCells(3, 3, 4, 3);
    worksheet.mergeCells(3, 4, 3, 3 + daysInMonth);
    worksheet.mergeCells(3, 4 + daysInMonth, 4, 4 + daysInMonth);
    headerRow1.alignment = { vertical: "middle", horizontal: "center" };
    headerRow1.font = { bold: true, color: { argb: "00000000" } };

    const headerRow2 = worksheet.addRow([
      "",
      "",
      "",
      ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
      "",
    ]);
    headerRow2.alignment = { horizontal: "center" };
    headerRow2.font = { bold: true, color: { argb: "00000000" } };

    // Apply fill color to title and month-year rows
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 4 + daysInMonth; j++) {
        const cell = worksheet.getCell(i, j);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFACE9C" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          right: { style: "thin" },
        };
      }
    }

    // Apply fill color to header rows
    for (let i = 3; i <= 5; i++) {
      for (let j = 1; j <= 4 + daysInMonth; j++) {
        const cell = worksheet.getCell(i, j);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFDE2CA" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    // Apply fill color to day columns
    for (let j = 4; j <= 3 + daysInMonth; j++) {
      const cell = worksheet.getCell(5, j);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF5A89A" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    // Process rows and apply custom formatting
    const rows = stateStaff.map((staff, index) => {
      const hours = Array(daysInMonth).fill(0);
      stateTimekeep.forEach((timekeep) => {
        if (timekeep.staffid === staff.id) {
          const timekeepDate = new Date(timekeep.createDate);
          if (
            timekeepDate.getMonth() + 1 === selectedMonth.month &&
            timekeepDate.getFullYear() === selectedMonth.year
          ) {
            const day = timekeepDate.getDate();
            let totalHours = 0;
            let totalMinutes = 0;
            for (let i = 0; i < timekeep.startCheck.length; i++) {
              let startHour = 0,
                startMinute = 0,
                endHour = 0,
                endMinute = 0;
              if (
                typeof timekeep.startCheck[i] === "string" &&
                typeof timekeep.endCheck[i] === "string"
              ) {
                [startHour, startMinute] = timekeep.startCheck[i]
                  .split(":")
                  .map(Number);
                [endHour, endMinute] = timekeep.endCheck[i]
                  .split(":")
                  .map(Number);
              }
              const start = new Date(0, 0, 0, startHour, startMinute);
              const end = new Date(0, 0, 0, endHour, endMinute);
              const diffMilliseconds = end - start;
              totalHours += Math.floor(diffMilliseconds / (1000 * 60 * 60));
              totalMinutes += Math.floor(
                (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
              );
            }

            let adjustedHours = totalHours + totalMinutes / 60;
            if (
              staff.Role === ROLE_EMPLOYEE.MANAGER.VALUE &&
              adjustedHours >= 10
            ) {
              adjustedHours -= 1;
            } else if (
              staff.Role !== ROLE_EMPLOYEE.STAFF.VALUE &&
              staff.Role !== ROLE_EMPLOYEE.MANAGER.VALUE &&
              staff.Role !== ROLE_EMPLOYEE.DEPUTY_MANAGER.VALUE &&
              adjustedHours >= 5
            ) {
              adjustedHours -= 1;
            }

            hours[day - 1] = adjustedHours.toFixed(2);
          }
        }
      });

      const totalHours = hours.reduce((sum, val) => sum + parseFloat(val), 0);

      return {
        TT: index + 1,
        "Họ tên": staff.name,
        "Chức vụ": staff.Role,
        "Ngày trong tháng": {
          ...hours.reduce((acc, val, idx) => {
            acc[`Ngày ${idx + 1}`] = 1 * val === 0 ? "" : 1 * val;
            return acc;
          }, {}),
        },
        "Tổng cộng":
          totalHours.toFixed(2) * 1 === 0 ? "" : totalHours.toFixed(2) * 1,
      };
    });

    rows.forEach((row) => {
      const rowData = [
        row["TT"],
        row["Họ tên"],
        row["Chức vụ"],
        ...Object.values(row["Ngày trong tháng"]),
        row["Tổng cộng"],
      ];
      const addedRow = worksheet.addRow(rowData);
      addedRow.alignment = { horizontal: "center" }; // Center align all cells in the row

      // Apply border to each cell in the row
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 30 },
      ...Array.from({ length: daysInMonth }, () => ({ width: 5 })),
      { width: 15 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Bảng chấm công tháng ${selectedMonth.month} năm ${selectedMonth.year}.xlsx`;
    link.click();
  };
  const handleExportExcelCines = async () => {
    if (isLoadingTimekeeping || isInitialLoad) {
      alert(
        "Vui lòng chờ dữ liệu chấm công được tải xong trước khi xuất ra Excel."
      );
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng chấm công");
    const daysInMonth = new Date(
      selectedMonth.year,
      selectedMonth.month,
      0
    ).getDate();

    // Add title row with custom formatting
    const titleRow = worksheet.addRow(["BẢNG CHẤM CÔNG"]);
    titleRow.font = { size: 16, bold: true, color: { argb: "0000000" } };
    worksheet.mergeCells(1, 1, 1, 4 + daysInMonth);
    titleRow.alignment = { horizontal: "center" };

    // Add month-year row with custom formatting
    const monthYearRow = worksheet.addRow([
      `Tháng ${selectedMonth.month} năm ${selectedMonth.year}`,
    ]);
    monthYearRow.font = { size: 14, bold: true, color: { argb: "0000000" } };
    worksheet.mergeCells(2, 1, 2, 4 + daysInMonth);
    monthYearRow.alignment = { horizontal: "center" };

    // Add header rows with custom formatting
    const headerRow1 = worksheet.addRow([
      "TT",
      "Họ tên",
      "Chức vụ",
      "Ca làm",
      "Ngày trong tháng",
      ...Array.from({ length: daysInMonth - 1 }, () => ""),
      "Tổng cộng",
    ]);
    worksheet.mergeCells(3, 1, 4, 1);
    worksheet.mergeCells(3, 2, 4, 2);
    worksheet.mergeCells(3, 3, 4, 3);
    worksheet.mergeCells(3, 4, 4, 4); // Merge Ca làm
    worksheet.mergeCells(3, 5, 3, 4 + daysInMonth);
    worksheet.mergeCells(3, 5 + daysInMonth, 4, 5 + daysInMonth);
    headerRow1.alignment = { vertical: "middle", horizontal: "center" };
    headerRow1.font = { bold: true, color: { argb: "00000000" } };

    const headerRow2 = worksheet.addRow([
      "",
      "",
      "",
      "",
      ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
      "",
    ]);
    headerRow2.alignment = { horizontal: "center" };
    headerRow2.font = { bold: true, color: { argb: "00000000" } };

    // Apply fill color to title and month-year rows
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 5 + daysInMonth; j++) {
        const cell = worksheet.getCell(i, j);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFACE9C" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          right: { style: "thin" },
        };
      }
    }

    // Apply fill color to header rows
    for (let i = 3; i <= 5; i++) {
      for (let j = 1; j <= 5 + daysInMonth; j++) {
        const cell = worksheet.getCell(i, j);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFDE2CA" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    // Apply fill color to day columns
    for (let j = 5; j <= 4 + daysInMonth; j++) {
      const cell = worksheet.getCell(5, j);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF5A89A" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    // Process rows and apply custom formatting
    const rows = stateStaff.map((staff, index) => {
      const shift1 = Array(daysInMonth).fill("");
      const shift2 = Array(daysInMonth).fill("");

      stateTimekeep.forEach((timekeep) => {
        if (timekeep.staffid === staff.id) {
          const timekeepDate = new Date(timekeep.createDate);
          if (
            timekeepDate.getMonth() + 1 === selectedMonth.month &&
            timekeepDate.getFullYear() === selectedMonth.year
          ) {
            const day = timekeepDate.getDate();
            for (let i = 0; i < timekeep.startCheck.length; i++) {
              let startHour = 0,
                startMinute = 0,
                endHour = 0,
                endMinute = 0;
              if (
                typeof timekeep.startCheck[i] === "string" &&
                typeof timekeep.endCheck[i] === "string"
              ) {
                [startHour, startMinute] = timekeep.startCheck[i]
                  .split(":")
                  .map(Number);
                [endHour, endMinute] = timekeep.endCheck[i]
                  .split(":")
                  .map(Number);
              }
              const start = new Date(0, 0, 0, startHour, startMinute);
              const end = new Date(0, 0, 0, endHour, endMinute);
              const totalMinutesWorked = (end - start) / (1000 * 60);

              if (startHour < 19 && endHour >= 20) {
                const firstShiftEnd = new Date(0, 0, 0, 20, 0);
                const firstShiftMinutes = (firstShiftEnd - start) / (1000 * 60);
                let firstShiftHours = Math.floor(firstShiftMinutes / 60);
                let firstShiftRemainingMinutes = firstShiftMinutes % 60;

                let adjustedHours =
                  firstShiftHours + firstShiftRemainingMinutes / 60;
                if (
                  staff.Role === ROLE_EMPLOYEE.MANAGER.VALUE &&
                  adjustedHours >= 10
                ) {
                  adjustedHours -= 1;
                } else if (
                  staff.Role !== ROLE_EMPLOYEE.STAFF.VALUE &&
                  staff.Role !== ROLE_EMPLOYEE.MANAGER.VALUE &&
                  staff.Role !== ROLE_EMPLOYEE.DEPUTY_MANAGER.VALUE &&
                  adjustedHours >= 5
                ) {
                  adjustedHours -= 1;
                }

                shift1[day - 1] = (shift1[day - 1] || 0) + adjustedHours || "";

                const secondShiftMinutes =
                  totalMinutesWorked - firstShiftMinutes;
                const secondShiftHours = Math.floor(secondShiftMinutes / 60);
                const secondShiftRemainingMinutes = secondShiftMinutes % 60;
                shift2[day - 1] =
                  (shift2[day - 1] || 0) +
                    secondShiftHours +
                    secondShiftRemainingMinutes / 60 || "";
              } else if (startHour >= 19) {
                shift2[day - 1] =
                  (shift2[day - 1] || 0) + totalMinutesWorked / 60 || "";
              } else {
                let adjustedHours = totalMinutesWorked / 60;
                if (
                  staff.Role === ROLE_EMPLOYEE.MANAGER.VALUE &&
                  adjustedHours >= 10
                ) {
                  adjustedHours -= 1;
                } else if (
                  staff.Role !== ROLE_EMPLOYEE.STAFF.VALUE &&
                  staff.Role !== ROLE_EMPLOYEE.MANAGER.VALUE &&
                  staff.Role !== ROLE_EMPLOYEE.DEPUTY_MANAGER.VALUE &&
                  adjustedHours >= 5
                ) {
                  adjustedHours -= 1;
                }
                shift1[day - 1] = (shift1[day - 1] || 0) + adjustedHours || "";
              }
            }
          }
        }
      });

      const totalHours =
        shift1.reduce((sum, val) => sum + (parseFloat(val) || 0), 0) +
        shift2.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

      return {
        TT: index + 1,
        "Họ tên": staff.name,
        "Chức vụ": staff.Role,
        "Ca 1": shift1,
        "Ca 2": shift2,
        "Tổng cộng": totalHours.toFixed(2) * 1,
      };
    });
    rows.forEach((row) => {
      const rowData = [
        row["TT"],
        row["Họ tên"],
        row["Chức vụ"],
        "Ca 1",
        ...Object.values(row["Ca 1"]),
        row["Tổng cộng"],
      ];
      const addedRow = worksheet.addRow(rowData);
      addedRow.alignment = { horizontal: "center" }; // Center align all cells in the row

      // Apply border to each cell in the row
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      const rowData2 = ["", "", "", "Ca 2", ...Object.values(row["Ca 2"]), ""];
      const addedRow2 = worksheet.addRow(rowData2);
      addedRow2.alignment = { horizontal: "center" }; // Center align all cells in the row

      // Apply border to each cell in the row
      addedRow2.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
    // worksheet.spliceRows(4, 1);
    let currentRow = 6; // Row start after the headers (4 header rows + 1 initial row + 1 more for Excel indexing start at 1)
    const mergeCellMapping = {
      28: "AG",
      29: "AH",
      30: "AI",
      31: "AJ",
    };
    rows.forEach((row, index) => {
      worksheet.mergeCells(`A${currentRow}:A${currentRow + 1}`);
      worksheet.mergeCells(`B${currentRow}:B${currentRow + 1}`);
      worksheet.mergeCells(`C${currentRow}:C${currentRow + 1}`);
      ["A", "B", "C"].forEach((column) => {
        const cell = worksheet.getCell(`${column}${currentRow}`);
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
      const columnLetter = mergeCellMapping[daysInMonth];
      if (columnLetter) {
        worksheet.mergeCells(
          `${columnLetter}${currentRow}:${columnLetter}${currentRow + 1}`
        );
        const cell = worksheet.getCell(`${columnLetter}${currentRow}`);
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }
      currentRow += 2;
    });

    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 20 },
      { width: 15 },
      ...Array.from({ length: daysInMonth }, () => ({ width: 5 })),
      { width: 15 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Bảng chấm công tháng ${selectedMonth.month} năm ${selectedMonth.year}.xlsx`;
    link.click();
  };

  let checkaccess = false;
  let chinhanhdau = "";
  const fetchingBranch = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = Get_all_branch();

      if (objBranch instanceof Promise) {
        const resolvedResult = await objBranch;
        setStateBranch(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].branchID;
      } else {
        setStateBranch(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].branchID;
      }
    } else {
      const objBranch = Get_all_branch_By_userid();

      if (objBranch instanceof Promise) {
        const resolvedResult = await objBranch;
        setStateBranch(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].branchID;
      } else {
        setStateBranch(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].branchID;
      }
    }
  };
  const fetchingTimekeep = async (branchId, createF, createT) => {
    setIsLoadingTimekeeping(true);
    const jsonfetch = {
      branchID: branchId,
      createDateF: createF,
      createDateT: createT,
    };
    const objBranch = await Get_all_TIMEKEEPING_By_DateF_DateT_branchID(
      jsonfetch
    );

    if (objBranch instanceof Promise) {
      const resolvedResult = await objBranch;
      setStateTimekeep(JSON.parse(resolvedResult));
    } else {
      setStateTimekeep(JSON.parse(objBranch));
    }
    setIsLoadingTimekeeping(false);
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
      }
    } else {
      if (check === "true" || check) {
        checkaccess = true;
      } else {
        checkaccess = false;
      }
    }
  };

  const fetchingGettAllStaft_by_branchID = async (x) => {
    const check = await Get_all_User_By_branchID(x);
    if (check instanceof Promise) {
      const resolvedResult = await check;
      setStateStaff(JSON.parse(resolvedResult));
    } else {
      setStateStaff(JSON.parse(check));
    }
  };
  const fetchingGettAllStaftOff_by_branchID = async (x) => {
    const check = await Get_all_STAFFOFF_By_branchID(x);
    if (check instanceof Promise) {
      const resolvedResult = await check;
      setStateStaffOff(JSON.parse(resolvedResult));
    } else {
      setStateStaffOff(JSON.parse(check));
    }
  };
  const handle_getAllStaff = async (e) => {
    setStatechinhanh(e.target.value);

    await fetchingGettAllStaft_by_branchID(e.target.value);
    await fetchingGettAllStaftOff_by_branchID(e.target.value);
    // setStartDate(datetimeToday);
    // setEndDate(datetimeToday);
  };
  useEffect(() => {
    const fetchingapi = async () => {
      try {
        await checkAccess();
        await fetchingBranch();
        const fetchData = async () => {
          try {
            await Promise.all([
              fetchingGettAllStaft_by_branchID(chinhanhdau),
              fetchingGettAllStaftOff_by_branchID(chinhanhdau),
            ]);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        await fetchData();
        setStatechinhanh(chinhanhdau);

        // Thiết lập tháng hiện tại
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        setSelectedMonth({ year: currentYear, month: currentMonth });
        const { startDate, endDate } = getStartAndEndDatesOfMonth(
          currentYear,
          currentMonth
        );
        await fetchingTimekeep(chinhanhdau, startDate, endDate);
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchingapi();
  }, []);

  const [addStaffForm, setAddStaffForm] = useState({
    name: "",
    phone: "",
    Role: "",
    branchID: "",
    id: "",
    ngayvao: "",
    AccountBank: "",
    picture: "",
    pictureTwo: "",
  });

  const [EditStaffForm, setEditStaffForm] = useState({
    name: "",
    phone: "",
    Role: "",
    branchID: "",
    AccountBank: "",
    id: "",
    ngayvao: "",
    idnew: "",
    picture: "",
    pictureTwo: "",
  });

  const editstaff = async () => {
    setSelectedOption("");
    const check = await HandleEditStaff(EditStaffForm);
    await fetchingGettAllStaft_by_branchID(statechinhanh);

    if (check.data.success) {
      alert("Update Success");
      await HandleUpload(
        "STAFF",
        stateimageEdit,
        statechinhanh,
        stateimageFileNameEdit
      );
      await HandleUpload(
        "STAFF",
        stateimageTwoEdit,
        statechinhanh,
        stateimageTwoFileNameEdit
      );
    }
    setSelectionModel([]);
    setStateimgEdit("");
    setStateimgTwoEdit("");
    setIschecked(false);
    document.getElementById("choserole").selectedIndex = 0;
  };

  const onChangeStaffForm = (event) => {
    setisError(false);

    setAddStaffForm({
      ...addStaffForm,
      [event.target.name]: event.target.value,
      branchID: statechinhanh,
    });
    if (event.target.name === "Role") {
      setSelectedOption(event.target.value);
    }
  };

  const onChangeEditStaffForm = (event) => {
    setEditStaffForm({
      ...EditStaffForm,
      [event.target.name]: event.target.value,
    });
    if (event.target.name === "Role") {
      setSelectedOption(event.target.value);
    }
  };

  const handleResetSelect = () => {
    setSelectedOption(""); // Đặt lại giá trị của select về giá trị mặc định
  };

  return (
    <Box m="20px">
      <Header title={i18n.t("TITLETEAM")} subtitle={i18n.t("DESTEAM")} />
      <Box height={"100%"} width={"100%"} display={"flex"}>
        <Box
          display={"flex"}
          gap={2}
          flexDirection={"column"}
          width={"100%"}
          height={"100%"}
        >
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
                onChange={handle_getAllStaff}
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
                {stateBranch &&
                  stateBranch.map((object, index) => (
                    <MenuItem key={index} value={object.branchID}>
                      {object.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            display={"flex"}
            flexDirection={{
              xs: "column-reverse",
              sm: "column-reverse",
              md: "row",
              lg: "row",
            }}
            gap={1}
            alignItems={"flex-end"}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"flex-end"}
              width={"100%"}
              gap={1}
            >
              <Box>
                <Typography
                  ml={2}
                  fontWeight="600"
                  color={colors.grey[100]}
                  variant="body2"
                >
                  {i18n.t("GMONTH")}
                </Typography>
                <TextField
                  type="month"
                  readOnly
                  value={`${selectedMonth.year}-${selectedMonth.month
                    .toString()
                    .padStart(2, "0")}`}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split("-");
                    setSelectedMonth({
                      year: parseInt(year),
                      month: parseInt(month),
                    });
                  }}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Button
                onClick={
                  statechinhanh === "BT004"
                    ? handleExportExcelCines
                    : handleExportExcel
                }
                disabled={isLoadingTimekeeping}
                className={classes.buttonExport}
              >
                {isLoadingTimekeeping ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Export"
                )}
              </Button>
            </Box>
            <Box
              display={"flex"}
              width={"100%"}
              height={"100%"}
              justifyContent={{
                xs: "flex-start",
                sm: "flex-start",
                md: "flex-end",
                lg: "flex-end",
              }}
              alignItems={" center"}
              gap={1}
            >
              <Button
                type="button"
                className={classes.buttonAdd}
                data-toggle="modal"
                data-target="#staticBackdropEdit"
                onClick={handleClickAdd}
              >
                {!isXsScreen && i18n.t("THEMNV")}
                <PersonAddAltIcon sx={{ ml: 1 }}></PersonAddAltIcon>
              </Button>
              <AddEmployeeModal
                open={openModalAdd}
                onClose={handleCloseModalAdd}
                statechinhanh={statechinhanh}
                updateTimekeepingData={fetchTimekeepingData}
                updateStaff={fetchingGettAllStaft_by_branchID}
              />
              {!isloading ? (
                <Button
                  style={{ marginLeft: "1%" }}
                  onClick={handleSaveClick}
                  className={classes.buttonDelete}
                >
                  {!isXsScreen && i18n.t("XOANV")}

                  <DeleteForeverOutlinedIcon sx={{ ml: 1 }} />
                </Button>
              ) : (
                <Button
                  style={{ marginLeft: "1%", backgroundColor: "grey" }}
                  className={classes.buttonDelete}
                >
                  <i class="fa fa-spinner fa-spin"></i> Deleting..
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box height="75vh" className={classes.datagrid}>
        <DataGrid
          zIndex={10}
          checkboxSelection
          editMode="row"
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rows={stateStaff}
          columns={columns}
          onRowClick={handleRowDoubleClick}
        />
        <EmployeeDetailModal
          open={openModal}
          onClose={handleCloseModal}
          statechinhanh={statechinhanh}
          employee={selectedEmployee}
          updateTimekeepingData={fetchTimekeepingData}
          onUpdateData={handleDataUpdate}
        />
      </Box>
      {/* Nhân viên đã nghĩ */}

      <Box m="80px 0 0 0" height="75vh" className={classes.datagrid}>
        <Header
          title={i18n.t("OT_NHANVIENDANGHI").toLocaleUpperCase()}
        ></Header>

        {isloadingDeleted ? (
          <Loading></Loading>
        ) : (
          <>
            {" "}
            <Box display="flex" mb={3} gap={2}>
              <Button onClick={showAlertHuy} className={classes.buttonDelete}>
                {i18n.t("XOANV")}
              </Button>

              <Button onClick={undostaff} className={classes.buttonEdit}>
                {i18n.t("OT_KHOIPHUCNV")}
              </Button>
            </Box>
          </>
        )}

        <DataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          checkboxSelection
          selectionModel={selectionModelOff}
          onSelectionModelChange={handleSelectionModelChangeOff}
          pageSize={10}
          rows={stateStaffOff}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Team;

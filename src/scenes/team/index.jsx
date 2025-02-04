import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import React from "react";
import { confirmAlert } from "react-confirm-alert";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { Get_all_TIMEKEEPING_By_DateF_DateT_branchID } from "./handleTimekeeps";
import {
  Get_all_branch_By_userid,
  Get_all_STAFFOFF_By_branchID,
  Get_all_User_By_branchID,
} from "./handlebranch";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "react-loading";
import CommonStyle from "../../components/CommonStyle";
import AddEmployeeModal from "../../components/EmployeeDetail/AddEmployeeModal";
import EmployeeDetailModal from "../../components/EmployeeDetail/EmployeeDetailModal";
import { LoadingSpinner } from "../../components/commons";
import { handleCheckExistId, handleGetDayTime } from "../../helper";
import useGetData from "../../hook/fetchData";
import { useAppDispatch } from "../../hook/reduxHooks";
import i18n from "../../i18n/i18n";
import { doSetBranch } from "../../store/slices/branchSlice";
import { ROLE_EMPLOYEE } from "../../utils/constant";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { HandleEditTimekeeps } from "./handleTimekeeps";
import {
  HandleCreateStaff,
  HandleCreateStaffOff,
  HandleDeletedStaff,
  HandleDeletedStaffOff,
} from "./handlestaff";
import "./style.css";
import moment from "moment/moment";

const Team = () => {
  useTranslation();

  // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
  const { day, month, year } = handleGetDayTime();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isloading, setIsloading] = useState(false);
  const [isloadingDeleted, setIsloadingDeleted] = useState(false);
  const [stateTimekeep, setStateTimekeep] = useState([]);
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

  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedEmployee(null);
    await fetchTimekeepingData();
  };
  const handleCloseModalAdd = async () => {
    setOpenModalAdd(false);
    await fetchTimekeepingData();
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
  const [selectionModelOff, setSelectionModelOff] = useState([]);
  const [selectRowOff, setSelectRowOff] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
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
      console.log("====res===", res);
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
      fetchingTimekeep(statechinhanh, selectedMonth.month, selectedMonth.year);
    }
  }, [selectedMonth, statechinhanh]);

  const handleExportExcel = async () => {
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
      "Ngày trong tháng",
      ...Array.from({ length: daysInMonth - 1 }, () => ""),
      "Tổng cộng",
      "Tăng ca",
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
      stateTimekeep?.forEach((paySlip) => {
        // totalHours = paySlip?.dataPayslip?.total / 60
        if (paySlip?.user?.phone === staff.phone) {
          paySlip?.dataPayslip?.data?.map((timekeep) => {
            const timekeepDate = new Date(timekeep?.createDate);
            if (
              timekeepDate.getMonth() + 1 === selectedMonth.month &&
              timekeepDate.getFullYear() === selectedMonth.year
            ) {
              const day = timekeepDate.getDate();
              let adjustedHours = (timekeep?.time - timekeep?.fined) / 60;
              if (adjustedHours) {
                hours[day - 1] = adjustedHours.toFixed(2);
              }
            }
          });
        }
      });
      const totalHours =
        stateTimekeep?.find((i) => i?.user?.phone === staff?.phone)?.dataPayslip
          ?.total / 60;
      const total_overtime =
        stateTimekeep?.find((i) => i?.user?.phone === staff?.phone)?.dataPayslip
          ?.total_overtime / 60;
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
        "Tăng ca":
          total_overtime.toFixed(2) * 1 === 0
            ? ""
            : total_overtime.toFixed(2) * 1,
      };
    });

    rows.forEach((row) => {
      const rowData = [
        row["TT"],
        row["Họ tên"],
        row["Chức vụ"],
        ...Object.values(row["Ngày trong tháng"]),
        row["Tổng cộng"],
        row["Tăng ca"],
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


  let checkaccess = false;
  let chinhanhdau = "";

  const fetchingTimekeep = async (branchId, month, year) => {
    setIsLoadingTimekeeping(true);
    const jsonfetch = {
      branchID: branchId,
      month,
      year,
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

  const { data: dataBranch, loading } = useGetData({
    url: "/Branch/admin/getallbranch/",
  });

  useEffect(() => {
    (async () => {
      dispatch(doSetBranch(dataBranch?.All_Branch));
    })();
  }, [dataBranch]);

  const fetchingBranch = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = dataBranch?.All_Branch;
      // console.log("🚀 ~ fetchingBranch ~ objBranch:", objBranch)

      setStateBranch(objBranch);
      chinhanhdau = objBranch[0].branchID;
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

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        setSelectedMonth({ year: currentYear, month: currentMonth });
        const { startDate, endDate } = getStartAndEndDatesOfMonth(
          currentYear,
          currentMonth
        );
        await fetchingTimekeep(
          chinhanhdau,
          selectedMonth.month,
          selectedMonth.year
        );
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchingapi();
  }, [loading]);

  return (
    <Box m="20px">
      {loading && <LoadingSpinner></LoadingSpinner>}
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
                    ? handleExportExcel
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
            </Box>
          </Box>
        </Box>
      </Box>

      <Box height="75vh" className={classes.datagrid}>
        <DataGrid
          zIndex={10}
          // checkboxSelection
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

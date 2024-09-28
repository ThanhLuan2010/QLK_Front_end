import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
  Backdrop,
  CircularProgress,
  useTheme,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./style.css";
import { format, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import EmployeeDetail from "./EmployeeDetail";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { HandleEditStaff } from "../../scenes/team/handlestaff";
import {
  CreateTimeKeeping,
  Get_TIMEKEEPING_By_StaffID,
  UpdateTimeKeeping,
  UpdateMultipleTimeKeeping,
} from "../../scenes/team/handleTimekeeps";
import { saveAs } from "file-saver";
import TimeKeepingLabel from "./TimeKeepingLabel";
import i18n from "../../i18n/i18n";
import { icons } from "../../utils/icons";
import {
  convertMinutes,
  convertToISODate,
  handleGetDayTime,
} from "../../helper";
import useGetData from "../../hook/fetchData";
import PayslipItem from "./PayslipItem";
import { CardCustom, PopoverCustom, TableCustom } from "../commons";
import ExcelJS from "exceljs";
import { useAppDispatch, useAppSelector } from "../../hook/reduxHooks";
import {
  doSetDataInPopover,
  doSetIsOpenPopover,
} from "../../store/slices/commonSlice";

const TITLE_PAYSLIP = [
  i18n.t("TOTAL_OVERTIME"),
  i18n.t("TOTAL_MINUTES_CHECKIN_LATER"),
  i18n.t("TOTAL_MINUTES_MINUS"),
  i18n.t("TOTAL_TIME"),
  i18n.t("TOTAL_MINUTES_CHECKOUT_EARLY"),
  i18n.t("TOTAL_TIME_CHECKIN_LATER"),
  i18n.t("TOTAL_TIME_CHECKOUT_EARLY"),
  i18n.t("TOTAL"),
];

const KEY_PAYSLIP = [
  "total_overtime",
  "total_minutes_checkin_late",
  "total_minutes_fined",
  "total_time",
  "total_minutes_checkout_early",
  "total_time_checkin_late",
  "total_time_checkout_early",
  "total",
];
const EmployeeDetailModal = ({
  open,
  onClose,
  employee,
  statechinhanh,
  updateTimekeepingData,
  onUpdateData,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const classes = EmployeeDetail();
  const [selectedDate, setSelectedDate] = useState(null);
  const [multiDay, setMultiDay] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [monthData, setMonthData] = useState([]);
  const [dailyTimes, setDailyTimes] = useState([{ checkIn: "", checkOut: "" }]);
  const modalRef = useRef(null);
  const [timekeepingData, setTimekeepingData] = useState([]);
  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [EditStaffForm, setEditStaffForm] = useState({
    name: "",
    phone: "",
    Role: "",
    branchID: "",
    AccountBank: "",
    id: "",
    ngayvao: "",
    picture: "",
    pictureTwo: "",
  });

  const {
    AlarmAddIcon,
    HistoryIcon,
    AvTimerIcon,
    AlarmIcon,
    ScheduleIcon,
    AlarmOffIcon,
    HistoryToggleOffIcon,
    AlarmOnIcon,
    ArrowDownwardIcon,
  } = icons;

  const ICONS_PAYSLIP = [
    AlarmAddIcon,
    HistoryIcon,
    AvTimerIcon,
    AlarmIcon,
    ScheduleIcon,
    AlarmOffIcon,
    HistoryToggleOffIcon,
    AlarmOnIcon,
  ];

  const { month, year } = handleGetDayTime();
  const { data, loading } = useGetData({
    url: "/timekeep/get-payslip-by-staff",
    queryParams: `month=${month}&year=${year}&staffId=${employee?.id}`,
  });

  const { isOpenModel, isOpenPopover } = useAppSelector(
    (state) => state.common
  );

  useEffect(() => {
    if (employee) {
      setEditStaffForm({
        name: employee.name || "",
        phone: employee.phone || "",
        Role: employee.Role || "",
        branchID: employee.branchID || "",
        AccountBank: employee.AccountBank || "",
        id: employee.id || "",
        ngayvao: employee.ngayvao || "",
        picture: employee.picture || "",
        pictureTwo: employee.pictureTwo || "",
      });
    }
  }, [employee]);

  const handleSubmit = async () => {
    await HandleEditStaff(EditStaffForm);
    alert("Cập nhật thành công!");
  };

  const handleFileChange = (e, setImageFile) => {
    setImageFile(e.target.files[0]);
  };

  const handleCreateTimeKeeping = async (
    employeeId,
    branchID,
    name,
    date,
    checkIn,
    checkOut
  ) => {
    const response = await CreateTimeKeeping(
      employeeId,
      branchID,
      name,
      date,
      checkIn,
      checkOut,
      0,
      new Date()
    );
    return response;
  };

  const handleUpdateTimeKeeping = async (
    id,
    startCheck,
    endCheck,
    createDate
  ) => {
    const response = await UpdateTimeKeeping(
      id,
      startCheck,
      endCheck,
      createDate
    );
    return response;
  };

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  const validateTimes = (times) => {
    const minCheckIn = "07:00";

    for (let i = 0; i < times.length; i++) {
      const { checkIn, checkOut } = times[i];
      if (checkIn < minCheckIn) {
        alert("Giờ check-in phải sau 07:00");
        return false;
      }
      if (checkOut <= checkIn && checkOut !== "00:00") {
        alert("Giờ check-out phải sau giờ check-in.");
        return false;
      }
      for (let j = i + 1; j < times.length; j++) {
        if (
          (times[j].checkIn >= checkIn && times[j].checkIn <= checkOut) ||
          (times[j].checkOut >= checkIn && times[j].checkOut <= checkOut)
        ) {
          alert("Thời gian chấm công không được trùng lặp.");
          return false;
        }
      }
    }
    return true;
  };

  const handleUpdateTime = async () => {
    if (
      dailyTimes.length === 0 ||
      dailyTimes.every((time) => time.checkIn === "" && time.checkOut === "")
    ) {
      if (
        !window.confirm(
          "Các mốc chấm công đều rỗng. Bạn có chắc muốn xóa hết ngày công không?"
        )
      ) {
        return;
      }
    }

    if (!validateTimes(dailyTimes)) {
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = formatDate(selectedDate);
      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");

      const timekeepingEntry = timekeepingData.find(
        (item) =>
          format(new Date(item.createDate), "yyyy-MM-dd") ===
          selectedDateFormatted
      );

      if (!timekeepingEntry) {
        // Ngày chưa có chấm công, gọi API tạo mới chấm công trước
        const response = await handleCreateTimeKeeping(
          employee.id,
          statechinhanh,
          employee.name,
          "..",
          dailyTimes[0].checkIn,
          dailyTimes[0].checkOut === "00:00" ? "24:00" : dailyTimes[0].checkOut,
          0,
          format(formattedDate, "yyyy-MM-dd")
        );
        if (response) {
          const timeStart = [];
          const timeEnd = [];
          for (const time of dailyTimes) {
            timeStart.push(time.checkIn);
            timeEnd.push(time.checkOut === "00:00" ? "24:00" : time.checkOut);
          }
          await handleUpdateTimeKeeping(
            response.timekeep._id,
            timeStart,
            timeEnd,
            format(formattedDate, "yyyy-MM-dd")
          );

          // Cập nhật monthData với dữ liệu mới
          const newDayData = {
            day: convertToISODate(new Date(response.timekeep.createDate)),
            times: dailyTimes,
          };
          setMonthData((prevData) => [...prevData, newDayData]);
          setTimekeepingData((prevData) => [...prevData, response.timekeep]); // Cập nhật thêm ở đây
        }
      } else {
        const timeStart = [];
        const timeEnd = [];
        for (const time of dailyTimes) {
          timeStart.push(time.checkIn);
          timeEnd.push(time.checkOut === "00:00" ? "24:00" : time.checkOut);
        }
        await handleUpdateTimeKeeping(
          timekeepingEntry._id,
          timeStart,
          timeEnd,
          format(formattedDate, "yyyy-MM-dd")
        );
        const updatedData = monthData.map((d) =>
          format(d.day, "yyyy-MM-dd") === selectedDateFormatted
            ? { ...d, times: dailyTimes }
            : d
        );
        setMonthData(updatedData);
      }

      // Lấy dữ liệu mới sau khi cập nhật
      await fetchTimekeepingData();
      await updateTimekeepingData();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMultipleTimeKeeping = async () => {
    if (
      dailyTimes.length === 0 ||
      dailyTimes.every((time) => time.checkIn === "" && time.checkOut === "")
    ) {
      if (
        !window.confirm(
          "Các mốc chấm công đều rỗng. Bạn có chắc muốn xóa hết ngày công không?"
        )
      ) {
        return;
      }
    }

    if (!validateTimes(dailyTimes)) {
      return;
    }

    setIsLoading(true);
    try {
      const timeStart = [];
      const timeEnd = [];
      for (const time of dailyTimes) {
        timeStart.push(time.checkIn);
        timeEnd.push(time.checkOut === "00:00" ? "24:00" : time.checkOut);
      }
      const response = await UpdateMultipleTimeKeeping(
        employee.id,
        statechinhanh,
        employee.name,
        "..",
        timeStart,
        timeEnd,
        formatDate(dateRange[0]),
        formatDate(dateRange[1])
      );

      if (response) {
        await fetchTimekeepingData();
      }
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 500);
      setDateRange([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedDate(null);
    }
  };

  const fetchTimekeepingData = async () => {
    setIsCalendarLoading(true);
    try {
      const start = convertToISODate(startOfMonth(currentMonth));
      const end = convertToISODate(endOfMonth(currentMonth));
      if (employee) {
        const res = await Get_TIMEKEEPING_By_StaffID(start, end, employee.id);
        if (res && res.length > 0) {
          setTimekeepingData(res);
          const formattedData = res.map((item) => ({
            day: convertToISODate(new Date(item.createDate)),
            times: {
              checkIn: item?.startCheck,
              checkOut: item?.endCheck,
            },
          }));
          setMonthData(formattedData);
        } else {
          setTimekeepingData([]);
          setMonthData([]);
        }
      }
    } catch (error) {
    } finally {
      setIsCalendarLoading(false);
    }
  };

  useEffect(() => {
    if (employee) {
      setSelectedDate(null);
      fetchTimekeepingData();
    }
  }, [employee, employee, currentMonth, statechinhanh]);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const renderCalendarTileContent = ({ date, view }) => {
    if (view === "month") {
      const dayData = monthData.filter((d) => {
        const isTrue =
          new Date(d.day).getTime() ==
          new Date(convertToISODate(date)).getTime();
        return isTrue;
      });

      return (
        <>
          {dayData?.length > 0 && (
            <Box>
              <Box>
                <div
                  style={{ fontSize: 12, fontWeight: "bold", color: "#E41395" }}
                >
                  {dayData[0]?.times.checkIn}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: "gray",
                    marginTop: -10,
                    marginBottom: -8,
                  }}
                >
                  <ArrowDownwardIcon
                    style={{
                      fontSize: "0.8rem",
                      color: "#E41395",
                      marginBottom: 2,
                    }}
                  ></ArrowDownwardIcon>
                </div>
                <div
                  style={{ fontSize: 12, fontWeight: "bold", color: "#E41395" }}
                >
                  {dayData[0]?.times.checkOut ? dayData[0]?.times.checkOut : ""}
                </div>
              </Box>
            </Box>
          )}
        </>
      );
    }
    return null;
  };

  const handleAddTimeSlot = () => {
    setDailyTimes([...dailyTimes, { checkIn: "", checkOut: "" }]);
  };

  const handleDeleteTimeSlot = (index) => {
    const newTimes = dailyTimes.filter((_, i) => i !== index);
    setDailyTimes(newTimes);
  };

  const handleTimeChange = (index, type, value) => {
    const newTimes = dailyTimes.map((time, i) =>
      i === index ? { ...time, [type]: value } : time
    );
    setDailyTimes(newTimes);
  };

  const hasEmptyFields = dailyTimes.some(
    (time) => time.checkIn === "" || time.checkOut === ""
  );

  const handleMultiDayUpdate = async () => {
    console.log("dateRange", dateRange);

    if (dateRange.length !== 2) {
      alert("Vui lòng chọn ít nhất 2 ngày để chấm công nhiều ngày.");
      return;
    }
    if (!validateTimes(dailyTimes)) {
      return;
    }

    const hasMultipleCheckInOutDays = monthData.some((d) =>
      isWithinInterval(d.day, { start: dateRange[0], end: dateRange[1] })
        ? d.times.length > 1
        : false
    );

    if (hasMultipleCheckInOutDays) {
      if (
        window.confirm(
          "Một số ngày đã có nhiều lượt chấm công. Bạn có chắc chắn muốn cập nhật tất cả các ngày này không?"
        )
      ) {
        await handleUpdateMultipleTimeKeeping();
      }
    } else {
      await handleUpdateMultipleTimeKeeping();
    }
  };

  useEffect(() => {
    if (multiDay) {
      const filteredData = monthData.filter((d) =>
        isWithinInterval(d.day, { start: dateRange[0], end: dateRange[1] })
      );

      const minTimes = filteredData.length
        ? Math.min(...filteredData.map((d) => d.times.length))
        : 0;

      const resetTimes = Array.from(
        { length: minTimes === 0 ? 1 : minTimes },
        () => ({
          checkIn: "",
          checkOut: "",
        })
      );

      setDailyTimes(resetTimes);
    } else {
      setDailyTimes([{ checkIn: "", checkOut: "" }]);
    }
  }, [multiDay, dateRange, monthData]);

  const handleExportDataToExcel = () => {
    const sheetData = data?.data?.data?.map((item) => ({
      staffid: item.staffid,
      staffName: item.staffName,
      branchID: item.branchID,
      startCheck: item.startCheck,
      endCheck: item.endCheck,
      checkin_late: item.checkin_late,
      checkout_early: item.checkout_early,
      fined: item.fined,
    }));

    sheetData.push({
      staffid: "",
      staffName: "Tổng",
      branchID: "",
      startCheck: "",
      endCheck: "",
      checkin_late: data?.data.total_minutes_checkin_late,
      checkout_early: data?.data.total_minutes_checkout_early,
      fined: data.total_minutes_fined,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "Mã nhân viên", key: "staffid", width: 35 },
      { header: "Tên nhân viên", key: "staffName", width: 45 },
      { header: "Chi nhánh", key: "branchID", width: 20 },
      { header: "Giờ bắt đầu", key: "startCheck", width: 30 },
      { header: "Giờ kết thúc", key: "endCheck", width: 30 },
      { header: "Đi trễ (phút)", key: "checkin_late", width: 30 },
      { header: "Về sớm (phút)", key: "checkout_early", width: 30 },
      { header: "Bị phạt", key: "fined", width: 20 },
    ];

    sheetData.forEach((item) => {
      worksheet.addRow(item);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      cell.font = { bold: true };
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "tracking_data.xlsx");
    });
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
  };

  const handleModalClose = () => {
    updateTimekeepingData();
    onUpdateData();
    onClose();
  };
  if (!employee) return null;

  const handleOpenPopover = (event, value) => {
    const dayData = monthData.filter((d) => {
      return (
        new Date(d.day).getTime() ===
        new Date(convertToISODate(value)).getTime()
      );
    });
    dispatch(doSetDataInPopover(dayData));

    setAnchorEl(event.currentTarget);

    dispatch(doSetIsOpenPopover(true));
  };

  const handleClose = () => {
    setAnchorEl(null);
    dispatch(doSetIsOpenPopover(false));
  };

  return (
    <>
      <PopoverCustom
        isOpen={isOpenPopover}
        anchorEl={anchorEl}
        handleClose={handleClose}
      ></PopoverCustom>
      <Modal className="model-css" open={open} onClose={handleModalClose}>
        <Box
          width={{ xs: "100%", md: "85%" }}
          height={{ md: "70%" }}
          position={"absolute"}
          ref={modalRef}
          className={classes.modalBox}
          display="flex"
          flexDirection="column"
          alignItems="start"
        >
          <Box
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            flexDirection="column"
          >
            <Typography
              fontWeight="bold"
              gutterBottom
              textTransform="uppercase"
              textAlign="center"
              my={4}
              fontSize={"1.25rem"}
            >
              {i18n.t("Timekeep")}
            </Typography>

            <IconButton
              className="icon-close-id"
              onClick={onClose}
              sx={{
                color: "black",
                position: "absolute",
                right: 10,
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box class="card-custom-id">
            <CardCustom
              name={employee?.name}
              id={employee?.id}
              role={employee?.Role}
              avatarUser={employee?.avatar}
            ></CardCustom>
          </Box>
          <Box height={"100%"} display="flex" justifyContent="center">
            <Box
              width={"50%"}
              flexDirection="column"
              overflow={"auto"}
              alignItems="center"
              className="custom-scroll"
              display={{ xs: showEmployeeInfo ? "none" : "flex", md: "flex" }}
            >
              <Box
                display="flex"
                flexDirection="row"
                width={"100%"}
                marginBottom={0.5}
                paddingBottom={1}
                alignItems="center"
                justifyContent="space-between"
                boxShadow={"0 5px 5px -5px  rgba(0, 0, 0, 0.2)"}
                position={"relative"}
              >
                <Box
                  display="flex"
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  marginLeft={"-30px"}
                ></Box>
              </Box>

              <Box width={"100%"} paddingX={3}>
                <Box
                  sx={{ position: "relative", width: "100%", height: "100%" }}
                >
                  <Backdrop
                    sx={{
                      color: "#fff",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                      borderRadius: 2,
                      backgroundColor: "rgba(0,0,0,0.1)",
                    }}
                    open={isCalendarLoading}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                  <Box sx={{ opacity: isCalendarLoading ? 0.5 : 1 }}>
                    <Calendar
                      value={multiDay ? dateRange : selectedDate}
                      tileContent={renderCalendarTileContent}
                      onClickDay={(value, event) =>
                        handleOpenPopover(event, value)
                      }
                    />
                  </Box>
                </Box>
              </Box>
              {(selectedDate || multiDay) && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  width={"100%"}
                  mt={2}
                  paddingX={3}
                >
                  {dailyTimes.length > 0 &&
                    dailyTimes.map((time, index) => (
                      <TimeKeepingLabel
                        key={index}
                        index={index}
                        timeIn={time.checkIn}
                        timeOut={
                          time.checkOut === "24:00" ? "00:00" : time.checkOut
                        }
                        handleTimeChange={handleTimeChange}
                        handleDelete={handleDeleteTimeSlot}
                      />
                    ))}

                  <Box
                    alignItems={"center"}
                    justifyContent={"center"}
                    display={"flex"}
                    mt={2}
                  >
                    <IconButton
                      onClick={handleAddTimeSlot}
                      sx={{
                        border: "2px solid #22C75B",
                        color: "#22C75B",
                        "&: hover": {
                          backgroundColor: "#DEFFE9",
                        },
                      }}
                    >
                      <AddIcon fontSize="medium" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
            <Box width={"50%"} flexDirection={"column"}>
              <Box width={"100%"} style={{ marginTop: 56 }} height={"100%"}>
                {/* <ChartComponent data={data?.data} /> */}
                <PayslipItem data={data?.data}></PayslipItem>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: -8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      color: "#000",
                      fontWeight: "bolder",
                    }}
                  >
                    {i18n.t("TOTAL")}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      color: "#000",
                      fontWeight: "bolder",
                    }}
                  >
                    {convertMinutes(data?.data?.total)}
                  </span>
                </div>
                <Button
                  className={classes.button}
                  onClick={handleExportDataToExcel}
                  sx={{ mt: 2, borderRadius: "30px" }}
                  variant="contained"
                >
                  {i18n.t("EXPORT")}
                </Button>
              </Box>
              <Box class="">
                {data?.data?.data?.length > 0 ? (
                  <TableCustom data={data?.data?.data}></TableCustom>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{ marginTop: 32 }}
                      width={"44%"}
                      src="https://nissan.navigation.com/static/WFS/Shop-Site/-/Shop/en_US/Product%20Not%20Found.png"
                    ></img>
                  </div>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EmployeeDetailModal;

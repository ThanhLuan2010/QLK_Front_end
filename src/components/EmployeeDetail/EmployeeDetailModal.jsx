import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Checkbox,
  FormControlLabel,
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
import CheckIcon from "@mui/icons-material/Check";
import EmployeeInfo from "./EmployeeInfo";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { HandleEditStaff } from "../../scenes/team/handlestaff";
import {
  CreateTimeKeeping,
  Get_TIMEKEEPING_By_StaffID,
  UpdateTimeKeeping,
  UpdateMultipleTimeKeeping,
} from "../../scenes/team/handleTimekeeps";
import CircleChecked from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import TimeKeepingLabel from "./TimeKeepingLabel";
import { ArrowForwardIos } from "@mui/icons-material";
import i18n from "../../i18n/i18n";

const EmployeeDetailModal = ({
  open,
  onClose,
  employee,
  statechinhanh,
  updateTimekeepingData,
  onUpdateData,
}) => {
  const theme = useTheme();
  const isMobile = theme.breakpoints.down("sm");
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
    console.log("EditStaffForm", EditStaffForm);

    await HandleEditStaff(EditStaffForm);
    alert("Cập nhật thành công!");
  };

  const handleFileChange = (e, setImageFile) => {
    setImageFile(e.target.files[0]);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const dayData = monthData.find(
      (d) => format(d.day, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    setDailyTimes(
      dayData
        ? dayData.times.map((time) => ({
            checkIn: time.checkIn === "24:00" ? "00:00" : time.checkIn,
            checkOut: time.checkOut === "24:00" ? "00:00" : time.checkOut,
          }))
        : [{ checkIn: "", checkOut: "" }]
    );
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
            day: new Date(response.timekeep.createDate),
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

        // Cập nhật monthData với dữ liệu đã cập nhật
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
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      if (employee) {
        const res = await Get_TIMEKEEPING_By_StaffID(
          statechinhanh,
          start,
          end,
          employee.id
        );
        if (res && res.length > 0) {
          setTimekeepingData(res);
          const formattedData = res.map((item) => ({
            day: new Date(item.createDate),
            times: item.startCheck.map((checkIn, index) => ({
              checkIn,
              checkOut: item.endCheck[index],
            })),
          }));
          setMonthData(formattedData);
        } else {
          setTimekeepingData([]); // Reset timekeeping data
          setMonthData([]); // Reset month data
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCalendarLoading(false); // Kết thúc trạng thái loading cho lịch
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
      const dayData = monthData.find(
        (d) => format(d.day, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );

      return (
        <Box>
          {dayData?.times.map((time, index) => (
            <Box key={index}>
              <Box>
                {time.checkIn} - {time.checkOut}
              </Box>
            </Box>
          ))}
        </Box>
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

  const handleMonthChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
  };
  const handleModalClose = () => {
    updateTimekeepingData();
    onUpdateData();
    onClose();
  };
  if (!employee) return null;
  console.log("dailyTimes", dailyTimes);
  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box
        width={{ xs: "90%", md: showEmployeeInfo ? "50%" : "40%" }}
        position={"absolute"}
        ref={modalRef}
        className={classes.modalBox}
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
            // variant="h3"
            // component="h2"
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
            onClick={onClose}
            sx={{
              color: "black",
              border: "2px solid black",
              position: "absolute",
              right: 10,
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={"center"}
          mb={3}
        >
          <EmployeeInfo
            employee={employee}
            statechinhanh={statechinhanh}
            handleSubmit={handleSubmit}
            EditStaffForm={EditStaffForm}
            setEditStaffForm={setEditStaffForm}
            handleFileChange={handleFileChange}
            setShowEmployeeInfo={setShowEmployeeInfo}
            showEmployeeInfo={showEmployeeInfo}
          />

          <Box
            width={"100%"}
            flexDirection="column"
            overflow={"auto"}
            height={"70vh"}
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
              {!showEmployeeInfo && (
                <IconButton
                  color="primary"
                  size="small"
                  position={"relative"}
                  sx={{
                    border: "2px solid #000000",
                    color: "#000000",
                    "&: hover": {
                      backgroundColor: "#E0E0E0",
                    },
                    marginLeft: "20px",
                  }}
                  onClick={() => setShowEmployeeInfo(!showEmployeeInfo)}
                >
                  <ArrowForwardIos />
                </IconButton>
              )}
              <Box
                display="flex"
                flex={1}
                justifyContent="center"
                alignItems="center"
                marginLeft={"-30px"}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    variant="h6"
                    fontWeight={"bold"}
                    component="h2"
                    align="center"
                  >
                    {i18n.t("Calendar")}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "black",
                        }}
                        icon={<CircleUnchecked sx={{ color: "black" }} />}
                        checkedIcon={<CircleChecked sx={{ color: "black" }} />}
                        checked={multiDay}
                        onChange={() => setMultiDay(!multiDay)}
                      />
                    }
                    label={
                      <Typography variant="body1" style={{ fontWeight: "600" }}>
                        {i18n.t("MultiTime")}
                      </Typography>
                    }
                  />
                </Box>
              </Box>
            </Box>

            <Box width={"100%"} paddingX={3}>
              <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
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
                    selectRange={multiDay}
                    onChange={(value) =>
                      multiDay ? setDateRange(value) : setSelectedDate(value)
                    }
                    onClickDay={!multiDay ? handleDayClick : undefined}
                    tileContent={renderCalendarTileContent}
                    onActiveStartDateChange={handleMonthChange}
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

            <Button
              variant="contained"
              onClick={multiDay ? handleMultiDayUpdate : handleUpdateTime}
              className={classes.button}
              sx={{ mt: 2, borderRadius: "30px" }}
              disabled={hasEmptyFields || isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : isSuccess ? (
                <CheckIcon />
              ) : (
                <Typography color={"white"}>{i18n.t("SubmitTime")}</Typography>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmployeeDetailModal;

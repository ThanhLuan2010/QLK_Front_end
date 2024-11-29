import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { convertToISODate, handleGetDayTime } from "../../helper";
import useGetData from "../../hook/fetchData";
import { useAppDispatch, useAppSelector } from "../../hook/reduxHooks";
import i18n from "../../i18n/i18n";
import {
  doSetDataInPopover,
  doSetIsOpenPopover,
} from "../../store/slices/commonSlice";
import { icons } from "../../utils/icons";
import { CardCustom, PopoverCustom, TableCustom } from "../commons";
import EmployeeDetail from "./EmployeeDetail";
import PayslipItem from "./PayslipItem";
import PayslipList from "./PayslipList";
import "./style.css";
import TimeKeepingLabel from "./TimeKeepingLabel";

const EmployeeDetailModal = ({
  open,
  onClose,
  employee,
  statechinhanh,
  updateTimekeepingData,
  onUpdateData,
}) => {
  const dispatch = useAppDispatch();
  const classes = EmployeeDetail();
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthData, setMonthData] = useState([]);
  const [dailyTimes, setDailyTimes] = useState([{ checkIn: "", checkOut: "" }]);
  const modalRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { ArrowDownwardIcon } = icons;
  const { month, year } = handleGetDayTime();
  const [monthSelect, setMonthSelect] = useState(undefined);

  useEffect(() => {
    setMonthSelect(month);
  }, [month]);

  const { data, loading, reload } = useGetData({
    url: "/timekeep/get-payslip-by-staff",
    queryParams: `month=${monthSelect}&year=${year}&staffId=${employee?.id}&branch_id=${statechinhanh}`,
  });

  useEffect(() => {
    reload();
  }, [monthSelect, employee?.id]);

  const { isOpenPopover } = useAppSelector((state) => state.common);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedDate(null);
    }
  };

  useEffect(() => {
    const formattedData = data?.data?.data.map((item) => ({
      day: convertToISODate(new Date(item.createDate)),
      times: {
        checkIn: item?.startCheck,
        checkOut: item?.endCheck,
      },
    }));
    setMonthData(formattedData);
  }, [monthSelect, data]);

  useEffect(() => {
    if (employee) {
      setSelectedDate(null);
    }
  }, [employee, employee, statechinhanh, monthSelect]);

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
    // Kiểm tra chỉ áp dụng cho chế độ xem "month"
    if (view === "month") {
      // Lọc dữ liệu để tìm ngày khớp với date hiện tại của tile
      const dayData = monthData?.filter((d) => {
        return (
          new Date(d.day).setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)
        );
      });

      return (
        <>
          {dayData?.length > 0 && (
            <Box display="flex" flexDirection="column" alignItems="center">
              <div
                style={{ fontSize: 12, fontWeight: "bold", color: "#E41395" }}
              >
                {dayData[0].times.checkIn}
              </div>
              <ArrowDownwardIcon
                style={{ fontSize: "0.8rem", color: "#E41395" }}
              />
              <div
                style={{ fontSize: 12, fontWeight: "bold", color: "#E41395" }}
              >
                {dayData[0].times.checkOut || ""}
              </div>
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
    const newTimes = dailyTimes?.filter((_, i) => i !== index);
    setDailyTimes(newTimes);
  };

  const handleTimeChange = (index, type, value) => {
    const newTimes = dailyTimes.map((time, i) =>
      i === index ? { ...time, [type]: value } : time
    );
    setDailyTimes(newTimes);
  };

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

    if (!sheetData) {
      toast.warning("Không có dữ liểu để xuất");
      return;
    }

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

    toast.success("Xuất dữ liệu chấm công thành công");
  };

  const handleModalClose = () => {
    updateTimekeepingData();
    onUpdateData();
    onClose();
  };
  if (!employee) return null;

  const handleOpenPopover = (event, value) => {
    const dayData = monthData?.filter((d) => {
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

  const handleMonthChange = ({ activeStartDate, view }) => {
    if (view === "month") {
      console.log("Tháng đã thay đổi:", activeStartDate.getMonth() + 1);
      setMonthSelect(activeStartDate.getMonth() + 1);
      reload();
    }
  };

  return (
    <>
      <PopoverCustom
        isOpen={isOpenPopover}
        anchorEl={anchorEl}
        handleClose={handleClose}
      ></PopoverCustom>
      <Modal
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
        className="model-css"
        open={open}
        onClose={handleModalClose}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "90%", md: "85%", lg: "85%" },
            height: { sm: "80%", md: "auto", lg: "auto" },
            maxHeight: "90vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            backgroundColor: "white",
            borderRadius: 8,
            paddingLeft: { xs: 2, sm: 2, md: 4, lg: 4 },
            paddingBottom: 4,
            paddingRight: { xs: 2, sm: 2, md: 4, lg: 4 },
          }}
          display="flex"
          flexDirection="column"
          ref={modalRef}
        >
          {/* Header Model */}
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
              color={"black"}
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

          {/* Card User */}
          <Box
            sx={{
              zIndex: 1000,
              display: "block",
              marginTop: { xs: -8, sm: -4, md: 0, lg: 0 },
            }}
            class="card-custom-id"
          >
            <CardCustom
              name={employee?.name}
              id={employee?.id}
              role={employee?.Role}
              avatarUser={employee?.avatar}
            ></CardCustom>
          </Box>

          {/* Body Main */}
          <Box
            sx={{
              display: { sm: "flex" },
              flexDirection: { sm: "column", md: "row", lg: "row" },
              marginTop: { xs: 2, sm: 10, md: 0, lg: 0 },
            }}
            height={"100%"}
            display="flex"
            justifyContent="center"
          >
            {/* Calender */}
            <Box sx={{ width: { sm: "100%", md: "50%", lg: "50%" } }}>
              <Box sx={{ width: "100%" }} paddingX={3}>
                {/* CALENDER */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  {/* CALENDER MAIN */}
                  <Box
                    sx={{
                      opacity: 0.5,
                      fontSize: { xs: "10px", sm: "10px", md: "14px" },
                      overflow: "hidden",
                    }}
                  >
                    <Calendar
                      onActiveStartDateChange={handleMonthChange}
                      value={selectedDate}
                      tileContent={renderCalendarTileContent}
                      onClickDay={(value, event) =>
                        handleOpenPopover(event, value)
                      }
                    />
                  </Box>
                </Box>
              </Box>
              {selectedDate && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  width={"100%"}
                  mt={2}
                  paddingX={3}
                >
                  {dailyTimes?.length > 0 &&
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

            {/* Payslips Left */}
            <Box
              sx={{
                width: { sm: "100%", md: "50%", lg: "50%" },
                marginTop: { sm: "4%", xs: "4%", md: "0%", lg: "0%" },
              }}
              flexDirection={"column"}
            >
              <Box width={"100%"} style={{ marginTop: 56 }} height={"100%"}>
                {/* <ChartComponent data={data?.data} /> */}
                <PayslipItem data={data?.data}></PayslipItem>
                <PayslipList data={data?.data}></PayslipList>
                <Button
                  className={classes.button}
                  onClick={handleExportDataToExcel}
                  sx={{ mt: 2, borderRadius: "30px" }}
                  variant="contained"
                >
                  {i18n.t("EXPORT")}
                </Button>
              </Box>

              {/* Table */}
              <Box
                sx={{
                  flex:1,
                  height:"100%"
                }}
              >
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
                      alt="404"
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

import { useState } from "react";
import {
  Badge,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HandleAccessAccount from "../handleAccess/handleAccess";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useEffect } from "react";
import Collapse from "react-bootstrap/Collapse";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import ExpandMoreIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/KeyboardArrowRight";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import { setLoggingIn } from "../../api/common";
// import "../../components/EmployeeDetail/style.css";
import { useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../index.css";
import {
  Get_all_Order,
  Get_all_Order_By_StoreID_Year_Month,
} from "../xuatkho/handlePhieustore";
import { useOrderContext } from "../../context/OrderContext";
import { useSidebar } from "../../context/SidebarContext";
const CustomListItem = styled(ListItem)(() => ({
  "&:hover": {
    color: "#fff",
  },
}));
const Sidebar = () => {
  let checkaccess = false;
  let nav = useNavigate();
  const [check, setcheck] = useState(false);
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const [openInfo, setOpenInfo] = useState(true);
  const [openpage, setOpenpage] = useState(true);
  const [openchitieu, setOpenchitieu] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const checkAccess = async () => {
    try {
      const check = HandleAccessAccount();
      if (check instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await check;

        if (resolvedResult === true || resolvedResult) {
          checkaccess = resolvedResult;
        } else {
          checkaccess = resolvedResult;
        }
      } else {
        if (check === true || check) {
          checkaccess = true;
        } else {
          checkaccess = false;
        }
      }
    } catch (error) {
      console.log(error);
    }

    setcheck(checkaccess);
  };

  const fetchingapi = async () => {
    await checkAccess();
  };
  useEffect(() => {
    fetchingapi();
  }, []);
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selected, setSelected } = useSidebar();

  const [currentDate, setCurrentDate] = useState(new Date());
  const { orders, fetchingOrderBy_storeID } = useOrderContext();

  const logout = () => {
    setSelected("Dashboard");
    localStorage.clear();
    nav("/login");
  };
  const handleItemClick = (item) => {
    setSelected(item);
    if (isMobile) {
      setIsCollapsed(true);
    }
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

  const formattedDate = `${currentDate.getFullYear()}-${getMonthNameInVietnamese(
    currentDate.getMonth()
  )}`;

  // const fetchingOrderBy_storeID = async () => {
  //   try {
  //     const check = await Get_all_Order();

  //     if (check instanceof Promise) {
  //       const resolvedResult = await check;

  //       const orders = JSON.parse(resolvedResult);

  //       const watingOrders = orders.filter((order) =>
  //         order.status.includes("PENDING")
  //       );

  //       setStatePhieuStore(watingOrders);
  //     } else {
  //       const orders = JSON.parse(check);

  //       const watingOrders = orders.filter((order) =>
  //         order.status.includes("PENDING")
  //       );

  //       setStatePhieuStore(watingOrders);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch orders by store ID and year-month", error);
  //   }
  // };
  useEffect(() => {
    fetchingOrderBy_storeID();
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212" }}>
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#121212",
            width: isCollapsed ? 73 : isMobile ? "100%" : 240,
          },
          className: "custom-scroll",
        }}
        sx={{
          width: isCollapsed ? 73 : isMobile ? "100%" : 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isCollapsed ? 73 : isMobile ? "100%" : 240,
            px: isCollapsed ? 1 : 0,
            overflow: "auto",
          },
        }}
        variant="permanent"
        anchor="left"
        className="custom-scroll"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 1,
          }}
        >
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              cursor: "pointer",
            }}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <IconButton size="large">
              <MenuOutlinedIcon />
            </IconButton>
            {!isCollapsed && (
              <Typography
                fontWeight="bold"
                textTransform={"uppercase"}
                variant="h4"
                noWrap
              >
                {check
                  ? localStorage.getItem("username")
                  : localStorage.getItem("username")?.split("admin")[1]}
              </Typography>
            )}
          </Box>
          {!isCollapsed && (
            <Box display={"flex"} justifyContent={"center"}>
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="170px"
                    height="170px"
                    src={`../../assets/Logo.png`}
                    style={{ cursor: "pointer" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    icon={<LogoutIcon></LogoutIcon>}
                    variant="h5"
                    color={colors.greenAccent[500]}
                    onClick={logout}
                    style={{ cursor: "pointer" }}
                  >
                    <LogoutIcon></LogoutIcon> LOG OUT
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <List>
          <CustomListItem
            button
            onClick={() => handleItemClick("Dashboard")}
            component={Link}
            to="/"
            selected={selected === "Dashboard"}
          >
            <ListItemIcon>
              <HomeOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" style={{ color: "#fff" }} />
          </CustomListItem>
          <List component="div" disablePadding>
            <CustomListItem
              sx={{
                backgroundColor: "#454545",
                height: "50px",
              }}
              button
              onClick={() => setOpenInfo(!openInfo)}
              selected={selected === "Team"}
            >
              <ListItemIcon>
                <ContactsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={t("TT")} />
              {!openInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </CustomListItem>
            <Collapse in={openInfo} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <CustomListItem
                  button
                  component={Link}
                  to="/team"
                  selected={selected === "Team"}
                  sx={{
                    height: "40px",
                    color: selected === "Team" ? "#FFFFFF" : "#949494",
                  }}
                  onClick={() => handleItemClick("Team")}
                >
                  <ListItemIcon>
                    <PeopleOutlinedIcon
                      sx={{
                        color: selected === "Team" ? "#FFFFFF" : "#949494",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={t("QLNV")} />
                </CustomListItem>
                {check && (
                  <>
                    {/* <CustomListItem
                      sx={{
                        height: "40px",
                        color: selected === "Chamcong" ? "#FFFFFF" : "#949494",
                      }}
                      button
                      component={Link}
                      to="/chamcong"
                      selected={selected === "Chamcong"}
                      onClick={() => handleItemClick("Chamcong")}
                    >
                      <ListItemIcon>
                        <PeopleOutlinedIcon
                          sx={{
                            color:
                              selected === "Chamcong" ? "#FFFFFF" : "#949494",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={t("QLMCC")} />
                    </CustomListItem> */}
                    <CustomListItem
                      button
                      sx={{
                        height: "40px",
                        color: selected === "Branch" ? "#FFFFFF" : "#949494",
                      }}
                      component={Link}
                      to="/branch"
                      selected={selected === "Branch"}
                      onClick={() => handleItemClick("Branch")}
                    >
                      <ListItemIcon>
                        <StorefrontIcon
                          sx={{
                            color:
                              selected === "Branch" ? "#FFFFFF" : "#949494",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={t("QLCNHANH")} />
                    </CustomListItem>
                  </>
                )}
              </List>
            </Collapse>
            <CustomListItem
              sx={{ backgroundColor: "#454545", height: "50px" }}
              button
              onClick={() => setOpenpage(!openpage)}
              selected={selected === "Contacts"}
            >
              <ListItemIcon>
                <CategoryOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={t("BDTK")} />
              {!openpage ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </CustomListItem>
            <Collapse in={openpage} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <CustomListItem
                  button
                  sx={{
                    height: "40px",
                    color: selected === "Contacts" ? "#FFFFFF" : "#949494",
                  }}
                  component={Link}
                  to="/contacts"
                  selected={selected === "Contacts"}
                  onClick={() => handleItemClick("Contacts")}
                >
                  <ListItemIcon>
                    <StorefrontIcon
                      sx={{
                        color: selected === "Contacts" ? "#FFFFFF" : "#949494",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={t("QLK")} />
                </CustomListItem>
                <CustomListItem
                  button
                  sx={{
                    height: "40px",
                    color: selected === "Invoices" ? "#FFFFFF" : "#949494",
                  }}
                  component={Link}
                  to="/invoices"
                  selected={selected === "Invoices"}
                  onClick={() => handleItemClick("Invoices")}
                >
                  <ListItemIcon>
                    <ReceiptOutlinedIcon
                      sx={{
                        color: selected === "Invoices" ? "#FFFFFF" : "#949494",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={t("QLNK")} />
                </CustomListItem>
                {check && (
                  <CustomListItem
                    button
                    sx={{
                      height: "40px",
                      color: selected === "Xuatkho" ? "#FFFFFF" : "#949494",
                    }}
                    component={Link}
                    to="/xuatkho"
                    selected={selected === "Xuatkho"}
                    onClick={() => handleItemClick("Xuatkho")}
                  >
                    <ListItemIcon>
                      <ReceiptOutlinedIcon
                        sx={{
                          color: selected === "Xuatkho" ? "#FFFFFF" : "#949494",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={t("QLXK")} />
                  </CustomListItem>
                )}
              </List>
            </Collapse>
            {check && (
              <CustomListItem
                sx={{ backgroundColor: "#454545", height: "50px" }}
                button
                onClick={() => setOpenchitieu(!openchitieu)}
                selected={selected === "Bills"}
              >
                <ListItemIcon>
                  <AssessmentOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={t("DT")} />
                {!openchitieu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </CustomListItem>
            )}
            {check && (
              <Collapse in={openchitieu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <CustomListItem
                    sx={{
                      height: "40px",
                      color: selected === "Doanhthu" ? "#FFFFFF" : "#949494",
                    }}
                    button
                    component={Link}
                    to="/doanhthu"
                    selected={selected === "Doanhthu"}
                    onClick={() => handleItemClick("Doanhthu")}
                  >
                    <ListItemIcon>
                      <ReceiptOutlinedIcon
                        sx={{
                          color:
                            selected === "Doanhthu" ? "#FFFFFF" : "#949494",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={t("QLDT")} />
                  </CustomListItem>
                  <CustomListItem
                    sx={{
                      height: "40px",
                      color: selected === "Debtors" ? "#FFFFFF" : "#949494",
                    }}
                    button
                    component={Link}
                    to="/debtors"
                    selected={selected === "Debtors"}
                    onClick={() => handleItemClick("Debtors")}
                  >
                    <ListItemIcon>
                      <ReceiptOutlinedIcon
                        sx={{
                          color: selected === "Debtors" ? "#FFFFFF" : "#949494",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={t("QLCN")} />
                  </CustomListItem>
                </List>
              </Collapse>
            )}
            <CustomListItem
              sx={{ backgroundColor: "#454545", height: "50px" }}
              button
              onClick={() => setOpen(!open)}
              selected={selected === "Actions"}
            >
              <ListItemIcon>
                <AssessmentOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={t("HV")} />
              {!open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </CustomListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <CustomListItem
                  button
                  sx={{
                    height: "40px",
                    color: selected === "Actions" ? "#FFFFFF" : "#949494",
                  }}
                  component={Link}
                  to="/form"
                  selected={selected === "Actions"}
                  onClick={() => handleItemClick("Actions")}
                >
                  <ListItemIcon>
                    <ReceiptOutlinedIcon
                      sx={{
                        color: selected === "Actions" ? "#FFFFFF" : "#949494",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={t("NK")} />
                </CustomListItem>
                {check && (
                  <CustomListItem
                    sx={{
                      height: "40px",
                      color: selected === "Input" ? "#FFFFFF" : "#949494",
                    }}
                    button
                    component={Link}
                    to="/orders"
                    selected={selected === "Input"}
                    onClick={() => handleItemClick("Input")}
                  >
                    <ListItemIcon>
                      <ReceiptOutlinedIcon
                        sx={{
                          color: selected === "Input" ? "#FFFFFF" : "#949494",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={t("XK")} />
                  </CustomListItem>
                )}
                {check && (
                  <CustomListItem
                    sx={{
                      height: "40px",
                      color: selected === "AcXuat" ? "#FFFFFF" : "#949494",
                    }}
                    button
                    component={Link}
                    to="/pending-orders"
                    selected={selected === "AcXuat"}
                    onClick={() => handleItemClick("AcXuat")}
                  >
                    <ListItemIcon>
                      <Badge badgeContent={orders.length} color="error">
                        <ReceiptOutlinedIcon
                          sx={{
                            color:
                              selected === "AcXuat" ? "#FFFFFF" : "#949494",
                          }}
                        />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary={"Duyệt xuất kho"} />
                  </CustomListItem>
                )}
              </List>
            </Collapse>
          </List>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

import { Box, Button, IconButton, Badge, useTheme } from "@mui/material";
import { useContext, useEffect, useState, useRef } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsActiveIcon from "@mui/icons-material/Notifications";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import Temp from "../../components/Temp";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n/i18n";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { Get_all_Phieu_Store_By_Status } from "../invoices/handlePhieustore";
import "./style.css";
import Notification from "../../components/Notification";
import { Get_all_branch, Get_all_branch_By_userid } from "../team/handlebranch";
import {
  Get_all_Store,
  Get_all_store_By_userid,
} from "../contacts/handlestore";
import { database } from "../../config/firebase";
import { off, onValue, ref } from "firebase/database";

const Topbar = () => {
  useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [statePhieustorePending, setStatePhieustorePending] = useState([]);
  const [statePhieustoreWaiting, setStatePhieustoreWaiting] = useState([]);
  const [stateBranch, setStateBranch] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [stateaccess, setstateaccess] = useState(false);
  const dropdownRef = useRef(null);
  const [isBlinking, setIsBlinking] = useState(false);

  let checkaccess = false;

  const checkAccess = async () => {
    const check = HandleAccessAccount();
    if (check instanceof Promise) {
      const resolvedResult = await check;
      checkaccess = resolvedResult === "true" || resolvedResult;
    } else {
      checkaccess = check === "true" || check;
    }
    setstateaccess(checkaccess);
  };

  const fetchingBranch = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = Get_all_Store();

      if (objBranch instanceof Promise) {
        const resolvedResult = await objBranch;
        setStateBranch(JSON.parse(resolvedResult));
      } else {
        setStateBranch(JSON.parse(objBranch));
      }
    } else {
      const objBranch = Get_all_store_By_userid();

      if (objBranch instanceof Promise) {
        const resolvedResult = await objBranch;
        setStateBranch(JSON.parse(resolvedResult));
      } else {
        setStateBranch(JSON.parse(objBranch));
      }
    }
  };

  const handleDropdownClick = () => {
    setDropdownOpen((prev) => !prev);
    setIsBlinking(false);
  };
console.log("stateBranch", stateBranch);
  const GET_ALL_PHIEU_STORE = async () => {
    const getP = await Get_all_Phieu_Store_By_Status("PENDING");
    const resW = await Get_all_Phieu_Store_By_Status("WAITING");
    // const pendingData = JSON.parse(getP).sort(
    //   (a, b) => new Date(b.ngaylap) - new Date(a.ngaylap)
    // );
    setStatePhieustorePending(JSON.parse(getP));

    if (stateBranch.length > 0) {
      const getW = JSON.parse(resW).filter((item) => {
        return item.StoreID === stateBranch[0].id;
      });
      //   const waitingData = JSON.parse(resW)
      //     .filter((item) => item.StoreID === stateBranch[0].id)
      //     .sort((a, b) => new Date(b.ngaylap) - new Date(a.ngaylap));
      setStatePhieustoreWaiting(getW);
    }
  };

  const fetchingapi = async () => {
    await checkAccess();
    await fetchingBranch();
  };
  const Refreshphieu = async () => {
    await GET_ALL_PHIEU_STORE();
    setIsBlinking(false);
  };

  useEffect(() => {
    fetchingapi();
  }, []);
  useEffect(() => {
    if (stateBranch.length > 0) {
      GET_ALL_PHIEU_STORE();

      const phieuStoreRef = ref(database, `phieustore`);

      const handleChange = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          GET_ALL_PHIEU_STORE();
        }
      };

      onValue(phieuStoreRef, handleChange);
      return () => {
        off(phieuStoreRef, "value", handleChange);
      };
    }
  }, [stateBranch]);
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const shouldShowActiveIcon =
    (stateaccess && statePhieustorePending.length > 0) ||
    (!stateaccess && statePhieustoreWaiting.length > 0);
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        alignItems={"center"}
      >
        {/* SEARCH BAR */}
        <Box
          display="flex"
          backgroundColor={colors.primary.main}
          borderRadius="40px"
          border="1px #D7D7D7 solid"
          maxWidth="400px"
          width="100%"
          maxHeight="40px"
          height="100%"
        >
          <InputBase
            sx={{ ml: 2, flex: 1, color: "black" }}
            placeholder={i18n.t("Find")}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon sx={{ color: "black" }} />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="center" p={1}>
          <img
            // maxHeight="40px"
            height="60px"
            src={`../../assets/ori-logo.png`}
          ></img>
        </Box>
        {/* ICONS */}
        <Box
          display="flex"
          gap={1}
          flexDirection="row"
          alignItem="center"
          justifyContent="center"
        >
          {/* {stateaccess ? ( */}
          <div
            style={{ paddingTop: "7px", position: "relative" }}
            className="dropdown"
            ref={dropdownRef}
            id="notification-anchor"
          >
            <Badge
              badgeContent={
                stateaccess
                  ? statePhieustorePending.length
                  : statePhieustoreWaiting.length
              }
              color="error"
              onClick={handleDropdownClick}
            >
              {shouldShowActiveIcon ? (
                <NotificationsActiveIcon
                  className={isBlinking ? "bell-ringing" : ""}
                  fontSize="large"
                  style={{ color: "red", cursor: "pointer" }}
                />
              ) : (
                <NotificationsOutlinedIcon
                  className={isBlinking ? "bell-ringing" : ""}
                  fontSize="large"
                  style={{ cursor: "pointer" }}
                />
              )}
            </Badge>
            {isDropdownOpen && (
              <Notification
                statePhieustore={
                  stateaccess ? statePhieustorePending : statePhieustoreWaiting
                }
                Refreshphieu={Refreshphieu}
                handleDropdownClick={handleDropdownClick}
                statechinhanh={stateBranch[0].id}
              ></Notification>
            )}
          </div>
          {/* ) : (
             <IconButton>
               <NotificationsOutlinedIcon
                 sx={{ color: colors.grey[100] }}
                fontSize="large"
               />
             </IconButton>
           )} */}

          {/* <IconButton sx={{ color: colors.grey[100] }}>
            <SettingsOutlinedIcon fontSize="large" />
          </IconButton> */}
          {/* <IconButton> */}
          <Temp />
          {/* </IconButton> */}
        </Box>
      </Box>
      <div
        className="position-fixed bottom-0 right-0 p-3"
        style={{ zIndex: 5, right: 0, bottom: 0 }}
      >
        <div
          id="liveToast"
          className="toast hide"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-delay="2000"
        >
          <div className="toast-header">
            <strong className="mr-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button
              type="button"
              className="ml-2 mb-1 close"
              data-dismiss="toast"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="toast-body">
            Hello, world! This is a toast message.
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;

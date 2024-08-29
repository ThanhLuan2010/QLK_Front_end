import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import { useState, useRef, useEffect } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VN from "./../assets/vietnam_flag.png";
import KO from "./../assets/korea_flag.png";

const Temp = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [anchorEl, setAnchorEl] = useState(null);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      ref={dropdownRef}
    >
      <IconButton onClick={handleClick} color="inherit">
        {selectedLanguage === "vi" ? (
          <img
            src={VN}
            alt="Vietnamese"
            style={{ width: 24, height: 24, borderRadius: "50%" }}
          />
        ) : (
          <img
            src={KO}
            alt="Korean"
            style={{ width: 24, height: 24, borderRadius: "50%" }}
          />
        )}
        <ArrowDropDownIcon sx={{ color: "black" }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => changeLanguage("vi")}>
          <img
            src={VN}
            alt="Vietnamese"
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              marginRight: 8,
            }}
          />
          Tiếng Việt
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("ko")}>
          <img
            src={KO}
            alt="Korean"
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              marginRight: 8,
            }}
          />
          한국어
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Temp;

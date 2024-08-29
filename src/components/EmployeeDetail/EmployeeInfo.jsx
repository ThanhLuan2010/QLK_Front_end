import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { HandleUpload } from "../../scenes/sendfileFTP/sendfileFTP";
import useStyles from "./EmployeeDetail";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Add } from "@mui/icons-material";

const EmployeeInfo = ({
  statechinhanh,
  handleSubmit,
  EditStaffForm,
  setEditStaffForm,
  showEmployeeInfo,
  setShowEmployeeInfo,
}) => {
  const classes = useStyles();
  const [editRole, setEditRole] = useState(false);
  const [currentFrontImage, setCurrentFrontImage] = useState("");
  const [currentBackImage, setCurrentBackImage] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([
    { value: "QL", label: "Quản Lý" },
    { value: "PQL", label: "Phó Quản Lý" },
    { value: "NV", label: "Nhân Viên" },
  ]);
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };
  const handleImageUpload = async (e, setCurrentImage, fieldName) => {
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setCurrentImage(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
    const file = e.target.files[0];
    try {
      const url = await HandleUpload(file, "STAFF", statechinhanh);
      console.log("url", url);
      setEditStaffForm((prevForm) => ({
        ...prevForm,
        [fieldName]: url,
      }));
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  useEffect(() => {
    if (EditStaffForm) {
      setCurrentFrontImage(EditStaffForm.picture);
      setCurrentBackImage(EditStaffForm.pictureTwo);
    }
    if (
      EditStaffForm.Role !== "NV" &&
      EditStaffForm.Role !== "QL" &&
      EditStaffForm.Role !== "PQL"
    ) {
      setEditRole(true);
    }
  }, [EditStaffForm]);

  const handleChange = (field, value) => {
    if (field === "id") {
      setEditStaffForm({ ...EditStaffForm, idnew: value });
      return;
    }
    setEditStaffForm({ ...EditStaffForm, [field]: value });
  };
  const [errors, setErrors] = useState({});
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = ["name", "phone", "Role", "ngayvao", "AccountBank"];

    requiredFields.forEach((field) => {
      if (!EditStaffForm[field]) {
        newErrors[field] = `Không được để trống thông tin!`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        handleSubmit();
      } catch (error) {
        console.error("Failed to update staff", error);
        alert("Cập nhật thất bại!");
      }
    }
  };

  const predefinedRoles = ["QL", "PQL", "NV"];
  const handleOpenNewEmployeeDialog = () => {
    setIsNewEmployeeOpen(true);
  };

  const handleCloseNewEmployeeDialog = () => {
    setIsNewEmployeeOpen(false);
    setNewEmployeeName("");
  };

  const handleAddNewEmployee = async () => {
    if (newEmployeeName.trim() !== "") {
      if (employeeOptions.some((e) => e.label === newEmployeeName)) {
        alert("Chức vụ đã tồn tại!");
        return;
      }
      const newEmployeeOption = {
        value: newEmployeeName,
        label: newEmployeeName,
      };
      setEmployeeOptions((prevOptions) => [...prevOptions, newEmployeeOption]);
      handleChange("Role", newEmployeeOption.value);
      setNewEmployeeName("");
      setIsNewEmployeeOpen(false);
    }
  };
  return (
    <Box display={"flex"}>
      {/* {!showEmployeeInfo && (
        <IconButton
          color="primary"
          size="small"
          sx={{
            border: "2px solid #000000",
            color: "#000000",
            "&: hover": {
              backgroundColor: "#E0E0E0",
            },
          }}
          onClick={() => setShowEmployeeInfo(!showEmployeeInfo)}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )} */}
      {showEmployeeInfo && (
        <Box
          padding={2}
          height={"70vh"}
          overflow={"auto"}
          className="custom-scroll"
          flex={1}
          flexDirection={"column"}
          display="flex"
          maxWidth={300}
          width={"100%"}
        >
          <Box
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h4" fontSize={"1.25rem"} fontWeight={"bold"}>
            {i18n.t("Detail")}
            </Typography>
            <IconButton
              size="small"
              sx={{
                border: "2px solid #000000",
                color: "#000000",
                "&: hover": {
                  backgroundColor: "#E0E0E0",
                },
              }}
              onClick={() => setShowEmployeeInfo(!showEmployeeInfo)}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Box>

          <Typography
            variant="body1"
            color={focusedField === "id" ? "black" : "#D9D2D2"}
            onFocus={() => handleFocus("id")}
            onBlur={handleBlur}
          >
            {i18n.t("MNV_TEAM") || "CCCD"}
          </Typography>
          <TextField
            className={classes.textField}
            value={EditStaffForm.idnew ? EditStaffForm.idnew : EditStaffForm.id}
            onChange={(e) => handleChange("id", e.target.value)}
            onFocus={() => handleFocus("id")}
            onBlur={handleBlur}
          />
          <Typography
            color={focusedField === "name" ? "black" : "#D9D2D2"}
            variant="body1"
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
          >
            {" "}
            {i18n.t("TNV_TEAM")}
          </Typography>
          <TextField
            error={!!errors["name"]}
            helperText={errors["name"]}
            required
            className={classes.textField}
            value={EditStaffForm.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
          />
          <Typography
            color={focusedField === "phone" ? "black" : "#D9D2D2"}
            variant="body1"
            onFocus={() => handleFocus("phone")}
            onBlur={handleBlur}
          >
            {" "}
            {i18n.t("SDT_TEAM")}
          </Typography>

          <TextField
            error={!!errors["phone"]}
            helperText={errors["phone"]}
            required
            className={classes.textField}
            value={EditStaffForm.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onFocus={() => handleFocus("phone")}
            onBlur={handleBlur}
          ></TextField>

          <Typography
            color={focusedField === "Role" ? "black" : "#D9D2D2"}
            variant="body1"
            onFocus={() => handleFocus("Role")}
            onBlur={handleBlur}
          >
            {" "}
            {i18n.t("Chức vụ")}
          </Typography>

          {/* {editRole ? (
            <TextField
              error={!!errors["Role"]}
              helperText={errors["Role"]}
              className={classes.textField}
              value={EditStaffForm.Role}
              onChange={(e) => handleChange("Role", e.target.value)}
              onFocus={() => handleFocus("Role")}
              onBlur={handleBlur}
            />
          ) : ( */}
          <FormControl fullWidth>
            <Select
              sx={{
                mb: "8px",
              }}
              value={EditStaffForm.Role}
              className={classes.select}
              onChange={(e) => handleChange("Role", e.target.value)}
              onFocus={() => handleFocus("Role")}
              onBlur={handleBlur}
            >
              {predefinedRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role === "QL"
                    ? "Quản Lý"
                    : role === "PQL"
                    ? "Phó Quản Lý"
                    : "Nhân Viên"}
                </MenuItem>
              ))}
              {!predefinedRoles.includes(EditStaffForm.Role) && (
                <MenuItem value={EditStaffForm.Role}>
                  {EditStaffForm.Role}
                </MenuItem>
              )}
              <MenuItem onClick={handleOpenNewEmployeeDialog}>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"row"}
                  width={"100%"}
                  gap={1}
                >
                  <Add />
                  <Typography variant="body1">Chọn chức vụ khác</Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* )} */}
          <Typography
            color={focusedField === "ngayvao" ? "black" : "#D9D2D2"}
            variant="body1"
            onFocus={() => handleFocus("ngayvao")}
            onBlur={handleBlur}
          >
            {i18n.t("NV_TEAM")}
          </Typography>
          <TextField
            error={!!errors["ngayvao"]}
            helperText={errors["ngayvao"]}
            className={classes.textField}
            value={EditStaffForm.ngayvao}
            onChange={(e) => handleChange("ngayvao", e.target.value)}
            onFocus={() => handleFocus("ngayvao")}
            onBlur={handleBlur}
          />
          <Typography
            color={focusedField === "AccountBank" ? "black" : "#D9D2D2"}
            variant="body1"
            onFocus={() => handleFocus("AccountBank")}
            onBlur={handleBlur}
          >
            {" "}
            {i18n.t("TTNH")}
          </Typography>

          <TextField
            error={!!errors["AccountBank"]}
            helperText={errors["AccountBank"]}
            className={classes.textField}
            value={EditStaffForm.AccountBank}
            onChange={(e) => handleChange("AccountBank", e.target.value)}
            onFocus={() => handleFocus("AccountBank")}
            onBlur={handleBlur}
          />
          <Box
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            flexDirection={"column"}
            mt={2}
          >
            <img
              src={currentFrontImage}
              alt="Mặt trước CCCD"
              width={"100%"}
              style={{ marginTop: "16px", borderRadius: "20px" }}
            />

            <label htmlFor="picture">CCCD Mặt trước</label>
            <input
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e, setCurrentFrontImage, "picture");
              }}
              type="file"
              id="picture"
              name="picture"
            ></input>
            <img
              src={currentBackImage}
              alt="Mặt sau CCCD"
              width={"100%"}
              style={{ marginTop: "16px", borderRadius: "20px" }}
            />
            <label htmlFor="pictureTwo">CCCD Mặt sau</label>
            <input
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e, setCurrentBackImage, "pictureTwo");
              }}
              type="file"
              id="pictureTwo"
              name="pictureTwo"
            ></input>
          </Box>
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              className={classes.button}
              onClick={handleFormSubmit}
              sx={{ mt: 2, borderRadius: "30px" }}
              variant="contained"
            >
              <Typography fontSize={"0.8rem"} textTransform={"none"}>
              {i18n.t("Update")}
              </Typography>
            </Button>
          </Box>
        </Box>
      )}
      <Dialog
        open={isNewEmployeeOpen}
        onClose={handleCloseNewEmployeeDialog}
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "10px",
            backgroundColor: "black",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5">Tên chức vụ</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newEmployeeName"
            type="text"
            className={classes.textFieldAdd}
            fullWidth
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: "30px" }}
            onClick={handleCloseNewEmployeeDialog}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{
              borderRadius: "30px",
              backgroundColor: "white",
              color: "black",
            }}
            onClick={handleAddNewEmployee}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeInfo;

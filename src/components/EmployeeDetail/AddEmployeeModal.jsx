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
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { HandleUpload } from "../../scenes/sendfileFTP/sendfileFTP";
import useStyles from "./EmployeeDetail";
import CloseIcon from "@mui/icons-material/Close";
import { HandleCreateStaff } from "../../scenes/team/handlestaff";
import { Add } from "@mui/icons-material";

const AddEmployeeModal = ({
  open,
  onClose,
  statechinhanh,
  updateTimekeepingData,
  updateStaff,
}) => {
  const classes = useStyles();
  const [editRole, setEditRole] = useState(false);
  const [currentFrontImage, setCurrentFrontImage] = useState("");
  const [currentBackImage, setCurrentBackImage] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [AddStaffForm, setAddStaffForm] = useState({
    name: "",
    phone: "",
    Role: "",
    branchID: statechinhanh,
    AccountBank: "",
    id: "",
    ngayvao: "",
    picture: "",
    pictureTwo: "",
  });
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
      setAddStaffForm((prevForm) => ({
        ...prevForm,
        [fieldName]: url,
      }));
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  useEffect(() => {
    if (AddStaffForm) {
      setCurrentFrontImage(AddStaffForm.picture);
      setCurrentBackImage(AddStaffForm.pictureTwo);
    }
    if (
      AddStaffForm.Role !== "NV" &&
      AddStaffForm.Role !== "QL" &&
      AddStaffForm.Role !== "PQL"
    ) {
      setEditRole(true);
    }
  }, [AddStaffForm]);

  const handleChange = (field, value) => {
    setAddStaffForm({
      ...AddStaffForm,
      [field]: value,
      branchID: statechinhanh,
    });
  };

  const [errors, setErrors] = useState({});
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = [
      "id",
      "name",
      "phone",
      "Role",
      "ngayvao",
      "AccountBank",
    ];

    requiredFields.forEach((field) => {
      if (!AddStaffForm[field]) {
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

  const handleSubmit = async () => {
    try {
      await HandleCreateStaff(AddStaffForm);
      alert("Thêm thành công");
      onClose();
      await updateStaff(statechinhanh);
    } catch (error) {
      console.error("Failed to create staff", error);
      alert("Thêm nhân viên thất bại!");
    }
  };

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
        value: newEmployeeName.toUpperCase().replace(/\s+/g, "_"),
        label: newEmployeeName,
      };
      setEmployeeOptions((prevOptions) => [...prevOptions, newEmployeeOption]);
      handleChange("Role", newEmployeeOption.value);
      setNewEmployeeName("");
      setIsNewEmployeeOpen(false);
    }
  };

  return (
    <Modal open={Boolean(open)} onClose={onClose}>
      <Box
        maxWidth={400}
        width={"100%"}
        maxHeight={1000}
        height={"90%"}
        className={classes.modalBox}
      >
        <Box
          padding={2}
          height={"70vh"}
          flex={1}
          flexDirection={"column"}
          display="flex"
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={"row"}
            alignItems={"center"}
            mb={2}
          >
            <Typography variant="h4" component="h2" fontWeight={"bold"}>
              {i18n.t("THEMNV")}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: "black", border: "2px solid black" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            padding={1}
            overflow={"auto"}
            overflowX={"hidden"}
            className="custom-scroll"
            flexDirection={"column"}
          >
            <Typography
              variant="body1"
              color={focusedField === "id" ? "black" : "#D9D2D2"}
              onFocus={() => handleFocus("id")}
              onBlur={handleBlur}
            >
              {" "}
              {i18n.t("CCCD") || "CCCD"}
            </Typography>
            <TextField
              className={classes.textField}
              error={!!errors["id"]}
              helperText={errors["id"]}
              value={AddStaffForm.id}
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
              value={AddStaffForm.name}
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
              value={AddStaffForm.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onFocus={() => handleFocus("phone")}
              onBlur={handleBlur}
            />
            <Typography
              color={focusedField === "Role" ? "black" : "#D9D2D2"}
              variant="body1"
              onFocus={() => handleFocus("Role")}
              onBlur={handleBlur}
            >
              {" "}
              {i18n.t("Chức vụ")}
            </Typography>
            <FormControl fullWidth>
              <Select
                sx={{ mb: "8px" }}
                value={AddStaffForm.Role}
                className={classes.select}
                onChange={(e) => handleChange("Role", e.target.value)}
                onFocus={() => handleFocus("Role")}
                onBlur={handleBlur}
              >
                {employeeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
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
              value={AddStaffForm.ngayvao}
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
              value={AddStaffForm.AccountBank}
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
                width={300}
                style={{ marginTop: "16px", borderRadius: "20px" }}
              />
              <label htmlFor="picture">{i18n.t("CCCDF")}</label>
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
                width={300}
                style={{ marginTop: "16px", borderRadius: "20px" }}
              />
              <label htmlFor="pictureTwo">{i18n.t("CCCDB")}</label>
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
          </Box>
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              className={classes.button}
              onClick={handleFormSubmit}
              sx={{ mt: 2, borderRadius: "30px" }}
              variant="contained"
            >
              {i18n.t("Update")}
            </Button>
          </Box>
        </Box>
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
    </Modal>
  );
};

export default AddEmployeeModal;

import i18n from "../../../i18n/i18n";
import "./style.css";
const InputSelect = ({
  label,
  id,
  type = "text",
  register,
  errors,
  validate,
  placeholder,
  option = [],
  onClickOpenNewEmployeeDialog,
}) => {
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "new") {
      onClickOpenNewEmployeeDialog();
    }
  };
  return (
    <div>
      {label && (
        <label style={{ fontSize: 14, color: "gray" }} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        type={type}
        id={id}
        class="minimal"
        style={{
          width: "100%",
          height: "4vh",
          outline: "none",
          borderRadius: 20,
          paddingLeft: 10,
          marginBottom: 6,
        }}
        {...register(id, validate)}
        onChange={handleSelectChange}
        placeholder={placeholder}
      >
        {option.map((el) => (
          <option
            style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
            key={el.value}
            value={el.value}
          >
            <span>{el?.label}</span>
            {/* <img
              src="https://api.vietqr.io/img/ICB.png"
              style={{ width: 100 }}
            /> */}
          </option>
        ))}
        <option value="new">
          <span>{i18n.t("ADD_ROLE")}</span>
        </option>
      </select>
      {errors && errors[id] && (
        <small
          style={{
            color: "red",
            marginTop: 4,
            fontSize: 14,
          }}
        >
          {errors[id]?.message}
        </small>
      )}
    </div>
  );
};

export default InputSelect;

import { handleGetDayTime } from "../../../helper";

const InputForm = ({
  label,
  id,
  type = "text",
  register,
  errors,
  validate,
  placeholder,
  ...props
}) => {
  const { day, month, year } = handleGetDayTime();
  const getDefaultValue = () => {
    if (type === "date") {
      return `${year}-${month}-${day}`;
    }
    return "";
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: 8,
      }}
    >
      {label && (
        <label style={{ fontSize: 14, color: "gray" }} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        defaultValue={getDefaultValue()}
        style={{
          width: "100%",
          height: "4vh",
          outline: "none",
          borderRadius: 20,
          paddingLeft: 10,
          borderWidth: "0.5px",
          paddingRight: 10,
        }}
        {...register(id, validate)}
        {...props}
      />
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

export default InputForm;

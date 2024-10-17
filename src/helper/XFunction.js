import i18n from "../i18n/i18n";

export const handleGetDayTime = (originalDateString) => {
  let today;
  if (originalDateString) today = new Date(originalDateString);
  else today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const hours = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");
  const seconds = today.getSeconds().toString().padStart(2, "0");

  return { year, month, day, hours, minutes, seconds };
};

export const handleConvertDate = (day, month, year) => {
  return `${parseInt(year)}-${parseInt(month)
    .toString()
    .padStart(2, "0")}-${parseInt(day).toString().padStart(2, "0")}`;
};

export const convertToHHandMM = (params) => {
  const arrayObject = params.value;
  const totalHours = Math.floor(arrayObject / (1000 * 60 * 60));
  const totalMinutes = Math.floor(
    (arrayObject % (1000 * 60 * 60)) / (1000 * 60)
  );

  return <span>{`${totalHours} giờ ${totalMinutes} phút`}</span>;
};

export const convertMinutes = (minutes) => {
  if (isNaN(minutes) || minutes === null || minutes === undefined) {
    return "Đang cập nhập";
  }

  minutes = parseInt(minutes, 10);

  if (minutes < 60) {
    return minutes + ` ${i18n.t("MINUS")}`;
  } else {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;
    return (
      hours + ` ${i18n.t("HOURS")} ` + remainingMinutes + ` ${i18n.t("MINUS")} `
    );
  }
};

export const convertToISODate = (dateString) => {
  const date = new Date(dateString);

  const isoString = date.toISOString();

  return isoString;
};

export const convertISOToDateFormat = (isoString) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    console.log("blob " + blob);
    reader.onloadend = () => resolve(reader.result); // Lấy phần base64 sau dấu phẩy
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const convertUrlToBase64 = async (url) => {
  const response = await fetch(url, { mode: "no-cors" });
  const blob = await response.blob();
  const base64 = await blobToBase64(blob);
  return base64;
};

export const handleCheckExistId = (A, B) => {
  return A.some((itemA) => B.some((itemB) => itemB.id === itemA.id));
};

export const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// export const convertoBase64PicTwoEdit = async (e) => {
//   const check = await CheckFileName(
//     e.target.files[0].name,
//     "STAFF",
//     statechinhanh
//   );
//   setStateimgTwoFileNameEdit(check);
//   const render = new FileReader();
//   render.readAsDataURL(e.target.files[0]);
//   render.onload = () => {
//     setEditStaffForm({
//       ...EditStaffForm,
//       pictureTwo: URL_IMG + `STAFF/${statechinhanh}/` + check,
//     });

//     setStateimgTwoEdit(render.result);
//   };
//   render.onerror = (error) => {
//     console.log("error" + error);
//   };
// };

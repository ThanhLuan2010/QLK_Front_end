import { firstValueFrom } from "rxjs";
import Url_BackEnd from "../../URL";
import { Method } from "../../api/common";
function generateRandomString() {
  // Hàm để tạo số ngẫu nhiên trong khoảng từ min đến max (bao gồm cả max)
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Hàm để tạo một ký tự chữ cái ngẫu nhiên
  const getRandomLetter = () => String.fromCharCode(getRandomNumber(65, 90)); // Từ A đến Z

  // Tạo chuỗi gồm 2 chữ cái và 8 số ngẫu nhiên
  const randomString =
    getRandomLetter() +
    getRandomLetter() +
    getRandomNumber(10000000, 99999999).toString();

  return randomString;
}

export const HandleUpload = async (image, type, statechinhanh) => {
  if (!image) {
    console.error("Please select a file");
    return;
  }
  console.log("image", image);

  const formData = new FormData();
  formData.append("image", image);
  formData.append("type", type);
  formData.append("machinhanh", statechinhanh);

  try {
    const response = await fetch(`${Url_BackEnd}/upload/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    const responseData = await response.json();
    return responseData.data.url;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export const CheckFileName = async (filename, type, statechinhanh) => {
  let tempName = "";
  const name = await firstValueFrom(
    Method.post(`${Url_BackEnd}/api/checkname`, {
      filename,
      type: type,
      machinhanh: statechinhanh,
    })
  ).then((resp) => {
    console.log("====resp==", resp);
    tempName = resp;
  });
  return tempName;
};

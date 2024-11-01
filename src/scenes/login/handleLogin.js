import Url_BackEnd from "../../URL";
import { Method } from "../../api/common";
import { firstValueFrom } from "rxjs";
const HandleLogin = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/Auth/Login`, {
      username: req.username,
      password: req.password,
    })
  );
  localStorage.setItem("id", response.user.userID);
  localStorage.setItem("username", response.user.username);
  localStorage.setItem("token", response.Accesstoken);
  console.log("login", response.user.Role);
  return response;
};

export default HandleLogin;

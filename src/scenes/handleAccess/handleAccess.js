import { firstValueFrom } from "rxjs";
import Url_BackEnd from "../../URL";
import { Method } from "../../api/common";
const HandleAccessAccount = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/checkaccess`)
  );
  
  if (response.success) {
    return true;
  }
  return false;
};

export default HandleAccessAccount;

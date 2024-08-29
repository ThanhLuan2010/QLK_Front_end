import Url_BackEnd from "../../URL";
import { Method } from "../../api/common";
import { firstValueFrom } from "rxjs";
export const Get_all_store_By_userid = async () => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/store/getstoreByUserID`)
  );
  return JSON.stringify(response.All_Branch);
};

export const Get_all_Store = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/store/getallstore`)
  );
  return JSON.stringify(response.All_Store);
};

export const Get_all_User_By_branchID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/Staff/getallStaft/`, {
      branchID: req,
    })
  );
  return JSON.stringify(response.All_Branch);
};

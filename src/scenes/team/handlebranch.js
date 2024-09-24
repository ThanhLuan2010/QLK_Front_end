import Url_BackEnd from "../../URL";
import { Method } from "../../api/common";
import { firstValueFrom } from "rxjs";
export const Get_all_branch_By_userid = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/Branch/getallbranch/`)
  );
  return JSON.stringify(response.All_Branch);
};

export const Get_all_branch = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/Branch/admin/getallbranch/`)
  );
  return JSON.stringify(response.All_Branch);
};

export const Get_all_User_By_branchID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/Staff/getallStaft/`, {
      branchID: req,
    })
  );
  console.log("=====response===", response);
  return JSON.stringify(response.All_Branch);
};

export const Get_all_STAFFOFF_By_branchID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/staffoff/getallStaft`, {
      branchID: req,
    })
  );
  return JSON.stringify(response.All_Branch);
};

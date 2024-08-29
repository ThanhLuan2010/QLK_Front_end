import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
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
  return JSON.stringify(response);
};

export const CreateBranch = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/Branch/create`, {
      branchID: req.branchID,
      name: req.name,
      diachi: req.diachi,
      masothue: req.masothue,
      userId: localStorage.getItem("id"),
    })
  );
  return JSON.stringify(response);
};

export const CreateStore = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/store/create`, {
      id: req.id,
      name: req.name,
      BranchId: req.BranchId,
      status: "OK",
      code: req.code,
    })
  );
  return JSON.stringify(response);
};

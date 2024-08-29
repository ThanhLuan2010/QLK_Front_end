import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const HandleCreateStaff = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/Staff/create`, {
      id: req.id,
      name: req.name,
      phone: req.phone,
      Role: req.Role,
      branchID: req.branchID,
      ngayvao: req.ngayvao,
    })
  );

  return JSON.stringify(response);
};

export const HandleEditStaff = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/Staff/updateStaff`, {
      id: req.id,
      name: req.name,
      phone: req.phone,
      Role: req.Role,
      branchID: req.branchID,
    })
  );

  return JSON.stringify(response);
};

export const HandleDeletedStaff = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/Staff/deletedstaff/`, {
      arraydeleted: req,
    })
  );
  return JSON.stringify(response);
};

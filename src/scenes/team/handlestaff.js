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
      AccountBank: req.AccountBank,
      picture: req.picture,
      pictureTwo: req.pictureTwo,
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
      AccountBank: req.AccountBank,
      ngayvao: req.ngayvao,
      idnew: req.idnew,
      picture: req.picture,
      pictureTwo: req.pictureTwo,
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

export const HandleDeletedStaffOff = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/staffoff/deletedstaff`, {
      id: req.id,
      branchID: req.branchID,
    })
  );
  return JSON.stringify(response);
};

export const HandleCreateStaffOff = async (req) => {

  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/staffoff/create`, {
      id: req.id,
      name: req.name,
      phone: req.phone,
      Role: req.Role,
      branchID: req.branchID,
      ngayvao: req.ngayvao,
      AccountBank: req.AccountBank,
      picture: req.picture,
      pictureTwo: req.pictureTwo,
    })
  );
  return JSON.stringify(response);
};

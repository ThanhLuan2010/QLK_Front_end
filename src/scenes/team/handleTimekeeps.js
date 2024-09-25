import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";

export const HandleCreateTimekeeps = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/timekeep/create`, {
      staffid: req.staffid,
      staffName: req.staffName,
      branchID: req.branchID,
      OT: req.OT,
      reason: "...",
      startCheck: "...",
      endCheck: "...",
      createDate: req.createDate,
    })
  );
  return response;
};

export const Get_all_TIMEKEEPING_By_DateF_DateT_branchID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/timekeep/getAllTimekeeep`, {
      branchID: req.branchID,
      createDateF: req.createDateF,
      createDateT: req.createDateT,
    })
  );
  return JSON.stringify(response.all_Time);
};

export const Get_TIMEKEEPING_By_StaffID = async (
  branchID,
  createDateF,
  createDateT,
  staffId
) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/timekeep/getTimekeepByStaff`, {
      branchID: branchID,
      createDateF: createDateF,
      createDateT: createDateT,
      staffId: staffId,
    })
  );
  return response.all_Time;
};
export const CreateTimeKeeping = async (
  staffid,
  branchID,
  staffName,
  reason,
  startCheck,
  endCheck,
  OT,
  createDate
) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/timekeep/create-timekeeping`, {
      staffid: staffid,
      branchID: branchID,
      staffName: staffName,
      reason: reason,
      startCheck: startCheck,
      endCheck: endCheck,
      OT: OT,
      createDate: createDate,
    })
  );
  return response;
};
export const UpdateTimeKeeping = async (
  id,
  startCheck,
  endCheck,
  createDate
) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/timekeep/update-keeping`, {
      id: id,
      startCheck: startCheck,
      endCheck: endCheck,
      createDate: createDate,
    })
  );
  return response;
};
export const UpdateMultipleTimeKeeping = async (
  staffid,
  branchID,
  staffName,
  reason,
  startCheck,
  endCheck,
  fromDate,
  toDate
) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/timekeep/create-keeping-multiple`, {
      staffid: staffid,
      branchID: branchID,
      staffName: staffName,
      reason: reason,
      startCheck: startCheck,
      endCheck: endCheck,
      fromDate: fromDate,
      toDate: toDate,
    })
  );
  return response;
};

export const GET_ALL_TIMEKEEP_FROM_API = async (req) => {
  const res = await firstValueFrom(Method.get(`${Url_BackEnd}/api/sql`));
  return res;
};

export const GET_ALL_TIMEKEEP_FROM_API_SEARCH = async (req) => {
  console.log("check req " + JSON.stringify(req));

  const res = await firstValueFrom(
    Method.post(`${Url_BackEnd}/api/search`, {
      dateF: req.dateF,
      dateT: req.dateT,
    })
  );
  return res;
};

export const HandleEditTimekeeps = async (req) => {
  console.log("check req " + JSON.stringify(req));

  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/timekeep/update`, {
      id: req.id,
      branchID: req.branchID,
      reason: req.reason,
      startCheck: req.startCheck,
      endCheck: req.endCheck,
      heso: req.heso,
      Total: req.Total,
    })
  );
  return response;
};
export const HandleDeletedTime = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/timekeep/deleted`, {
      id: req.id,
      branchID: req.branchID,
    })
  );
  return response;
};

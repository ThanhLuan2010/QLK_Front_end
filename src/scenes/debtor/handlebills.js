import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const createBills = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/bills/create`, {
        id: req.id,
        OrderID: req.OrderID,
        sotien: req.sotien,
        userID: req.userID,
        noiban: req.noiban,
        noimua: req.noimua,
        giaban: req.giaban,
        giamua: req.giamua,
        phieuxuatID: req.phieuxuatID,
      })
    );
    return JSON.stringify(response);
  }
};

export const GET_ALLBILL_BY_NOIMUA = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/bills/getallbillByNoimua`, {
        noimua: req,
      })
    );
    return JSON.stringify(response.All_Bill);
  }
};

export const Get_all_Bill_By_userID = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.get(`${Url_BackEnd}/bills/getallbillsByuserID`)
    );
    return JSON.stringify(response.All_Bill);
  }
};

export const Get_all_Bill = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.get(`${Url_BackEnd}/bills/getallbills`)
    );
    return JSON.stringify(response.All_Bill);
  }
};

export const Update_PhieuOrder_By_id = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.put(`${Url_BackEnd}/order/updateStateOrder`, {
        arrayUpdate: req,
      })
    );
    return JSON.stringify(response);
  }
};

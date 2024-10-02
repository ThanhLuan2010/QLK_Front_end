import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";

export const GET_Notifi_BY_ID = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/notifi/findone`, {
        id: "id01",
      })
    );
    return JSON.stringify(response.notifications?.content);
  }
};

export const Update_Notifi_By_id = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.put(`${Url_BackEnd}/notifi/update`, {
        id: "id01",
        content: req,
      })
    );
    return JSON.stringify(response.updateNotifi);
  }
};

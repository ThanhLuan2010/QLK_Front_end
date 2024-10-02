import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";

export const getAllBankName = async () => {
  const response = await firstValueFrom(
    Method.get(`https://api.vietqr.io/v2/banks`)
  );
  return JSON.stringify(response.data);
};

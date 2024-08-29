import { ref, set } from "firebase/database";
import { database } from "../config/firebase";

export const updateFirebasePhieuStore = async (
  phieuStoreData,
  storeID,
  status
) => {
  const dbRef = ref(database, `phieustore/${storeID}/${phieuStoreData}`);
  await set(dbRef, status);
};

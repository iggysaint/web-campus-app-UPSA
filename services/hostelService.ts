import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getHostels = async () => {
  const snapshot = await getDocs(collection(db, "hostels"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

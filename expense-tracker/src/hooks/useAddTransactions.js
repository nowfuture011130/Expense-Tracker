import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";
export const useAddTransactions = () => {
  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();
  const addTransactions = async ({
    description,
    transactionAmount,
    transactionClass,
    transactionType,
  }) => {
    await addDoc(transactionCollectionRef, {
      userID,
      description,
      transactionAmount,
      transactionClass,
      transactionType,
      createdAt: serverTimestamp(),
    });
  };
  return { addTransactions };
};

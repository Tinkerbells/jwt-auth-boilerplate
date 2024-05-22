import { apiClient } from "@/api";
import { useMutation } from "react-query";

type SecretType = {
  message: string
}

const fetchSecret = async (): Promise<SecretType> => {
  const { data } = await apiClient.get(`/secret`);
  return data;
};

export const useSecret = () => {
  return useMutation(fetchSecret);
};

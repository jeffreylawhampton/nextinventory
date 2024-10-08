import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

export const useUser = () => {
  const { data, error, isLoading } = useSWR(`/user/api`, fetcher);

  return {
    user: data,
    isLoading,
    error,
  };
};

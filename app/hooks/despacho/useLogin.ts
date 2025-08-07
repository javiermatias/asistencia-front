import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/check-status`;
const CheckStatus = async (token: string) => {
    const { data } = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };

  export interface CheckStatusResponse {
    message: string;
  
  }

  export const useCheckStatus = (token: string | undefined) => {
    return useQuery<CheckStatusResponse, Error>({
      // The query key is an array that uniquely identifies this data.
      // When page or limit changes, React Query will refetch automatically.
      queryKey: ['check'],
      queryFn: () => {
        if (!token) {
          // This will prevent the query from running, but 'enabled' is the primary way
          return Promise.reject(new Error('No token provided'));
        }
        return CheckStatus(token);
      },
      // Only run the query if the token exists
      enabled: !!token,
      // Optional: Keep previous data visible while new data is loading
      //keepPreviousData: true, 
      retry: false,
      
    });
  };
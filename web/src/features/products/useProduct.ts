import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";

const fetchProduct = async (barcode: string) => {
  const response = await api.get(`/products/${barcode}`);
  return response.data;
};

export const useProduct = (barcode: string) => {
  return useQuery({
    queryKey: ["product", barcode],
    queryFn: () => fetchProduct(barcode),
    enabled: !!barcode, 
    retry: false,
  });
};
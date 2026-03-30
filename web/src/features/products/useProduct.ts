import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";

export type NutrientInfo = {
  value: number | null;
  percent_daily: number | null;
  limit: number | null;
  level: "green" | "amber" | "red" | "unknown";
};

export type NutritionAnalysis = {
  per_100g: Record<string, NutrientInfo>;
  per_serving: Record<string, NutrientInfo>;
  serving_quantity: number | null;
  serving_size: string | null;
  serving_unit_parsed: string | null;
};

export type EnergyInfo = {
  per_100g: number | null;
  per_serving: number | null;
};

export type IngredientDetail = {
  ingredient: string;
  severity?: "high" | "medium" | "low";
  message: string;
};

export type IngredientAnalysis = {
  warnings: IngredientDetail[];
  positives: Array<{ ingredient: string; message: string }>;
  severity_counts: { high: number; medium: number; low: number };
  total_warnings: number;
  total_positives: number;
  ingredient_summary: string;
};

export type Insights = {
  summary: string;
  warnings: string[];
  positives: string[];
};

export type ProductResponse = {
  source: string;
  product: {
    barcode: string;
    name: string;
    brand: string | null;
    image_url: string | null;
    nutriscore: string | null;
    energy_kcal: number | null;
    protein: number | null;
    fiber: number | null;
    category: string | null;
    cached_at: string;
  };
  analysis: NutritionAnalysis;
  energy: EnergyInfo;
  insights: Insights;
  ingredient_analysis: IngredientAnalysis;
};

const fetchProduct = async (barcode: string): Promise<ProductResponse> => {
  const response = await api.get(`/products/${barcode}`);
  return response.data;
};

export const useProduct = (barcode: string) => {
  return useQuery<ProductResponse, Error>({
    queryKey: ["product", barcode],
    queryFn: () => fetchProduct(barcode),
    enabled: !!barcode,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
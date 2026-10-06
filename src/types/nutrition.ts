export interface NutritionItem {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface NutritionTotals {
  calories: number;
  protein_g: number;
  carbohydrates_total_g: number;
  fat_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface NutritionApiResponse {
  success: boolean;
  ingredients: string[];
  items: NutritionItem[];
  totals: NutritionTotals;
  missingItems?: string[];
  error?: string;
  isMock?: boolean;
}

export interface RapidApiCalorieNinjaResponse {
  items: NutritionItem[];
}

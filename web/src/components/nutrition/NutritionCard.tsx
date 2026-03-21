import React from "react";
import { CircularProgress } from "./CircularProgress";

type Props = {
  analysis: any;
};

export const NutritionCard: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="bg-white shadow rounded p-6 mt-4">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Percentage of daily limit (per 100g)
      </h2>
        
      <div className="grid grid-cols-2 gap-6">
        <CircularProgress
          label="Sugar"
          value={analysis.sugars.value}
          percent={analysis.sugars.percent_daily}
          level={analysis.sugars.level}
        />

        <CircularProgress
          label="Fat"
          value={analysis.fat.value}
          percent={analysis.fat.percent_daily}
          level={analysis.fat.level}
        />

        <CircularProgress
          label="Sat Fat"
          value={analysis.saturated_fat.value}
          percent={analysis.saturated_fat.percent_daily}
          level={analysis.saturated_fat.level}
        />

        <CircularProgress
          label="Salt"
          value={analysis.salt.value}
          percent={analysis.salt.percent_daily}
          level={analysis.salt.level}
        />
      </div>
    </div>
  );
};
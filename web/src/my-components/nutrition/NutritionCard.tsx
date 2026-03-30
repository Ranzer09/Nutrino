import React from "react";
import { CircularProgress } from "./CircularProgress";
import { Gauge, Info
  // , Info, Weight
 } from "lucide-react";

type Props = {
  analysis: any;
  energy: { per_100g: number | null; per_serving: number | null };
};

export const NutritionCard: React.FC<Props> = ({ analysis, energy }) => {
  const hasServing = !!(analysis?.serving_quantity && analysis.serving_quantity > 0);
  const servingData = analysis?.per_serving || {};
  const nutrients = ["sugars", "fat", "saturated_fat", "salt", "protein", "fiber"];

  const labelMap: Record<string, string> = {
    sugars: "Sugar",
    fat: "Total Fat",
    saturated_fat: "Saturated Fat",
    salt: "Salt",
    protein: "Protein",
    fiber: "Fiber",
  };

  const renderNutrientGrid = (data: any, title: string, isServing: boolean, subtitle?: string) => (
    <div className="mb-10 last:mb-0">
      <div className="flex justify-between items-end mb-4 border-b pb-2">
        <h3 className="text-lg font-bold text-gray-800">
          {title}
          {isServing && analysis?.serving_quantity && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({analysis.serving_quantity}g)
            </span>
          )}
        </h3>
        {subtitle && <p className="text-xs text-gray-500 italic">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {nutrients.map((key) => {
          const nutrient = data?.[key];
          if (!nutrient) return null;

          return (
            <CircularProgress
                label={labelMap[key] || key}
                value={nutrient?.value != null ? parseFloat(Number(nutrient.value).toFixed(2)) : null}
                percent={nutrient?.percent_daily}
                limit={nutrient?.limit}
                level={nutrient?.level}                    
                isServing={hasServing}                    
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-xl rounded-3xl p-6 md:p-8 mt-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <Gauge className="text-indigo-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-900">Nutrition Breakdown</h2>
      </div>

      {/* ENERGY SECTION - Very Prominent */}
      <div className="mb-10 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-7 text-white">
        <p className="uppercase text-xs tracking-[2px] text-indigo-300 font-medium mb-2">ENERGY</p>
        
        <div className="flex flex-col sm:flex-row gap-8 sm:items-end">
          <div>
            <div className="text-6xl font-black tracking-tighter">
              {energy?.per_serving != null ? parseFloat(Number(energy.per_serving).toFixed(2)) : '—'}
            </div>
            <p className="text-indigo-400 text-sm font-medium">kcal per serving</p>
          </div>

          <div className="text-4xl text-slate-700 hidden sm:block">/</div>

          <div className="opacity-75">
            <div className="text-4xl font-semibold">
              {energy?.per_100g != null ? parseFloat(Number(energy.per_100g).toFixed(2)) : '—'}
            </div>
            <p className="text-xs text-slate-400">kcal per 100g</p>
          </div>
        </div>
      </div>

      {/* MAIN NUTRIENT GRID - Unified Design */}
      
      <div>
        {/* PER SERVING SECTION */}
      {hasServing ? (
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Specific to Serving
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-md font-black uppercase tracking-widest">
                {analysis.serving_quantity}g
              </span>
            </h3>
            {analysis.serving_size && (
                <span className="text-xs font-medium text-gray-400 italic">
                    Estimating based on "{analysis.serving_size}"
                </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nutrients.map((key) => {
              const nutrient = servingData[key];
              if (!nutrient || nutrient.value === null) return null;

              return (
                <div
                  key={`serving-${key}`}
                  className={`group p-5 rounded-2xl border transition-all hover:scale-[1.02] `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 block">
                        {labelMap[key]}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black tracking-tight">{nutrient.value}</span>
                        <span className="text-sm font-bold opacity-70">g</span>
                      </div>
                    </div>
                    {nutrient.percent_daily && (
                      <div className="text-right">
                        <span className="block text-[10px] font-black uppercase tracking-tighter opacity-50">Daily %</span>
                        <span className="text-xl font-black tracking-tighter">{nutrient.percent_daily}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="mb-12 p-6 bg-amber-50/50 border border-dashed border-amber-200 rounded-3xl flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full text-amber-600">
            <Info size={20} />
          </div>
          <p className="text-amber-800 text-sm font-semibold leading-snug">
            Standardized serving data is unavailable for this product. 
            <span className="block text-amber-700/60 font-medium text-xs">Refer to the 100g breakdown below for accuracy.</span>
          </p>
        </div>
      )}
        {renderNutrientGrid(
          analysis.per_100g, 
          "Per 100g", 
          false
        )}
      </div>

    </div>
  );
};
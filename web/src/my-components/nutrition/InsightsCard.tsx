import React from "react";
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";

type Props = {
  insights: {
    summary: string;
    warnings: string[];
    positives: string[];
  };
  ingredient_analysis: {
    warnings: Array<{ message: string; severity?: "high" | "medium" | "low" }>;
    positives: Array<{ message: string }>;
    severity_counts: { high: number; medium: number; low: number };
    ingredient_summary: string;
  };
};

export const InsightsCard: React.FC<Props> = ({ insights, ingredient_analysis }) => {
  const { warnings, positives, ingredient_summary } = ingredient_analysis;

  const totalWarnings = insights.warnings.length + warnings.length;
  const totalPositives = insights.positives.length + positives.length;

  if (totalWarnings === 0 && totalPositives === 0) {
    return (
      <div className="bg-white shadow-sm rounded-2xl p-8 md:p-12 text-center border border-gray-100 mx-4">
        <Info className="mx-auto text-gray-300 mb-3" size={32} />
        <p className="text-gray-500 font-medium">No specific insights available for this product.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-100">
        
        {/* Header Section: Responsive Flex */}
        <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Product Insights</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Nutritional & Ingredient Analysis</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {totalWarnings > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-red-200">
                {totalWarnings} Points of Caution
              </div>
            )}
            {totalPositives > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-green-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-green-200">
              {totalPositives} Benefits
              </div>
            )}
            </div>
        </div>

        <div className="p-5 md:p-8">
          <div className="mb-8 p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 relative shadow-sm">
            <h4 className="text-blue-900 text-xs font-bold uppercase tracking-widest mb-2 opacity-70">The Verdict</h4>
            <p className="text-md md:text-lg font-semibold text-blue-900 leading-snug">
              {insights.summary}
            </p>
            {ingredient_summary && (
              <p className="mt-3 text-sm text-blue-700/80 font-semibold border-t border-blue-200/60 pt-3">
                {ingredient_summary}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* CONS SECTION */}
            <section className="order-1">
              <div className="flex items-center gap-2 mb-5 border-b border-red-50 pb-2">
                <AlertTriangle className="text-red-500" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Points of Caution</h3>
                <span className="ml-auto text-xs font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-md leading-none">
                  {totalWarnings}
                </span>
              </div>
              
              {totalWarnings > 0 && (
                <div className="space-y-3">
                {insights.warnings.map((msg, i) => (
                  <WarningItem key={`nut-warn-${i}`} message={msg} type="Nutrition" severity="high" />
                ))}
                {warnings.map((item, i) => (
                  <WarningItem key={`ing-warn-${i}`} message={item.message} type="Ingredient" severity={item.severity || "medium"} />
                ))}
              </div>
              )}
            </section>

            {/* PROS SECTION */}
           {totalPositives > 0 && (
             <section className="order-2 lg:order-2">
              <div className="flex items-center gap-2 mb-5 border-b border-emerald-50 pb-2">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Health Benefits</h3>
                <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-50 px-2 py-0.5 rounded-md leading-none">
                  {totalPositives}
                </span>
              </div>
              
              <div className="space-y-3">
                {insights.positives.map((msg, i) => (
                  <PositiveItem key={`nut-pos-${i}`} message={msg} type="Nutrition" />
                ))}
                {positives.map((item, i) => (
                  <PositiveItem key={`ing-pos-${i}`} message={item.message} type="Ingredient" />
                ))}
              </div>
             </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WarningItem = ({ message, severity, type }: { message: string, severity: string, type: string }) => {
  const styles = {
    high: "bg-red-50 border-red-100 text-red-900 shadow-red-100/20",
    medium: "bg-amber-50 border-amber-100 text-amber-900 shadow-amber-100/20",
    low: "bg-gray-50 border-gray-100 text-gray-800"
  }[severity] || "bg-gray-50";

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border transition-all hover:translate-x-1 ${styles}`}>
      <AlertCircle className="shrink-0 mt-1 opacity-60" size={18} />
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40 mb-1">
            {type} 
        </span>
        <p className="text-[14px] md:text-[15px] leading-snug font-medium tracking-tight">
          {message}
        </p>
      </div>
    </div>
  );
}

const PositiveItem = ({ message, type  }: { message: string, type: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-900 transition-all hover:translate-x-1 shadow-sm shadow-emerald-100/20">
    <CheckCircle2 className="shrink-0 mt-1 text-emerald-500" size={18} />    
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40 mb-1">
            {type} 
      </span>
      <p className="text-[14px] md:text-[15px] leading-snug font-medium tracking-tight">
        {message}
      </p>
    </div>
  </div>
);

  // const nutrientWarnings = insights.warnings.length ;
  // const nutrientPositives = insights.positives.length ;

  // const ingredientWarnings = warnings.length;
  // const ingredientPositives = positives.length;

  // return (
  //   <div className="bg-white shadow-lg rounded-2xl p-6 mt-6 border border-gray-100">
  //     <div className="flex items-center justify-between mb-6">
  //       <h2 className="text-2xl font-semibold text-gray-800">Insights</h2>
        
  //       {/* Severity Summary */}
  //       {severity_counts.high + severity_counts.medium > 0 && (
  //         <div className="flex gap-2 text-sm">
  //           {severity_counts.high > 0 && (
  //             <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1">
  //                {severity_counts.high} High
  //             </span>
  //           )}
  //           {severity_counts.medium > 0 && (
  //             <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1">
  //                {severity_counts.medium} Medium
  //             </span>
  //           )}
  //         </div>
  //       )}
  //     </div>

  //     {/* Main Summary */}
  //     <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-yellow-100">
  //       <p className="text-lg font-medium text-gray-800 leading-relaxed">
  //         {insights.summary}
  //       </p>
  //       {ingredient_summary && (
  //         <p className="mt-3 text-sm text-gray-600 italic">
  //           {ingredient_summary}
  //         </p>
  //       )}
  //     </div>

  //     {/* Warnings Section */}
  //     {nutrientWarnings > 0 && (
  //       <div className="mb-8">
  //         <div className="flex items-center gap-2 mb-4">
  //           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
  //           <h3 className="text-xl font-semibold text-red-700">
  //             Nutrition Warnings ({nutrientWarnings})
  //           </h3>
  //         </div>

  //         <div className="space-y-3">
  //           {/* Nutrition Warnings */}
  //           {insights.warnings.map((warning, i) => (
  //             <div 
  //               key={`nutri-${i}`}
  //               className="flex gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800"
  //             >
  //               <p className="text-[15px] leading-relaxed">{warning}</p>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}

  //     {ingredientWarnings > 0 && (
  //       <div className="mb-8">
  //         <div className="flex items-center gap-2 mb-4">
  //           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
  //           <h3 className="text-xl font-semibold text-red-700">
  //             Ingredient Warnings ({ingredientWarnings})
  //           </h3>
  //         </div>

  //         <div className="space-y-3">
  //           {/* Ingredient Warnings */}
  //           {warnings.map((item, i) => (
  //             <div 
  //               key={`ing-${i}`}
  //               className={`flex gap-3 p-4 border rounded-xl text-sm ${getSeverityBadge(item.severity)}`}
  //             >
  //               <p className="leading-relaxed">{item.message}</p>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}

      
  //     {/* Positives Section */}
  //     {nutrientPositives > 0 && (
  //       <div>
  //         <div className="flex items-center gap-2 mb-4">
  //           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
  //           <h3 className="text-xl font-semibold text-green-700">
  //             Nutrition Positives ({nutrientPositives})
  //           </h3>
  //         </div>

  //         <div className="space-y-3">
  //           {insights.positives.map((positive, i) => (
  //             <div 
  //               key={`pos-${i}`}
  //               className="flex gap-3 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800"
  //             >
  //               <p className="text-[15px] leading-relaxed">{positive}</p>
  //             </div>
  //           ))}

  //         </div>
  //       </div>
  //     )}
  //     {ingredientPositives > 0 && (
  //       <div>
  //         <div className="flex items-center gap-2 mb-4">
  //           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
  //           <h3 className="text-xl font-semibold text-green-700">
  //             Ingredient Positives ({ingredientPositives})
  //           </h3>
  //         </div>

  //         <div className="space-y-3">
  //           {positives.map((item, i) => (
  //             <div 
  //               key={`pos-ing-${i}`}
  //               className="flex gap-3 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800"
  //             >
  //               <p className="leading-relaxed">{item.message}</p>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}

  //     {(ingredientWarnings && nutrientWarnings) === 0 && (ingredientPositives && nutrientWarnings) === 0 && (
  //       <div className="text-center py-12 text-gray-500">
  //         No insights available for this product yet.
  //       </div>
  //     )}
  //   </div>
  // );



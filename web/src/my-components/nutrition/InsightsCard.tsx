import React from "react";

type Props = {
  insights: {
    summary: string;
    warnings: string[];
    positives: string[];
  };
};

export const InsightsCard: React.FC<Props> = ({ insights }) => {
  return (
    <div className="bg-white shadow rounded p-4 mt-4">
      {/* Summary */}
      <h2 className="text-lg font-semibold mb-2">
        Summary
      </h2>

     <p className="mb-3 p-3 rounded bg-yellow-100 text-yellow-800 font-medium">
        {insights.summary}
      </p>

      {/* Warnings */}
      {insights.warnings.length > 0 && (
        <div className="mb-3">
          <h3 className="text-red-600 font-medium">
            Warnings
          </h3>
          <ul className="list-disc ml-5 text-red-500">
            {insights.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Positives */}
      {insights.positives.length > 0 && (
        <div>
          <h3 className="text-green-600 font-medium">
            Positives
          </h3>
          <ul className="list-disc ml-5 text-green-500">
            {insights.positives.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
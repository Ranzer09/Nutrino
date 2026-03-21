import React from "react";

type Props = {
  label: string;
  value: number | null;
  percent: number | null;
  level: "green" | "amber" | "red" | "unknown";
};

const getColor = (level: string) => {
  switch (level) {
    case "green":
      return "#22c55e"; // green
    case "amber":
      return "#facc15"; // yellow
    case "red":
      return "#ef4444"; // red
    default:
      return "#9ca3af"; // gray
  }
};

export const CircularProgress: React.FC<Props> = ({
  label,
  value,
  percent,
  level,
}) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = percent ?? 0;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress circle */}
        <circle
          stroke={getColor(level)}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />

        {/* Text in center */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-lg font-semibold"
        >
          {progress}%
        </text>
      </svg>

      {/* Label */}
      <p className="text-lg mt-2 text-center">
        {label}
      </p>

      {/* Value */}
      <p className="text-xs text-gray-500">
        {value ?? "N/A"}g
      </p>
    </div>
  );
};
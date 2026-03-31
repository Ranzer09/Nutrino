import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

type Props = {
  label: string;
  value: number | null;
  percent: number | null;
  limit: number | null;
  level: "red" | "green" | "amber";
  isServing?: boolean;
};

const getNutrientStatus = (status: "green" | "amber" | "red", type: string) => {
  const normalizedType = type.toLowerCase();
  const isPositive = ["protein", "fiber"].includes(normalizedType);

  const config = {
    green: {
      color: "#22c55e",
      labelText: isPositive ? "Excellent" : "Low",
    },
    amber: {
      color: "#f59e0b",
      labelText: "Moderate",
    },
    red: {
      color: "#ef4444",
      labelText: isPositive ? "Low" : "High",
    },
  };

  return config[status] ?? { color: "#9ca3af", labelText: "Unknown" };
};

export const CircularProgress: React.FC<Props> = ({
  label,
  value,
  percent,
  limit,
  level,
  isServing = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const radius = 48;
  const stroke = 9;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = percent ?? 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const {color, labelText} = getNutrientStatus(level, label);

  return (
    <>
      <div className="flex flex-col items-center group">
        <svg
          onClick={() => setOpen(true)}
          className="cursor-pointer transition-transform group-hover:scale-105"
          height={radius * 2}
          width={radius * 2}
        >
          {/* Background */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress Circle */}
          <circle
            stroke={color}
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

          {/* Center Text - Make percentage prominent */}
          <text
            x="50%"
            y="46%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-lg font-bold fill-current"
          >
            {progress > 0 ? `${Math.round(progress)}%` : "—"}
          </text>
          <text
            x="50%"
            y="62%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-[10px] fill-gray-500"
          >
            of daily
          </text>
        </svg>

        <div className="text-center mt-3">
          <p className="font-semibold text-sm">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {value !== null ? `${value}g` : "—"}
          </p>
        </div>
      </div>

      {/* Enhanced Dialog - Much clearer daily impact */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {label} • {isServing ? "Per Serving" : "Per 100g"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Daily Contribution - Most Important */}
            <div className="bg-gray-50 p-5 rounded-2xl border">
              <p className="text-sm text-gray-600 mb-1">Contribution to Daily Limit</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold" style={{ color }}>
                  {progress > 0 ? Math.round(progress) : "—"}
                </span>
                <span className="text-3xl text-gray-400">%</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                of recommended daily {label.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-semibold">{value !== null ? `${value}g` : "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Daily Limit</p>
                <p className="font-semibold">{limit ? `${limit}g` : "—"}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Assessment</p>
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: color + "20", 
                  color: color 
                }}
              >
                {labelText}
              </span>
            </div>

            <div className="text-xs text-gray-500 pt-4 border-t">
              Based on WHO dietary guidelines • {isServing ? "Per serving" : "Per 100g"} values
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
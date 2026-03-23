import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"

type Props = {
  label: string;
  value: number | null;
  percent: number | null;
  level: "green" | "amber" | "red" | "unknown";
};

const getLimit = (nutrient: string) => {
  switch (nutrient) {
    case "Fat":
      return "70g";
    case "Sat Fat":
      return "20g";
    case "Sugar":
      return "50g";
    case "Salt":
      return "5g";
    default:
      return "Unknown";
  }
};

const getColor = (level: string) => {
  switch (level) {
    case "green":
      return "#22c55e";
    case "amber":
      return "#facc15";
    case "red":
      return "#ef4444";
    default:
      return "#9ca3af";
  }
};

export const CircularProgress: React.FC<Props> = ({
  label,
  value,
  percent,
  level,
}) => {
  const [open, setOpen] = React.useState(false);

  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = percent ?? 0;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <>
      {/* CLICKABLE CIRCLE */}
      <div
        
        className="flex flex-col items-center"
      >
        <svg onClick={() => setOpen(true)} className="cursor-pointer" height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

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

          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-sm font-semibold"
          >
            {progress}%
          </text>
        </svg>

        <p className="text-sm mt-2">{label}</p>
        <p className="text-xs text-gray-500">
          {value ?? "N/A"}g
        </p>
      </div>

      {/* POPUP DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label} Details (per 100g)</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p>
              Value: <strong>{value ?? "N/A"}g</strong>
            </p>

            <p>
              Contribution to Daily Limit: <strong>{percent ?? 0}%</strong>
            </p>
            
            <p>
             Daily Limit: <strong>{getLimit(label)}</strong>
            </p>

            <p>
              Level: <strong>{level}</strong>
            </p>

            <p className="text-gray-500 text-xs">
              Based on WHO recommended daily limits (per 100g).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
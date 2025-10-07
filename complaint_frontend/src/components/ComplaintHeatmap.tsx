// src/components/ComplaintHeatmap.tsx
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import API from "../api/axios";


interface HeatmapItem {
  area: string;
  _count: { _all: number };
}

interface ComplaintHeatmapProps {
  role?: "admin" | "chief_admin";
}

const ComplaintHeatmap: React.FC<ComplaintHeatmapProps> = React.memo(({ role = "admin" }) => {
  const [data, setData] = useState<{ name: string; size: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint ="/reports/heatmap" // heatmap endpoint
        

        const res = await API.get(endpoint);
        const formatted = res.data.map((d: HeatmapItem) => ({
          name: d.area || "Unknown",
          size: d._count._all,
        }));

        setData(formatted);
      } catch (err: any) {
        console.error("Error fetching heatmap data", err);
        setError(err.response?.data?.error || "Failed to load heatmap data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-4">Loading heatmap...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        {role === "chief_admin"
          ? "Overall Complaint Heatmap"
          : "Hostel Complaint Heatmap"}
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <Treemap
            data={data}
            dataKey="size"
            stroke="#fff"
            fill="#6366f1"
            content={<CustomizedContent />}
          >
            <Tooltip
              formatter={(value: number, name: string, props) => [
                `${value} complaints`,
                props.payload.name,
              ]}
            />
          </Treemap>
        </ResponsiveContainer>
      )}
    </div>
  );
}
)

const CustomizedContent = (props: any) => {
  const { depth, x, y, width, height, name, size } = props;
  const color = depth === 1 ? "#4f46e5" : "#a5b4fc";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
        rx={6}
        ry={6}
      />
      {width > 80 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize="0.8rem"
        >
          {name} ({size})
        </text>
      )}
    </g>
  );
};

export default ComplaintHeatmap;


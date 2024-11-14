import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import useSWR from "swr";
import axios from "axios";

// Data types
type Device = {
  name: string;
  power: number;
  dailyUsageHours?: number;
  dailyCost?: number;
  weeklyCost?: number;
  monthlyCost?: number;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const DeviceTable = () => {
  // Fetching devices data
  const { data: devices, mutate } = useSWR<Device[]>("/api/devices", fetcher, {
    refreshInterval: 1000,
  });
  console.log(devices);
  const [usageHours, setUsageHours] = useState<{ [key: string]: number }>({});

  const columns = useMemo<ColumnDef<Device>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Device Name",
      },
      {
        accessorKey: "power",
        header: "Power (in Watts)",
      },
      {
        accessorKey: "dailyUsageHours",
        header: "Daily Usage Hours",
        cell: ({ row }) => (
          <input
            type="number"
            value={usageHours[row.id] || 0}
            onChange={(e) =>
              setUsageHours((prev) => ({
                ...prev,
                [row.id]: Number(e.target.value),
              }))
            }
          />
        ),
      },
      {
        accessorKey: "dailyCost",
        header: "Daily Cost (₪)",
        cell: ({ row }) => {
          const hours = usageHours[row.id] || 0;
          return (row.original.power * hours * 0.0005).toFixed(2);
        },
      },
      {
        accessorKey: "weeklyCost",
        header: "Weekly Cost (₪)",
        cell: ({ row }) => {
          const hours = usageHours[row.id] || 0;
          return ((row.original.power * hours * 0.0005) * 7).toFixed(2);
        },
      },
      {
        accessorKey: "monthlyCost",
        header: "Monthly Cost (₪)",
        cell: ({ row }) => {
          const hours = usageHours[row.id] || 0;
          return ((row.original.power * hours * 0.0005) * 30).toFixed(2);
        },
      },
    ],
    [usageHours]
  );

  // Table initialization
  const table = useReactTable({
    data: devices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <table className="border-separate min-w-full border ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-4 py-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default DeviceTable;

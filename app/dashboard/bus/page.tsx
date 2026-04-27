"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { BusFormDialog } from "@/components/dashboardComponents/BusFormDialog";
import DataTable, {
  createSortableHeader,
  type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteBus, useFetchBuses } from "@/hooks/useBus";

interface IBusStopSummary {
  _id: string;
  stopName: string;
}

interface IBus {
  _id: string;
  busName: string;
  stops: IBusStopSummary[];
  createdAt?: string;
  updatedAt?: string;
}

export default function BusesPage() {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const { data, isLoading } = useFetchBuses(params);
  const { mutate: deleteBus } = useDeleteBus();

  const handlePaginationChange = useCallback((p: PaginationParams) => {
    setParams((prev) => ({
      ...prev,
      page: p.page,
      pageSize: p.pageSize,
      search: p.search ?? "",
    }));
  }, []);

  const columns = useMemo<ColumnDef<IBus>[]>(
    () => [
      {
        accessorKey: "busName",
        header: createSortableHeader("Bus Name"),
      },
      {
        id: "stops",
        header: "Stops",
        cell: ({ row }) => {
          const stops = row.original.stops ?? [];
          return (
            <div className="text-sm">
              <span className="font-medium">{stops.length}</span>
              <span className="text-slate-500 ml-1">
                {stops.length === 1 ? "stop" : "stops"}
              </span>
            </div>
          );
        },
      },
      {
        id: "stopList",
        header: "Route Preview",
        cell: ({ row }) => {
          const stops = row.original.stops ?? [];
          if (stops.length === 0) {
            return <span className="text-xs text-slate-500">No stops</span>;
          }
          return (
            <div className="text-xs text-slate-600 max-w-xs truncate">
              {stops
                .slice(0, 3)
                .map((s) => s.stopName)
                .join(" → ")}
              {stops.length > 3 && ` +${stops.length - 3} more`}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to delete this bus?")) {
                    deleteBus(row.original._id);
                  }
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [deleteBus],
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buses</h1>
          <p className="text-muted-foreground text-sm">
            Manage bus routes and their stops.
          </p>
        </div>
        <BusFormDialog />
      </div>

      <DataTable<IBus, unknown>
        columns={columns}
        data={(data?.items as IBus[]) ?? []}
        totalCount={data?.totalCount ?? 0}
        currentPage={data?.currentPage ?? 1}
        pageSize={params.pageSize}
        loading={isLoading}
        onPaginationChange={handlePaginationChange}
        searchPlaceholder="Search by bus name..."
      />
    </div>
  );
}

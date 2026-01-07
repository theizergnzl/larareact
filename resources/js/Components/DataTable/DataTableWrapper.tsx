import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Sheet, SheetTrigger } from "@/Components/ui/sheet";
import { Plus, Trash2 } from "lucide-react";
import Paginations from "@/Components/Pagination";
import { router } from "@inertiajs/react";
import { useDebouncedCallback } from "use-debounce";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table";

interface DataTableProps<T> {
  data: {
    data: T[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
      path: string;
      links: { url: string | null; label: string; active: boolean }[];
    };
  };
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  routePrefix: string;
  filters?: Record<string, any>;
  createButton?: {
    label: string;
    sheet: React.ReactNode;
  };
}

export function DataTableWrapper<T extends { id: number; [key: string]: any }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  routePrefix,
  filters,
  createButton,
}: DataTableProps<T>) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    router.get(
      route(`${routePrefix}.index`),
      { search: term },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  }, 300);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-between">
        <div className="flex gap-4 items-center">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full md:w-[300px]"
            defaultValue={filters?.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {createButton && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger>
              <Button
                variant="outline"
                className=""
                onClick={() => setIsSheetOpen(true)}
              >
                <Plus className="mr-2 size-4" />
                {createButton.label}
              </Button>
            </SheetTrigger>
            {createButton.sheet}
          </Sheet>
        )}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {data.meta.last_page > 1 && <Paginations pagination={data.meta} />}
    </div>
  );
}

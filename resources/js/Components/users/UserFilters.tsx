import { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDebouncedCallback } from "use-debounce";

interface FiltersProps {
  filters: {
    search: string;
    status: string;
    per_page: number;
  };
}

export function UserFilters({ filters }: FiltersProps) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");
  const [perPage, setPerPage] = useState(filters.per_page || 10);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    applyFilters({ search: value });
  }, 300);

  const applyFilters = (newFilters: Partial<typeof filters>) => {
    router.get(
      route("users.index"),
      { ...filters, ...newFilters },
      { preserveState: true, preserveScroll: true }
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setPerPage(10);
    router.get(route("users.index"), {}, { preserveState: false });
  };

  const hasActiveFilters = search || status !== "all" || perPage !== 10;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={status} onValueChange={(value) => {
            setStatus(value);
            applyFilters({ status: value === "all" ? "" : value });
          }}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={perPage.toString()} onValueChange={(value) => {
            setPerPage(parseInt(value));
            applyFilters({ per_page: parseInt(value) });
          }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="icon" onClick={resetFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Search: {search}
              <button
                onClick={() => {
                  setSearch("");
                  applyFilters({ search: "" });
                }}
                className="ml-1 text-primary hover:text-primary/70"
              >
                ×
              </button>
            </span>
          )}
          {status !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Status: {status}
              <button
                onClick={() => {
                  setStatus("all");
                  applyFilters({ status: "" });
                }}
                className="ml-1 text-primary hover:text-primary/70"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

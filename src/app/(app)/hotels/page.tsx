"use client";

import { useCallback, useState } from "react";
import { Loader2, LayoutGrid, Map as MapIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { HotelCard } from "@/components/hotels/HotelCard";
import { SearchFilters } from "@/components/hotels/SearchFilters";
import { MapView } from "@/components/hotels/MapView";
import { Button } from "@/components/ui/button";
import { useHotelSearchStore } from "@/lib/store";
import { hotelsApi } from "@/lib/api";

export default function HotelsPage() {
  const {
    results,
    totalResults,
    isSearching,
    searchParams,
    setResults,
    setSearching,
  } = useHotelSearchStore();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const handleSearch = useCallback(async () => {
    if (!searchParams.city) return;
    setSearching(true);
    try {
      const data = await hotelsApi.search(searchParams);
      setResults(data.items, data.total);
    } catch {
      // handle error
    } finally {
      setSearching(false);
    }
  }, [searchParams, setResults, setSearching]);

  return (
    <div className="flex h-full flex-col">
      <Header title="Hotels" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-6">
            {/* Sidebar filters */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <SearchFilters onSearch={handleSearch} />
            </aside>

            {/* Main content */}
            <div className="flex-1 space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {totalResults > 0
                    ? `${totalResults} hotel${totalResults !== 1 ? "s" : ""} found`
                    : "Search for hotels to get started"}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("map")}
                  >
                    <MapIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Loading */}
              {isSearching && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Results */}
              {!isSearching && viewMode === "grid" && (
                <>
                  {results.length === 0 && totalResults === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <MapIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
                      <h2 className="text-lg font-semibold mb-1">
                        Find Your Perfect Hotel
                      </h2>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Use the filters to search by city, dates, budget, and
                        more. Or try asking in the chat!
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {results.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                </>
              )}

              {!isSearching && viewMode === "map" && (
                <div className="h-[calc(100vh-12rem)]">
                  <MapView hotels={results} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

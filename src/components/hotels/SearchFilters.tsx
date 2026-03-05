"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useHotelSearchStore } from "@/lib/store";
import { useState } from "react";

interface SearchFiltersProps {
  onSearch: () => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const { searchParams, setSearchParams } = useHotelSearchStore();
  const [priceRange, setPriceRange] = useState([0, 500]);

  const handleSearch = () => {
    setSearchParams({
      budget_min: priceRange[0] || undefined,
      budget_max: priceRange[1] || undefined,
    });
    onSearch();
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* City */}
      <div className="space-y-1.5">
        <Label htmlFor="city">City</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="city"
            placeholder="Where are you going?"
            value={searchParams.city}
            onChange={(e) => setSearchParams({ city: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="check_in">Check-in</Label>
          <Input
            id="check_in"
            type="date"
            value={searchParams.check_in || ""}
            onChange={(e) => setSearchParams({ check_in: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="check_out">Check-out</Label>
          <Input
            id="check_out"
            type="date"
            value={searchParams.check_out || ""}
            onChange={(e) => setSearchParams({ check_out: e.target.value })}
          />
        </div>
      </div>

      {/* Guests */}
      <div className="space-y-1.5">
        <Label htmlFor="guests">Guests</Label>
        <Input
          id="guests"
          type="number"
          min={1}
          max={20}
          placeholder="Number of guests"
          value={searchParams.guests || ""}
          onChange={(e) =>
            setSearchParams({ guests: parseInt(e.target.value) || undefined })
          }
        />
      </div>

      {/* Star rating */}
      <div className="space-y-1.5">
        <Label>Star Rating</Label>
        <Select
          value={searchParams.star_rating?.toString() || "any"}
          onValueChange={(val) =>
            setSearchParams({
              star_rating: val === "any" ? undefined : parseInt(val),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Price per night</Label>
          <span className="text-sm text-muted-foreground">
            &euro;{priceRange[0]} &mdash; &euro;{priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
        />
      </div>

      {/* Sort by */}
      <div className="space-y-1.5">
        <Label>Sort by</Label>
        <Select
          value={searchParams.sort_by || "price_asc"}
          onValueChange={(val) =>
            setSearchParams({
              sort_by: val as "price_asc" | "price_desc" | "rating" | "relevance",
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="relevance">Relevance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search button */}
      <Button onClick={handleSearch} className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Search Hotels
      </Button>
    </div>
  );
}

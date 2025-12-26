"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface searchBarProps {
  handleSearch: (event: any) => void;
}

const SearchBar = ({ handleSearch }: searchBarProps) => {
  const [placeHolder, setPlaceHolder] = useState("");
  const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const searchQueries = [
      "III Year II Semester",
      "I Year I Semester",
      "IV year II Semester",
      "II Year I Semester",
    ];
    const typeWriter = async () => {
      await sleep(200);
      while (true) {
        for (let ind = 0; ind < searchQueries.length; ind++) {
          for (let i = 0; i < searchQueries[ind].length; i++) {
            setPlaceHolder(searchQueries[ind].substring(0, i + 1));
            await sleep(100);
          }
          await sleep(600);
          for (let i = 0; i < searchQueries[ind].length; i++) {
            setPlaceHolder(
              searchQueries[ind].substring(
                0,
                searchQueries[ind].length - i - 1,
              ),
            );
            await sleep(100);
          }
        }
      }
    };

    typeWriter();
  }, []);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        id="searchKey"
        className="w-full h-12 pl-10 pr-24 text-base"
        placeholder={placeHolder || "Search notifications..."}
        onChange={handleSearch}
        type="text"
      />
    </div>
  );
};

export default SearchBar;

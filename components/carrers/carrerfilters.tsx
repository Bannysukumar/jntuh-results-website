"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { ArrowRightIcon, ListFilter, SearchIcon, XIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "../ui/input";

interface Option {
  label: string;
  key: string;
}

interface Form {
  [key: string]: string;
}

interface Filter {
  name: string;
  options: Option[];
}

interface Filters {
  [key: string]: Filter;
}

interface CareerFilterProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  availableCompanies: string[];
}

const CareerFilters: React.FC<CareerFilterProps> = ({ form, setForm, availableCompanies }) => {
  const [isActive, setIsActive] = useState<string>("type");
  const [options, setOptions] = useState<Option[]>([]);

  const [searchInput, setSearchInput] = useState("");

  const companyOptions = availableCompanies.map(c => ({ key: c, label: c }));

  const filters: Filters = {
    type: {
      name: "Location Type",
      options: [
        { key: "worldwide", label: "Worldwide Remote" },
        { key: "restricted", label: "Restricted Region" },
      ],
    },
    experience: {
      name: "Experience",
      options: [
        { key: "junior", label: "Junior" },
        { key: "mid", label: "Mid-level" },
        { key: "senior", label: "Senior" },
        { key: "lead", label: "Lead" },
        { key: "manager", label: "Manager" },
      ],
    },
    company: {
      name: "Company",
      options: companyOptions,
    },
    dateposted: {
      name: "Date Posted",
      options: [
        {
          key: "today",
          label: "Today",
        },
        {
          key: "yesterday",
          label: "Yesterday",
        },
        {
          key: "past_7_days",
          label: "Past 7 Days",
        },
        {
          key: "older",
          label: "Older than 7 days",
        },
      ],
    },
  };

  const filterKeys = Object.keys(filters);
  useEffect(() => {
    setOptions(filters[isActive]?.options || []);
  }, [isActive, availableCompanies]);

  const handleSearch = () => {
    setForm((prevForm) => ({
      ...prevForm,
      title: searchInput,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleOptionChange = (optionKey: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [isActive]: optionKey,
    }));
  };

  return (
    <div className="w-full p-2 rounded  bg-gray-50 dark:bg-gray-800">
      <div className="h-14 dark:border-gray-700 bg-white border w-full p-2 rounded-md dark:bg-gray-900 overflow-y-scroll overflow-x-none scroll-smooth no-scrollbar">
        <div className="md:justify-normal justify-around lg:flex items-center grid grid-cols-3 overflow-x-none">
          <div className="flex justify-center md:px-2">
            <Select
              onValueChange={(event) => {
                setForm((prevForm) => ({
                  ...prevForm,
                  job: event,
                }));
              }}
              value={form.job || ""}
            >
              <SelectTrigger className="min-w-[100px] w-fit h-8 bg-blue-500 text-white font-semibold text-xs rounded-full">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full-Time</SelectItem>
                <SelectItem value="intern">Internship</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="parttime">Part-Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center border-x md:px-2 ">
            <Select
              onValueChange={(event) => {
                setForm((prevForm) => ({
                  ...prevForm,
                  sortby: event,
                }));
              }}
              value={form.sortby || "date"}
            >
              <SelectTrigger className="w-fit min-w-[100px] h-8 text-xs rounded-full bg-transparent">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort By</SelectLabel>
                  <SelectItem value="date">Date</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:flex hidden lg:flex-1">
            <div className="flex flex-1">
              {filterKeys.map((key) => (
                <div className="flex justify-center md:px-2 w-full" key={key}>
                  <Select
                    onValueChange={(val) => {
                      if (val === 'clear') {
                        setForm((prevForm) => ({ ...prevForm, [key]: "" }));
                      } else {
                        handleOptionChange(val);
                      }
                    }}
                    value={form[key] || undefined}
                    onOpenChange={() => setIsActive(key)}
                  >
                    <SelectTrigger className={`min-w-[130px] w-fit h-8 focus:outline-offset-0 focus:ring-offset-0 focus:ring-0 font-semibold text-xs rounded-full ${form[key] ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-black dark:text-white'}`}>
                      <SelectValue placeholder={filters[key].name} />
                    </SelectTrigger>
                    <SelectContent className="w-fit max-h-[300px]">
                      <SelectGroup>
                        <SelectItem value="clear" className="text-red-500 font-medium">Clear Filter</SelectItem>
                        {filters[key].options.map((option) => (
                          <SelectItem value={option.key} key={option.key}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className="flex flex-1 border-l gap-1 border-solid px-2 ">
              <Input
                className="md:h-[32px] text-sm"
                placeholder="Search job or company..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div
                className="p-2 flex border min-w-[32px] max-h-[32px] rounded justify-center items-center cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                onClick={handleSearch}
              >
                <SearchIcon size={16} />
              </div>
              {form.title && (
                <div
                  className="p-2 flex border min-w-[32px] max-h-[32px] rounded justify-center items-center cursor-pointer bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
                  onClick={() => {
                    setSearchInput("");
                    setForm(prev => ({ ...prev, title: "" }));
                  }}
                >
                  <XIcon size={16} />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center lg:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full flex gap-1 items-center px-4">
                  Filter
                  <ListFilter size="14" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex justify-between border-b shrink-0">
                  <DrawerTitle className="font-semibold">Filters</DrawerTitle>
                  <DrawerClose>
                    <XIcon className="cursor-pointer" />
                  </DrawerClose>
                </DrawerHeader>

                <div className="flex h-[50vh] min-h-[300px]">
                  <div className="w-[40%] border-r p-2 gap-1 flex flex-col overflow-y-auto">
                    {filterKeys.map((key) => (
                      <button
                        className={`p-3 w-full text-left text-xs gap-2 rounded-lg items-center flex justify-between ${isActive === key
                            ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 font-medium"
                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                          } cursor-pointer transition-colors`}
                        key={key}
                        onClick={() => setIsActive(key)}
                      >
                        <span>{filters[key].name}</span>
                        {form[key] && (
                          <div className="bg-blue-500 rounded-full w-2 h-2 shrink-0"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="w-[60%] flex flex-col">
                    <div className="border-b px-4 py-2 text-sm flex justify-between items-center font-semibold shrink-0">
                      <div>{filters[isActive]?.name}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                        onClick={() =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            [isActive]: "",
                          }))
                        }
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1">
                      <RadioGroup
                        value={form[isActive]}
                        onValueChange={handleOptionChange}
                        className="gap-3"
                      >
                        {options.map((option) => (
                          <div
                            className="flex items-center space-x-3"
                            key={option.key}
                          >
                            <RadioGroupItem
                              value={option.key}
                              id={`mobile-${option.key}`}
                              className="border-gray-300 text-blue-600"
                            />
                            <Label htmlFor={`mobile-${option.key}`} className="text-sm font-normal cursor-pointer leading-tight">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <DrawerFooter className="p-4 flex flex-row justify-end gap-2 border-t shrink-0">
                  <DrawerClose asChild>
                    <Button variant="outline" onClick={() => setForm({ job: "", title: "", type: "", experience: "", company: "", status: "", dateposted: "" })}>
                      Clear All
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button className="gap-2">
                      Apply Filters <ArrowRightIcon size="16" />
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerFilters;

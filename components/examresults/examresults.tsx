"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { rollNumberEndings } from "@/constants/rollNumberendings";
import { User, Users, Search } from "lucide-react";

const ExamResults = ({ title, query }: { title: string; query: string }) => {
  const [singleHtno, setSingleHtno] = useState("");
  const [multiHtno, setMultiHtno] = useState(["", ""]);
  const onSingleResultSubmit = async () => {
    if (singleHtno.length != 10) {
      toast.error("Kindly check the Hall ticket Number");
      return;
    }
    try {
      const redirectUrl =
        "http://results.jntuh.ac.in/results/resultAction?" +
        query +
        "&htno=" +
        singleHtno +
        "&result=null&grad=null";

      window.open(redirectUrl, "_blank");
    } catch (e: any) {
      console.log(e);
      toast.error("Internal Server Error!!!");
    }
  };
  const onMultiResultSubmit = () => {
    if (multiHtno[0].length != 10 || multiHtno[1].length != 10) {
      toast.error("Kindly check the Hall ticket Numbers");
      return;
    }
    const firstEnding = multiHtno[0].substring(8);
    const secondEnding = multiHtno[1].substring(8);
    if (
      rollNumberEndings.indexOf(firstEnding) >
      rollNumberEndings.indexOf(secondEnding)
    ) {
      toast.error("The from Htno should not be greater than to Htno ");
      return;
    }
    toast("Not Yet Implemented");
  };
  return (
    <div className="w-full">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger 
            value="single" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <User className="h-4 w-4" />
            Single Result
          </TabsTrigger>
          <TabsTrigger 
            value="multi" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Users className="h-4 w-4" />
            Multi Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="mt-0">
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Single Result
                  </h3>
                </div>
                <div className="w-full max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      className="pl-10 h-12 text-center text-base font-medium border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                      placeholder="Enter your Hall ticket No."
                      type="text"
                      value={singleHtno}
                      onChange={(event) => {
                        setSingleHtno(event.target.value.toUpperCase());
                      }}
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Enter your 10-digit Hall Ticket Number
                  </p>
                </div>
                <Button
                  onClick={onSingleResultSubmit}
                  className="w-full max-w-md h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Search Result
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="multi" className="mt-0">
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Multi Results
                  </h3>
                </div>
                <div className="w-full max-w-md space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      className="pl-10 h-12 text-center text-base font-medium border-2 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                      placeholder="Enter from Hall ticket No."
                      type="text"
                      value={multiHtno[0]}
                      onChange={(event) => {
                        const updatedHtno = [...multiHtno];
                        updatedHtno[0] = event.target.value.toUpperCase();
                        setMultiHtno(updatedHtno);
                      }}
                      maxLength={10}
                    />
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      className="pl-10 h-12 text-center text-base font-medium border-2 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                      placeholder="Enter to Hall ticket No."
                      type="text"
                      value={multiHtno[1]}
                      onChange={(event) => {
                        const updatedHtno = [...multiHtno];
                        updatedHtno[1] = event.target.value.toUpperCase();
                        setMultiHtno(updatedHtno);
                      }}
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the range of Hall Ticket Numbers
                  </p>
                </div>
                <Button
                  type="submit"
                  onClick={onMultiResultSubmit}
                  className="w-full max-w-md h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Search Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamResults;

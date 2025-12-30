"use client";

import { Card } from "@/components/ui/card";
import { NativeButton } from "@/components/native/native-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Loader2 } from "lucide-react";
import { ImpactStyle } from "@capacitor/haptics";

interface FormProps {
  title: string;
  hallticketno: string;
  hallticketno2?: string;
  sethallticketno: (value: string) => void;
  sethallticketno2?: (value: string) => void;
  onSubmit: () => void;
  isDisabled: boolean;
}

const Form = ({
  title,
  hallticketno,
  hallticketno2,
  sethallticketno,
  sethallticketno2,
  onSubmit,
  isDisabled,
}: FormProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-xl border-2">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Ticket className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Enter your hall ticket number to view your results
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="htno1" className="text-base font-semibold flex items-center gap-2">
                <Ticket className="h-4 w-4 text-blue-500" />
                {hallticketno2 !== undefined ? "First Hall Ticket Number" : "Hall Ticket Number"}
              </Label>
              <Input
                id="htno1"
                name="htno1"
                type="text"
                value={hallticketno}
                onChange={(event) => {
                  const value = event.target.value.toUpperCase();
                  sethallticketno(value);
                }}
                maxLength={10}
                placeholder={hallticketno2 !== undefined ? "Enter first hall ticket no" : "Enter your hall ticket no"}
                className="h-12 text-center text-lg font-mono tracking-wider"
                disabled={isDisabled}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {hallticketno.length} / 10 characters
              </p>
            </div>

            {hallticketno2 !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="htno2" className="text-base font-semibold flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-purple-500" />
                  Second Hall Ticket Number
                </Label>
                <Input
                  id="htno2"
                  name="htno2"
                  type="text"
                  value={hallticketno2 ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.toUpperCase();
                    sethallticketno2?.(value);
                  }}
                  maxLength={10}
                  placeholder="Enter second hall ticket no"
                  className="h-12 text-center text-lg font-mono tracking-wider"
                  disabled={isDisabled}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {hallticketno2?.length || 0} / 10 characters
                </p>
              </div>
            )}

            <NativeButton
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={isDisabled || hallticketno.length < 10 || (hallticketno2 !== undefined && (hallticketno2?.length || 0) < 10)}
              onClick={onSubmit}
              hapticStyle={ImpactStyle.Medium}
            >
              {isDisabled ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Results"
              )}
            </NativeButton>

            {isDisabled && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Please wait before submitting again
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Form;

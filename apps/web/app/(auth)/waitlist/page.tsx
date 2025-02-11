"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function WaitlistPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join waitlist");
      }

      toast.success("Successfully joined the waitlist!");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error joining waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4 sm:px-0">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Join our Waitlist</h2>
          <p className="mt-2 text-sm text-gray-600">Be the first to know when we launch</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">
              Email address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Enter your name (optional)"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="reason">Why are you interested?</Label>
            <Textarea
              id="reason"
              {...register("reason")}
              placeholder="Tell us why you're interested (optional)"
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Join Waitlist"}
          </Button>
        </form>
      </div>
    </div>
  );
}

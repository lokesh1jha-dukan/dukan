"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";
import { ResponseObject } from "@/types/client/types";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useRouter } from "next/navigation";

const ADMIN_ROLE = "admin"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});



export function InputOTPForm(props: {
  fieldState: { email: string; firstName?: string; lastName?: string };
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false)
  const {push} = useRouter()
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true)
      const result = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...props.fieldState, otp: data.pin }),
      });
      const resultjson: ResponseObject = await result.json();
      
      if (resultjson.response.statusCode === 200) {
        toast.success("OTP verified successfully")

        //@ts-ignore
        if (resultjson.response.data.role === ADMIN_ROLE) {
          push("/admin")
        } else {
          push("/products")
        }
      } else {
        toast.error(resultjson.response.message || "Invalid OTP");
      }
      setIsLoading(false)
    } catch (err) {
      toast.error("Invalid OTP");
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time OTP sent to your Email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : false}
          Submit</Button>
      </form>
    </Form>
  );
}

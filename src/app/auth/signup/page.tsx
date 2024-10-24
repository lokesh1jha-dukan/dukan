"use client"
type Props = {};

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { directus, withAuthDirectus } from "@/lib/utils";
import { useState } from "react";
import { InputOTPForm } from "@/components/block/InputOtpForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResponseObject } from "@/types/client/types";
import toast from "react-hot-toast";

export default function SignupForm() {
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldState, setFieldState] = useState({
    email: "",
    firstName: "",
    lastName: "",
  })
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    setFieldState({
      email,
      firstName,
      lastName
    })
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, firstName, lastName }),
    });
    setIsLoading(false)
    let data: ResponseObject = await response.json();
    if(data.response.statusCode !== 200) {
      toast.error(data.response.message)
    } else {
      toast.success("OTP sent to your email")
    }
    setShowOtpScreen(true)
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showOtpScreen? <InputOTPForm fieldState={fieldState} /> : <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    name="first-name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    name="last-name"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              {/* <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" />
          </div> */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : false}
                Create an account
              </Button>
              {/* <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button> */}
            </form>}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

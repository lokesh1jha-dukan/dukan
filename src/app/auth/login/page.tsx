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
import { useState } from "react";
import { InputOTPForm } from "@/components/block/InputOtpForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResponseObject } from "@/types/client/types";
import { toast } from "sonner";



export default function LoginForm() {
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")
    setIsLoading(true)
    let response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
    const data: ResponseObject = await response.json()
    setIsLoading(false)
    console.log(data, "response")
    if (data.response.statusCode == 400) {
      toast.error(data.response.message);
      return;
    }

    toast.success("OTP sent to your email")
    console.log(data, "response")
    setShowOtpScreen(true)
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showOtpScreen ? (
              <InputOTPForm fieldState={{ email }} />
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className={"w-full"}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner /> : false}
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}








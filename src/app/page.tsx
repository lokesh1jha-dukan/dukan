
import { Button } from "@/components/ui/button";
import { isAuthenticatedAndUserData } from "@/lib/auth";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";


export default async function Home() {
  const auth = await isAuthenticatedAndUserData()
  if(auth.isAuthenticated) {
    redirect("products")
  }
  return (
    <main className="flex min-h-screen justify-center gap-4 p-24">
      <Link href={"auth/login"}><Button>Login</Button></Link>
      <Link href={"auth/signup"}><Button>Signup</Button></Link>
    </main>
  );
}

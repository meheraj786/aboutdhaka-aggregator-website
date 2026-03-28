"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type LoginInput, loginSchema } from "@/validators/auth";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsPending(true);
    const res = await login(data);
    if (res.success) {
      toast.success("Login successful");
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error("Invalid credentials");
    }
    setIsPending(false);
  };

  // const handleSeed = async () => {
  //   const res = await seedAdmin();
  //   toast.info(res.message);
  // };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Admin Login</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            AboutDhaka Dashboard Access
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="admin@dhaka.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              {...register("password")}
              type="password"
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* <div className="pt-4 border-t text-center">
          <button
            type="button"
            onClick={handleSeed}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Run Seed (Create First Admin)
          </button>
        </div> */}
      </div>
    </div>
  );
}

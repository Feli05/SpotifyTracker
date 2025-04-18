"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { LoginSchema } from "../../../helpers/schemas";
import { LoginFormType } from "../../../helpers/types";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  
  // State for input values
  const [values, setValues] = useState<LoginFormType>({
    email: "",
    password: "",
  });

  // State for form errors
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormType, string>>>({});

  // Function to handle form submission
  const handleLogin = useCallback(async (values: LoginFormType) => {
    try {
      // POST to /api/login route with only required credentials
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      // If server returned an error
      if (!res.ok) return;

      // If success, redirect to /dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  }, [router]);

  // Validate and submit the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validate form values; abortEarly:false to catch all errors.
      await LoginSchema.validate(values, { abortEarly: false });
      setErrors({});
      await handleLogin(values);
    } catch (validationError: any) {
      // Convert validation errors into an object with field names as keys
      if (validationError.inner) {
        const formErrors: Partial<Record<keyof LoginFormType, string>> = {};
        validationError.inner.forEach((error: any) => {
          if (error.path) {
            formErrors[error.path as keyof LoginFormType] = error.message;
          }
        });
        setErrors(formErrors);
      }
    }
  };

  // Update state for input changes
  const handleChange = (field: keyof LoginFormType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [field]: e.target.value });
  };

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Login</div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full items-center" noValidate>
        <div className="flex flex-col w-1/2 gap-4 mb-4">
          <Input
            variant="bordered"
            label="Email"
            name="email"
            type="email"
            value={values.email}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            onChange={handleChange("email")}
            isRequired
            autoComplete="email"
          />
          <Input
            variant="bordered"
            label="Password"
            name="password"
            type="password"
            value={values.password}
            isInvalid={!!errors.password}
            errorMessage={errors.password}
            onChange={handleChange("password")}
            isRequired
            autoComplete="current-password"
          />
        </div>

          <Button type="submit" variant="flat" color="primary">
            Login
          </Button>   
      </form>

      <div className="font-light text-slate-400 mt-4 text-sm">
        Don&apos;t have an account ?{" "}
        <Link href="/register" className="font-bold">
          Register here
        </Link>
      </div>
    </>
  );
}

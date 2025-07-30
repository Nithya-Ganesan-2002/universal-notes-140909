"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuth } = useAuth?.() || { isAuth: false };
  const router = useRouter();
  useEffect(() => {
    router.replace(isAuth ? "/app" : "/auth");
  }, [isAuth, router]);
  return null;
}

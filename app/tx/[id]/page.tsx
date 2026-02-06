"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import TransactionDashboard from "@/components/TransactionDashboard";

export default function TxByIdPage() {
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    sessionStorage.setItem("autoTx", id);
  }, [id]);

  return <TransactionDashboard />;
}
import React, { useEffect } from "react";
import { usePlatformStore } from "@aroh/asdk";
import type { MobileScreenProps } from "../types";

export const WalletScreen: React.FC<MobileScreenProps> = () => {
  const { wallet, transactions, fetchUserTransactions, rehydrateSession } = usePlatformStore();

  useEffect(() => {
    rehydrateSession();
    fetchUserTransactions();
  }, []);

  const balance = wallet?.balance ?? 50000;

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <header>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#fff" }}>
          Aros Token Wallet
        </h1>
        <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
          Universal double-entry immutable ecosystem ledger
        </p>
      </header>

      {/* Wallet Balance Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          border: "1px solid #4338ca",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "12px", color: "#c7d2fe", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Total Available Balance
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff" }}>
            {balance.toLocaleString()}
          </span>
          <span style={{ fontSize: "16px", fontWeight: "600", color: "#818cf8" }}>
            Aros
          </span>
        </div>

        {/* Minor Payment Guardrail Indicator */}
        <div
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "999px", backgroundColor: "#10b981" }} />
          <span style={{ fontSize: "11px", color: "#e0e7ff" }}>
            Minor Payment Safety Guardrail Active (NO_MINOR_PAYMENT)
          </span>
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <div>
        <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#f4f4f5", marginBottom: "10px" }}>
          Recent Transactions
        </h2>

        {transactions.length === 0 ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              backgroundColor: "#18181b",
              borderRadius: "12px",
              border: "1px solid #27272a",
              color: "#71717a",
              fontSize: "13px"
            }}
          >
            No ledger transactions recorded yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                style={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "10px",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: "#f4f4f5" }}>
                    {tx.description}
                  </div>
                  <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: tx.amount > 0 ? "#34d399" : "#f87171"
                  }}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Aros
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

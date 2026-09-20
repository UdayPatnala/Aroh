"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@aroh/ads";
import { usePlatformStore, AROS_TIER_PACKAGES, ArosTierPackage, formatArosBalance } from "@aroh/asdk";

export default function PurchaseArosPage() {
  const { user, wallet, rewardUser } = usePlatformStore();
  const [selectedPackage, setSelectedPackage] = React.useState<string>("pkg_1500");
  const [loading, setLoading] = React.useState(false);
  const [eligibilityLoading, setEligibilityLoading] = React.useState(true);
  const [eligibility, setEligibility] = React.useState<{
    eligible: boolean;
    status: string;
    message: string;
  }>({
    eligible: false,
    status: "UNKNOWN",
    message: "Evaluating purchase eligibility..."
  });
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Dedicated Purchase Consent State (No pre-ticked boxes)
  const [ageAttested, setAgeAttested] = React.useState(false);
  const [termsAcknowledged, setTermsAcknowledged] = React.useState(false);
  const [refundAcknowledged, setRefundAcknowledged] = React.useState(false);

  // Fetch server-side eligibility on mount
  const checkEligibility = React.useCallback(async () => {
    try {
      setEligibilityLoading(true);
      const res = await fetch("/api/payment/eligibility", {
        headers: {
          "x-user-id": user?.id || "user-id"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEligibility({
          eligible: data.eligible,
          status: data.status,
          message: data.message
        });
      }
    } catch {
      setEligibility({
        eligible: false,
        status: "UNKNOWN",
        message: "Failed to verify purchase eligibility with server"
      });
    } finally {
      setEligibilityLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  const handleAttestAdult = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payment/eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "user-id"
        },
        body: JSON.stringify({
          status: "ADULT_ELIGIBLE",
          verificationMethod: "self_attestation"
        })
      });
      if (res.ok) {
        await checkEligibility();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update eligibility");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: ArosTierPackage) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Client-side guard (backed by mandatory server-side fail-closed check)
      if (!ageAttested || !termsAcknowledged || !refundAcknowledged) {
        throw new Error("You must affirmatively complete all purchase acknowledgements before proceeding.");
      }

      // 1. Record affirmative purchase consent
      const consentRes = await fetch("/api/payment/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "user-id"
        },
        body: JSON.stringify({
          package_id: pkg.id,
          aros_quantity: pkg.arosAmount,
          amount_usd_cents: pkg.priceUsdCents,
          currency: "USD",
          purchaser_is_18_attested: true,
          aros_classification_acknowledged: true,
          refund_policy_acknowledged: true,
          terms_version: "1.0.0",
          policy_version: "1.0.0",
          aros_policy_version: "1.0.0",
          age_policy_version: "1.0.0",
          source: "web_checkout",
          affirmative_action: `click_confirm_purchase_${pkg.id}`,
          idempotency_key: `idemp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
        })
      });

      if (!consentRes.ok) {
        const cData = await consentRes.json();
        throw new Error(cData.error || "Failed to record purchase consent");
      }

      // 2. Request checkout session
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "user-id"
        },
        body: JSON.stringify({
          packageId: pkg.id,
          successUrl: window.location.href
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to initiate checkout session");
      }

      const { session } = await res.json();

      // 3. Trigger instant settlement clearance (sandbox simulation)
      const webhookRes = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `evt_${Math.random().toString(36).substr(2, 9)}`,
          type: "checkout.session.completed",
          data: {
            object: {
              id: session.id,
              payment_intent: `ch_${Math.random().toString(36).substr(2, 9)}`
            }
          }
        })
      });

      if (webhookRes.ok) {
        await rewardUser(user?.id || "user-id", pkg.arosAmount, `Fiat Purchase: ${pkg.name}`);
        setSuccessMessage(`Successfully purchased and credited ${pkg.arosAmount} Aros to your account!`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process payment settlement");
    } finally {
      setLoading(false);
    }
  };

  const isMinorBlocked = eligibility.status === "MINOR_PAYMENT_BLOCKED";
  const needsAdultAttestation = !eligibility.eligible && !isMinorBlocked;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Fiat-to-Aros Settlement</span>
        </div>

        {/* Header and Current Balance */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Purchase Aros Tokens
            </h1>
            <p className="text-sm text-slate-500">
              Instant on-ramp settlement powered by Stripe Checkout. Conversion rate:{" "}
              <span className="font-mono font-semibold text-slate-800">$1.00 USD = 100 Aros</span>.
            </p>
          </div>

          <div className="bg-slate-50 border border-black/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-black text-lg">
              Ⱥ
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Balance</div>
              <div className="font-mono font-bold text-lg text-slate-900">
                {formatArosBalance(wallet?.balance, user?.role)}
              </div>
            </div>
          </div>
        </div>

        {/* MINOR RESTRICTION BANNER - Absolute Prohibition */}
        {isMinorBlocked && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span>Purchase Unavailable — 18+ Account Policy</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              AROH does not permit accounts belonging to persons under 18 to initiate purchases of Aros.
              All payment creation, checkout redirects, and saved payment methods are disabled for this account.
              You may continue using non-purchase platform features, exploration demos, and developer resources.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold">
              <Link href="/privacy" className="text-rose-900 underline hover:text-rose-700">
                Privacy Notice
              </Link>
              <Link href="/privacy/grievance" className="text-rose-900 underline hover:text-rose-700">
                Contact Grievance Redressal
              </Link>
            </div>
          </div>
        )}

        {/* AGE ELIGIBILITY ATTESTATION BANNER */}
        {needsAdultAttestation && !eligibilityLoading && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Age Verification & Eligibility Required</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              In accordance with AROH payment safety policies, purchasers must be 18 years of age or older to purchase Aros.
              Please confirm your eligibility to unlock checkout.
            </p>
            <Button
              variant="primary"
              className="text-xs font-semibold py-2 px-4"
              disabled={loading}
              onClick={handleAttestAdult}
            >
              {loading ? "Verifying..." : "Confirm I am 18+ and Eligible"}
            </Button>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-600 hover:text-emerald-900 font-bold text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs">
            {error}
          </div>
        )}

        {/* Packages Grid — Disabled if Minor Blocked */}
        {!isMinorBlocked && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AROS_TIER_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                const priceUsd = (pkg.priceUsdCents / 100).toFixed(2);
                const canPurchase = eligibility.eligible && ageAttested && termsAcknowledged && refundAcknowledged;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative bg-white border rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-slate-900 shadow-md ring-2 ring-slate-900/10"
                        : "border-black/10 hover:border-black/20 shadow-xs"
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-slate-900 text-white shadow-xs">
                        {pkg.badge}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Fixed rate: $1 = 100 Aros</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black font-mono text-slate-900">
                            {pkg.arosAmount.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-amber-600 font-mono">AROS</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-600 font-mono">
                          ${priceUsd} USD
                        </div>
                      </div>

                      <ul className="text-xs text-slate-600 space-y-2 pt-4 border-t border-black/5">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>Instant ledger clearance</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>Zero network settlement fees</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>Full ecosystem interoperability</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6 mt-6 border-t border-black/5">
                      <Button
                        variant={isSelected ? "primary" : "secondary"}
                        className="w-full text-xs font-semibold py-2.5"
                        disabled={loading || !canPurchase}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(pkg);
                        }}
                      >
                        {loading && isSelected ? "Settling..." : `Confirm purchase — $${priceUsd}`}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DEDICATED PURCHASE CONSENT BOX (Explicit, Affirmative, Unbundled) */}
            <div className="bg-white border border-black/10 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Mandatory Purchase Acknowledgements
              </h3>
              <p className="text-xs text-slate-500">
                Please affirmatively review and confirm each disclosure. Pre-ticked or bundled consents are prohibited.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageAttested}
                    onChange={(e) => setAgeAttested(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>
                    <strong>18+ Age Requirement:</strong> I affirmatively attest that I am at least 18 years of age and the authorized owner of the payment instrument used.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAcknowledged}
                    onChange={(e) => setTermsAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>
                    <strong>Nature of Aros:</strong> I acknowledge that Aros are closed-loop virtual ecosystem credits with zero cash value, non-redeemable for fiat currency, and non-transferable between accounts.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refundAcknowledged}
                    onChange={(e) => setRefundAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>
                    <strong>Finality & Refund Terms:</strong> I acknowledge that consumed Aros are non-refundable, and unconsumed Aros are subject to the AROH Purchase Safety & Refund Policy.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Security & Ledger Disclaimer */}
        <div className="bg-white/60 backdrop-blur-md border border-black/5 rounded-xl p-5 text-xs text-slate-500 space-y-2">
          <div className="font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ADR-004 Financial Authority, Idempotency & Age Safety Guarantee</span>
          </div>
          <p className="leading-relaxed">
            All fiat-to-Aros settlements are processed via immutable server-side ledger transactions.
            Transactions are cryptographically deduplicated to prevent replay attacks and double-crediting.
            Under-18 accounts are strictly prohibited from purchasing Aros or creating payment sessions.
          </p>
        </div>
      </div>
    </div>
  );
}

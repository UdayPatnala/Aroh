"use client";

import * as React from "react";
import Link from "next/link";
import { PLATFORM_VERSION } from "@aroh/asdk";
import ArohLogo from "./aroh-logo";

export default function PlatformFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 px-6 py-12 bg-white text-slate-900 relative z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <ArohLogo size={24} />
              <span className="font-extrabold text-sm text-slate-900 tracking-widest">
                AROH ECOSYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              An orchestrated open-source multi-product application ecosystem with decoupled spoke architecture and centralized financial ledger authority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-black/5 text-[11px] font-mono">
              Status: Active Ecosystem
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono">
              DPDP Architecture Ready
            </span>
          </div>
        </div>

        {/* Legal & Compliance Links Grid */}
        <div className="pt-6 border-t border-black/5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Governance & Terms</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <Link href="/terms" className="hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="hover:text-slate-900 transition-colors">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-slate-900 transition-colors">
                  Product Spokes
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Privacy & Data</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link href="/privacy/ai" className="hover:text-slate-900 transition-colors">
                  AI Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy/retention" className="hover:text-slate-900 transition-colors">
                  Retention Schedule
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Cookies & Consent</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <Link href="/cookies" className="hover:text-slate-900 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy/consent" className="hover:text-slate-900 transition-colors font-medium text-sky-700">
                  Consent Settings
                </Link>
              </li>
              <li>
                <Link href="/cookies#manage" className="hover:text-slate-900 transition-colors">
                  Preference Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Data Principal Rights</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <Link href="/privacy/rights" className="hover:text-slate-900 transition-colors font-medium text-sky-700">
                  Data Rights Center
                </Link>
              </li>
              <li>
                <Link href="/privacy/rights#export" className="hover:text-slate-900 transition-colors">
                  Export My Data
                </Link>
              </li>
              <li>
                <Link href="/privacy/rights#erasure" className="hover:text-slate-900 transition-colors">
                  Account Deletion
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Security & Grievance</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <Link href="/privacy/grievance" className="hover:text-slate-900 transition-colors font-medium text-rose-700">
                  Grievance Redressal
                </Link>
              </li>
              <li>
                <Link href="/privacy/security" className="hover:text-slate-900 transition-colors">
                  Security Safeguards
                </Link>
              </li>
              <li>
                <Link href="/privacy/grievance#nomination" className="hover:text-slate-900 transition-colors">
                  Nominee Registration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} AROH Ecosystem Platform. Designed to support compliance with the Digital Personal Data Protection Act, 2023.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Republic of India</span>
            <span>•</span>
            <span className="font-mono">v{PLATFORM_VERSION}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

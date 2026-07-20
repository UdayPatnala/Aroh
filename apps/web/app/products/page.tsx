"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, MembershipLevel, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";
import { registeredProducts, ProductDetails } from "../explore/page";
import NotificationCenter from "../components/notification-center";

const categories = ["All", "Core Service", "Ecosystem Service", "Analytics", "Developer Service", "AI Tools"];

export default function ProductsPage() {
  const router = useRouter();
  const {
    user,
    profile,
    wallet,
    isAuthenticated,
    isRehydrated,
    upgradeMembership
  } = usePlatformStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedProduct, setSelectedProduct] = React.useState<ProductDetails>(registeredProducts[0]);

  React.useEffect(() => {
    if (isRehydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isRehydrated, router]);

  const isPrivilegedUser = user?.role === "admin" || user?.role === "operator";

  const visibleProducts = registeredProducts.filter((prod) => {
    if (prod.internalOnly && !isPrivilegedUser) return false;
    return true;
  });

  const filteredProducts = visibleProducts.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prod.badge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTierImportance = (tier: MembershipLevel): number => {
    if (tier === "enterprise") return 2;
    if (tier === "pro") return 1;
    return 0;
  };

  const userTierImportance = profile ? getTierImportance(profile.membershipLevel) : 0;
  const productTierImportance = getTierImportance(selectedProduct.requiredTier);
  const hasTierAccess = userTierImportance >= productTierImportance || user?.role === "admin";

  const handleLaunchProductWebpage = (product: ProductDetails) => {
    if (product.url) {
      window.open(product.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/explore/${product.id}`);
    }
  };

  const handleBuyUpgrade = async () => {
    if (!wallet || (wallet.balance < selectedProduct.price && user?.role !== "admin")) {
      alert("Insufficient Aros tokens to execute upgrade.");
      return;
    }
    try {
      await upgradeMembership(selectedProduct.requiredTier, selectedProduct.price);
      alert(`Success! Upgraded membership level to ${selectedProduct.requiredTier.toUpperCase()}.`);
    } catch (err: any) {
      alert(err.message || "Failed to buy upgrade");
    }
  };

  if (!isRehydrated || !isAuthenticated || !profile || !wallet) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex justify-center items-center text-slate-900">
        <span className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-10 px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/aroh-logo.png?v=2" alt="AROH Logo" className="h-10 w-10 object-contain rounded-xl border border-black/5 shadow-sm" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                AROH Products Console
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                Ecosystem Product Directory & Standalone Launch Console
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <div
              onClick={() => router.push("/dashboard")}
              className="bg-white border border-black/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
            >
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-800 font-mono">
                {formatArosBalance(wallet.balance, user?.role)}
              </span>
            </div>
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50">
              Home
            </Button>
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs bg-slate-100 text-slate-800 border-slate-200">
              Dashboard
            </Button>
          </div>
        </div>

        {/* Console Hub Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Product Selector Navigator */}
          <div className="lg:col-span-1 space-y-6 flex flex-col h-[70vh]">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Ecosystem Directory</h2>
              <label htmlFor="prodConsoleFilter" className="sr-only">Filter console products</label>
              <input
                id="prodConsoleFilter"
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-xs shadow-sm"
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-black/5 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-mono">No products found.</div>
              ) : (
                filteredProducts.map((prod) => {
                  const isActive = selectedProduct.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:border-slate-300 bg-white shadow-sm ${
                        isActive ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-black/5"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{prod.name}</h3>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {prod.badge}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs line-clamp-2 mt-2 leading-relaxed font-normal">{prod.description}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Product Display */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-black/5 rounded-3xl p-8 space-y-6 shadow-md"
            >
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-black/5 pb-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-[9px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedProduct.badge}
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Developed by <strong className="text-slate-900">{selectedProduct.author}</strong> • Version <strong className="text-sky-600 font-mono">{selectedProduct.version}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleLaunchProductWebpage(selectedProduct)}
                    className="px-6 py-2.5 font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10"
                  >
                    Launch Webpage ↗
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500">Overview</h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-200 p-5 rounded-2xl font-normal">
                  {selectedProduct.longDescription}
                </p>
              </div>

              {!hasTierAccess && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-sm">Access Restricted</h4>
                  <p className="text-xs text-slate-600">
                    This service requires **Platform {selectedProduct.requiredTier.toUpperCase()}** access level.
                    Your current membership is **{profile.membershipLevel.toUpperCase()}**.
                  </p>
                  <Button variant="primary" onClick={handleBuyUpgrade} className="px-5 py-2 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700">
                    Upgrade Access ({selectedProduct.price} Aros)
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

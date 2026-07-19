"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, MembershipLevel } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import AdminCharts from "../../components/admin-charts";

interface WorkspaceProps {
  productId: string;
}

export default function InteractiveWorkspace({ productId }: WorkspaceProps) {
  const router = useRouter();
  const {
    user,
    profile,
    wallet,
    transactions,
    addNotification,
    rewardUser,
    upgradeMembership,
    announcements,
    fetchUserTransactions
  } = usePlatformStore();

  switch (productId) {
    case "aros-wallet":
      return <ArosWalletWorkspace wallet={wallet} user={user} rewardUser={rewardUser} fetchUserTransactions={fetchUserTransactions} />;
    case "aroh-cms":
      return <ArohCmsWorkspace user={user} profile={profile} announcements={announcements} router={router} />;
    case "aros-metrics":
      return <ArosMetricsWorkspace />;
    case "aroh-notifier":
      return <ArohNotifierWorkspace addNotification={addNotification} />;
    case "aros-console":
      return <ArosConsoleWorkspace user={user} profile={profile} wallet={wallet} rewardUser={rewardUser} upgradeMembership={upgradeMembership} announcements={announcements} />;
    case "aroh-ai-helper":
      return <ArohAiHelperWorkspace />;
    case "nebula":
      return <NebulaWorkspace user={user} rewardUser={rewardUser} />;
    case "javapath-pro":
      return <JavaPathWorkspace user={user} rewardUser={rewardUser} />;
    case "spedex":
      return <SpedexWorkspace user={user} wallet={wallet} rewardUser={rewardUser} />;
    case "music-mirror":
      return <MusicMirrorWorkspace user={user} wallet={wallet} rewardUser={rewardUser} />;
    default:
      return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-zinc-400 text-xs font-mono">
          Interactive workspace for this product is handled externally or not required.
        </div>
      );
  }
}

/* ==========================================
   1. Aros Core Wallet Workspace
   ========================================== */
function ArosWalletWorkspace({ wallet, user, rewardUser, fetchUserTransactions }: any) {
  const [recipientId, setRecipientId] = React.useState("operator-id");
  const [amount, setAmount] = React.useState("50");
  const [desc, setDesc] = React.useState("Peer Transfer");
  const [isTransferring, setIsTransferring] = React.useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !wallet) return;
    const transferVal = parseFloat(amount);
    if (isNaN(transferVal) || transferVal <= 0) return;
    if (wallet.balance < transferVal) {
      alert("Insufficient wallet balance for this transfer.");
      return;
    }

    setIsTransferring(true);
    try {
      // Debit sender
      await rewardUser(user.id, -transferVal, `Transfer to ${recipientId}: "${desc}"`);
      // Credit recipient
      await rewardUser(recipientId, transferVal, `Transfer from ${user.id}: "${desc}"`);
      alert("Peer transfer completed successfully. Ledger updated.");
      setAmount("50");
      setDesc("Peer Transfer");
      fetchUserTransactions();
    } catch (err: any) {
      alert(err.message || "Transfer failed");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/3 border border-white/5 p-6 rounded-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Peer Ledger Transfer</h3>
        <p className="text-xs text-zinc-400">
          Transfer Aros tokens instantly to other ecosystem accounts. All transactions are logged in the audited ledger.
        </p>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label htmlFor="recipientId" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Recipient Account</label>
            <select
              id="recipientId"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="operator-id">CMS Operator (operator-id)</option>
              <option value="admin-id">Aroh Director (admin-id)</option>
              <option value="user-id">Standard User (user-id)</option>
            </select>
          </div>

          <div>
            <label htmlFor="transferAmount" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Amount (Aros)</label>
            <input
              id="transferAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="transferDesc" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Ledger Memo</label>
            <input
              id="transferDesc"
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5 text-xs" disabled={isTransferring}>
            {isTransferring ? "Processing..." : "Initiate Instant Transfer"}
          </Button>
        </form>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/5 p-5 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Current Wallet Status</span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono block">{wallet?.balance} Aros</span>
        </div>

        <div className="border-t border-white/5 pt-4 space-y-2.5 text-xs text-zinc-400 mt-6">
          <div className="flex justify-between">
            <span>Ledger Clearance:</span>
            <strong className="text-emerald-400">INSTANT</strong>
          </div>
          <div className="flex justify-between">
            <span>Firestore Rules Encrypted:</span>
            <strong className="text-white">TRUE</strong>
          </div>
          <div className="flex justify-between">
            <span>Audit Trail Mode:</span>
            <strong className="text-white">FULL TRACE</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. Aroh CMS Alerts Workspace
   ========================================== */
function ArohCmsWorkspace({ user, profile, announcements, router }: any) {
  const hasAccess = user?.role === "admin" || user?.role === "operator";

  return (
    <div className="bg-white/3 border border-white/5 p-6 rounded-2xl space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Announcement Pipeline</h3>
          <p className="text-xs text-zinc-400">Preview system announcements and schedule new alerts.</p>
        </div>
        {hasAccess ? (
          <Button variant="primary" onClick={() => router.push("/cms")} className="px-5 py-2 text-xs">
            Open Full CMS Editor
          </Button>
        ) : (
          <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            Editor Access Restricted
          </span>
        )}
      </div>

      <div className="space-y-3">
        <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Alert Feed Preview</span>
        {announcements.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">No announcements in pipeline.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 4).map((ann: any) => (
              <div key={ann.id} className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-extrabold ${
                    ann.category === "maintenance" ? "bg-rose-500/10 text-rose-400" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-[9px] text-zinc-500">{new Date(ann.publishedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                <p className="text-zinc-400 text-xs leading-normal line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   3. Aros Metrics Engine Workspace
   ========================================== */
function ArosMetricsWorkspace() {
  return (
    <div className="space-y-6">
      <div className="bg-white/3 border border-white/5 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-2">Live Node Telemetry</h3>
        <p className="text-xs text-zinc-400 mb-6">Real-time CPU loads, transaction cycles, and active client connections across the AROH cloud cluster.</p>
        
        {/* Render the full SVG graph dashboards */}
        <AdminCharts />
      </div>
    </div>
  );
}

/* ==========================================
   4. Aroh Notification Center Workspace
   ========================================== */
function ArohNotifierWorkspace({ addNotification }: any) {
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState<"info" | "success" | "warning">("success");

  const triggerAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addNotification(message, type);
    setMessage("");
    alert("Notification routed successfully! Check the bell icon dropdown in the header.");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/3 border border-white/5 p-6 rounded-2xl">
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-white">Alert Trigger Console</h3>
        <p className="text-xs text-zinc-400">
          Dispatch in-app notification packets. The routed message will instantly hydrate inside the client notification tray (bell icon).
        </p>

        <form onSubmit={triggerAlert} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="notifyMsg" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Notification Message</label>
              <input
                id="notifyMsg"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. System upgrade scheduled for 02:00 UTC"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label htmlFor="notifyType" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Alert Level</label>
              <select
                id="notifyType"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" className="px-6 py-2.5 text-xs">
            Route Alert Packet
          </Button>
        </form>
      </div>

      <div className="bg-black/30 border border-white/5 rounded-xl p-5 text-xs text-zinc-400 space-y-4">
        <strong className="text-white block uppercase text-[10px] tracking-wider">Broker Details</strong>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Protocol:</span>
            <span className="text-white font-mono">ASDK/WS</span>
          </div>
          <div className="flex justify-between">
            <span>Client State Sync:</span>
            <span className="text-emerald-400">ACTIVE</span>
          </div>
          <div className="flex justify-between">
            <span>Storage persistence:</span>
            <span className="text-zinc-500 font-mono">Local/None</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   5. Aros Command Console Workspace (CLI)
   ========================================== */
interface ConsoleLine {
  text: string;
  type: "input" | "success" | "error" | "system";
}

function ArosConsoleWorkspace({ user, profile, wallet, rewardUser, upgradeMembership, announcements }: any) {
  const [cliInput, setCliInput] = React.useState("");
  const [history, setHistory] = React.useState<ConsoleLine[]>([
    { text: "AROH COMMAND CONSOLE [Version 1.1.0]", type: "system" },
    { text: "Type /help to review all accessible shell functions.", type: "system" }
  ]);
  const consoleEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const parseCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const rawCmd = cliInput.trim();
    setHistory((prev) => [...prev, { text: `> ${rawCmd}`, type: "input" }]);
    setCliInput("");

    const parts = rawCmd.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "/help":
        setHistory((prev) => [
          ...prev,
          { text: "Accessible CLI Commands:", type: "system" },
          { text: "  /help                      - Review command directives", type: "system" },
          { text: "  /balance                   - Query wallet ledger total", type: "system" },
          { text: "  /upgrade <pro|enterprise>  - Buy membership tier overrides", type: "system" },
          { text: "  /reward <amount>           - Mint tokens via simulated incentive", type: "system" },
          { text: "  /announcements             - Print dynamic alert cache lists", type: "system" },
          { text: "  /clear                     - Flush terminal console lines", type: "system" }
        ]);
        break;

      case "/balance":
        setHistory((prev) => [...prev, { text: `Current Wallet Balance: ${wallet?.balance || 0} Aros`, type: "success" }]);
        break;

      case "/clear":
        setHistory([]);
        break;

      case "/announcements":
        if (announcements.length === 0) {
          setHistory((prev) => [...prev, { text: "Announcements index empty.", type: "system" }]);
        } else {
          announcements.forEach((ann: any) => {
            setHistory((prev) => [...prev, { text: `[${ann.category.toUpperCase()}] ${ann.title} - ${ann.content.slice(0, 40)}...`, type: "system" }]);
          });
        }
        break;

      case "/reward": {
        const amt = parseFloat(args[0]);
        if (isNaN(amt) || amt <= 0) {
          setHistory((prev) => [...prev, { text: "Error: Invalid argument. Amount must be positive.", type: "error" }]);
        } else {
          try {
            await rewardUser(user.id, amt, "CLI Mint Action");
            setHistory((prev) => [...prev, { text: `Minted +${amt} Aros. Ledger verified.`, type: "success" }]);
          } catch (err: any) {
            setHistory((prev) => [...prev, { text: `Mint error: ${err.message}`, type: "error" }]);
          }
        }
        break;
      }

      case "/upgrade": {
        const level = args[0]?.toLowerCase() as MembershipLevel;
        if (level !== "pro" && level !== "enterprise") {
          setHistory((prev) => [...prev, { text: "Error: Invalid level name. Options: pro | enterprise", type: "error" }]);
        } else {
          const cost = level === "pro" ? 100 : 500;
          if (wallet.balance < cost) {
            setHistory((prev) => [...prev, { text: `Error: Insufficient balance. Upgrade costs ${cost} Aros.`, type: "error" }]);
          } else {
            try {
              await upgradeMembership(level, cost);
              setHistory((prev) => [...prev, { text: `Membership successfully upgraded to ${level.toUpperCase()}.`, type: "success" }]);
            } catch (err: any) {
              setHistory((prev) => [...prev, { text: `Upgrade error: ${err.message}`, type: "error" }]);
            }
          }
        }
        break;
      }

      default:
        setHistory((prev) => [...prev, { text: `Command not recognized: "${command}". Type /help for assistance.`, type: "error" }]);
    }
  };

  return (
    <div className="bg-[#050508] border border-white/10 rounded-2xl p-5 space-y-4 font-mono text-[11px]">
      <div className="h-64 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 pr-2">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={
              line.type === "input"
                ? "text-white"
                : line.type === "success"
                ? "text-emerald-400"
                : line.type === "error"
                ? "text-rose-500 font-bold"
                : "text-amber-500"
            }
          >
            {line.text}
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>

      <form onSubmit={parseCommand} className="flex gap-2 border-t border-white/5 pt-3">
        <span className="text-zinc-500 py-1 shrink-0 font-bold">$</span>
        <label htmlFor="cliInput" className="sr-only">Type CLI command</label>
        <input
          id="cliInput"
          type="text"
          value={cliInput}
          onChange={(e) => setCliInput(e.target.value)}
          className="flex-1 bg-transparent border-0 text-white focus:outline-none text-xs font-mono"
          placeholder="type /help to begin..."
          autoComplete="off"
        />
      </form>
    </div>
  );
}

/* ==========================================
   6. AROH AI Doc Helper Workspace
   ========================================== */
import { mockDocDatabase } from "../../ai/page";

function ArohAiHelperWorkspace() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<typeof mockDocDatabase>([]);
  const [searched, setSearched] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const term = query.toLowerCase();
    const list = mockDocDatabase.filter((doc) =>
      doc.keyword.includes(term) ||
      doc.title.toLowerCase().includes(term) ||
      doc.content.toLowerCase().includes(term)
    );
    setResults(list);
    setSearched(true);
  };

  return (
    <div className="bg-white/3 border border-white/5 p-6 rounded-2xl space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">Documentation Index Assistant</h3>
        <p className="text-xs text-zinc-400">
          Query architectural principles directly in the workspace database. Try keywords like "ledger", "monorepo", "authority", or "ssot".
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <label htmlFor="aiHelperQuery" className="sr-only">Search architecture guidelines</label>
        <input
          id="aiHelperQuery"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guidelines..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-xs"
        />
        <Button type="submit" variant="primary" className="px-5 text-xs font-semibold">
          Search
        </Button>
      </form>

      {searched && (
        <div className="bg-black/30 rounded-xl border border-white/5 p-4 space-y-3">
          {results.length === 0 ? (
            <p className="text-xs text-zinc-400 font-mono text-center">No principles matched query.</p>
          ) : (
            results.map((res) => (
              <div key={res.keyword} className="space-y-1 text-xs">
                <strong className="text-amber-400 block font-semibold">{res.title}</strong>
                <p className="text-zinc-400 leading-relaxed text-[11px]">{res.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   7. Nebula Workspace Component
   ========================================== */
function NebulaWorkspace({ user, rewardUser }: any) {
  const [selectedImg, setSelectedImg] = React.useState<number | null>(null);
  const [pipelineLogs, setPipelineLogs] = React.useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<any>(null);
  const [checkInDisabled, setCheckInDisabled] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const lastCheck = localStorage.getItem("aroh_nebula_checkin");
      if (lastCheck) {
        const diff = Date.now() - parseInt(lastCheck);
        if (diff < 60000) { // Limit mock check-in to once a minute for testing
          setCheckInDisabled(true);
        }
      }
    }
  }, []);

  const handleCheckIn = async () => {
    if (!user) return;
    try {
      await rewardUser(user.id, 10, "Nebula Daily Check-in Reward");
      localStorage.setItem("aroh_nebula_checkin", Date.now().toString());
      setCheckInDisabled(true);
      alert("Successfully claimed +10 Aros daily check-in reward!");
    } catch {
      alert("Failed to claim daily check-in");
    }
  };

  const startAnalysis = () => {
    if (selectedImg === null) {
      alert("Please select a photo/media to analyze first.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPipelineLogs(["[STAGE 1/5] Extracting Exif metadata & photo profile..."]);

    setTimeout(() => {
      setPipelineLogs((prev) => [...prev, "[STAGE 2/5] Object Detection: sunset, waves, landscape scenery detected."]);
    }, 600);
    setTimeout(() => {
      setPipelineLogs((prev) => [...prev, "[STAGE 3/5] Face Mapping: 0 faces found in landscape view."]);
    }, 1200);
    setTimeout(() => {
      setPipelineLogs((prev) => [...prev, "[STAGE 4/5] Emotion Mapping: classification resolved to CALM & SERENE."]);
    }, 1800);
    setTimeout(() => {
      setPipelineLogs((prev) => [...prev, "[STAGE 5/5] Synthesizing story highlights and generating color palette..."]);
    }, 2400);

    setTimeout(() => {
      setIsAnalyzing(false);
      setPipelineLogs((prev) => [...prev, "[SUCCESS] Gallery story analysis complete."]);
      setAnalysisResult({
        mood: "Serene & Peaceful",
        tags: ["Sunset", "Ocean Coast", "Golden Hour", "Calmness"],
        colors: ["#f59e0b", "#fb7185", "#38bdf8"]
      });
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/3 border border-white/5 p-6 rounded-2xl">
      <div className="space-y-6 col-span-1">
        <div>
          <h3 className="text-lg font-bold text-white">Media Intelligence Pipeline</h3>
          <p className="text-xs text-zinc-400">Select a gallery file to launch the 5-stage analysis engine.</p>
        </div>

        {/* Media grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            "from-amber-500 to-rose-500",
            "from-blue-600 to-purple-600",
            "from-emerald-500 to-teal-500"
          ].map((grad, i) => (
            <div
              key={i}
              onClick={() => setSelectedImg(i)}
              className={`h-20 rounded-xl bg-gradient-to-br ${grad} cursor-pointer border-2 transition-all ${
                selectedImg === i ? "border-amber-400 scale-95" : "border-white/5 hover:border-white/20"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="primary" onClick={startAnalysis} disabled={isAnalyzing} className="flex-1 py-2 text-xs">
            {isAnalyzing ? "Analyzing Pipeline..." : "Analyze Media File"}
          </Button>
          <Button
            variant="glass"
            onClick={handleCheckIn}
            disabled={checkInDisabled}
            className="flex-1 py-2 text-xs text-amber-400 border-amber-500/20"
          >
            {checkInDisabled ? "Checked In Today" : "Claim Daily +10 Aros"}
          </Button>
        </div>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/5 p-5 flex flex-col justify-between font-mono text-[11px] h-60 overflow-y-auto col-span-1">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block font-sans">Pipeline Logs</span>
          {pipelineLogs.map((log, idx) => (
            <div key={idx} className={log.includes("[SUCCESS]") ? "text-emerald-400" : log.includes("[STAGE") ? "text-amber-500" : "text-zinc-400"}>
              {log}
            </div>
          ))}
        </div>

        {analysisResult && (
          <div className="border-t border-white/5 pt-3 mt-4 space-y-2 font-sans text-xs">
            <div>
              <span className="text-zinc-400 text-[10px] uppercase font-semibold">Mood Classification:</span>
              <strong className="text-white block">{analysisResult.mood}</strong>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] uppercase font-semibold">Ambient Palette:</span>
              <div className="flex gap-2 mt-1">
                {analysisResult.colors.map((c: string) => (
                  <span key={c} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-amber-400 font-semibold tracking-wide hover:underline cursor-pointer flex items-center gap-1 focus:outline-none"
        >
          {showCode ? "▼ Hide ASDK SSO & Integration Code" : "▶ Show ASDK SSO & Integration Code"}
        </button>
        {showCode && (
          <div className="bg-black/60 rounded-xl p-4 border border-white/5 overflow-x-auto text-[10px] font-mono text-zinc-400 leading-relaxed mt-3 max-h-60 overflow-y-auto scrollbar-thin">
            <pre>{`// D:\\PROJECT\\Nebula\\src\\aroh-adapter.ts
import { usePlatformStore } from "@aroh/asdk";

export function useArohNebulaBridge() {
  const { user, profile, wallet, token, isAuthenticated, login, logout, rewardUser } = usePlatformStore();

  const activeUser = user && profile && wallet ? {
    id: user.id,
    name: profile.displayName,
    email: user.email,
    role: profile.membershipLevel === "enterprise" || profile.membershipLevel === "pro" ? "premium_user" : "registered_user",
    credits: wallet.balance, // Sync credit balance with Aros wallet
  } : null;

  const dailyCheckIn = async (): Promise<boolean> => {
    if (!user) return false;
    await rewardUser(user.id, 10, "Daily Check-in Reward");
    return true;
  };

  return { user: activeUser, isAuthenticated, login, logout, dailyCheckIn, token };
}`}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   8. JavaPath Pro Workspace Component
   ========================================== */
function JavaPathWorkspace({ user, rewardUser }: any) {
  const [code, setCode] = React.useState(`public class StringReverser {
    public String reverse(String input) {
        // TODO: implement reversal logic
        return new StringBuilder(input).reverse().toString();
    }
}`);
  const [compiling, setCompiling] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [isPassed, setIsPassed] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);

  const runTests = () => {
    setCompiling(true);
    setIsPassed(false);
    setLogs(["Compiling StringReverser.java...", "Resolving dependencies..."]);

    setTimeout(() => {
      setLogs((prev) => [...prev, "Running JUnit test suite..."]);
    }, 700);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        "[PASS] Test case 1: reverse('Aroh') -> 'horA'",
        "[PASS] Test case 2: reverse('') -> ''"
      ]);
    }, 1400);

    setTimeout(async () => {
      setCompiling(false);
      setIsPassed(true);
      setLogs((prev) => [...prev, "[SUCCESS] All JUnit tests passed. Dispatching 15 Aros token incentive..."]);
      if (user) {
        try {
          await rewardUser(user.id, 15, "JavaPath Pro: Task Completed");
        } catch {
          // Bypassed
        }
      }
    }, 2100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/3 border border-white/5 p-6 rounded-2xl">
      <div className="space-y-4 col-span-1">
        <div>
          <h3 className="text-lg font-bold text-white">Java Compiler Sandbox</h3>
          <p className="text-xs text-zinc-400">Implement string reversal to satisfy unit tests and claim wallet rewards.</p>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-40 bg-zinc-950 border border-white/10 rounded-xl p-4 font-mono text-[11px] text-zinc-300 focus:outline-none focus:border-amber-500"
        />

        <Button variant="primary" onClick={runTests} disabled={compiling} className="w-full py-2 text-xs">
          {compiling ? "Running Tests..." : "Compile & Run Tests"}
        </Button>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/5 p-5 font-mono text-[11px] space-y-1.5 h-64 overflow-y-auto col-span-1">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block font-sans mb-2">JUnit Console Output</span>
        {logs.map((log, i) => (
          <div key={i} className={log.includes("[SUCCESS]") ? "text-emerald-400" : log.includes("[PASS]") ? "text-emerald-400/80" : "text-zinc-400"}>
            {log}
          </div>
        ))}
      </div>

      <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-amber-400 font-semibold tracking-wide hover:underline cursor-pointer flex items-center gap-1 focus:outline-none"
        >
          {showCode ? "▼ Hide ASDK SSO & Integration Code" : "▶ Show ASDK SSO & Integration Code"}
        </button>
        {showCode && (
          <div className="bg-black/60 rounded-xl p-4 border border-white/5 overflow-x-auto text-[10px] font-mono text-zinc-400 leading-relaxed mt-3 max-h-60 overflow-y-auto scrollbar-thin">
            <pre>{`// D:\\PROJECT\\javapath-pro\\javapath-frontend\\src\\aroh-adapter.ts
import { usePlatformStore } from "@aroh/asdk";
import axios from "axios";

export function useArohJavaPathBridge() {
  const { user, profile, token, isAuthenticated, login, logout, rewardUser } = usePlatformStore();

  const syncAxiosToken = (jwtToken: string | null) => {
    if (jwtToken) {
      axios.defaults.headers.common["Authorization"] = \`Bearer \${jwtToken}\`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const rewardForTaskCompletion = async (taskId: string, points = 15) => {
    if (!user) return;
    await rewardUser(user.id, points, \`Completed JavaPath Challenge: \${taskId}\`);
  };

  return { user, token, isAuthenticated, login, logout, syncAxiosToken, rewardForTaskCompletion };
}`}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   9. SpeDex Workspace Component
   ========================================== */
function SpedexWorkspace({ user, wallet, rewardUser }: any) {
  const [cost, setCost] = React.useState("50");
  const [desc, setDesc] = React.useState("Cloud Computing Resource Usage");
  const [processing, setProcessing] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);

  const handleCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !wallet) return;
    const value = parseFloat(cost);
    if (isNaN(value) || value <= 0) return;

    if (wallet.balance < value) {
      alert("Insufficient wallet balance to cover budget debit!");
      return;
    }

    setProcessing(true);
    try {
      await rewardUser(user.id, -value, `SpeDex Payment: "${desc}"`);
      alert(`Success! Processed SpeDex debit of -${value} Aros.`);
      setCost("50");
      setDesc("Cloud Resource Usage");
    } catch (err: any) {
      alert(err.message || "Failed to process SpeDex debit");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/3 border border-white/5 p-6 rounded-2xl">
      <div className="space-y-4 col-span-1">
        <div>
          <h3 className="text-lg font-bold text-white">Spend Speedometer & Payment Bridge</h3>
          <p className="text-xs text-zinc-400">Debit Aros tokens from your wallet to pay for microservices.</p>
        </div>

        <form onSubmit={handleCharge} className="space-y-4">
          <div>
            <label htmlFor="spedexCost" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Charge Amount (Aros)</label>
            <input
              id="spedexCost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="spedexDesc" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Debit Memo</label>
            <input
              id="spedexDesc"
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-2 text-xs" disabled={processing}>
            {processing ? "Processing debit..." : "Execute SpeDex Debit"}
          </Button>
        </form>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/5 p-5 flex flex-col justify-center items-center h-60 space-y-4 col-span-1">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Current Spending Speed</span>
        
        {/* Speedometer visual SVG */}
        <div className="relative w-36 h-20">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#27272a"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 70 20"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute bottom-0 inset-x-0 text-center text-sm font-bold text-white font-mono">75% Velocity</span>
        </div>
        
        <span className="text-zinc-500 text-[10px] text-center max-w-[200px] leading-relaxed">
          Aggregates transactions and triggers alerts when speed exceeds budget limits.
        </span>
      </div>

      <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-amber-400 font-semibold tracking-wide hover:underline cursor-pointer flex items-center gap-1 focus:outline-none"
        >
          {showCode ? "▼ Hide ASDK SSO & Integration Code" : "▶ Show ASDK SSO & Integration Code"}
        </button>
        {showCode && (
          <div className="bg-black/60 rounded-xl p-4 border border-white/5 overflow-x-auto text-[10px] font-mono text-zinc-400 leading-relaxed mt-3 max-h-60 overflow-y-auto scrollbar-thin">
            <pre>{`// D:\\PROJECT\\Spedex\\dashboard_app\\src\\aroh-adapter.ts
import { usePlatformStore } from "@aroh/asdk";

export function useArohSpedexBridge() {
  const { user, profile, wallet, token, isAuthenticated, logout, rewardUser } = usePlatformStore();

  const executePayment = async (amount: number, description: string) => {
    if (!user) throw new Error("Authentication Required");
    if (!wallet || wallet.balance < amount) {
      throw new Error("Insufficient Aros Balance");
    }
    await rewardUser(user.id, -amount, \`Spedex Debit: \${description}\`);
  };

  return { user, token, isAuthenticated, executePayment, logout };
}`}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   10. Music Mirror Workspace Component
   ========================================== */
const MOOD_PLAYLISTS: Record<string, { title: string; premium: boolean }[]> = {
  happy: [
    { title: "Sunny Days (Lofi)", premium: false },
    { title: "Funky Basslines", premium: true }
  ],
  blue: [
    { title: "Quite Rain (Acoustic)", premium: false },
    { title: "Midnight Blues", premium: true }
  ],
  energetic: [
    { title: "Cyberpunk Horizon (Synth)", premium: false },
    { title: "Heavy Metal Core", premium: true }
  ],
  calm: [
    { title: "Deep Space Ambient", premium: false },
    { title: "Piano Dreams", premium: true }
  ]
};

function MusicMirrorWorkspace({ user, wallet, rewardUser }: any) {
  const [mood, setMood] = React.useState("happy");
  const [scanning, setScanning] = React.useState(false);
  const [playlist, setPlaylist] = React.useState<{ title: string; premium: boolean }[]>([]);
  const [activeSong, setActiveSong] = React.useState<string | null>(null);
  const [unlockedSongs, setUnlockedSongs] = React.useState<Record<string, boolean>>({});
  const [showCode, setShowCode] = React.useState(false);

  const detectMood = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setPlaylist(MOOD_PLAYLISTS[mood] || []);
      setActiveSong(null);
    }, 1500);
  };

  const handlePlay = async (song: { title: string; premium: boolean }) => {
    if (!user) return;
    if (song.premium && !unlockedSongs[song.title]) {
      if (wallet.balance < 20) {
        alert("Insufficient balance to unlock premium track!");
        return;
      }
      try {
        await rewardUser(user.id, -20, `Music Mirror: Unlocked premium track "${song.title}"`);
        setUnlockedSongs((prev) => ({ ...prev, [song.title]: true }));
        setActiveSong(song.title);
        alert(`Success! Unlocked "${song.title}" for 20 Aros.`);
      } catch {
        alert("Transaction failed");
      }
    } else {
      setActiveSong(song.title);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/3 border border-white/5 p-6 rounded-2xl">
      <div className="space-y-4 col-span-1">
        <div>
          <h3 className="text-lg font-bold text-white">Mood Matcher Audio Player</h3>
          <p className="text-xs text-zinc-400">Scan mood tags or unlock premium tracks for mood enhancement.</p>
        </div>

        <div>
          <label htmlFor="moodSelect" className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Select Simulated Facial Expression</label>
          <select
            id="moodSelect"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 mb-4"
          >
            <option value="happy">Smiling (Happy)</option>
            <option value="blue">Frowning (Blue)</option>
            <option value="energetic">Excited (Energetic)</option>
            <option value="calm">Neutral (Calm)</option>
          </select>

          <Button variant="primary" onClick={detectMood} disabled={scanning} className="w-full py-2 text-xs">
            {scanning ? "Scanning Webcam Facial Map..." : "Scan Expression & Recommend"}
          </Button>
        </div>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/5 p-5 flex flex-col justify-between h-60 col-span-1">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block mb-3">Recommender Playlist</span>
          {scanning ? (
            <div className="text-center py-8 text-xs text-zinc-500 animate-pulse">Running mood classification...</div>
          ) : playlist.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 font-mono">Camera feed inactive. Please scan first.</div>
          ) : (
            <div className="space-y-2">
              {playlist.map((song) => (
                <div key={song.title} className="flex justify-between items-center p-2 rounded bg-white/2 hover:bg-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={activeSong === song.title ? "text-emerald-400" : "text-white"}>
                      {song.title}
                    </span>
                    {song.premium && !unlockedSongs[song.title] && (
                      <span className="text-[9px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                        PRO Track
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlay(song)}
                    className="text-[10px] px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                  >
                    {song.premium && !unlockedSongs[song.title] ? "Unlock (20 Aros)" : activeSong === song.title ? "Playing" : "Play"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeSong && (
          <div className="flex items-center gap-3 border-t border-white/5 pt-3">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-xs text-zinc-300 font-medium">Currently Playing: "{activeSong}"</span>
          </div>
        )}
      </div>

      <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-amber-400 font-semibold tracking-wide hover:underline cursor-pointer flex items-center gap-1 focus:outline-none"
        >
          {showCode ? "▼ Hide ASDK SSO & Integration Code" : "▶ Show ASDK SSO & Integration Code"}
        </button>
        {showCode && (
          <div className="bg-black/60 rounded-xl p-4 border border-white/5 overflow-x-auto text-[10px] font-mono text-zinc-400 leading-relaxed mt-3 max-h-60 overflow-y-auto scrollbar-thin">
            <pre>{`// D:\\PROJECT\\Music Mirror\\frontend\\src\\aroh-adapter.ts
import { usePlatformStore } from "@aroh/asdk";

export function useArohMusicMirrorBridge() {
  const { user, profile, isAuthenticated, logout, rewardUser } = usePlatformStore();

  const chargeForPremiumTrack = async (trackTitle: string, price = 20) => {
    if (!user) return;
    await rewardUser(user.id, -price, \`Unlocked Premium Song: \${trackTitle}\`);
  };

  return { isAuthenticated, chargeForPremiumTrack, logout };
}`}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

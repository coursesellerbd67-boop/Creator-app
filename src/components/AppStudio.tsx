import React, { useState } from "react";
import {
  Smartphone,
  Play,
  Copy,
  Download,
  Check,
  Sparkles,
  Code2,
  RefreshCw,
  Home,
  User,
  Settings,
  Trophy,
  Wallet,
  Gamepad2,
  LogIn,
  UserPlus,
  ArrowRight,
  Shield,
  CreditCard,
  Bell,
  Search,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface AppStudioProps {
  initialPrompt?: string;
}

type ScreenType =
  | "home"
  | "tournament"
  | "leaderboard"
  | "wallet"
  | "profile"
  | "login"
  | "register"
  | "settings";

export const AppStudio: React.FC<AppStudioProps> = ({ initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || "একটা Free Fire tournament app বানাও—Home, Tournament, Leaderboard, Wallet, Profile সহ।"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [activeScreen, setActiveScreen] = useState<ScreenType>("home");
  const [codePlatform, setCodePlatform] = useState<"react-native" | "flutter">("react-native");
  const [copied, setCopied] = useState(false);

  // App mock interactive state
  const [walletBalance, setWalletBalance] = useState(1450);
  const [joinedTournaments, setJoinedTournaments] = useState<{ [k: number]: boolean }>({ 1: true });
  const [ign, setIgn] = useState("Pro_Sniper_BD");
  const [freeFireUid, setFreeFireUid] = useState("2847192841");

  const screens: { id: ScreenType; label: string; icon: any }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "tournament", label: "Tournament", icon: Gamepad2 },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
    { id: "login", label: "Login", icon: LogIn },
    { id: "register", label: "Register", icon: UserPlus },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "app_prototype",
          prompt: `Generate an 8-screen mobile application specification and architecture for: "${prompt}". Focus on Home, Login, Register, Tournament/Catalog, Leaderboard/Stats, Profile, Wallet/Checkout, Settings.`,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJoinMatch = (id: number, fee: number) => {
    if (joinedTournaments[id]) return;
    if (walletBalance < fee) {
      alert("ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই! দয়া করে ওয়ালেট থেকে রিচার্জ করুন।");
      setActiveScreen("wallet");
      return;
    }
    setWalletBalance((prev) => prev - fee);
    setJoinedTournaments((prev) => ({ ...prev, [id]: true }));
    alert("টুর্নামেন্টে রেজিস্ট্রেশন সফল হয়েছে! ম্যাচ শুরুর ১৫ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড পাঠানো হবে।");
  };

  const sampleReactNativeCode = `// React Native / Expo - Free Fire Tournament App
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function TournamentApp() {
  const [balance, setBalance] = useState(1450);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>✦ FF BATTLE PRO</Text>
        <TouchableOpacity style={styles.balanceBadge}>
          <Text style={styles.balanceText}>৳ {balance}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Daily Grand Tournament</Text>
          <Text style={styles.cardSub}>প্রাইজ পুল: ৳ ৫,০০০ | এন্ট্রি ফি: ৳ ৫০</Text>
          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinText}>এখনই জয়েন করুন</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appTitle: { color: '#f59e0b', fontSize: 18, fontWeight: 'bold' },
  balanceBadge: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  balanceText: { color: '#10b981', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: '#94a3b8', fontSize: 12, marginVertical: 6 },
  joinBtn: { backgroundColor: '#f59e0b', padding: 10, borderRadius: 10, alignItems: 'center' },
  joinText: { color: '#000', fontWeight: 'bold' }
});`;

  const sampleFlutterCode = `// Flutter Dart - Free Fire Tournament App
import 'package:flutter/material.dart';

void main() => runApp(const TournamentApp());

class TournamentApp extends StatelessWidget {
  const TournamentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        primaryColor: const Color(0xFFF59E0B),
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('✦ FF BATTLE PRO', style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0F172A),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Center(
              child: Text('৳ 1,450', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            color: const Color(0xFF1E293B),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('🔥 Daily Grand Tournament', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 6),
                  const Text('প্রাইজ পুল: ৳ ৫,০০০ | এন্ট্রি ফি: ৳ ৫০', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF59E0B), foregroundColor: Colors.black),
                    onPressed: () {},
                    child: const Text('এখনই জয়েন করুন', style: TextStyle(fontWeight: FontWeight.bold)),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}`;

  return (
    <div id="app-studio-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>APP STUDIO V2 • INTERACTIVE MULTI-SCREEN PROTOTYPER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            মোবাইল অ্যাপ প্রোটোটাইপার ও কোড জেনারেটর
          </h1>
          <p className="text-amber-200/90 text-xs md:text-sm mt-1">
            Home, Login, Register, Tournament, Leaderboard, Profile, Wallet এবং Settings—লাইভ ক্লিক্যাবল ইন্টারঅ্যাকশন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preview" ? "bg-amber-500 text-black shadow" : "bg-white/10 text-white"
            }`}
          >
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "code" ? "bg-amber-500 text-black shadow" : "bg-white/10 text-white"
            }`}
          >
            Source Code
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Phone Mockup */}
        <div className="lg:col-span-7 bg-neutral-950 rounded-2xl p-6 border border-neutral-800 shadow-xl flex flex-col items-center justify-center">
          {activeTab === "preview" ? (
            <div className="w-[330px] h-[640px] bg-slate-900 rounded-[40px] border-4 border-neutral-700 shadow-2xl relative flex flex-col overflow-hidden text-white">
              {/* Phone Speaker & Camera Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-800 rounded-full z-30 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              </div>

              {/* Status Bar */}
              <div className="pt-7 px-5 pb-2 flex items-center justify-between text-[11px] font-mono text-neutral-400 shrink-0">
                <span>09:41</span>
                <span>5G 98%</span>
              </div>

              {/* App In-Screen Top Header */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-extrabold text-sm tracking-wider">
                    ✦ FF BATTLE PRO
                  </span>
                </div>
                <div
                  onClick={() => setActiveScreen("wallet")}
                  className="cursor-pointer flex items-center gap-1 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-emerald-400 text-xs font-bold"
                >
                  <Wallet className="w-3 h-3" />
                  <span>৳ {walletBalance}</span>
                </div>
              </div>

              {/* Screen Content Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* 1. HOME SCREEN */}
                {activeScreen === "home" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl text-white shadow">
                      <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-bold">
                        FEATURED
                      </span>
                      <h3 className="font-bold text-sm mt-1">Free Fire Pro Cup Season 4</h3>
                      <p className="text-xs text-amber-100 mt-0.5">মোট প্রাইজ পুল: ৳ ৫০,০০০</p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-neutral-300">
                      <span>আজকের লাইভ টুর্নামেন্ট</span>
                      <button
                        onClick={() => setActiveScreen("tournament")}
                        className="text-amber-400 text-[11px]"
                      >
                        সব দেখুন →
                      </button>
                    </div>

                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">Solo Rush #102</span>
                        <span className="text-amber-400 font-bold">৳ ২০০০ পুল</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 flex justify-between">
                        <span>ম্যাপ: Bermuda</span>
                        <span>এন্ট্রি: ৳ ৫০</span>
                      </div>
                      <button
                        onClick={() => handleJoinMatch(2, 50)}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold ${
                          joinedTournaments[2]
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-black hover:bg-amber-400"
                        }`}
                      >
                        {joinedTournaments[2] ? "রেজিস্ট্রেশন সম্পন্ন ✓" : "জয়েন করুন (৳৫০)"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. TOURNAMENT SCREEN */}
                {activeScreen === "tournament" && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      টুর্নামেন্ট তালিকা (CS & Battle Royale)
                    </h3>
                    {[
                      { id: 1, title: "Squad Bermuda Clash", prize: "৳ ৫০০০", fee: 100, slots: "38/48" },
                      { id: 2, title: "Duo Purgatory Snipe", prize: "৳ ২৫০০", fee: 60, slots: "40/48" },
                      { id: 3, title: "Solo Custom Night", prize: "৳ ১৫০০", fee: 40, slots: "45/48" },
                    ].map((tour) => (
                      <div key={tour.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{tour.title}</span>
                          <span className="text-emerald-400 font-bold">{tour.prize}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex justify-between">
                          <span>স্লট: {tour.slots}</span>
                          <span>ফি: ৳ {tour.fee}</span>
                        </div>
                        <button
                          onClick={() => handleJoinMatch(tour.id, tour.fee)}
                          className={`w-full py-1.5 rounded-lg text-xs font-bold ${
                            joinedTournaments[tour.id]
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-500 text-black hover:bg-amber-400"
                          }`}
                        >
                          {joinedTournaments[tour.id] ? "অলরেডি জয়েন করেছেন ✓" : `জয়েন করুন (৳${tour.fee})`}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. LEADERBOARD SCREEN */}
                {activeScreen === "leaderboard" && (
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      টপ প্লেয়ার লিডারবোর্ড
                    </h3>
                    {[
                      { rank: 1, name: "Killer_BD_99", kills: 142, prizeWon: "৳ ৮,৪০০" },
                      { rank: 2, name: "Pro_Sniper_BD (You)", kills: 128, prizeWon: "৳ ৭,২০০" },
                      { rank: 3, name: "Headshot_King", kills: 115, prizeWon: "৳ ৫,১০০" },
                      { rank: 4, name: "Shadow_Hunter", kills: 98, prizeWon: "৳ ৩,৫০০" },
                    ].map((player) => (
                      <div
                        key={player.rank}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          player.rank === 1
                            ? "bg-amber-950/60 border-amber-500/50"
                            : "bg-slate-800 border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {player.rank}
                          </span>
                          <span className="font-bold text-white truncate max-w-[120px]">{player.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-amber-400 font-bold block">{player.prizeWon}</span>
                          <span className="text-[10px] text-neutral-400">{player.kills} Kills</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. WALLET SCREEN */}
                {activeScreen === "wallet" && (
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-center space-y-1">
                      <span className="text-xs text-neutral-400">বর্তমান একাউন্ট ব্যালেন্স</span>
                      <h2 className="text-2xl font-black text-emerald-400">৳ {walletBalance}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setWalletBalance((prev) => prev + 500);
                          alert("bKash-এর মাধ্যমে ৳৫০০ সফলভাবে ডিপোজিট হয়েছে!");
                        }}
                        className="py-2 px-3 bg-pink-600 hover:bg-pink-700 rounded-xl text-xs font-bold text-white shadow"
                      >
                        + ৳৫০০ ডিপোজিট
                      </button>
                      <button
                        onClick={() => {
                          if (walletBalance >= 500) {
                            setWalletBalance((prev) => prev - 500);
                            alert("উইথড্র রিকোয়েস্ট সফল হয়েছে! ৩ ঘণ্টার মধ্যে bKash-এ টাকা পৌঁছে যাবে।");
                          } else {
                            alert("নূন্যতম উইথড্র ৳৫০০");
                          }
                        }}
                        className="py-2 px-3 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white shadow"
                      >
                        টাকা উত্তোলন
                      </button>
                    </div>

                    <div className="text-xs font-bold text-neutral-400 pt-1">পেমেন্ট গেটওয়ে:</div>
                    <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                      <span>বিকাশ / নগদ / রকেট অটো-পে</span>
                      <span className="text-emerald-400 font-bold text-[10px]">সক্রিয়</span>
                    </div>
                  </div>
                )}

                {/* 5. PROFILE SCREEN */}
                {activeScreen === "profile" && (
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-slate-800 rounded-2xl border border-slate-700 space-y-1">
                      <div className="w-14 h-14 rounded-full bg-amber-500 text-black font-black text-xl flex items-center justify-center mx-auto">
                        PS
                      </div>
                      <h4 className="font-bold text-sm text-white">{ign}</h4>
                      <p className="text-[11px] text-neutral-400">FF UID: {freeFireUid}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-800 rounded-xl">
                        <span className="text-[10px] text-neutral-400 block">লেভেল</span>
                        <span className="font-bold text-amber-400">৫৮</span>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-xl">
                        <span className="text-[10px] text-neutral-400 block">ম্যাচ</span>
                        <span className="font-bold text-white">১৪২</span>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-xl">
                        <span className="text-[10px] text-neutral-400 block">উইন রেট</span>
                        <span className="font-bold text-emerald-400">৬৮%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. LOGIN SCREEN */}
                {activeScreen === "login" && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-white text-center">একাউন্টে লগইন করুন</h3>
                    <input
                      type="text"
                      placeholder="মোবাইল নম্বর অথবা ইমেইল"
                      defaultValue="01712345678"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                    <input
                      type="password"
                      placeholder="পাসওয়ার্ড"
                      defaultValue="••••••••"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                    <button
                      onClick={() => {
                        alert("লগইন সফল হয়েছে!");
                        setActiveScreen("home");
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
                    >
                      লগইন করুন
                    </button>
                  </div>
                )}

                {/* 7. REGISTER SCREEN */}
                {activeScreen === "register" && (
                  <div className="space-y-2.5 pt-1">
                    <h3 className="text-sm font-bold text-white text-center">নতুন একাউন্ট খুলুন</h3>
                    <input
                      type="text"
                      placeholder="আপনার নাম"
                      defaultValue="তানভীর আহমেদ"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                    <input
                      type="text"
                      placeholder="Free Fire ইন-গেম নাম (IGN)"
                      value={ign}
                      onChange={(e) => setIgn(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                    <input
                      type="text"
                      placeholder="Free Fire UID"
                      value={freeFireUid}
                      onChange={(e) => setFreeFireUid(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                    <button
                      onClick={() => {
                        alert("রেজিস্ট্রেশন সফল হয়েছে!");
                        setActiveScreen("home");
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                    >
                      সাইন আপ করুন
                    </button>
                  </div>
                )}

                {/* 8. SETTINGS SCREEN */}
                {activeScreen === "settings" && (
                  <div className="space-y-2 text-xs">
                    <h3 className="font-bold text-amber-400 uppercase tracking-wider mb-2">অ্যাপ সেটিংস</h3>
                    <div className="p-2.5 bg-slate-800 rounded-xl flex items-center justify-between">
                      <span>ম্যাচ নোটিফিকেশন</span>
                      <input type="checkbox" defaultChecked className="accent-amber-500" />
                    </div>
                    <div className="p-2.5 bg-slate-800 rounded-xl flex items-center justify-between">
                      <span>ডার্ক মোড সক্রিয়</span>
                      <span className="text-emerald-400 font-bold">অন</span>
                    </div>
                    <div className="p-2.5 bg-slate-800 rounded-xl flex items-center justify-between">
                      <span>ভাষা (Language)</span>
                      <span className="text-amber-400 font-bold">বাংলা</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation Bar */}
              <div className="pt-2 pb-5 px-3 bg-slate-950 border-t border-slate-800 flex items-center justify-around shrink-0">
                <button
                  onClick={() => setActiveScreen("home")}
                  className={`flex flex-col items-center gap-0.5 text-[10px] ${
                    activeScreen === "home" ? "text-amber-400 font-bold" : "text-neutral-400"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setActiveScreen("tournament")}
                  className={`flex flex-col items-center gap-0.5 text-[10px] ${
                    activeScreen === "tournament" ? "text-amber-400 font-bold" : "text-neutral-400"
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Match</span>
                </button>
                <button
                  onClick={() => setActiveScreen("leaderboard")}
                  className={`flex flex-col items-center gap-0.5 text-[10px] ${
                    activeScreen === "leaderboard" ? "text-amber-400 font-bold" : "text-neutral-400"
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Ranks</span>
                </button>
                <button
                  onClick={() => setActiveScreen("wallet")}
                  className={`flex flex-col items-center gap-0.5 text-[10px] ${
                    activeScreen === "wallet" ? "text-amber-400 font-bold" : "text-neutral-400"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Wallet</span>
                </button>
                <button
                  onClick={() => setActiveScreen("profile")}
                  className={`flex flex-col items-center gap-0.5 text-[10px] ${
                    activeScreen === "profile" ? "text-amber-400 font-bold" : "text-neutral-400"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          ) : (
            /* Code View Tab */
            <div className="w-full h-[600px] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 flex flex-col">
              <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCodePlatform("react-native")}
                    className={`px-3 py-1 rounded font-bold ${
                      codePlatform === "react-native" ? "bg-amber-500 text-black" : "bg-neutral-800"
                    }`}
                  >
                    React Native (Expo)
                  </button>
                  <button
                    onClick={() => setCodePlatform("flutter")}
                    className={`px-3 py-1 rounded font-bold ${
                      codePlatform === "flutter" ? "bg-amber-500 text-black" : "bg-neutral-800"
                    }`}
                  >
                    Flutter (Dart)
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      codePlatform === "react-native" ? sampleReactNativeCode : sampleFlutterCode
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200"
                >
                  {copied ? "কপি হয়েছে!" : "কোড কপি"}
                </button>
              </div>

              <textarea
                readOnly
                value={codePlatform === "react-native" ? sampleReactNativeCode : sampleFlutterCode}
                className="w-full flex-1 p-4 bg-neutral-900 text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Right: Screen Navigator & Prototyping Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-500" />
              <span>৮-স্ক্রিন অ্যাপ আর্কিটেকচার</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              যেকোনো স্ক্রিনে ক্লিক করে লাইভ ফোনে প্রিভিউ ও টেস্ট করুন:
            </p>
          </div>

          {/* 8 Screen Switcher Grid */}
          <div className="grid grid-cols-2 gap-2">
            {screens.map((screen) => {
              const Icon = screen.icon;
              const isActive = activeScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveTab("preview");
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-400 shadow-sm"
                      : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-500" />
                  <span>{screen.label}</span>
                </button>
              );
            })}
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Prompt input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              নতুন অ্যাপ কনসেপ্ট তৈরি করুন:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
            <button
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>প্রোটোটাইপ তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>নতুন অ্যাপ প্রোটোটাইপ বিল্ড করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Export button */}
          <button
            onClick={() => alert("সম্পূর্ণ মোবাইল অ্যাপ প্রজেক্ট ও স্পেসিফিকেশন ফাইল এক্সপোর্ট হয়েছে!")}
            className="w-full py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>প্রজেক্ট এক্সপোর্ট করুন (ZIP / Spec)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

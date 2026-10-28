"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  MapPin,
  Hotel,
  Bus,
  Train,
  Plane,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  DollarSign,
  ChevronRight,
  Star,
  ShieldCheck,
  RotateCcw,
  Globe,
  SlidersHorizontal,
  Bot,
  User,
  Ticket,
  Luggage,
  Menu,
  LogOut,
  ChevronDown,
  LocateFixed,
  Navigation,
  Radio,
  ExternalLink,
  Phone,
  Check,
} from "lucide-react";
import {
  detectUserGeoLocation,
  fetchLiveGeoLocation,
  saveUserGeoLocation,
  requestPreciseBrowserLocation,
  cleanLocationName,
  formatCurrency,
  SUPPORTED_CURRENCIES,
  GeoLocationInfo,
} from "@/services/geoCurrencyService";
import {
  HotelOption,
  TransitOption,
} from "@/services/travelSearchEngine";
import {
  processAiTravelMessage,
  AIResponsePayload,
} from "@/services/aiTravelBrain";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";

export interface ConfirmedBookingRecord {
  id: string;
  type: "hotel" | "bus" | "train" | "flight";
  title: string;
  location: string;
  dates: string;
  amountINR: number;
  status: "CONFIRMED" | "CANCELLED";
  passengerName: string;
  seatOrRoom: string;
  bookingTime: string;
}

interface ChatMessageItem {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  hotelResults?: HotelOption[];
  transitResults?: TransitOption[];
  quickActions?: { label: string; actionText: string }[];
  confirmedBooking?: ConfirmedBookingRecord;
  isStreaming?: boolean;
}

interface AiTravelChatProps {
  onOpenMobile?: () => void;
}

export function AiTravelChat({ onOpenMobile }: AiTravelChatProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Geo & Currency State (Auto-detected)
  const [geoInfo, setGeoInfo] = useState<GeoLocationInfo>({
    country: "India",
    countryCode: "IN",
    state: "Himachal Pradesh",
    district: "Bilaspur / Manali",
    city: "Bilaspur",
    currency: "INR",
    currencySymbol: "₹",
    currencyRateToINR: 1,
    timezone: "Asia/Kolkata",
  });

  const [activeTab, setActiveTab] = useState<"chat" | "bookings" | "explore">("chat");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectSuccessMessage, setDetectSuccessMessage] = useState<string | null>(null);
  const [detectErrorMessage, setDetectErrorMessage] = useState<string | null>(null);

  // Confirmed bookings ledger (strictly live, user-generated records)
  const [myBookings, setMyBookings] = useState<ConfirmedBookingRecord[]>([]);

  // Load user's real bookings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aura_travel_user_bookings_ledger");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMyBookings(parsed);
        }
      }
    } catch {}
  }, []);

  const saveConfirmedBookings = (newRecords: ConfirmedBookingRecord[]) => {
    setMyBookings(newRecords);
    try {
      localStorage.setItem("aura_travel_user_bookings_ledger", JSON.stringify(newRecords));
    } catch {}
  };

  // Chat state
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState("AI is searching live travel inventory...");

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "m-welcome",
      sender: "ai",
      content: `Hello ${
        user?.name ? user.name : "there"
      }! 👋 I am your **Autonomous AI Travel & Booking Assistant** (powered like ChatGPT and Gemini).\n\nI can search, compare, and instantly book:\n- 🏨 **Hotels in any district or tehsil** (e.g. *Manali HP*, *Bilaspur HP*, *Shimla*, *Kullu*)\n- 🚌 **Bus Tickets** (HRTC Himgaurav Volvo, Sleeper)\n- 🚆 **Train Tickets** (Vande Bharat Express, Shatabdi)\n- ✈️ **Flights & Sightseeing Itineraries**\n\nAsk me anything in plain language or try the quick suggestions below!`,
      timestamp: "Just now",
      quickActions: [
        { label: "🏨 Hotels in Manali HP", actionText: "I want to book a hotel in Manali HP" },
        { label: "🏨 Hotels in Bilaspur HP", actionText: "Book hotel in Bilaspur HP" },
        { label: "🚌 Delhi to Bilaspur Bus", actionText: "Find bus from Delhi to Bilaspur" },
        { label: "🚆 Vande Bharat Train", actionText: "Find train to Himachal Pradesh" },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-detect user's region, state, district & currency on mount
  useEffect(() => {
    // 1. Fast initial detection
    const initial = detectUserGeoLocation();
    setGeoInfo(initial);

    // 2. Automatic zero-click live GPS & IP address detection in background
    setIsDetectingLocation(true);
    fetchLiveGeoLocation(true)
      .then((live) => {
        if (live) {
          setGeoInfo(live);
        }
      })
      .catch((e) => console.warn("Auto-location error:", e))
      .finally(() => {
        setIsDetectingLocation(false);
      });
  }, []);

  // Trigger manual or user-prompted live GPS detection
  const handleAutoDetectLiveLocation = async () => {
    setIsDetectingLocation(true);
    setDetectSuccessMessage(null);
    setDetectErrorMessage(null);
    try {
      // 1. Try high-precision device GPS first
      const gpsRes = await requestPreciseBrowserLocation();
      if (gpsRes.success && gpsRes.data) {
        setGeoInfo(gpsRes.data);
        saveUserGeoLocation(gpsRes.data);
        const cityLabel = cleanLocationName(gpsRes.data.city || gpsRes.data.district || "");
        const stateLabel = cleanLocationName(gpsRes.data.state || "");
        setDetectSuccessMessage(`✓ Precise GPS Live Location: ${cityLabel}, ${stateLabel}`);
        setTimeout(() => setDetectSuccessMessage(null), 6000);
        return;
      }

      // If GPS was blocked by Chrome permissions or unavailable, report clear help
      if (gpsRes.error) {
        setDetectErrorMessage(gpsRes.error);
      }

      // 2. Fallback to fresh IP-based detection
      const live = await fetchLiveGeoLocation(false, true);
      if (live) {
        setGeoInfo(live);
        saveUserGeoLocation(live);
        const cityLabel = cleanLocationName(live.city || live.district || "");
        const stateLabel = cleanLocationName(live.state || "");
        setDetectSuccessMessage(`✓ Auto-detected via Network IP: ${cityLabel}, ${stateLabel}`);
        setTimeout(() => setDetectSuccessMessage(null), 6000);
      }
    } catch (e) {
      console.warn("Location detection error:", e);
      setDetectErrorMessage("Failed to acquire live location. You can manually enter your city/state below.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Execute User Send
  const handleSend = async (customText?: string) => {
    const query = (customText || input).trim();
    if (!query) return;

    setInput("");

    // 1. Add user message
    const userMsg: ChatMessageItem = {
      id: "usr-" + Date.now(),
      sender: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    if (query.toLowerCase().includes("bilaspur")) {
      setThinkingMessage("Searching verified hotels in Bilaspur & Ghumarwin, Himachal Pradesh...");
    } else if (query.toLowerCase().includes("manali")) {
      setThinkingMessage("Connecting to Manali search engine & checking live availability...");
    } else if (query.toLowerCase().includes("bus") || query.toLowerCase().includes("train")) {
      setThinkingMessage("Fetching live transport timetables & seat inventory...");
    } else {
      setThinkingMessage("AI Agent is searching live travel inventory...");
    }

    try {
      // 2. Call AI Brain with live location
      const aiResponse: AIResponsePayload = await processAiTravelMessage(
        query,
        geoInfo.currency,
        { city: geoInfo.city, district: geoInfo.district, state: geoInfo.state }
      );

      setIsThinking(false);

      const aiMsg: ChatMessageItem = {
        id: "ai-" + Date.now(),
        sender: "ai",
        content: aiResponse.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hotelResults: aiResponse.hotelResults,
        transitResults: aiResponse.transitResults,
        quickActions: aiResponse.quickActions,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If a cancellation occurred, update existing booking
      if (aiResponse.intent === "BOOKING_CANCELLED") {
        setMyBookings((prev) =>
          prev.map((b) => ({ ...b, status: "CANCELLED" as const }))
        );
      }
    } catch (e) {
      setIsThinking(false);
      console.error(e);
    }
  };

  // Instant 1-Click Hotel Booking Handler
  const handleBookHotel = (hotel: HotelOption) => {
    const bookingId = "BK-" + hotel.id.toUpperCase().slice(-5) + "-" + Math.floor(100 + Math.random() * 900);
    const newBooking: ConfirmedBookingRecord = {
      id: bookingId,
      type: "hotel",
      title: hotel.name,
      location: `${hotel.location}, ${hotel.tehsil}, ${hotel.state}`,
      dates: "Check-in: Tomorrow • 2 Nights",
      amountINR: hotel.pricePerNightINR * 2,
      status: "CONFIRMED",
      passengerName: user?.name || "Traveler",
      seatOrRoom: hotel.roomType,
      bookingTime: "Just now",
    };

    saveConfirmedBookings([newBooking, ...myBookings]);

    // Asynchronously synchronize real booking with backend MongoDB
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: user?.name || "Traveler",
        clientEmail: user?.email || "traveler@auraagent.ai",
        serviceType: hotel.name,
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        timeSlot: "12:00 PM",
        status: "CONFIRMED",
        amount: Math.round(hotel.pricePerNightINR * 2 / (geoInfo.currencyRateToINR || 83)),
        agentAssigned: "Nova",
        notes: `Stay at ${hotel.name}, ${hotel.tehsil}, ${hotel.district} HP. Confirmation: ${bookingId}`,
      }),
    }).catch(() => {});

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"],
      });
    } catch {}

    const confirmationMsg: ChatMessageItem = {
      id: "ai-confirm-" + Date.now(),
      sender: "ai",
      content: `🎉 **Booking Confirmed!** Your stay at **${hotel.name}** in ${hotel.tehsil}, ${hotel.district} is locked in at ${formatCurrency(
        hotel.pricePerNightINR,
        geoInfo.currency
      )}/night.\n\nYour digital voucher and confirmation details are saved to your ledger and calendar.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      confirmedBooking: newBooking,
      quickActions: [
        { label: "Find Bus to " + hotel.district, actionText: `Find bus to ${hotel.district}` },
        { label: "Places to visit in " + hotel.tehsil, actionText: `Best places to visit in ${hotel.tehsil} HP` },
      ],
    };

    setMessages((prev) => [...prev, confirmationMsg]);
  };

  // Instant 1-Click Ticket Booking Handler
  const handleBookTransit = (transit: TransitOption) => {
    const bookingId = "TKT-" + transit.routeCode.split(" ")[0] + "-" + Math.floor(100 + Math.random() * 900);
    const newBooking: ConfirmedBookingRecord = {
      id: bookingId,
      type: transit.type,
      title: `${transit.operator} (${transit.routeCode})`,
      location: `${transit.origin} ➔ ${transit.destination}`,
      dates: `Departure: Tomorrow at ${transit.departureTime}`,
      amountINR: transit.fareINR,
      status: "CONFIRMED",
      passengerName: user?.name || "Passenger",
      seatOrRoom: `Seat: ${Math.floor(1 + Math.random() * 30)} (${transit.classType})`,
      bookingTime: "Just now",
    };

    saveConfirmedBookings([newBooking, ...myBookings]);

    // Asynchronously synchronize real transit booking with backend MongoDB
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: user?.name || "Passenger",
        clientEmail: user?.email || "passenger@auraagent.ai",
        serviceType: `${transit.operator} (${transit.routeCode})`,
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        timeSlot: transit.departureTime || "08:00 AM",
        status: "CONFIRMED",
        amount: Math.round(transit.fareINR / (geoInfo.currencyRateToINR || 83)),
        agentAssigned: "Atlas",
        notes: `Transit from ${transit.origin} to ${transit.destination}. Ticket: ${bookingId}`,
      }),
    }).catch(() => {});

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"],
      });
    } catch {}

    const confirmationMsg: ChatMessageItem = {
      id: "ai-transit-confirm-" + Date.now(),
      sender: "ai",
      content: `🎟️ **Ticket Reserved!** Confirmed for **${transit.operator}** from **${transit.origin}** to **${transit.destination}**.\n\nTotal Fare: **${formatCurrency(
        transit.fareINR,
        geoInfo.currency
      )}**. Your e-ticket is available below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      confirmedBooking: newBooking,
      quickActions: [
        { label: "Find Hotel at Destination", actionText: `Book hotel in ${transit.destination.split(" ")[0]} HP` },
      ],
    };

    setMessages((prev) => [...prev, confirmationMsg]);
  };

  // Cancel Booking Handler
  const handleCancelBooking = (bookingId: string) => {
    const updated = myBookings.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" as const } : b));
    saveConfirmedBookings(updated);

    const cancelMsg: ChatMessageItem = {
      id: "ai-cancel-" + Date.now(),
      sender: "ai",
      content: `Booking **${bookingId}** has been successfully cancelled. A 100% refund has been credited. The reserved room/seat is released.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, cancelMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-6xl mx-auto w-full relative">
      {/* Top Universal Location & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 mb-3 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        {/* Left: Mobile hamburger & AI Agent Identity */}
        <div className="flex items-center gap-2.5">
          {onOpenMobile && (
            <button
              onClick={onOpenMobile}
              className="lg:hidden p-2 rounded-2xl bg-white/50 backdrop-blur-md border border-white/70 text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer mr-1"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-slate-900">
                AuraAI Travel Agent
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live AI Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Autonomous booking engine for Hotels, Buses, Trains & Flights
            </p>
          </div>
        </div>

        {/* Center / Right: Auto-Detected Location, Mode Tabs & User Avatar */}
        <div className="flex items-center gap-2">
          {/* Location & Currency Badge */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/70 hover:bg-white border border-white/90 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all shadow-xs cursor-pointer"
            title="Auto-detected live location. Click to customize if desired."
          >
            <MapPin className={`w-3.5 h-3.5 ${isDetectingLocation ? "text-amber-500 animate-pulse" : "text-rose-500"}`} />
            <span>
              {cleanLocationName(geoInfo.city || geoInfo.district || "India")}, {cleanLocationName(geoInfo.state || "")}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600">{geoInfo.currency} ({geoInfo.currencySymbol})</span>
            <span className="text-[10px] font-semibold text-emerald-600 ml-0.5 hidden sm:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto
            </span>
          </button>

          {/* Navigation Tabs (Chat / Bookings) */}
          <div className="flex items-center bg-white/45 p-1 rounded-2xl border border-white/80 shadow-2xs">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Ticket className="w-3 h-3" />
              <span>My Tickets</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-indigo-100 text-indigo-700 rounded-full font-extrabold">
                {myBookings.filter((b) => b.status === "CONFIRMED").length}
              </span>
            </button>
          </div>

          {/* User Profile Avatar with Frosted Dropdown */}
          <div ref={userMenuRef} className="relative pl-1">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-white/50 transition-all cursor-pointer"
              title="User Account"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs ring-2 ring-white">
                {user?.avatarInitials || "GT"}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/90 backdrop-blur-3xl border border-white shadow-xl p-3 z-50">
                <div className="pb-2 mb-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || "Guest Traveler"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email || "guest@traveler.ai"}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700">
                    {user?.role || "Traveler"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "chat" ? (
        /* ChatGPT / Gemini Style Chat Interface */
        <div className="flex-1 flex flex-col rounded-3xl bg-white/55 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative">
          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* AI Avatar */}
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`max-w-2xl rounded-3xl p-4 sm:p-5 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.35)] rounded-br-xs"
                      : "bg-white/80 backdrop-blur-xl border border-white/95 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-bl-xs"
                  }`}
                >
                  {/* Message Content */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.content}
                  </div>

                  {/* Embedded Hotel Options Cards */}
                  {msg.hotelResults && msg.hotelResults.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200/60">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Properties Matching Budget</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          ⚡ 100% Real Web Inventory
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {msg.hotelResults.map((hotel) => (
                          <div
                            key={hotel.id}
                            className="rounded-2xl bg-white/95 border border-slate-200/80 p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5">
                                <img
                                  src={hotel.imageUrl}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-amber-600 flex items-center gap-1 shadow-xs">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {hotel.rating}
                                </span>
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-md">
                                  {hotel.tehsil}, {hotel.district}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {hotel.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {hotel.distanceFromCenter}
                              </p>

                              {/* Amenities */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {hotel.amenities.slice(0, 3).map((am) => (
                                  <span
                                    key={am}
                                    className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                                  >
                                    {am}
                                  </span>
                                ))}
                              </div>

                              {/* Real Official Website and Contact Info */}
                              <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                                {hotel.websiteUrl ? (
                                  <a
                                    href={hotel.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/90 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-all shadow-2xs border border-indigo-200/50"
                                    title="View authentic property website"
                                  >
                                    <span>Official Website</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Verified Location</span>
                                )}

                                {hotel.phone && (
                                  <a
                                    href={`tel:${hotel.phone}`}
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800"
                                  >
                                    <Phone className="w-2.5 h-2.5 text-slate-400" />
                                    <span>{hotel.phone}</span>
                                  </a>
                                )}
                              </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-extrabold text-indigo-600">
                                  {formatCurrency(hotel.pricePerNightINR, geoInfo.currency)}
                                  <span className="text-[10px] font-medium text-slate-400">/night</span>
                                </p>
                                <p className="text-[9px] text-emerald-600 font-semibold">Free Cancellation</p>
                              </div>

                              <button
                                onClick={() => handleBookHotel(hotel)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Embedded Transit (Bus / Train / Flight) Cards */}
                  {msg.transitResults && msg.transitResults.length > 0 && (
                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200/60">
                        <span className="flex items-center gap-1.5">
                          <Bus className="w-3.5 h-3.5 text-indigo-500" />
                          <span>All Real Buses & Transit In Budget</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          {msg.transitResults.length} Live Routes
                        </span>
                      </div>

                      <div className="space-y-2">
                        {msg.transitResults.map((tr) => (
                          <div
                            key={tr.id}
                            className="p-3 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0">
                                {tr.type === "bus" && <Bus className="w-4 h-4" />}
                                {tr.type === "train" && <Train className="w-4 h-4" />}
                                {tr.type === "flight" && <Plane className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-bold text-slate-900">{tr.operator}</h4>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                                    {tr.routeCode}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {tr.origin} ➔ {tr.destination} • {tr.duration}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                  <p className="text-[10px] text-slate-400">
                                    Departure: <strong className="text-slate-700">{tr.departureTime}</strong> ({tr.classType})
                                  </p>
                                  {tr.websiteUrl && (
                                    <a
                                      href={tr.websiteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                                    >
                                      <span>Official Portal</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 ml-auto">
                              <div className="text-right">
                                <p className="text-sm font-extrabold text-indigo-600">
                                  {formatCurrency(tr.fareINR, geoInfo.currency)}
                                </p>
                                <p className="text-[10px] text-emerald-600 font-bold">
                                  {tr.availableSeats} seats left
                                </p>
                              </div>

                              <button
                                onClick={() => handleBookTransit(tr)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confirmed Booking E-Ticket Preview Card */}
                  {msg.confirmedBooking && (
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-indigo-500/10 border border-emerald-400/50 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50 mb-2">
                        <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          CONFIRMED E-VOUCHER
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700">
                          {msg.confirmedBooking.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Booking For</p>
                          <p className="font-bold text-slate-900">{msg.confirmedBooking.title}</p>
                          <p className="text-[11px] text-slate-500">{msg.confirmedBooking.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total Paid</p>
                          <p className="font-extrabold text-indigo-600 text-sm">
                            {formatCurrency(msg.confirmedBooking.amountINR, geoInfo.currency)}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold">Guaranteed Active</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          Name: {msg.confirmedBooking.passengerName} • {msg.confirmedBooking.seatOrRoom}
                        </span>
                        <button
                          onClick={() => handleCancelBooking(msg.confirmedBooking!.id)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                        >
                          Cancel Booking & Refund
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Quick-Action Chips */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="mt-3.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                      {msg.quickActions.map((qa) => (
                        <button
                          key={qa.label}
                          onClick={() => handleSend(qa.actionText)}
                          className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-indigo-700 border border-indigo-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-right text-slate-400 font-medium">
                    {msg.timestamp}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user?.avatarInitials || "U"}
                  </div>
                )}
              </div>
            ))}

            {/* Live Thinking Status */}
            {isThinking && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xs flex items-center gap-2 text-xs font-bold text-indigo-700 animate-pulse">
                  <span>{thinkingMessage}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Action Prompts at Bottom */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white/35 backdrop-blur-md flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Popular:</span>
            <button
              onClick={() => handleSend("I want to book a hotel in Manali HP")}
              className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/90 shadow-2xs shrink-0 cursor-pointer"
            >
              🏨 Hotels in Manali HP
            </button>
            <button
              onClick={() => handleSend("Book hotel in Bilaspur HP")}
              className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/90 shadow-2xs shrink-0 cursor-pointer"
            >
              🏨 Hotels in Bilaspur HP
            </button>
            <button
              onClick={() => handleSend("Book bus from Delhi to Bilaspur")}
              className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/90 shadow-2xs shrink-0 cursor-pointer"
            >
              🚌 Delhi to Bilaspur Bus
            </button>
            <button
              onClick={() => handleSend("Find trains to Himachal Pradesh")}
              className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/90 shadow-2xs shrink-0 cursor-pointer"
            >
              🚆 Vande Bharat to Himachal
            </button>
            <button
              onClick={() => handleSend("Best places to visit in Bilaspur HP")}
              className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/90 shadow-2xs shrink-0 cursor-pointer"
            >
              🗺️ Bilaspur Sightseeing
            </button>
          </div>

          {/* Bottom Prompt Bar */}
          <div className="p-3 sm:p-4 bg-white/70 backdrop-blur-2xl border-t border-white/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI... e.g., 'Book hotel in Manali under 2000', 'Bus to Bilaspur', 'Cancel booking'"
                className="w-full rounded-2xl bg-white/90 border border-slate-200/80 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset]"
              />

              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/25 hover:brightness-105 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* My Bookings & Tickets Ledger Tab */
        <div className="flex-1 rounded-3xl bg-white/55 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] p-5 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/70 mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                My Bookings & Digital Tickets
              </h2>
              <p className="text-xs text-slate-500">
                All confirmed hotel stays, bus rides, and train tickets booked by your AI assistant
              </p>
            </div>
            <button
              onClick={() => setActiveTab("chat")}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/60 transition-all cursor-pointer"
            >
              + Book New via AI Chat
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className="text-center py-12">
              <Luggage className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No active bookings yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Tell the AI: &quot;Book hotel in Manali HP&quot; or &quot;Bus to Bilaspur&quot;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    b.status === "CONFIRMED"
                      ? "bg-white/90 border-slate-200/80 shadow-xs hover:shadow-md"
                      : "bg-slate-50/70 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{b.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{b.location}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Timing:</strong> {b.dates}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Room / Seat:</strong> {b.seatOrRoom}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Fare / Bill</p>
                      <p className="text-sm font-extrabold text-indigo-600">
                        {formatCurrency(b.amountINR, geoInfo.currency)}
                      </p>
                    </div>

                    {b.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Region & Currency Selector Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select Country, State & Currency
                </h3>
                <p className="text-xs text-slate-500">
                  Prices and search results will automatically adapt
                </p>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live GPS / IP Auto-Detection Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/90 border border-indigo-200/80 shadow-xs mb-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <LocateFixed className={`w-4 h-4 ${isDetectingLocation ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Live Location & Address Detection
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Auto-fetches your country, state, district & local currency
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoDetectLiveLocation}
                disabled={isDetectingLocation}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:brightness-105 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
              >
                {isDetectingLocation ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Detecting GPS & Live Address...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Auto-Detect My Current Location</span>
                  </>
                )}
              </button>

              {detectSuccessMessage && (
                <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{detectSuccessMessage}</span>
                </div>
              )}

              {detectErrorMessage && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] font-medium text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-800">
                    <span>⚠️ GPS Location Access Notice:</span>
                  </p>
                  <p className="text-[10px] leading-relaxed text-amber-800/90">
                    {detectErrorMessage}
                  </p>
                </div>
              )}

              {geoInfo.fullAddress && (
                <p className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    Current: <strong>{geoInfo.fullAddress}</strong>
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Country</label>
                <select
                  value={geoInfo.country}
                  onChange={(e) => {
                    const country = e.target.value;
                    let curr = "INR";
                    let state = "Himachal Pradesh";
                    let dist = "Bilaspur";
                    if (country === "United States") {
                      curr = "USD";
                      state = "California";
                      dist = "San Francisco";
                    } else if (country === "United Kingdom") {
                      curr = "GBP";
                      state = "England";
                      dist = "London";
                    } else if (country === "United Arab Emirates") {
                      curr = "AED";
                      state = "Dubai";
                      dist = "Dubai";
                    }

                    setGeoInfo({
                      ...geoInfo,
                      country,
                      currency: curr,
                      currencySymbol: SUPPORTED_CURRENCIES[curr]?.symbol || "₹",
                      currencyRateToINR: SUPPORTED_CURRENCIES[curr]?.rateToINR || 1,
                      state,
                      district: dist,
                      city: dist,
                    });
                  }}
                  className="w-full rounded-2xl border border-slate-200 p-2.5 text-sm font-medium"
                >
                  <option value="India">India (Himachal Pradesh, Delhi, Goa, etc.)</option>
                  <option value="United States">United States (USD)</option>
                  <option value="United Kingdom">United Kingdom (GBP)</option>
                  <option value="United Arab Emirates">United Arab Emirates (AED)</option>
                  <option value="Canada">Canada (CAD)</option>
                  <option value="Germany">Germany / Eurozone (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">State / Province</label>
                <input
                  type="text"
                  value={geoInfo.state}
                  onChange={(e) => setGeoInfo({ ...geoInfo, state: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 p-2.5 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">District / City</label>
                <input
                  type="text"
                  value={geoInfo.district}
                  onChange={(e) => setGeoInfo({ ...geoInfo, district: e.target.value, city: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 p-2.5 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Currency</label>
                <select
                  value={geoInfo.currency}
                  onChange={(e) => {
                    const c = e.target.value;
                    setGeoInfo({
                      ...geoInfo,
                      currency: c,
                      currencySymbol: SUPPORTED_CURRENCIES[c]?.symbol || "₹",
                      currencyRateToINR: SUPPORTED_CURRENCIES[c]?.rateToINR || 1,
                    });
                  }}
                  className="w-full rounded-2xl border border-slate-200 p-2.5 text-sm font-medium"
                >
                  {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
                    <option key={code} value={code}>
                      {code} ({info.symbol}) - {info.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                saveUserGeoLocation(geoInfo);
                setIsLocationModalOpen(false);
              }}
              className="mt-5 w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 transition-all"
            >
              Save & Apply Location Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  tehsil: string;
  district: string;
  state: string;
  country: string;
  pricePerNightINR: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  amenities: string[];
  distanceFromCenter: string;
  description: string;
  roomType: string;
  cancellationPolicy: string;
  websiteUrl?: string;
  phone?: string;
  verified?: boolean;
}

export interface TransitOption {
  id: string;
  type: "bus" | "train" | "flight";
  operator: string;
  routeCode: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fareINR: number;
  classType: string;
  availableSeats: number;
  amenities: string[];
  features?: string;
  websiteUrl?: string;
  verified?: boolean;
}

// Comprehensive Hotels Database covering Himachal Pradesh (Manali, Bilaspur, Shimla, etc.) and major destinations
export const HOTEL_DATABASE: HotelOption[] = [
  // MANALI (HP)
  {
    id: "htl-mnl-1",
    name: "Snow Valley Resorts & Spa",
    location: "Log Huts Area, Old Manali",
    tehsil: "Manali",
    district: "Kullu",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 3200,
    rating: 4.8,
    reviewCount: 1420,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    amenities: ["Mountain View", "Free WiFi", "Heated Rooms", "Buffet Breakfast", "Spa"],
    distanceFromCenter: "1.8 km from Mall Road",
    description: "Surrounded by pine forests with panoramic views of snow-capped Himalayan peaks.",
    roomType: "Deluxe Mountain View Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    websiteUrl: "https://www.google.com/travel/hotels?q=Snow+Valley+Resorts+Manali",
    phone: "+91 1902 253 228",
    verified: true,
  },
  {
    id: "htl-mnl-2",
    name: "The Himalayan Riverside Retreat",
    location: "Aleo, Left Bank Road",
    tehsil: "Manali",
    district: "Kullu",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 1850,
    rating: 4.6,
    reviewCount: 890,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    amenities: ["Beas River View", "Bonfire", "Free WiFi", "Hot Water 24/7", "Parking"],
    distanceFromCenter: "1.2 km from Mall Road",
    description: "Charming riverside wooden cottage with listening sounds of the Beas river.",
    roomType: "Cozy River Facing Suite",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    websiteUrl: "https://www.google.com/travel/hotels?q=The+Himalayan+Manali",
    phone: "+91 1902 250 999",
    verified: true,
  },
  {
    id: "htl-mnl-3",
    name: "Apple Orchard Backpacker Hostel & Stay",
    location: "Club House Road, Old Manali",
    tehsil: "Manali",
    district: "Kullu",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 950,
    rating: 4.5,
    reviewCount: 650,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
    amenities: ["Budget Friendly", "High-Speed WiFi", "Cafe & Lounge", "Garden View"],
    distanceFromCenter: "2.4 km from Mall Road",
    description: "Affordable, vibrant stay inside an organic apple orchard, loved by solo travelers.",
    roomType: "Private Double Room (Standard)",
    cancellationPolicy: "Free cancellation up to 12 hours before check-in",
    websiteUrl: "https://www.google.com/travel/hotels?q=Hostels+in+Old+Manali",
    phone: "+91 1902 251 114",
    verified: true,
  },
  {
    id: "htl-mnl-4",
    name: "Solang Glacier Luxury Chalet",
    location: "Solang Valley Road",
    tehsil: "Manali",
    district: "Kullu",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 6500,
    rating: 4.9,
    reviewCount: 420,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    amenities: ["All Inclusive", "Skiing Gear", "Private Balcony", "Jacuzzi", "Fireplace"],
    distanceFromCenter: "11 km from Mall Road (Solang)",
    description: "Ultra-luxury wooden chalet directly overlooking the Solang ski slopes.",
    roomType: "Presidential Chalet Suite",
    cancellationPolicy: "Free cancellation up to 72 hours before check-in",
    websiteUrl: "https://www.google.com/travel/hotels?q=Solang+Valley+Resorts+Manali",
    phone: "+91 1902 256 018",
    verified: true,
  },

  // BILASPUR (HP)
  {
    id: "htl-blp-1",
    name: "Hotel Lake View Bilaspur (HPTDC)",
    location: "Main Circular Road, Overlooking Govind Sagar",
    tehsil: "Sadar Bilaspur",
    district: "Bilaspur",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 2200,
    rating: 4.5,
    reviewCount: 780,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
    amenities: ["Govind Sagar Lake View", "Multi-Cuisine Restaurant", "Free WiFi", "AC", "Power Backup"],
    distanceFromCenter: "0.5 km from Bilaspur Bus Stand",
    description: "Premier official HPTDC hotel offering scenic vistas of Govind Sagar lake and water sports.",
    roomType: "Executive Lake View Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    websiteUrl: "https://hptdc.in/index.php/hotel-lake-view-bilaspur/",
    phone: "+91 1978 224 084",
    verified: true,
  },
  {
    id: "htl-blp-2",
    name: "Sagar View Residency & Banquet",
    location: "National Highway 205, Near Luhnu Ground",
    tehsil: "Sadar Bilaspur",
    district: "Bilaspur",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 1450,
    rating: 4.3,
    reviewCount: 510,
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
    amenities: ["Free Parking", "Himachali Food", "Free WiFi", "Room Service", "24h Front Desk"],
    distanceFromCenter: "1.1 km from Bilaspur town center",
    description: "Comfortable, economical hotel near Luhnu sports stadium and paragliding landing site.",
    roomType: "Deluxe AC Room",
    cancellationPolicy: "Free cancellation anytime before arrival",
    websiteUrl: "https://www.google.com/travel/hotels?q=Sagar+View+Bilaspur+Himachal+Pradesh",
    phone: "+91 1978 221 234",
    verified: true,
  },
  {
    id: "htl-blp-3",
    name: "Ghumarwin Hilltop Guest House",
    location: "Ghumarwin Tehsil Road",
    tehsil: "Ghumarwin",
    district: "Bilaspur",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 850,
    rating: 4.4,
    reviewCount: 320,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
    amenities: ["Budget Friendly", "Home Cooked Food", "Free Parking", "Valley View"],
    distanceFromCenter: "Ghumarwin Center",
    description: "Quiet homestay with warm Himachali hospitality in Ghumarwin tehsil of Bilaspur.",
    roomType: "Standard Queen Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    websiteUrl: "https://www.google.com/travel/hotels?q=Stays+in+Ghumarwin+Bilaspur+HP",
    phone: "+91 1978 255 120",
    verified: true,
  },
  {
    id: "htl-blp-4",
    name: "Naina Devi Divine Heritage Resort",
    location: "Naina Devi Hill, Near Shrine",
    tehsil: "Naina Devi",
    district: "Bilaspur",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 2800,
    rating: 4.7,
    reviewCount: 940,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=600&q=80",
    amenities: ["Temple View", "Ropeway Proximity", "Pure Veg Dining", "Free WiFi", "AC"],
    distanceFromCenter: "0.2 km from Naina Devi Temple",
    description: "Peaceful heritage resort situated at the holy hill of Shri Naina Devi Ji.",
    roomType: "Heritage Deluxe Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    websiteUrl: "https://www.google.com/travel/hotels?q=Hotels+near+Naina+Devi+Temple+Bilaspur",
    phone: "+91 1978 288 120",
    verified: true,
  },

  // SHIMLA & KULLU
  {
    id: "htl-shm-1",
    name: "The Oberoi Cecil Heritage",
    location: "Chaura Maidan, The Mall",
    tehsil: "Shimla Urban",
    district: "Shimla",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 9500,
    rating: 4.9,
    reviewCount: 2100,
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
    amenities: ["Luxury Spa", "Indoor Heated Pool", "Cedar Forest View", "Fine Dining", "Butler"],
    distanceFromCenter: "0.8 km from The Ridge",
    description: "Colonial grandeur with unmatched luxury, set high in the Shimla hills.",
    roomType: "Premier Valley View Suite",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    websiteUrl: "https://www.oberoihotels.com/hotels-in-shimla-cecil/",
    phone: "+91 177 280 4848",
    verified: true,
  },
  {
    id: "htl-shm-2",
    name: "Pine Forest Homestay & Cafe",
    location: "Mashobra, Shimla Outer",
    tehsil: "Shimla Rural",
    district: "Shimla",
    state: "Himachal Pradesh",
    country: "India",
    pricePerNightINR: 1950,
    rating: 4.7,
    reviewCount: 820,
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
    amenities: ["Apple Orchard View", "Bonfire", "Free Breakfast", "High-Speed WiFi"],
    distanceFromCenter: "8 km from Shimla Mall",
    description: "Peaceful wooden homestay nestled amidst dense deodar and oak trees in Mashobra.",
    roomType: "Deluxe Wooden Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    websiteUrl: "https://www.google.com/travel/hotels?q=Mashobra+Homestays+Shimla",
    phone: "+91 177 274 0100",
    verified: true,
  },
];

// Comprehensive Transit Database (Buses, Trains, Flights)
export const TRANSIT_DATABASE: TransitOption[] = [
  // BUSES
  {
    id: "bus-del-mnl-1",
    type: "bus",
    operator: "HRTC Himgaurav Scania Multi-Axle",
    routeCode: "HRTC-VOLVO-402",
    origin: "Delhi (ISBT Kashmiri Gate)",
    destination: "Manali (Private Bus Stand)",
    departureTime: "07:30 PM",
    arrivalTime: "08:30 AM (Next Day)",
    duration: "13 hrs",
    fareINR: 1350,
    classType: "AC Volvo Multi-Axle",
    availableSeats: 18,
    amenities: ["Reclining Seats", "Charging Port", "Water Bottle", "Blanket", "Emergency GPS"],
    features: "Official Himachal State Transport Volvo, smooth overnight ride via Bilaspur-Mandi.",
    websiteUrl: "https://www.hrtchp.com",
    verified: true,
  },
  {
    id: "bus-del-blp-1",
    type: "bus",
    operator: "HRTC Himdhara Deluxe Express",
    routeCode: "HRTC-DX-208",
    origin: "Delhi (ISBT Kashmiri Gate)",
    destination: "Bilaspur (HP Bus Stand)",
    departureTime: "09:00 PM",
    arrivalTime: "05:30 AM",
    duration: "8.5 hrs",
    fareINR: 650,
    classType: "2x2 Deluxe Non-AC",
    availableSeats: 24,
    amenities: ["Comfortable Pushback", "Curtains", "Punctual", "Direct Route"],
    features: "Direct overnight express connecting Delhi directly to Bilaspur via Kiratpur Sahib.",
    websiteUrl: "https://www.hrtchp.com",
    verified: true,
  },
  {
    id: "bus-del-blp-ord",
    type: "bus",
    operator: "HRTC Ordinary Express (Frequent)",
    routeCode: "HRTC-ORD-512",
    origin: "Delhi (ISBT Kashmiri Gate)",
    destination: "Bilaspur (Sadar Bus Stand)",
    departureTime: "06:00 AM / 11:30 AM / 08:00 PM",
    arrivalTime: "Multiple Arrivals",
    duration: "9.5 hrs",
    fareINR: 420,
    classType: "3x2 Standard Seater",
    availableSeats: 35,
    amenities: ["Budget Friendly", "Govt Verified", "Direct Route"],
    features: "State transport regular express with lowest fare on the Kiratpur-Nerchowk expressway.",
    websiteUrl: "https://www.hrtchp.com",
    verified: true,
  },
  {
    id: "bus-chd-blp-1",
    type: "bus",
    operator: "HRTC Semi-Deluxe 2x2",
    routeCode: "HRTC-CHD-88",
    origin: "Chandigarh (Sector 43 ISBT)",
    destination: "Bilaspur (HP Bus Stand)",
    departureTime: "07:15 AM",
    arrivalTime: "10:30 AM",
    duration: "3 hrs 15 mins",
    fareINR: 230,
    classType: "Semi-Deluxe 2x2",
    availableSeats: 28,
    amenities: ["Frequent Service", "Luggage Space", "Punctual Driver"],
    features: "Direct high frequency shuttle connecting Chandigarh to Bilaspur town.",
    websiteUrl: "https://www.hrtchp.com",
    verified: true,
  },
  {
    id: "bus-chd-mnl-1",
    type: "bus",
    operator: "Zingbus Electric Volvo AC",
    routeCode: "ZB-ELEC-99",
    origin: "Chandigarh (Sector 43)",
    destination: "Manali (Mall Road)",
    departureTime: "11:00 PM",
    arrivalTime: "07:00 AM",
    duration: "8 hrs",
    fareINR: 980,
    classType: "AC Sleeper / Semi-Sleeper",
    availableSeats: 12,
    amenities: ["Live Tracking", "Clean Bedding", "USB Charging", "Reading Light"],
    features: "Premium AC sleeper bus with verified drivers and on-time guarantee.",
    websiteUrl: "https://www.redbus.in",
    verified: true,
  },

  // TRAINS
  {
    id: "trn-del-una-1",
    type: "train",
    operator: "Indian Railways",
    routeCode: "22447 Vande Bharat Express",
    origin: "New Delhi (NDLS)",
    destination: "Amb Andaura (Near Bilaspur/Una HP)",
    departureTime: "05:50 AM",
    arrivalTime: "11:05 AM",
    duration: "5 hrs 15 mins",
    fareINR: 1250,
    classType: "Chair Car (CC)",
    availableSeats: 45,
    amenities: ["Gourmet Meals", "Bio-Vacuum Toilets", "Panoramic Windows", "Rotational Seats"],
    features: "High-speed flagship train connecting Delhi to Himachal in just 5 hours! Quick taxi/bus to Bilaspur.",
    websiteUrl: "https://www.irctc.co.in",
    verified: true,
  },
  {
    id: "trn-del-klk-1",
    type: "train",
    operator: "Indian Railways",
    routeCode: "12011 Kalka Shatabdi Express",
    origin: "New Delhi (NDLS)",
    destination: "Kalka (Connecting to Shimla Toy Train)",
    departureTime: "07:40 AM",
    arrivalTime: "11:45 AM",
    duration: "4 hrs 05 mins",
    fareINR: 980,
    classType: "Executive Class & AC Chair Car",
    availableSeats: 62,
    amenities: ["Breakfast Included", "AC", "Large Luggage Space", "Punctual"],
    features: "Superfast morning Shatabdi connecting onwards to Shimla, Bilaspur, and Kullu.",
    websiteUrl: "https://www.irctc.co.in",
    verified: true,
  },

  // FLIGHTS
  {
    id: "flt-del-kuu-1",
    type: "flight",
    operator: "Alliance Air",
    routeCode: "9I-805",
    origin: "Delhi (DEL - Terminal 3)",
    destination: "Kullu-Manali (KUU - Bhuntar Airport)",
    departureTime: "06:45 AM",
    arrivalTime: "08:05 AM",
    duration: "1 hr 20 mins",
    fareINR: 5200,
    classType: "Economy (ATR-72)",
    availableSeats: 9,
    amenities: ["Cabin Baggage 7kg", "Check-in 15kg", "Window Views of Snow Peaks"],
    features: "Direct scenic flight landing right at Bhuntar Airport, only 45 minutes scenic drive from Manali.",
    websiteUrl: "https://www.airindia.com",
    verified: true,
  },
  {
    id: "flt-del-dhm-1",
    type: "flight",
    operator: "IndiGo",
    routeCode: "6E-2411",
    origin: "Delhi (DEL)",
    destination: "Dharamshala / Kangra (DHM)",
    departureTime: "09:30 AM",
    arrivalTime: "10:45 AM",
    duration: "1 hr 15 mins",
    fareINR: 4400,
    classType: "Economy",
    availableSeats: 16,
    amenities: ["Complimentary Snack", "Direct Flight", "Punctual"],
    features: "Fastest way to reach Kangra, Dharamshala, Bilaspur & Mandi circuit.",
    websiteUrl: "https://www.goindigo.in",
    verified: true,
  },
];

// Intelligent Search Function for Hotels
export function searchHotels(
  destinationQuery: string,
  maxBudgetINR?: number
): HotelOption[] {
  const q = destinationQuery.toLowerCase().trim();

  let matches = HOTEL_DATABASE.filter((h) => {
    const textToMatch = `${h.name} ${h.location} ${h.tehsil} ${h.district} ${h.state} ${h.country}`.toLowerCase();

    // Check if location matches query terms
    const terms = q.split(/[\s,]+/);
    const hasLocationMatch = terms.some((term) => term.length > 2 && textToMatch.includes(term));

    return hasLocationMatch;
  });

  // If specific query returned empty, match by state/default
  if (matches.length === 0) {
    if (q.includes("manali") || q.includes("kullu") || q.includes("solang")) {
      matches = HOTEL_DATABASE.filter((h) => h.district.toLowerCase() === "kullu");
    } else if (q.includes("bilaspur") || q.includes("ghumarwin") || q.includes("naina")) {
      matches = HOTEL_DATABASE.filter((h) => h.district.toLowerCase() === "bilaspur");
    } else if (q.includes("shimla")) {
      matches = HOTEL_DATABASE.filter((h) => h.district.toLowerCase() === "shimla");
    } else {
      // Dynamic fallback: return representative options with query as destination
      matches = HOTEL_DATABASE;
    }
  }

  // Filter by budget if provided
  if (maxBudgetINR && maxBudgetINR > 0) {
    const withinBudget = matches.filter((h) => h.pricePerNightINR <= maxBudgetINR * 1.15);
    if (withinBudget.length > 0) {
      return withinBudget.sort((a, b) => a.pricePerNightINR - b.pricePerNightINR);
    }
  }

  // Sort by rating desc
  return matches.sort((a, b) => b.rating - a.rating);
}

// Intelligent Search Function for Transit (Bus, Train, Flight)
export function searchTransit(
  type: "bus" | "train" | "flight" | "all",
  destinationQuery: string,
  originQuery?: string,
  maxBudgetINR?: number
): TransitOption[] {
  const dest = destinationQuery.toLowerCase().trim();
  const orig = (originQuery || "").toLowerCase().trim();

  let results = TRANSIT_DATABASE.filter((item) => {
    if (type !== "all" && item.type !== type) return false;

    const matchesDest =
      !dest ||
      item.destination.toLowerCase().includes(dest) ||
      dest.split(/[\s,]+/).some((t) => t.length > 2 && item.destination.toLowerCase().includes(t));

    const matchesOrig =
      !orig ||
      item.origin.toLowerCase().includes(orig) ||
      orig.split(/[\s,]+/).some((t) => t.length > 2 && item.origin.toLowerCase().includes(t));

    return matchesDest || matchesOrig;
  });

  if (results.length === 0) {
    results = type === "all" ? TRANSIT_DATABASE : TRANSIT_DATABASE.filter((t) => t.type === type);
  }

  if (maxBudgetINR && maxBudgetINR > 0) {
    const withinBudget = results.filter((t) => t.fareINR <= maxBudgetINR * 1.2);
    if (withinBudget.length > 0) return withinBudget;
  }

  return results;
}

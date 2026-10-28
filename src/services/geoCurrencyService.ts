export interface GeoLocationInfo {
  country: string;
  countryCode: string;
  state: string;
  district: string;
  city: string;
  pincode?: string;
  currency: string;
  currencySymbol: string;
  currencyRateToINR: number;
  timezone: string;
  source?: "gps" | "ip" | "browser" | "manual";
  fullAddress?: string;
}

export const SUPPORTED_CURRENCIES: Record<
  string,
  { symbol: string; rateToINR: number; name: string }
> = {
  INR: { symbol: "₹", rateToINR: 1, name: "Indian Rupee" },
  USD: { symbol: "$", rateToINR: 0.012, name: "US Dollar" },
  EUR: { symbol: "€", rateToINR: 0.011, name: "Euro" },
  GBP: { symbol: "£", rateToINR: 0.0094, name: "British Pound" },
  AED: { symbol: "د.إ", rateToINR: 0.044, name: "UAE Dirham" },
  CAD: { symbol: "CA$", rateToINR: 0.016, name: "Canadian Dollar" },
  AUD: { symbol: "AU$", rateToINR: 0.018, name: "Australian Dollar" },
  SGD: { symbol: "SG$", rateToINR: 0.016, name: "Singapore Dollar" },
};

const GEO_STORAGE_KEY = "aura_detected_geo_v2";

// Fast synchronous fallback using browser Intl and timezone
export function detectUserGeoLocation(): GeoLocationInfo {
  if (typeof window === "undefined") {
    return getDefaultLocation();
  }

  // Check saved location first
  try {
    const saved = localStorage.getItem(GEO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.country) {
        return parsed;
      }
    }
  } catch {}

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "en-IN";

    if (
      tz.includes("Kolkata") ||
      tz.includes("Calcutta") ||
      locale.includes("IN") ||
      locale.includes("hi")
    ) {
      return {
        country: "India",
        countryCode: "IN",
        state: "Punjab",
        district: "Sahibzada Ajit Singh Nagar district",
        city: "Mohali",
        currency: "INR",
        currencySymbol: "₹",
        currencyRateToINR: 1,
        timezone: tz || "Asia/Kolkata",
        source: "browser",
        fullAddress: "Sahibzada Ajit Singh Nagar district, Punjab, India",
      };
    }

    if (tz.includes("New_York") || tz.includes("Los_Angeles") || tz.includes("Chicago") || locale.includes("US")) {
      return {
        country: "United States",
        countryCode: "US",
        state: "California",
        district: "San Francisco",
        city: "San Francisco",
        currency: "USD",
        currencySymbol: "$",
        currencyRateToINR: 0.012,
        timezone: tz,
        source: "browser",
        fullAddress: "San Francisco, California, United States",
      };
    }

    if (tz.includes("London") || locale.includes("GB")) {
      return {
        country: "United Kingdom",
        countryCode: "GB",
        state: "England",
        district: "London",
        city: "London",
        currency: "GBP",
        currencySymbol: "£",
        currencyRateToINR: 0.0094,
        timezone: tz,
        source: "browser",
        fullAddress: "London, England, United Kingdom",
      };
    }

    if (tz.includes("Dubai") || tz.includes("Muscat") || locale.includes("AE")) {
      return {
        country: "United Arab Emirates",
        countryCode: "AE",
        state: "Dubai",
        district: "Dubai",
        city: "Dubai",
        currency: "AED",
        currencySymbol: "د.إ",
        currencyRateToINR: 0.044,
        timezone: tz,
        source: "browser",
        fullAddress: "Dubai, United Arab Emirates",
      };
    }
  } catch (e) {
    console.warn("Fast geo detection fallback:", e);
  }

  return getDefaultLocation();
}

function getDefaultLocation(): GeoLocationInfo {
  return {
    country: "India",
    countryCode: "IN",
    state: "Punjab",
    district: "Sahibzada Ajit Singh Nagar district",
    city: "Mohali",
    currency: "INR",
    currencySymbol: "₹",
    currencyRateToINR: 1,
    timezone: "Asia/Kolkata",
    source: "browser",
    fullAddress: "Sahibzada Ajit Singh Nagar district, Punjab, India",
  };
}

// Map Country to Currency
function getCurrencyForCountry(countryCode: string): { currency: string; symbol: string; rateToINR: number } {
  switch (countryCode.toUpperCase()) {
    case "IN":
      return { currency: "INR", symbol: "₹", rateToINR: 1 };
    case "US":
      return { currency: "USD", symbol: "$", rateToINR: 0.012 };
    case "GB":
      return { currency: "GBP", symbol: "£", rateToINR: 0.0094 };
    case "AE":
      return { currency: "AED", symbol: "د.إ", rateToINR: 0.044 };
    case "CA":
      return { currency: "CAD", symbol: "CA$", rateToINR: 0.016 };
    case "AU":
      return { currency: "AUD", symbol: "AU$", rateToINR: 0.018 };
    case "DE":
    case "FR":
    case "IT":
    case "ES":
    case "NL":
      return { currency: "EUR", symbol: "€", rateToINR: 0.011 };
    default:
      return { currency: "INR", symbol: "₹", rateToINR: 1 };
  }
}

// Helper: Reverse-geocode coordinates via BigDataCloud client API (CORS enabled, no API key needed)
async function reverseGeocodeCoords(lat: number, lon: number): Promise<Partial<GeoLocationInfo> | null> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (res.ok) {
      const data = await res.json();
      const countryName = data.countryName || "India";
      const countryCode = data.countryCode || "IN";
      const stateName = data.principalSubdivision || "Punjab";
      const cityName = data.locality || data.city || data.localityInfo?.administrative?.[3]?.name || "Mohali";
      const districtName = data.localityInfo?.administrative?.[2]?.name || cityName;
      const curr = getCurrencyForCountry(countryCode);

      return {
        country: countryName,
        countryCode: countryCode,
        state: stateName,
        district: districtName,
        city: cityName,
        pincode: data.postcode || "",
        currency: curr.currency,
        currencySymbol: curr.symbol,
        currencyRateToINR: curr.rateToINR,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
        fullAddress: `${cityName}, ${districtName}, ${stateName}, ${countryName}`,
      };
    }
  } catch (e) {
    console.warn("Reverse geocode warning:", e);
  }
  return null;
}

// REAL LIVE AUTO-DETECTION: Runs automatically without requiring manual clicks
export async function fetchLiveGeoLocation(useGpsIfAllowed = true): Promise<GeoLocationInfo> {
  // 1. Fast, highly-accurate IP Geolocation (Zero permission prompts, resolves immediately)
  const ipDetectionPromise = (async (): Promise<GeoLocationInfo | null> => {
    // Provider A: freeipapi.com
    try {
      const res = await fetch("https://freeipapi.com/api/json", { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const ipData = await res.json();
        if (ipData && ipData.latitude && ipData.longitude) {
          const rev = await reverseGeocodeCoords(ipData.latitude, ipData.longitude);
          if (rev && rev.district) {
            return {
              ...(rev as GeoLocationInfo),
              source: "ip",
            };
          }
        }
      }
    } catch {}

    // Provider B: ipwho.is (Robust fallback)
    try {
      const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const ipData = await res.json();
        if (ipData && ipData.latitude && ipData.longitude) {
          const rev = await reverseGeocodeCoords(ipData.latitude, ipData.longitude);
          if (rev && rev.district) {
            return {
              ...(rev as GeoLocationInfo),
              source: "ip",
            };
          }
          const curr = getCurrencyForCountry(ipData.country_code || "IN");
          return {
            country: ipData.country || "India",
            countryCode: ipData.country_code || "IN",
            state: ipData.region || "Punjab",
            district: ipData.city || "Mohali",
            city: ipData.city || "Mohali",
            pincode: ipData.postal || "",
            currency: curr.currency,
            currencySymbol: curr.symbol,
            currencyRateToINR: curr.rateToINR,
            timezone: ipData.timezone?.id || "Asia/Kolkata",
            source: "ip",
            fullAddress: `${ipData.city || ""}, ${ipData.region || ""}, ${ipData.country || ""}`,
          };
        }
      }
    } catch {}

    return null;
  })();

  // 2. High-precision Browser GPS (runs concurrently if supported)
  const gpsDetectionPromise = (async (): Promise<GeoLocationInfo | null> => {
    if (!useGpsIfAllowed || typeof window === "undefined" || !("geolocation" in navigator)) {
      return null;
    }
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 4500,
          maximumAge: 300000,
          enableHighAccuracy: true,
        });
      });
      const { latitude, longitude } = position.coords;
      const rev = await reverseGeocodeCoords(latitude, longitude);
      if (rev) {
        return {
          ...(rev as GeoLocationInfo),
          source: "gps",
        };
      }
    } catch {}
    return null;
  })();

  try {
    const [ipRes, gpsRes] = await Promise.allSettled([ipDetectionPromise, gpsDetectionPromise]);

    const resolved =
      (gpsRes.status === "fulfilled" && gpsRes.value) ||
      (ipRes.status === "fulfilled" && ipRes.value);

    if (resolved) {
      try {
        localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(resolved));
      } catch {}
      return resolved;
    }
  } catch (e) {
    console.warn("Live auto-detection error:", e);
  }

  // 3. Fallback to cached or browser timezone
  return detectUserGeoLocation();
}

// Format amount according to currency
export function formatCurrency(amountInINR: number, currencyCode: string = "INR"): string {
  const curr = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.INR;
  const converted = Math.round(amountInINR * curr.rateToINR);

  if (currencyCode === "INR") {
    return `₹${converted.toLocaleString("en-IN")}`;
  }
  return `${curr.symbol}${converted.toLocaleString()}`;
}

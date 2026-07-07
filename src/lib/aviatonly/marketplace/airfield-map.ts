export type AirfieldMapTarget = {
  query: string;
  zoom: number;
};

const SA_AIRFIELD_BY_ICAO: Record<string, AirfieldMapTarget> = {
  FACT: {
    query: "Cape Town International Airport, Western Cape, South Africa",
    zoom: 10,
  },
  FAOR: {
    query: "O.R. Tambo International Airport, Gauteng, South Africa",
    zoom: 10,
  },
  FALA: {
    query: "Lanseria International Airport, Gauteng, South Africa",
    zoom: 10,
  },
  FAGC: {
    query: "Grand Central Airport, Midrand, Gauteng, South Africa",
    zoom: 11,
  },
  FAWB: {
    query: "Wonderboom National Airport, Pretoria, Gauteng, South Africa",
    zoom: 11,
  },
  FAFM: {
    query: "Morningstar Airfield, Durbanville, Western Cape, South Africa",
    zoom: 11,
  },
  FASH: {
    query: "Stellenbosch Airfield, Western Cape, South Africa",
    zoom: 11,
  },
  FAPG: {
    query: "George Airport, Western Cape, South Africa",
    zoom: 11,
  },
  FAPE: {
    query: "Chief Dawid Stuurman International Airport, Gqeberha, Eastern Cape, South Africa",
    zoom: 11,
  },
  FAVG: {
    query: "Virginia Airport, Durban, KwaZulu-Natal, South Africa",
    zoom: 11,
  },
};

const SA_AIRFIELD_NAME_ALIASES: Record<string, keyof typeof SA_AIRFIELD_BY_ICAO> = {
  morningstar: "FAFM",
  wonderboom: "FAWB",
  lanseria: "FALA",
  stellenbosch: "FASH",
  "grand central": "FAGC",
  virginia: "FAVG",
  george: "FAPG",
  "port elizabeth": "FAPE",
  "cape town": "FACT",
  "cape town intl": "FACT",
  "cape town international": "FACT",
  "or tambo": "FAOR",
  "o.r. tambo": "FAOR",
};

function extractIcaoCode(airfield: string): string | null {
  const match = airfield.match(/\b(FA[A-Z]{2})\b/i);
  return match ? match[1].toUpperCase() : null;
}

function normalizeAirfieldKey(value: string): string {
  return value.trim().toLowerCase();
}

function lookupByName(airfield: string): AirfieldMapTarget | null {
  const primary = normalizeAirfieldKey(airfield.split(/[—–-]/)[0] ?? airfield);
  const full = normalizeAirfieldKey(airfield);
  const icao = SA_AIRFIELD_NAME_ALIASES[primary] ?? SA_AIRFIELD_NAME_ALIASES[full];
  return icao ? SA_AIRFIELD_BY_ICAO[icao] : null;
}

/**
 * Resolve a seller-entered airfield label to a Google Maps place query and zoom level.
 * Prefers known SA ICAO/name mappings so FACT points at Cape Town International, not a random match.
 */
export function resolveAirfieldMapTarget(
  airfield: string,
  province?: string,
  country = "South Africa",
): AirfieldMapTarget {
  const trimmed = airfield.trim();
  const icao = extractIcaoCode(trimmed);

  if (icao && SA_AIRFIELD_BY_ICAO[icao]) {
    return SA_AIRFIELD_BY_ICAO[icao];
  }

  const byName = lookupByName(trimmed);
  if (byName) {
    return byName;
  }

  const namePart = trimmed.split(/[—–-]/).map((part) => part.trim()).slice(1).join(" - ");
  if (namePart) {
    return {
      query: [namePart, "airport", province, country].filter(Boolean).join(", "),
      zoom: 10,
    };
  }

  if (icao) {
    return {
      query: [`${icao} airport`, province, country].filter(Boolean).join(", "),
      zoom: 10,
    };
  }

  return {
    query: [trimmed, "airfield", province, country].filter(Boolean).join(", "),
    zoom: 11,
  };
}

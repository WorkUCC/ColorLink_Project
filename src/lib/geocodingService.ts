/**
 * Servicio de geocodificación para ColorLink by Pintuco.
 * Utiliza el servicio gratuito Nominatim de OpenStreetMap conforme a su política de uso:
 * - Header User-Agent identificando la aplicación
 * - Caché local en localStorage para evitar consultas duplicadas
 * - Respaldo al centro aproximado de la ciudad si no se obtienen coordenadas exactas
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  source: "nominatim" | "city_fallback";
  displayName?: string;
}

// Coordenadas oficiales de centro de las principales ciudades colombianas
export const CIUDADES_COODENADAS: Record<string, [number, number]> = {
  "bogotá": [4.6782, -74.0583],
  "bogotá d.c.": [4.6782, -74.0583],
  "medellín": [6.2442, -75.5812],
  "medellín (antioquia)": [6.2442, -75.5812],
  "cali": [3.4516, -76.5320],
  "cali (valle)": [3.4516, -76.5320],
  "barranquilla": [10.9685, -74.7813],
  "barranquilla (atlántico)": [10.9685, -74.7813],
  "bucaramanga": [7.1254, -73.1198],
  "bucaramanga (santander)": [7.1254, -73.1198],
  "cartagena": [10.3910, -75.4794],
  "cartagena (bolívar)": [10.3910, -75.4794],
  "pereira": [4.8133, -75.6961],
  "pereira (risaralda)": [4.8133, -75.6961],
  "manizales": [5.0689, -75.5174],
  "manizales (caldas)": [5.0689, -75.5174],
  "ibagué": [4.4389, -75.2322],
  "ibagué (tolima)": [4.4389, -75.2322],
  "santa marta": [11.2408, -74.1990],
  "santa marta (magdalena)": [11.2408, -74.1990],
};

export function getFallbackCityCoords(city?: string): [number, number] {
  if (!city) return [4.6782, -74.0583]; // Bogotá por defecto
  const normalizada = city.toLowerCase().trim();
  for (const [key, coords] of Object.entries(CIUDADES_COODENADAS)) {
    if (normalizada.includes(key) || key.includes(normalizada.split(" ")[0])) {
      return coords;
    }
  }
  return [4.6782, -74.0583];
}

export async function geocodeAddress(
  address: string | undefined,
  city: string | undefined
): Promise<GeocodeResult> {
  const cityClean = (city || "Bogotá").split("(")[0].trim();
  const addressClean = (address || "").trim();

  // Si no hay dirección real, usar centro de ciudad de inmediato
  if (!addressClean || addressClean.toLowerCase().includes("dirección de obra")) {
    const coords = getFallbackCityCoords(city);
    return {
      lat: coords[0],
      lng: coords[1],
      source: "city_fallback",
      displayName: `Centro de ${cityClean}, Colombia`,
    };
  }

  const queryFull = `${addressClean}, ${cityClean}, Colombia`;
  const cacheKey = `colorlink_geo_${encodeURIComponent(queryFull.toLowerCase())}`;

  // 1. Revisar caché local
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        return parsed as GeocodeResult;
      }
    }
  } catch {
    // ignorar error de localStorage
  }

  // 2. Consultar Nominatim con User-Agent
  try {
    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      queryFull
    )}&format=json&limit=1`;

    let response = await fetch(url, {
      headers: {
        "User-Agent": "ColorLink-Pintuco-App/1.0 (ucctrabajodelau@gmail.com)",
      },
    });

    let data = response.ok ? await response.json() : null;

    // Si no encontró resultados y la dirección tiene complementos (Apto, Torre, Int, etc.), limpiar y reintentar
    if (!data || !Array.isArray(data) || data.length === 0) {
      const addressSimplified = addressClean
        .replace(/\b(apto|apartamento|int|interior|bloque|blq|torre|casa|piso|oficina)\s*[0-9a-z\-]+/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      if (addressSimplified && addressSimplified !== addressClean) {
        const queryRetry = `${addressSimplified}, ${cityClean}, Colombia`;
        const retryUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          queryRetry
        )}&format=json&limit=1`;

        const retryResponse = await fetch(retryUrl, {
          headers: {
            "User-Agent": "ColorLink-Pintuco-App/1.0 (ucctrabajodelau@gmail.com)",
          },
        });
        if (retryResponse.ok) {
          data = await retryResponse.json();
        }
      }
    }

    if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
      const result: GeocodeResult = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        source: "nominatim",
        displayName: data[0].display_name,
      };

      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        // ignorar
      }

      return result;
    }
  } catch (err) {
    console.warn("[Geocoding] Nominatim no disponible, usando respaldo de ciudad:", err);
  }

  // 3. Respaldo al centro de la ciudad
  const fallbackCoords = getFallbackCityCoords(city);
  const fallbackResult: GeocodeResult = {
    lat: fallbackCoords[0],
    lng: fallbackCoords[1],
    source: "city_fallback",
    displayName: `${cityClean}, Colombia (Ubicación aproximada)`,
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(fallbackResult));
  } catch {
    // ignorar
  }

  return fallbackResult;
}

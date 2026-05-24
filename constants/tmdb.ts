export const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? "";
export const TMDB_BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p/w500";
export const TMDB_IMAGE_ORIGINAL = process.env.EXPO_PUBLIC_TMDB_IMAGE_ORIGINAL ?? "https://image.tmdb.org/t/p/original";

export const endpoints = {
    popular: `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`,
    nowPlaying: `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`,
    topRated: `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`,
    trending: `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
    search: (query: string) =>
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
    detail: (id: number) =>
        `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`,
    similar: (id: number) =>
        `${TMDB_BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}`,
};

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids?: number[];
    genres?: { id: number; name: string }[];
}

export interface MovieDetail extends Movie {
    runtime: number;
    tagline: string;
    genres: { id: number; name: string }[];
    credits?: {
        cast: { id: number; name: string; character: string; profile_path: string | null }[];
        crew: { id: number; name: string; job: string; profile_path: string | null }[];
    };
}

export function getPosterUrl(path: string | null, size: "w500" | "original" = "w500") {
    if (!path) return null;
    const base = size === "original" ? TMDB_IMAGE_ORIGINAL : TMDB_IMAGE_BASE;
    return `${base}${path}`;
}

export function formatRating(rating: number) {
    return (rating / 10 * 10).toFixed(1);
}

export function getYear(dateString: string) {
    return dateString ? dateString.split("-")[0] : "N/A";
}
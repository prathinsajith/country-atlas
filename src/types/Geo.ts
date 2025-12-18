import { Continent } from './Country';

export interface GeoBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface GeoPointer {
    latitude: number;
    longitude: number;
}

export interface GeoData {
    placeId?: string; // Optional as per decision example in prompt ("geo.placeId?: string")
    latitude: number;
    longitude: number;
    pointer: GeoPointer;
    bounds: GeoBounds;
    region?: string;
    continent: Continent;
    landlocked: boolean;
    areaKm2: number;
    borders?: string[]; // Array of ISO alpha-3 codes usually, or alpha-2? Prompt says "borders: []", usually it's neighbor codes. Let's assume string[] for safety.
}

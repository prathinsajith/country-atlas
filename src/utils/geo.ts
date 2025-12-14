import { Country } from '../types';
import { hasCoordinates } from './guards';

/**
 * Geographic utility functions for distance calculations
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Calculate distance between two countries (using their capital coordinates)
 * @param country1 First country
 * @param country2 Second country
 * @returns Distance in kilometers, or undefined if coordinates are not available
 */
export function getDistanceBetweenCountries(
    country1: Country,
    country2: Country,
): number | undefined {
    if (!hasCoordinates(country1) || !hasCoordinates(country2)) {
        return undefined;
    }

    return haversineDistance(
        country1.geo.latitude,
        country1.geo.longitude,
        country2.geo.latitude,
        country2.geo.longitude,
    );
}

/**
 * Find nearest countries to a given country
 * @param country Target country
 * @param allCountries List of all countries to search from
 * @param limit Number of nearest countries to return (default: 5)
 * @returns Array of countries with their distances, sorted by distance
 */
export function getNearestCountries(
    country: Country,
    allCountries: Country[],
    limit = 5,
): Array<{ country: Country; distance: number }> {
    if (!hasCoordinates(country)) {
        return [];
    }

    const distances = allCountries
        .filter((c) => c.iso.alpha2 !== country.iso.alpha2 && hasCoordinates(c))
        .map((c) => ({
            country: c,
            distance: getDistanceBetweenCountries(country, c)!,
        }))
        .sort((a, b) => a.distance - b.distance);

    return distances.slice(0, limit);
}

/**
 * Check if two countries share a border
 * @param country1 First country
 * @param country2 Second country
 * @returns True if countries share a border
 */
export function doCountriesShareBorder(country1: Country, country2: Country): boolean {
    if (!country1.geo.borders || !country2.geo.borders) {
        return false;
    }

    // Check if country2's ISO code is in country1's borders
    return (
        country1.geo.borders.includes(country2.iso.alpha2) ||
        country1.geo.borders.includes(country2.iso.alpha3)
    );
}

import { Currency } from './Currency';
import { GeoData } from './Geo';
import { Flag } from './Flag';

export interface ISO {
    alpha2: string;
    alpha3: string;
    numeric?: string;
}

export interface Domains {
    topLevelDomain?: string;
    internetTld?: string[];
}

export interface Postal {
    codeFormat?: string;
    example?: string;
}

export interface Formats {
    dateFormat?: string;
    weekStart?: string;
}

export interface Timezone {
    name: string;
    utcOffset: string;
    utcOffsetMin?: number;
}

export interface Country {
    name: string;
    officialName: string;
    capital?: string[];
    iso: ISO;
    geo: GeoData;
    nativeNames?: Record<string, { official: string; common: string }>; // "nativeNames": {} in prompt. Standard is often Record<langCode, {official, common}>
    languages?: string[];

    currency?: Currency;

    callingCode?: string;

    timezones?: Timezone[];
    flag: Flag;
    domains?: Domains;
    postal?: Postal;
    formats?: Formats;
    unMember: boolean;
}

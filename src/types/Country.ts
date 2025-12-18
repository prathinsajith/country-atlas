import { Currency } from './Currency';
import { GeoData } from './Geo';
import { Flag } from './Flag';

export type Continent = 'Asia' | 'Europe' | 'Africa' | 'Americas' | 'Oceania' | 'Antarctic';

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
    geo: Omit<GeoData, 'continent'> & { continent: Continent };
    nativeNames?: Record<string, { official: string; common: string }>;
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

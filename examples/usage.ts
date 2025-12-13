import { getAllCountries, searchCountry, getCountryByISO2 } from '../src';

/**
 * SCENARIO 1: Country Selector (Dropdown)
 * Transforming data for use in libraries like React-Select, Radix UI, etc.
 */
function getCountryOptions() {
    const countries = getAllCountries();
    return countries.map(c => ({
        value: c.iso.alpha2,
        label: `${c.flag.emoji} ${c.name}`,
        searchTerms: [c.name, c.officialName, c.iso.alpha3].join(' ') // Helper for filtering
    }));
}

console.log('--- Dropdown Options Sample ---');
console.log(getCountryOptions().slice(0, 3));


/**
 * SCENARIO 2: Phonebook Validation
 * Validating if a number matches a country's calling code.
 */
function validatePhoneNumber(phoneNumber: string, isoCode: string): boolean {
    const country = getCountryByISO2(isoCode);
    if (!country) return false;

    // Remove non-digits
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    const callingCode = country.callingCode || '';

    if (!callingCode) {
        console.log(`❌ No calling code format valid for: ${country.name}`);
        return false;
    }

    // Check if number starts with the calling code
    // (Note: This is basic validation. Use libphonenumber-js for strict parsing)
    if (cleanNumber.startsWith(callingCode)) {
        console.log(`✅ Valid prefix for ${country.name}: ${callingCode}`);
        return true;
    }

    console.log(`❌ Invalid: ${phoneNumber} does not start with ${callingCode} (${country.name})`);
    return false;
}

console.log('\n--- Phone Validation ---');
validatePhoneNumber('+919876543210', 'IN'); // Valid India
validatePhoneNumber('+15551234567', 'IN');  // Invalid India


/**
 * SCENARIO 3: Search / Typeahead
 * Finding a country for a "Select Country" dialog.
 */
function onSearchInput(query: string) {
    if (!query) return [];

    // searchCountry performs fuzzy/partial matching on common and official names
    const results = searchCountry(query);

    return results.map(c => ({
        id: c.iso.alpha2,
        displayName: c.name,
        subtitle: c.officialName
    }));
}

console.log('\n--- Search Typeahead ---');
console.log('Query "United":', onSearchInput('United').length, 'matches');
console.log('First match:', onSearchInput('United')[0]);

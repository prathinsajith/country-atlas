const countryAtlas = require('country-atlas');

// 1. Basic Lookup (ISO Code)
const usa = countryAtlas.getCountryByISO3('USA');
console.log('🇺🇸 Found Country:', usa.name);

// 2. Native Name Lookup
const bharat = countryAtlas.getCountryByName('भारत');
console.log('\n🧡 Native Name (भारत) Found:', bharat.name);

// 3. Intelligent Search (Fuzzy Matching)
// Finds "United Kingdom" by searching "Kingdom" or "United"
const searchResults = countryAtlas.searchCountry('Kingdom');
console.log(`\n🔍 Search 'Kingdom' found ${searchResults.length} results:`);
searchResults.forEach((c) => console.log(` - ${c.flag.emoji} ${c.name} (${c.iso.alpha3})`));

// 4. Performance: Field Selection
// Only fetch what you need (Save memory!)
const partialData = countryAtlas.getCountry('JP', {
    fields: ['name', 'capital', 'currency', 'timezones'],
});
console.log('\n⚡ Partial Data (Japan):', partialData);

// 5. Region Filtering
const oceania = countryAtlas.getCountriesByContinent('Oceania');
console.log(`\n🌏 Oceania has ${oceania.length} countries.`);

// 6. Data Depth: Borders & Neighbors
const neighbors = countryAtlas.getBorderCountries('Germany');
if (neighbors.length > 0) {
    console.log(`\n🇩🇪 Germany borders ${neighbors.length} countries:`);
    console.log(neighbors.map((c) => c.name).join(', '));
}

// 6. Data Depth: Currencies
const uae = countryAtlas.getCountryByISO2('AE');
if (uae) {
    console.log(`\n💰 Currency of UAE: ${uae.currency.name} (${uae.currency.symbol})`);
}

// 7. Utility: Calling Codes
const india = countryAtlas.getCountryByCallingCode('+91');
console.log(`\n📞 +91 belongs to: ${india?.name}`);

// 8. Utility: Currency Zone
const euroCountries = countryAtlas.getCountriesByCurrency('EUR');
console.log(`\n💶 Countries using Euro: ${euroCountries.length}`);

// 9. Scenario: Simple Phone Number Validation
function isValidPhoneForCountry(phoneNumber, isoCode) {
    const country = countryAtlas.getCountryByISO2(isoCode);
    if (!country) return false;
    // Strip non-digits
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    const callingCode = country.callingCode;

    // Check if number starts with calling code
    const isValid = cleanNumber.startsWith(callingCode);
    console.log(
        `\n📱 Validating ${phoneNumber} for ${country.name}: ${isValid ? '✅ Valid' : '❌ Invalid'}`,
    );
    return isValid;
}

isValidPhoneForCountry('+919876543210', 'IN');
isValidPhoneForCountry('+15551234567', 'IN'); // Invalid for India

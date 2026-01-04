// Named exports for tree-shaking
import asia from '../../data/normalized/asia.json';
import europe from '../../data/normalized/europe.json';
import africa from '../../data/normalized/africa.json';
import americas from '../../data/normalized/americas.json';
import oceania from '../../data/normalized/oceania.json';
import antarctic from '../../data/normalized/antarctic.json';

// Named exports (regions)
export { asia, europe, africa, americas, oceania, antarctic };

// Aggregated export (replaces monolithic countries.json to avoid duplication)
export const countries = [...africa, ...americas, ...antarctic, ...asia, ...europe, ...oceania];

// Legacy object export
export const regions = {
    asia,
    europe,
    africa,
    americas,
    oceania,
    antarctic,
};

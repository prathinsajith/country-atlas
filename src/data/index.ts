// Named exports for tree-shaking
export { default as asia } from '../../data/normalized/asia.json';
export { default as europe } from '../../data/normalized/europe.json';
export { default as africa } from '../../data/normalized/africa.json';
export { default as americas } from '../../data/normalized/americas.json';
export { default as oceania } from '../../data/normalized/oceania.json';
export { default as antarctic } from '../../data/normalized/antarctic.json';
export { default as countries } from '../../data/normalized/countries.json';

// Legacy object export (optional, but named is better)
import asia from '../../data/normalized/asia.json';
import europe from '../../data/normalized/europe.json';
import africa from '../../data/normalized/africa.json';
import americas from '../../data/normalized/americas.json';
import oceania from '../../data/normalized/oceania.json';
import antarctic from '../../data/normalized/antarctic.json';

export const regions = {
    asia,
    europe,
    africa,
    americas,
    oceania,
    antarctic,
};

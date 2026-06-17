import { getDensityFromABV, getDensityFromABM, getABMFromDensity, getABVFromDensity } from "./density.js";

function howManyDefined(...args) {
    let total = 0;
    for (const arg of args) {
        total += (typeof arg !== "undefined")
    }
    return total;
}

export function normalizeLiquid(liquid) {
    var result = {
        mass: undefined, // in kg
        volume: undefined, // in litres
        
        ABV: undefined, // alcohol by volume, percentage
        ABM: undefined, // alcohol by mass, percentage
        density: undefined,
        KPA: undefined, // kilograms of pure alcohol
        LPA: undefined, // litres of pure alcohol
    }
    result = {...result, ...liquid}
    
    if (howManyDefined(result.mass, result.volume) != 1) {
        throw new Error("we need exactly one of (volume, mass)");
    }
    if (howManyDefined(result.ABV || result.ABM || result.density || result.KPA || result.LPA) != 1) {
        throw new Error("we need exactly one of (ABV, ABM, density, KPA, LPA)");
    }
    
    if (result.LPA) {
        result.KPA = result.LPA * 0.78934
    }
    
    if (result.KPA && result.mass) {
        result.ABM = result.KPA / result.mass * 100
    }
    
    if (result.ABV && !result.density) {
        result.density = getDensityFromABV(result.ABV);
    }
    if (result.ABM && !result.density) {
        result.density = getDensityFromABM(result.ABM);
    }
    
    if (result.mass) {
        result.volume = 1/result.density * result.mass;
    } else if (result.volume) {
        result.mass = result.density * result.volume;
    }
    
    if (!result.ABV) {
        result.ABV = getABVFromDensity(result.density);
    }
    
    if (!result.ABM) {
        result.ABM = getABMFromDensity(result.density);
    }
    
    if (!result.KPA) {
        result.KPA = (result.ABM/100) * result.mass
    }
    if (!result.LPA) {
        result.LPA = result.KPA * (1/0.78934)
    }
    
    result.original = liquid;
    return result;
}

export function sumLiquids(liquids) {
    let result = liquids.map((it) => normalizeLiquid(it)).reduce((acc, liquid) => {
        acc.mass += liquid.mass;
        acc.KPA += liquid.KPA;
        return acc;
    }, {mass: 0, KPA: 0});
    
    return normalizeLiquid(result)
}
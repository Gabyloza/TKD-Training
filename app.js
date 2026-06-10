function calculateAthleteScore(){

let load =
data.tkd + data.strength + data.speed +
data.flex + data.swim + data.bike;

let fatigue = data.fatigue || 5;
let intensity = data.intensity || 5;

// CONSISTENCY BONUS
let consistency = load > 300 ? 20 : load > 150 ? 10 : 5;

// FATIGUE PENALTY
let fatiguePenalty = fatigue * 4;

// INTENSITY BONUS
let intensityBonus = intensity * 3;

// FINAL SCORE
let score =
load/10 +
consistency +
intensityBonus -
fatiguePenalty;

return Math.max(0, Math.min(100, Math.round(score)));
}

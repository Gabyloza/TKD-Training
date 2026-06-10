let data = {
tkd:0,
strength:0,
speed:0,
flex:0,
swim:0,
bike:0,
fatigue:5,
intensity:5,
xp:0,
level:1,
weeklyLoad:0
};

// =====================
// GUARDAR
// =====================

function saveTraining(){

data.tkd = +tkd.value;
data.strength = +strength.value;
data.speed = +speed.value;
data.flex = +flex.value;
data.swim = +swim.value;
data.bike = +bike.value;
data.fatigue = +fatigue.value;
data.intensity = +intensity.value;

// XP SYSTEM
let xpGain =
data.tkd +
data.strength +
data.speed +
data.flex;

data.xp += xpGain;

// LEVEL SYSTEM
data.level = Math.floor(data.xp / 500) + 1;

// LOAD SYSTEM
data.weeklyLoad =
data.tkd +
data.strength +
data.speed +
data.flex +
data.swim +
data.bike;

// STATUS
let status = "";

if(data.weeklyLoad > 500){
status = "🔥 Sobrecarga";
}
else if(data.weeklyLoad > 300){
status = "⚡ Óptimo";
}
else{
status = "📉 Bajo volumen";
}

// SAVE
localStorage.setItem("elite", JSON.stringify(data));

// UPDATE UI
updateUI(status);
updateChart();
checkAchievements();
}

// =====================
// CARGAR
// =====================

function load(){

let saved = JSON.parse(localStorage.getItem("elite"));

if(saved) data = saved;

updateUI("");
}

// =====================
// UI
// =====================

function updateUI(status){

level.innerText = data.level;
xp.innerText = data.xp;
load.innerText = data.weeklyLoad;
loadStatus.innerText = status;

// MACROCICLO
let month = new Date().getMonth();

let cycle = "";

if(month == 6) cycle = "Julio - Base";
if(month == 7) cycle = "Agosto - Fuerza";
if(month == 8) cycle = "Septiembre - Potencia";
if(month == 9) cycle = "Octubre - Velocidad";
if(month == 10) cycle = "Noviembre - Combate";
if(month == 11) cycle = "Diciembre - Peak";

document.getElementById("cycle").innerText = cycle;
}

// =====================
// LOGROS
// =====================

function checkAchievements(){

let list = document.getElementById("achievements");

if(data.level >= 5){
list.innerHTML += "<li>🥋 Nivel 5 alcanzado</li>";
}

if(data.weeklyLoad > 400){
list.innerHTML += "<li>🔥 Semana de alto rendimiento</li>";
}

if(data.xp > 1000){
list.innerHTML += "<li>⚡ 1000 XP acumulados</li>";
}
}

// =====================
// GRAFICO
// =====================

function updateChart(){

new Chart(chart,{

type:"radar",

data:{
labels:["TKD","Fuerza","Velocidad","Flex","Natación","Bici"],
datasets:[{
data:[
data.tkd,
data.strength,
data.speed,
data.flex,
data.swim,
data.bike
],
backgroundColor:"rgba(0,255,153,0.3)",
borderColor:"#00ff99"
}]
}
});

}

// =====================
// INIT
// =====================

window.onload = function(){
load();
updateChart();
};

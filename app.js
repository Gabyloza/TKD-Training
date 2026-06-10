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
level:1
};

// =========================
// GUARDAR ENTRENAMIENTO
// =========================

function saveTraining(){

data.tkd = +tkd.value;
data.strength = +strength.value;
data.speed = +speed.value;
data.flex = +flex.value;
data.swim = +swim.value;
data.bike = +bike.value;
data.fatigue = +fatigue.value;
data.intensity = +intensity.value;

// XP
let xpGain =
data.tkd +
data.strength +
data.speed +
data.flex;

data.xp += xpGain;

// LEVEL
data.level = Math.floor(data.xp / 500) + 1;

// SAVE
localStorage.setItem("tkd_elite", JSON.stringify(data));

// UPDATE
updateSystem();
checkAchievements();
drawChart();
}

// =========================
// IA COACH (MOTOR)
// =========================

function aiCoach(){

let load =
data.tkd + data.strength + data.speed +
data.flex + data.swim + data.bike;

let score =
load/10 +
(data.intensity * 3) -
(data.fatigue * 4);

score = Math.max(0, Math.min(100, Math.round(score)));

let message = "";

if(score < 40){
message = "🟡 Baja carga - riesgo de desentreno";
}
else if(score < 70){
message = "⚖️ Zona óptima de progreso";
}
else{
message = "🔥 Alto rendimiento - cuidado sobrecarga";
}

if(data.fatigue >= 8){
message += " | ⚠️ DESCARGA RECOMENDADA";
}

if(data.speed < 30){
message += " | ⚡ mejorar velocidad";
}

if(data.flex < 40){
message += " | 🤸 mejorar movilidad";
}

return {score, message};
}

// =========================
// ACTUALIZAR SISTEMA
// =========================

function updateSystem(){

let ai = aiCoach();

document.getElementById("score").innerText = ai.score;
document.getElementById("aiMessage").innerText = ai.message;

document.getElementById("level").innerText = data.level;
document.getElementById("xp").innerText = data.xp;

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

// =========================
// LOGROS
// =========================

function checkAchievements(){

let list = document.getElementById("achievements");

if(data.level >= 3){
addAch("🥋 Nivel 3 alcanzado");
}

if(data.xp > 1000){
addAch("⚡ 1000 XP acumulados");
}

if(data.fatigue >= 9){
addAch("🔥 Entreno extremo detectado");
}
}

function addAch(text){

let li = document.createElement("li");
li.innerText = text;
document.getElementById("achievements").appendChild(li);
}

// =========================
// GRAFICO
// =========================

function drawChart(){

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

// =========================
// CARGAR DATOS
// =========================

function load(){

let saved = JSON.parse(localStorage.getItem("tkd_elite"));

if(saved) data = saved;

updateSystem();
drawChart();
}

// =========================
// INIT
// =========================

window.onload = function(){
load();
};

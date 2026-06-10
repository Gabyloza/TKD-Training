let data = {
forms:0,
sparring:0,
strength:0,
speed:0,
flex:0,
endurance:0,
fatigue:5,
intensity:5,
xp:0,
level:1
};

// =========================
// IA CORE
// =========================

function aiEngine(){

let load =
data.forms +
data.sparring +
data.strength +
data.speed +
data.flex +
data.endurance;

// SCORE ATLETA (0–100)
let score =
(load / 10) +
(data.intensity * 3) -
(data.fatigue * 4);

score = Math.max(0, Math.min(100, Math.round(score)));

// DECISION ENGINE
let message = "";

if(score < 40){
message = "🟡 Baja carga → recuperación activa recomendada";
}
else if(score < 70){
message = "⚖️ Zona óptima de progreso";
}
else{
message = "🔥 Alto rendimiento → controlar fatiga";
}

if(data.fatigue >= 8){
message += " | ⚠️ DESCARGA NECESARIA";
}

if(data.speed < 30){
message += " | ⚡ mejorar velocidad";
}

if(data.forms < 40){
message += " | 🥋 mejorar formas ITF";
}

return {score, message};
}

// =========================
// GUARDAR
// =========================

function saveTraining(){

data.forms = +forms.value;
data.sparring = +sparring.value;
data.strength = +strength.value;
data.speed = +speed.value;
data.flex = +flex.value;
data.endurance = +endurance.value;
data.fatigue = +fatigue.value;
data.intensity = +intensity.value;

// XP SYSTEM
data.xp +=
data.forms +
data.sparring +
data.strength +
data.speed +
data.flex;

// LEVEL SYSTEM
data.level = Math.floor(data.xp / 500) + 1;

localStorage.setItem("itf_elite", JSON.stringify(data));

updateUI();
updateChart();
achievements();
}

// =========================
// UI
// =========================

function updateUI(){

let ai = aiEngine();

document.getElementById("score").innerText = ai.score;
document.getElementById("aiMessage").innerText = ai.message;

document.getElementById("level").innerText = data.level;
document.getElementById("xp").innerText = data.xp;

// MACROCICLO
let m = new Date().getMonth();

let cycle =
m==6?"Julio - Base ITF":
m==7?"Agosto - Fuerza":
m==8?"Septiembre - Potencia":
m==9?"Octubre - Velocidad":
m==10?"Noviembre - Combate":
"Diciembre - Peak";

document.getElementById("cycle").innerText = cycle;
}

// =========================
// LOGROS
// =========================

function achievements(){

let list = document.getElementById("achievements");

if(data.level >= 3){
add("🥋 Nivel 3 atleta ITF");
}

if(data.forms > 80){
add("🌀 Formas avanzadas dominadas");
}

if(data.sparring > 80){
add("🥊 Nivel competitivo sparring");
}
}

function add(text){
let li = document.createElement("li");
li.innerText = text;
document.getElementById("achievements").appendChild(li);
}

// =========================
// GRAFICO
// =========================

function updateChart(){

new Chart(chart,{

type:"radar",

data:{
labels:["Formas","Sparring","Fuerza","Velocidad","Flex","Resistencia"],
datasets:[{
data:[
data.forms,
data.sparring,
data.strength,
data.speed,
data.flex,
data.endurance
],
backgroundColor:"rgba(0,255,153,0.3)",
borderColor:"#00ff99"
}]
}
});
}

// =========================
// LOAD
// =========================

function load(){

let saved = JSON.parse(localStorage.getItem("itf_elite"));
if(saved) data = saved;

updateUI();
updateChart();
}

// =========================

window.onload = load;

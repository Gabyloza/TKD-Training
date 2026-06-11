// ============================
// TKD PERFORMANCE TRACKER V12
// ============================

let data = JSON.parse(
localStorage.getItem("tkdPerformance")
) || {
sessions:[]
};

// ============================
// NAVEGACION
// ============================

function openScreen(id){

document
.querySelectorAll(".screen")
.forEach(screen=>{

screen.classList.remove("active");

});

document
.getElementById(id)
.classList.add("active");

}

// ============================
// SAVE
// ============================

function save(){

let session = {

date:new Date().toLocaleDateString(),

sleep:+document.getElementById("sleep").value || 0,

weight:+document.getElementById("weight").value || 0,

energy:+document.getElementById("energy").value || 0,

motivation:+document.getElementById("motivation").value || 0,

fatigue:+document.getElementById("fatigue").value || 0,

// TKD

tkdMinutes:+document.getElementById("tkdMinutes").value || 0,

forms:+document.getElementById("forms").value || 0,

sparringRounds:+document.getElementById("sparringRounds").value || 0,

kicks:+document.getElementById("kicks").value || 0,

// NATACION

swimMeters:+document.getElementById("swimMeters").value || 0,

swimMinutes:+document.getElementById("swimMinutes").value || 0,

swimExercises:
document.getElementById("swimExercises").value || "",

// BICICLETA

bikeKm:+document.getElementById("bikeKm").value || 0,

bikeMinutes:+document.getElementById("bikeMinutes").value || 0,

// FUERZA

strengthMinutes:
+document.getElementById("strengthMinutes").value || 0,

// VELOCIDAD

speedMinutes:
+document.getElementById("speedMinutes").value || 0,

// FLEX

flexMinutes:
+document.getElementById("flexMinutes").value || 0,

// HANDBALL

handballMinutes:
+document.getElementById("handballMinutes").value || 0,

notes:
document.getElementById("notes").value || ""

};

data.sessions.push(session);

localStorage.setItem(
"tkdPerformance",
JSON.stringify(data)
);

update();

alert("Entrenamiento guardado ✅");

}

// ============================
// IA HUMANA
// ============================

function humanAI(){

if(data.sessions.length===0){

return "Todavía no hay suficientes datos.";

}

let s = data.sessions[data.sessions.length-1];

let totalTraining =

s.tkdMinutes +
s.swimMinutes +
s.bikeMinutes +
s.strengthMinutes +
s.speedMinutes +
s.flexMinutes +
s.handballMinutes;

if(s.sleep < 6){

return "😴 Dormiste poco. Priorizá recuperación.";

}

if(s.fatigue > 80){

return "⚠️ Fatiga muy alta. Reducí carga.";

}

if(totalTraining > 240){

return "🔥 Carga elevada. Recuperación recomendada.";

}

if(s.energy > 70 && s.fatigue < 40){

return "🟢 Excelente estado para entrenar fuerte.";

}

return "🟡 Estado normal de entrenamiento.";

}

// ============================
// METRICAS
// ============================

function totalHours(){

let minutes = 0;

data.sessions.forEach(s=>{

minutes +=

s.tkdMinutes +
s.swimMinutes +
s.bikeMinutes +
s.strengthMinutes +
s.speedMinutes +
s.flexMinutes +
s.handballMinutes;

});

return (minutes/60).toFixed(1);

}

function totalSwim(){

return data.sessions.reduce(
(total,s)=>total+s.swimMeters,
0
);

}

function totalBike(){

return data.sessions.reduce(
(total,s)=>total+s.bikeKm,
0
);

}

// ============================
// CUMPLIMIENTO
// ============================

function compliance(){

if(data.sessions.length===0){

return 0;

}

let last7 = data.sessions.slice(-7);

let score = 0;

last7.forEach(s=>{

let total =

s.tkdMinutes +
s.swimMinutes +
s.bikeMinutes +
s.strengthMinutes +
s.speedMinutes +
s.flexMinutes +
s.handballMinutes;

if(total >= 60){

score++;

}

});

return Math.round(
(score/7)*100
);

}

// ============================
// HISTORIAL
// ============================

function renderHistory(){

let div =
document.getElementById("history");

div.innerHTML = "";

data.sessions
.slice()
.reverse()
.forEach(s=>{

div.innerHTML += `

<div class="history-card">

<div class="history-date">

📅 ${s.date}

</div>

<div class="history-row">
🥋 TKD: ${s.tkdMinutes} min
</div>

<div class="history-row">
🏊 Natación: ${s.swimMeters} m
</div>

<div class="history-row">
🚴 Bicicleta: ${s.bikeKm} km
</div>

<div class="history-row">
💪 Fuerza: ${s.strengthMinutes} min
</div>

<div class="history-row">
🤸 Flexibilidad: ${s.flexMinutes} min
</div>

<div class="history-row">
😴 Sueño: ${s.sleep} h
</div>

<div class="history-row">
📝 ${s.notes}
</div>

</div>

`;

});

}

// ============================
// CHARTS
// ============================

let mainChart;
let sportsChart;
let sleepChart;

function drawCharts(){

// MAIN

let load = data.sessions.map(s=>

s.tkdMinutes +
s.swimMinutes +
s.bikeMinutes +
s.strengthMinutes +
s.speedMinutes +
s.flexMinutes +
s.handballMinutes

);

if(mainChart){

mainChart.destroy();

}

mainChart = new Chart(

document.getElementById("mainChart"),

{

type:"line",

data:{

labels:data.sessions.map(s=>s.date),

datasets:[{

label:"Carga",

data:load

}]

}

}

);

// SPORTS

let tkd = 0;
let swim = 0;
let bike = 0;

data.sessions.forEach(s=>{

tkd += s.tkdMinutes;

swim += s.swimMinutes;

bike += s.bikeMinutes;

});

if(sportsChart){

sportsChart.destroy();

}

sportsChart = new Chart(

document.getElementById("sportsChart"),

{

type:"doughnut",

data:{

labels:[
"TKD",
"Natación",
"Bicicleta"
],

datasets:[{

data:[
tkd,
swim,
bike
]

}]

}

}

);

// SLEEP

if(sleepChart){

sleepChart.destroy();

}

sleepChart = new Chart(

document.getElementById("sleepChart"),

{

type:"bar",

data:{

labels:data.sessions.map(
s=>s.date
),

datasets:[{

label:"Sueño",

data:data.sessions.map(
s=>s.sleep
)

}]

}

}

);

}

// ============================
// UPDATE
// ============================

function update(){

document
.getElementById("humanAI")
.innerText = humanAI();

document
.getElementById("totalHours")
.innerText =
totalHours()+" h";

document
.getElementById("totalSwim")
.innerText =
totalSwim()+" m";

document
.getElementById("totalBike")
.innerText =
totalBike()+" km";

document
.getElementById("compliance")
.innerText =
compliance()+"%";

renderHistory();

drawCharts();

}

// ============================

window.onload = function(){

update();

};

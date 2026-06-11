// ======================================
// TKD PERFORMANCE TRACKER V13
// ======================================

// ---------- STORAGE ----------

let db = JSON.parse(
localStorage.getItem("tkd_v13")
) || {

sessions:[],

goals:{
weeklySessions:4,
weeklyHours:5,

monthlyHours:20,
monthlyBike:100,
monthlySwim:5000,

mainGoal:"Cinturón Negro"
}

};

// ---------- CHARTS ----------

let loadChartInstance = null;
let sportChartInstance = null;
let sleepChartInstance = null;
let hydrationChartInstance = null;

// ---------- HELPERS ----------

function $(id){
return document.getElementById(id);
}

function todayISO(){

return new Date()
.toISOString()
.split("T")[0];

}

// ---------- INIT ----------

window.onload = ()=>{

if($("sessionDate"))
$("sessionDate").value = todayISO();

updateAll();

};

// ======================================
// NAVEGACION
// ======================================

function openScreen(screenId){

document
.querySelectorAll(".screen")
.forEach(screen=>{

screen.classList.remove("active");

});

$(screenId)
.classList.add("active");

}

// ======================================
// GUARDAR OBJETIVOS
// ======================================

function saveGoals(){

db.goals.weeklySessions =
+$("weeklyGoal").value || 0;

db.goals.weeklyHours =
+$("weeklyHoursGoal").value || 0;

db.goals.monthlyHours =
+$("monthlyHoursGoal").value || 0;

db.goals.monthlyBike =
+$("monthlyBikeGoal").value || 0;

db.goals.monthlySwim =
+$("monthlySwimGoal").value || 0;

db.goals.mainGoal =
$("mainGoal").value || "";

saveDB();

updateAll();

alert("Objetivos guardados");

}

// ======================================
// GUARDAR SESION
// ======================================

function saveSession(){

let duration =
+$("duration").value || 0;

let intensity =
+$("intensity").value || 1;

let load =
duration * intensity;

let session = {

id:Date.now(),

date:
$("sessionDate").value,

sport:
$("sport").value,

duration,

intensity,

load,

hydration:
+$("hydration").value || 0,

sleep:
+$("sleep").value || 0,

energy:
+$("energy").value || 0,

motivation:
+$("motivation").value || 0,

fatigue:
+$("fatigue").value || 0,

energyNote:
$("energyNote").value,

motivationNote:
$("motivationNote").value,

fatigueNote:
$("fatigueNote").value,

generalExercises:
$("generalExercises").value,

notes:
$("notes").value,

// TKD

forms:
$("forms").value,

sparring:
+$("sparring").value || 0,

tkdDetails:
$("tkdDetails").value,

// NATACION

swimMeters:
+$("swimMeters").value || 0,

swimStyle:
$("swimStyle").value,

swimExercises:
$("swimExercises").value,

// BICICLETA

bikeKm:
+$("bikeKm").value || 0,

bikePace:
+$("bikePace").value || 0,

bikeDetails:
$("bikeDetails").value,

// FUERZA

strengthExercises:
$("strengthExercises").value,

strengthNotes:
$("strengthNotes").value,

// VELOCIDAD

speedExercises:
$("speedExercises").value,

// FLEXIBILIDAD

flexZones:
$("flexZones").value,

flexMethod:
$("flexMethod").value,

// HANDBALL

handballMinutes:
+$("handballMinutes").value || 0,

handballExercises:
$("handballExercises").value

};

db.sessions.push(session);

saveDB();

clearForm();

updateAll();

alert("Sesión guardada");

}

// ======================================
// STORAGE
// ======================================

function saveDB(){

localStorage.setItem(
"tkd_v13",
JSON.stringify(db)
);

}
// ======================================
// LIMPIAR FORMULARIO
// ======================================

function clearForm(){

$("duration").value = "";
$("hydration").value = "";
$("sleep").value = "";

$("energy").value = 5;
$("motivation").value = 5;
$("fatigue").value = 5;

$("energyNote").value = "";
$("motivationNote").value = "";
$("fatigueNote").value = "";

$("generalExercises").value = "";
$("notes").value = "";

$("forms").value = "";
$("sparring").value = "";
$("tkdDetails").value = "";

$("swimMeters").value = "";
$("swimStyle").value = "";
$("swimExercises").value = "";

$("bikeKm").value = "";
$("bikePace").value = "";
$("bikeDetails").value = "";

$("strengthExercises").value = "";
$("strengthNotes").value = "";

$("speedExercises").value = "";

$("flexZones").value = "";
$("flexMethod").value = "";

$("handballMinutes").value = "";
$("handballExercises").value = "";

}

// ======================================
// UPDATE GENERAL
// ======================================

function updateAll(){

updateDashboard();

updateCoach();

updateGoals();

updateStats();

updateCalendar();

}

// ======================================
// DASHBOARD
// ======================================

function updateDashboard(){

let sessions = db.sessions;

// Horas

let totalMinutes =
sessions.reduce(
(sum,s)=>sum+s.duration,
0
);

let totalHours =
(totalMinutes/60).toFixed(1);

// Natación

let swimTotal =
sessions.reduce(
(sum,s)=>sum+s.swimMeters,
0
);

// Bicicleta

let bikeTotal =
sessions.reduce(
(sum,s)=>sum+s.bikeKm,
0
);

// Puntaje general

let score = calculateScore();

// Mostrar

if($("totalHours"))
$("totalHours").innerText =
totalHours + " h";

if($("totalSwim"))
$("totalSwim").innerText =
swimTotal + " m";

if($("totalBike"))
$("totalBike").innerText =
bikeTotal + " km";

if($("todayScore"))
$("todayScore").innerText =
score;

// Racha

let streakData =
calculateStreak();

if($("streak"))
$("streak").innerText =
streakData.current;

drawLoadChart();

}

// ======================================
// PUNTAJE GENERAL
// ======================================

function calculateScore(){

if(db.sessions.length === 0)
return 0;

let recent =
db.sessions.slice(-10);

let avgEnergy =
average(
recent.map(s=>s.energy)
);

let avgMotivation =
average(
recent.map(s=>s.motivation)
);

let avgFatigue =
average(
recent.map(s=>s.fatigue)
);

let avgIntensity =
average(
recent.map(s=>s.intensity)
);

let avgHydration =
average(
recent.map(s=>s.hydration)
);

let score =

(avgEnergy * 3) +
(avgMotivation * 3) +
(avgIntensity * 2) +
(avgHydration)

-

(avgFatigue * 2);

score =
Math.max(
0,
Math.min(
100,
Math.round(score)
)
);

return score;

}

// ======================================
// IA ENTRENADOR
// ======================================

function updateCoach(){

if(!$("humanAI"))
return;

let msg =
coachAnalysis();

$("humanAI").innerText =
msg;

if($("coachAI"))
$("coachAI").innerText =
msg;

}

function coachAnalysis(){

if(db.sessions.length === 0){

return "Todavía no hay suficientes sesiones registradas.";

}

let last =
db.sessions[
db.sessions.length - 1
];

let text = "";

// Energía

if(last.energy >= 8){

text +=
"Buen nivel de energía. ";

}
else if(last.energy <= 4){

text +=
"Tu energía está baja. ";

}

// Fatiga

if(last.fatigue >= 8){

text +=
"Hay acumulación de fatiga. ";

}

// Intensidad

if(last.intensity >= 8){

text +=
"Sesión intensa registrada. ";

}

// Hidratación

if(last.hydration < 1.5){

text +=
"Deberías aumentar tu hidratación. ";

}

// Sueño

if(last.sleep < 6){

text +=
"El descanso fue insuficiente. ";

}

if(text === ""){

text =
"Buen equilibrio entre carga y recuperación.";

}

return text;

}

// ======================================
// RACHAS
// ======================================

function calculateStreak(){

let dates =
[
...new Set(
db.sessions.map(
s=>s.date
)
)
]
.sort();

if(dates.length === 0){

return {
current:0,
best:0
};

}

let best = 1;
let current = 1;

for(
let i=1;
i<dates.length;
i++
){

let prev =
new Date(dates[i-1]);

let curr =
new Date(dates[i]);

let diff =
(curr-prev)
/(1000*60*60*24);

if(diff === 1){

current++;

best =
Math.max(
best,
current
);

}
else{

current = 1;

}

}

return{

current,
best

};

}

// ======================================
// HELPERS
// ======================================

function average(arr){

if(arr.length===0)
return 0;

return arr.reduce(
(a,b)=>a+b,
0
)/arr.length;

}
// ======================================
// OBJETIVOS
// ======================================

function updateGoals(){

if(!$("weeklyGoalsSummary"))
return;

let currentMonth =
new Date().getMonth();

let monthSessions =
db.sessions.filter(s=>
new Date(s.date).getMonth() === currentMonth
);

let totalHours =
monthSessions.reduce(
(sum,s)=>sum+s.duration,
0
)/60;

let totalBike =
monthSessions.reduce(
(sum,s)=>sum+s.bikeKm,
0
);

let totalSwim =
monthSessions.reduce(
(sum,s)=>sum+s.swimMeters,
0
);

$("weeklyGoalsSummary").innerHTML =

`
<div class="goal-card">

<div class="goal-title">
Sesiones registradas
</div>

<strong>
${db.sessions.length}
/
${db.goals.weeklySessions}
</strong>

</div>
`;

$("monthlyGoalsSummary").innerHTML =

`
<div class="goal-card">

<div class="goal-title">
Horas del mes
</div>

<strong>
${totalHours.toFixed(1)}
/
${db.goals.monthlyHours}
h
</strong>

</div>

<div class="goal-card">

<div class="goal-title">
Kilómetros bicicleta
</div>

<strong>
${totalBike}
/
${db.goals.monthlyBike}
km
</strong>

</div>

<div class="goal-card">

<div class="goal-title">
Metros natación
</div>

<strong>
${totalSwim}
/
${db.goals.monthlySwim}
m
</strong>

</div>
`;

}

// ======================================
// ESTADISTICAS
// ======================================

function updateStats(){

drawSportsChart();

drawSleepChart();

drawHydrationChart();

updateComparisons();

}

// ======================================
// COMPARACIONES
// ======================================

function updateComparisons(){

if(!$("weeklyComparison"))
return;

let last7 =
db.sessions.slice(-7);

let prev7 =
db.sessions.slice(-14,-7);

let currentLoad =
last7.reduce(
(sum,s)=>sum+s.load,
0
);

let previousLoad =
prev7.reduce(
(sum,s)=>sum+s.load,
0
);

let diff =
currentLoad - previousLoad;

$("weeklyComparison").innerHTML =

`
<div class="compare-box">

<div>
Carga semanal
</div>

<div class="
compare-value
${diff>=0 ? "compare-up":"compare-down"}
">

${diff>=0 ? "+" : ""}
${diff}

</div>

</div>
`;

let currentMonth =
new Date().getMonth();

let monthLoad =
db.sessions
.filter(
s=>new Date(s.date).getMonth()===currentMonth
)
.reduce(
(sum,s)=>sum+s.load,
0
);

$("monthlyComparison").innerHTML =

`
<div class="compare-box">

<div>
Carga mensual
</div>

<div class="compare-value">

${monthLoad}

</div>

</div>
`;

}

// ======================================
// CALENDARIO
// ======================================

function updateCalendar(){

if(!$("calendarGrid"))
return;

let grid =
$("calendarGrid");

grid.innerHTML = "";

for(let d=1; d<=31; d++){

let cell =
document.createElement("div");

cell.classList.add(
"calendar-day"
);

let count =
db.sessions.filter(s=>{

let day =
new Date(s.date)
.getDate();

return day===d;

}).length;

if(count===0){

cell.classList.add(
"calendar-none"
);

}
else if(count<=2){

cell.classList.add(
"calendar-low"
);

}
else if(count<=4){

cell.classList.add(
"calendar-medium"
);

}
else{

cell.classList.add(
"calendar-high"
);

}

cell.innerText = d;

grid.appendChild(cell);

}

let streak =
calculateStreak();

if($("currentStreak"))
$("currentStreak").innerText =
streak.current;

if($("bestStreak"))
$("bestStreak").innerText =
streak.best;

}

// ======================================
// GRAFICO DEPORTES
// ======================================

function drawSportsChart(){

if(!$("sportsChart"))
return;

let sports = {};

db.sessions.forEach(s=>{

sports[s.sport] =
(sports[s.sport] || 0)
+
s.duration;

});

if(sportChartInstance)
sportChartInstance.destroy();

sportChartInstance =
new Chart(
$("sportsChart"),
{

type:"doughnut",

data:{

labels:Object.keys(sports),

datasets:[{

data:Object.values(sports)

}]

}

});

}

// ======================================
// GRAFICO SUEÑO
// ======================================

function drawSleepChart(){

if(!$("sleepChart"))
return;

if(sleepChartInstance)
sleepChartInstance.destroy();

sleepChartInstance =
new Chart(
$("sleepChart"),
{

type:"line",

data:{

labels:
db.sessions.map(
s=>s.date
),

datasets:[{

label:"Sueño",

data:
db.sessions.map(
s=>s.sleep
)

}]

}

});

}

// ======================================
// GRAFICO HIDRATACION
// ======================================

function drawHydrationChart(){

if(!$("hydrationChart"))
return;

if(hydrationChartInstance)
hydrationChartInstance.destroy();

hydrationChartInstance =
new Chart(
$("hydrationChart"),
{

type:"bar",

data:{

labels:
db.sessions.map(
s=>s.date
),

datasets:[{

label:"Litros",

data:
db.sessions.map(
s=>s.hydration
)

}]

}

});

}
// ======================================
// GRAFICO PRINCIPAL DE CARGA
// ======================================

function drawLoadChart(){

if(!$("loadChart"))
return;

if(loadChartInstance)
loadChartInstance.destroy();

loadChartInstance =
new Chart(
$("loadChart"),
{

type:"line",

data:{

labels:
db.sessions.map(
s=>s.date
),

datasets:[{

label:"Carga",

data:
db.sessions.map(
s=>s.load
),

tension:0.3

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:true
}

}

}

});

}

// ======================================
// RESUMEN ENTRENADOR
// ======================================

function buildCoachSummary(){

if(!$("coachWeekly"))
return;

let last7 =
db.sessions.slice(-7);

let totalSessions =
last7.length;

let totalMinutes =
last7.reduce(
(sum,s)=>sum+s.duration,
0
);

let totalLoad =
last7.reduce(
(sum,s)=>sum+s.load,
0
);

let avgEnergy =
average(
last7.map(
s=>s.energy
)
).toFixed(1);

let avgMotivation =
average(
last7.map(
s=>s.motivation
)
).toFixed(1);

let avgFatigue =
average(
last7.map(
s=>s.fatigue
)
).toFixed(1);

$("coachWeekly").innerHTML =

`
<div class="summary-grid">

<div class="summary-item">
<span>Sesiones</span>
<strong>${totalSessions}</strong>
</div>

<div class="summary-item">
<span>Horas</span>
<strong>${(totalMinutes/60).toFixed(1)}</strong>
</div>

<div class="summary-item">
<span>Carga</span>
<strong>${totalLoad}</strong>
</div>

<div class="summary-item">
<span>Energía</span>
<strong>${avgEnergy}</strong>
</div>

<div class="summary-item">
<span>Motivación</span>
<strong>${avgMotivation}</strong>
</div>

<div class="summary-item">
<span>Fatiga</span>
<strong>${avgFatigue}</strong>
</div>

</div>
`;

}

// ======================================
// ALERTAS ENTRENADOR
// ======================================

function buildWarnings(){

if(!$("coachWarnings"))
return;

let warnings = [];

let last10 =
db.sessions.slice(-10);

if(last10.length === 0){

$("coachWarnings").innerHTML =
"Sin datos suficientes.";

return;

}

let avgFatigue =
average(
last10.map(
s=>s.fatigue
)
);

let avgSleep =
average(
last10.map(
s=>s.sleep
)
);

let avgHydration =
average(
last10.map(
s=>s.hydration
)
);

let avgIntensity =
average(
last10.map(
s=>s.intensity
)
);

// Fatiga

if(avgFatigue >= 7){

warnings.push(
"⚠️ Fatiga elevada."
);

}

// Sueño

if(avgSleep < 6){

warnings.push(
"😴 Descanso insuficiente."
);

}

// Hidratación

if(avgHydration < 1.5){

warnings.push(
"💧 Hidratación baja."
);

}

// Intensidad

if(avgIntensity > 8){

warnings.push(
"🔥 Intensidad muy alta sostenida."
);

}

if(warnings.length===0){

warnings.push(
"✅ Sin alertas importantes."
);

}

$("coachWarnings").innerHTML =

warnings.map(
w=>
`<div class="coach-box coach-warning">${w}</div>`
).join("");

}

// ======================================
// EXTENDER UPDATE COACH
// ======================================

const oldCoach =
updateCoach;

updateCoach = function(){

oldCoach();

buildCoachSummary();

buildWarnings();

};

// ======================================
// CARGAR OBJETIVOS EN PERFIL
// ======================================

function loadGoalsIntoProfile(){

if(!$("weeklyGoal"))
return;

$("weeklyGoal").value =
db.goals.weeklySessions;

$("weeklyHoursGoal").value =
db.goals.weeklyHours;

$("monthlyHoursGoal").value =
db.goals.monthlyHours;

$("monthlyBikeGoal").value =
db.goals.monthlyBike;

$("monthlySwimGoal").value =
db.goals.monthlySwim;

$("mainGoal").value =
db.goals.mainGoal;

}

// ======================================
// ACTUALIZAR GENERAL
// ======================================

const oldUpdateAll =
updateAll;

updateAll = function(){

oldUpdateAll();

loadGoalsIntoProfile();

};

// ======================================
// PRIMER ARRANQUE
// ======================================

updateAll();

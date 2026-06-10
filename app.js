let selectedDay = null;

let data = JSON.parse(localStorage.getItem("itf6")) || {
days:{},
xp:0,
fatigue:5
};

// =====================
// CALENDARIO
// =====================

function initCalendar(){

let calendar = document.getElementById("calendar");

let days = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

days.forEach((d,i)=>{

let div = document.createElement("div");
div.className="day";
div.innerText=d;

div.onclick=()=>selectDay(d,div);

calendar.appendChild(div);
});

updateAI();
updateWeekly();
}

// =====================
// SELECCIONAR DÍA
// =====================

function selectDay(day,el){

selectedDay = day;

document.querySelectorAll(".day").forEach(d=>d.classList.remove("active"));
el.classList.add("active");

let session = data.days[day] || {
tkd:false,
sparring:false,
strength:false,
speed:false,
flex:false,
run:false
};

document.getElementById("dayDetail").innerHTML = `
<label><input type="checkbox" id="tkd" ${session.tkd?"checked":""}> Formas ITF</label><br>
<label><input type="checkbox" id="sparring" ${session.sparring?"checked":""}> Sparring</label><br>
<label><input type="checkbox" id="strength"> Fuerza</label><br>
<label><input type="checkbox" id="speed"> Velocidad</label><br>
<label><input type="checkbox" id="flex"> Flexibilidad</label><br>
<label><input type="checkbox" id="run"> Resistencia</label>
`;
}

// =====================
// GUARDAR SESIÓN
// =====================

function saveSession(){

if(!selectedDay) return;

let session = {
tkd:tkd.checked,
sparring:sparring.checked,
strength:strength.checked,
speed:speed.checked,
flex:flex.checked,
run:run.checked
};

data.days[selectedDay] = session;

// XP SYSTEM
data.xp += Object.values(session).filter(Boolean).length * 20;

// FATIGA SIMPLE
data.fatigue += Object.values(session).filter(Boolean).length;

localStorage.setItem("itf6", JSON.stringify(data));

updateAI();
updateWeekly();
}

// =====================
// IA COACH
// =====================

function aiEngine(){

let totalDays = Object.keys(data.days).length;

let active = Object.values(data.days)
.flatMap(d=>Object.values(d))
.filter(Boolean).length;

let score = Math.min(100, active * 8 - data.fatigue * 3);

let message = "";

if(score < 40){
message="🟡 Baja carga → falta estímulo";
}
else if(score < 70){
message="⚖️ Zona óptima";
}
else{
message="🔥 Alto rendimiento";
}

if(data.fatigue > 15){
message += " | ⚠️ DESCARGA RECOMENDADA";
}

return {score,message};
}

// =====================
// UPDATE IA
// =====================

function updateAI(){

let ai = aiEngine();

document.getElementById("aiMessage").innerText = ai.message;

document.getElementById("status").innerText =
"Score atleta: " + ai.score + " | XP: " + data.xp;
}

// =====================
// RESUMEN SEMANAL
// =====================

function updateWeekly(){

let count = Object.keys(data.days).length;

document.getElementById("weeklyReport").innerText =
`Días activos: ${count} | XP total: ${data.xp} | Fatiga: ${data.fatigue}`;
}

// =====================
// INIT
// =====================

window.onload = initCalendar;

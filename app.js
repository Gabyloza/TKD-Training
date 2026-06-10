// ======================
// CARGA INICIAL
// ======================

window.onload = function () {
    loadData();
    createChart();
};

// ======================
// ACTUALIZAR PROGRESO
// ======================

function updateProgress() {

    const activities = document.querySelectorAll(".activity");

    let total = activities.length;
    let completed = 0;

    activities.forEach(item => {
        if(item.value === "Completado"){
            completed++;
        }
    });

    let percentage = Math.round((completed / total) * 100);

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("progressText").innerText =
        percentage + "%";

    let points = completed * 5;

    document.getElementById("points").innerText = points;

    saveProgress(percentage, points);

    unlockAchievements(completed);
}

// ======================
// GUARDAR PROGRESO
// ======================

function saveProgress(progress, points){

    localStorage.setItem("progress", progress);
    localStorage.setItem("points", points);

    const activities = [];

    document.querySelectorAll(".activity")
        .forEach(item=>{
            activities.push(item.value);
        });

    localStorage.setItem(
        "activities",
        JSON.stringify(activities)
    );
}

// ======================
// DIARIO
// ======================

function saveJournal(){

    localStorage.setItem(
        "sleep",
        document.getElementById("sleep").value
    );

    localStorage.setItem(
        "weight",
        document.getElementById("weight").value
    );

    localStorage.setItem(
        "motivation",
        document.getElementById("motivation").value
    );

    localStorage.setItem(
        "fatigue",
        document.getElementById("fatigue").value
    );

    localStorage.setItem(
        "notes",
        document.getElementById("notes").value
    );

    alert("Diario guardado ✔");
}

// ======================
// CARGAR DATOS
// ======================

function loadData(){

    const progress =
        localStorage.getItem("progress");

    const points =
        localStorage.getItem("points");

    if(progress){

        document.getElementById("progressBar")
            .style.width = progress + "%";

        document.getElementById("progressText")
            .innerText = progress + "%";
    }

    if(points){
        document.getElementById("points")
            .innerText = points;
    }

    const savedActivities =
        JSON.parse(
            localStorage.getItem("activities")
        );

    if(savedActivities){

        const selects =
            document.querySelectorAll(".activity");

        selects.forEach((select,index)=>{
            select.value =
                savedActivities[index];
        });
    }

    document.getElementById("sleep").value =
        localStorage.getItem("sleep") || "";

    document.getElementById("weight").value =
        localStorage.getItem("weight") || "";

    document.getElementById("motivation").value =
        localStorage.getItem("motivation") || "";

    document.getElementById("fatigue").value =
        localStorage.getItem("fatigue") || "";

    document.getElementById("notes").value =
        localStorage.getItem("notes") || "";
}

// ======================
// LOGROS
// ======================

function unlockAchievements(completed){

    const list =
        document.getElementById("achievementList");

    if(completed >= 1){

        if(
            !document.getElementById("firstAchievement")
        ){

            const li =
                document.createElement("li");

            li.id =
                "firstAchievement";

            li.innerText =
                "🏅 Primera actividad completada";

            list.appendChild(li);
        }
    }

    if(completed >= 5){

        if(
            !document.getElementById("weekAchievement")
        ){

            const li =
                document.createElement("li");

            li.id =
                "weekAchievement";

            li.innerText =
                "🔥 Semana casi perfecta";

            list.appendChild(li);
        }
    }
}

// ======================
// GRAFICO
// ======================

function createChart(){

    const ctx =
        document.getElementById("skillsChart");

    new Chart(ctx,{

        type:"radar",

        data:{

            labels:[
                "Fuerza",
                "Velocidad",
                "Flexibilidad",
                "Técnica",
                "Resistencia"
            ],

            datasets:[{

                label:"Nivel",

                data:[
                    60,
                    50,
                    70,
                    75,
                    65
                ],

                backgroundColor:
                    "rgba(76,175,80,.3)",

                borderColor:
                    "#4CAF50",

                borderWidth:2
            }]
        },

        options:{
            scales:{
                r:{
                    beginAtZero:true,
                    max:100
                }
            }
        }
    });
}

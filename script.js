async function fetchAQIData(city) {1
  try {
    const url = `https://api.waqi.info/feed/${city}/?token=${WAQI_TOKEN}`;

    let response = await fetch(url);

    if (!response.ok) {
      throw new Error("Cannot fetch data");
    }

    let data = await response.json();

    if (data.status !== "ok") {
      throw new Error("City not found");
    }

    console.log(data);

    return data;
  } catch (error) {
    console.error(error.message);
  }
}



 function getAQIBand(aqi) {
    if (aqi > 0 && aqi <= 50) {
      return { label: "Good", color: "green" };
    }
    if (aqi > 50 && aqi <= 100) {
      return { label: "Moderate", color: "yellow" };
    }
    if (aqi > 100 && aqi <= 150) {
      return { label: "Unnhealthy for sensitive groups", color: "orange" };
    }
    if (aqi > 150 && aqi <= 200) {
      return { label: "Unhealthy", color: "red" };
    }
    if (aqi > 200 && aqi <= 300) {
      return { label: "Very Unhealthy", color: "purple" };
    }
    if (aqi > 300) {
      return { label: "Hazardous", color: "maroon" };
    }
  }

let cardGrid = document.querySelector("#cardsGrid");

function renderAQICards(data, city) {
  
 
  let card = document.createElement("div");
  card.className = "aqi-card";

 

  let band = getAQIBand(data.aqi);

  card.style.borderLeft = `8px solid ${band.color}`;
  card.style.padding = `1rem`;

  card.innerHTML = `
     <h3>${data.city.name}</h3>
    <div class="aqi-number">${data.aqi}</div>
    <span class="aqi-band" style="background: ${band.color}">${band.label}</span>
    <p>Major Pollutant: ${data.dominentpol}</p>
    <p>Updated: ${data.time.s}</p>`;

  cardGrid.appendChild(card);
}

let btn = document.querySelector("#searchBtn");
btn.addEventListener("click", async function () {
  let city = document.querySelector("#citySearch").value;

  
 cardGrid.innerHTML = "";
  cardGrid.innerHTML = `<p>Loading....</p>`;
 

  let result = await fetchAQIData(city);
  if (result) {
      cardGrid.innerHTML = "";
    renderAQICards(result.data, city);
  } else {
    cardGrid.innerHTML = `<h1 style="color: red;">City not found. Try another search.</h1>`;
  }
});

let compTBtn = document.querySelector("#compareToggleBtn");
let compBar = document.querySelector("#compareBar");


compTBtn.addEventListener("click", function(){
    if(compBar.style.display === "none" && compTBtn.textContent === "Compare Cities"){
        compBar.style.display = "flex";
        compTBtn.textContent = "Close";
    }
    else {
        compBar.style.display = "none"
         compTBtn.textContent = "Compare Cities"
    }
   
})

let compRunBtn = document.querySelector("#compareRunBtn");


compRunBtn.addEventListener("click", async function(){

    let city1 = document.querySelector("#compareCity1").value;
    let city2 = document.querySelector("#compareCity2").value;
    let cities = [city1,city2];
    cardGrid.innerHTML = "";
    cardGrid.innerHTML = `<p>Loading....</p>`;

   let results = await Promise.allSettled([fetchAQIData(city1), fetchAQIData(city2)]);
   cardGrid.innerHTML = "";


   results.forEach(function(result,index){
       if(result.value){
        renderAQICards(result.value.data,cities[index]);
       }else{
        let p = document.createElement("p");
        p.textContent = `${cities[index]} not found`;
        cardGrid.appendChild(p);
       }
   })
})

let resetBtn = document.querySelector("#resetButton");

resetBtn.addEventListener("click", function(){
    cardGrid.innerHTML = "";
})
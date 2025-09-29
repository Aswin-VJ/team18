//TO-GET thye lat and long
const lat = 0;
const lon = 0;
async function getCityAirData(city) {
  const apiKey = "57f84fb3948f84ba9de6a31d526820ab";

  // Step 1: Get lat/lon from city name
  const geoRes = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  );
  const geoData = await geoRes.json();

  if (geoData.length === 0) {
    console.log("City not found!");
    return;
  }

  const { lat, lon } = geoData[0];

  // Step 2: Get air pollution data
  const airRes = await fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  const airData = await airRes.json();

  const commponents = airData.list[0].components;
  const aqi = airData.list[0].main.aqi;
  if(aqi == 1){
    document.getElementById('txt2').textContent = "Air is clean safe";
  }else if(aqi ==2 ){
    document.getElementById('txt2').textContent = "Fair 🙂 (Acceptable, some sensitive people may feel effects)";
  }else if(aqi ==3){
    document.getElementById('txt2').textContent = "Moderate 😐 (Okay, but watch out if sensitive) ";
  }else if(aqi ==4){
    document.getElementById('txt2').textContent = "Poor ⚠️ (Unhealthy for sensitive groups)";
  }else if(aqi ==5 ){
    document.getElementById('txt2').textContent = "Very Poor ❌ (Unsafe for everyone) ";
  }else{
    document.getElementById('txt2').textContent = "Very Poor ❌ (Unsafe for everyone) ";
  }
  

  
  document.getElementById('co').textContent = commponents.co;
  
  document.getElementById('no2').textContent = commponents.no2;
  document.getElementById('o3').textContent = commponents.o3;
  document.getElementById('so2').textContent = commponents.so2;
  document.getElementById('pm25').textContent = commponents.pm25;
  document.getElementById('pm10').textContent = commponents.pm10;
  document.getElementById('nh3').textContent = commponents.nh3;
  
}
//for hide the menu
const searchBtn = document.getElementById('search-btn');
    const hiddenDiv = document.getElementById('air-quality1');

    searchBtn.addEventListener('click', () => {
      hiddenDiv.style.display = 'block'; // Show the div when button is clicked
    });





function search(){
    const city = document.getElementById('search').value;
    console.log(city);
    getCityAirData(city);


}
console.log(lat,lon);




const API_KEY = "57f84fb3948f84ba9de6a31d526820ab";


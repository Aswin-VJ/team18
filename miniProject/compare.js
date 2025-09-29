async function getCityAirData(city1, city2) {
  const apiKey = "57f84fb3948f84ba9de6a31d526820ab";

  // Fetch geolocation for city1
  const geoRes1 = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city1)}&limit=1&appid=${apiKey}`
  );
  const geoData1 = await geoRes1.json();
  if (!geoData1.length) {
    alert(`City "${city1}" not found!`);
    return;
  }

  // Fetch geolocation for city2
  const geoRes2 = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city2)}&limit=1&appid=${apiKey}`
  );
  const geoData2 = await geoRes2.json();
  if (!geoData2.length) {
    alert(`City "${city2}" not found!`);
    return;
  }

  const { lat: lat1, lon: lon1 } = geoData1[0];
  const { lat: lat2, lon: lon2 } = geoData2[0];

  // Fetch air pollution data for city1
  const airRes1 = await fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat1}&lon=${lon1}&appid=${apiKey}`
  );
  const airData1 = await airRes1.json();

  // Fetch air pollution data for city2
  const airRes2 = await fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat2}&lon=${lon2}&appid=${apiKey}`
  );
  const airData2 = await airRes2.json();

  // Helper function to safely update element textContent
  function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  const components1 = airData1.list[0].components;
  const components2 = airData2.list[0].components;
  const aqi1 = airData1.list[0].main.aqi;
  const aqi2 = airData2.list[0].main.aqi;

  const aqiDescriptions = {
    1: "Air is clean safe",
    2: "Fair 🙂 (Acceptable, some sensitive people may feel effects)",
    3: "Moderate 😐 (Okay, but watch out if sensitive)",
    4: "Poor ⚠️ (Unhealthy for sensitive groups)",
    5: "Very Poor ❌ (Unsafe for everyone)",
  };

  updateText('txt2', `City 1: ${aqiDescriptions[aqi1] || "Unknown AQI"} | City 2: ${aqiDescriptions[aqi2] || "Unknown AQI"}`);

  // Update pollution components city1
  updateText('co1', components1.co);
  updateText('no21', components1.no2);
  updateText('o31', components1.o3);
  updateText('so21', components1.so2);
  updateText('pm251', components1.pm25);
  updateText('pm101', components1.pm10);
  updateText('nh31', components1.nh3);

  // Update pollution components city2
  updateText('co2', components2.co);
  updateText('no22', components2.no2);
  updateText('o32', components2.o3);
  updateText('so22', components2.so2);
  updateText('pm252', components2.pm25);
  updateText('pm102', components2.pm10);
  updateText('nh32', components2.nh3);
}

function compareCities() {
  const city1 = document.getElementById('city1').value.trim();
  const city2 = document.getElementById('city2').value.trim();

  if (!city1 || !city2) {
    alert("Please enter both city names.");
    return;
  }

  getCityAirData(city1, city2);
}

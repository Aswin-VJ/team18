const messageDiv = document.getElementById('message');

async function signup() {
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  messageDiv.textContent = '';

  if (!username || !password) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Please enter username and password to sign up.';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();

    if (res.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = 'Signup successful! You can now login.';
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Signup failed: ' + text;
    }
  } catch (err) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Error: ' + err.message;
  }
}

async function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  messageDiv.textContent = '';

  if (!username || !password) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Please enter username and password to login.';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();

    if (res.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = 'Login successful!';
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Login failed: ' + text;
    }
  } catch (err) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Error: ' + err.message;
  }
}

//  const apiKey = "57f84fb3948f84ba9de6a31d526820ab";

//     // Helper function to map AQI number to text
//     function getAqiText(aqi) {
//       switch(aqi) {
//         case 1: return "Air is clean safe";
//         case 2: return "Fair 🙂 (Acceptable, some sensitive people may feel effects)";
//         case 3: return "Moderate 😐 (Okay, but watch out if sensitive)";
//         case 4: return "Poor ⚠️ (Unhealthy for sensitive groups)";
//         case 5: return "Very Poor ❌ (Unsafe for everyone)";
//         default: return "Unknown AQI";
//       }
//     }

//     async function getCityAirData(city) {
//       // Step 1: Get lat/lon from city name
//       const geoRes = await fetch(
//         `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
//       );
//       const geoData = await geoRes.json();

//       if (geoData.length === 0) {
//         throw new Error("City not found: " + city);
//       }

//       const { lat, lon, name } = geoData[0];

//       // Step 2: Get air pollution data
//       const airRes = await fetch(
//         `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
//       );
//       const airData = await airRes.json();

//       if (!airData.list || airData.list.length === 0) {
//         throw new Error("No air pollution data for " + city);
//       }

//       const components = airData.list[0].components;
//       const aqi = airData.list[0].main.aqi;

//       return { name, components, aqi };
//     }

//     async function compareCities() {
//       const city1Input = document.getElementById("city1").value.trim();
//       const city2Input = document.getElementById("city2").value.trim();

//       if (!city1Input || !city2Input) {
//         alert("Please enter both cities.");
//         return;
//       }

//       // Reset UI placeholders while loading
//       const placeholders = ['co', 'no2', 'o3', 'so2', 'pm25', 'pm10', 'nh3'];
//       placeholders.forEach(id => {
//         document.getElementById(id + '1').textContent = "...";
//         document.getElementById(id + '2').textContent = "...";
//       });
//       document.getElementById("aqi1-text").textContent = "Loading...";
//       document.getElementById("aqi2-text").textContent = "Loading...";
//       document.getElementById("city1-name").textContent = "Loading...";
//       document.getElementById("city2-name").textContent = "Loading...";

//       try {
//         const [city1Data, city2Data] = await Promise.all([
//           getCityAirData(city1Input),
//           getCityAirData(city2Input),
//         ]);

//         // Update City 1 UI
//         document.getElementById("city1-name").textContent = city1Data.name;
//         document.getElementById("aqi1-text").textContent = `AQI: ${city1Data.aqi} - ${getAqiText(city1Data.aqi)}`;
//         document.getElementById("co1").textContent = city1Data.components.co;
//         document.getElementById("no21").textContent = city1Data.components.no2.toFixed(2);
//         document.getElementById("o31").textContent = city1Data.components.o3.toFixed(2);
//         document.getElementById("so21").textContent = city1Data.components.so2.toFixed(2);
//         document.getElementById("pm251").textContent = city1Data.components.pm2_5.toFixed(2);
//         document.getElementById("pm101").textContent = city1Data.components.pm10.toFixed(2);
//         document.getElementById("nh31").textContent = city1Data.components.nh3.toFixed(2);

//         // Update City 2 UI
//         document.getElementById("city2-name").textContent = city2Data.name;
//         document.getElementById("aqi2-text").textContent = `AQI: ${city2Data.aqi} - ${getAqiText(city2Data.aqi)}`;
//         document.getElementById("co2").textContent = city2Data.components.co.toFixed(2);
//         document.getElementById("no22").textContent = city2Data.components.no2.toFixed(2);
//         document.getElementById("o32").textContent = city2Data.components.o3.toFixed(2);
//         document.getElementById("so22").textContent = city2Data.components.so2.toFixed(2);
//         document.getElementById("pm252").textContent = city2Data.components.pm2_5.toFixed(2);
//         document.getElementById("pm102").textContent = city2Data.components.pm10.toFixed(2);
//         document.getElementById("nh32").textContent = city2Data.components.nh3.toFixed(2);

//       } catch (error) {
//         alert(error.message);
//         // Reset UI on error
//         const placeholders = ['co', 'no2', 'o3', 'so2', 'pm25', 'pm10', 'nh3'];
//         placeholders.forEach(id => {
//           document.getElementById(id + '1').textContent = "--";
//           document.getElementById(id + '2').textContent = "--";
//         });
//         document.getElementById("aqi1-text").textContent = "AQI: --";
//         document.getElementById("aqi2-text").textContent = "AQI: --";
//         document.getElementById("city1-name").textContent = "City 1";
//         document.getElementById("city2-name").textContent = "City 2";
//       }
//     }

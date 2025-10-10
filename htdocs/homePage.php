<?php
session_start();

// -------- PHP: Add city to database ----------
$host = "sql102.infinityfree.com";  
$user = "if0_40048739";
$pass = "Aswinvj1404";
$db   = "if0_40048739_users";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB Connection Failed: " . $conn->connect_error);

// ✅ Save search history with user_id
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['text'])) {

    // Check user login
    if (!isset($_SESSION['user_id'])) {
        echo "Error: user not logged in.";
        exit;
    }

    $text = $conn->real_escape_string($_POST['text']);
    $user_id = $_SESSION['user_id'];

    // ✅ Insert with user_id
    $conn->query("INSERT INTO history(user_id, text, created_at) VALUES('$user_id', '$text', NOW())");
    echo "Added";
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Air Quality Monitor</title>
    <style>
        * { box-sizing: border-box; font-family: Arial, sans-serif; }
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
            color: #fff;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .head {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.3);
        }

        nav.menu{
            display: flex;
            justify-content: center;
            gap: 15px;
            padding: 15px;
            flex-wrap: wrap;
        }
        nav.menu a{
            text-decoration: none;
            color: #fff;
            font-weight: bold;
            padding: 8px 15px;
            border-radius: 25px;
            background: rgba(0,0,0,0.2);
            transition: background 0.3s;
        }
        nav.menu a:hover { background: rgba(0,0,0,0.5); }

        .menu {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        .menu input, .menu button{
            padding: 10px 15px;
            border-radius: 25px;
            border: none;
            font-size: 1rem;
        }
        .menu button {
            background: rgba(0,0,0,0.3);
            color: #fff;
            cursor: pointer;
            transition: background 0.3s;
        }
        .menu button:hover { background: rgba(0,0,0,0.6); }

        #air-quality {
            display: none;
            margin: 20px auto;
            width: 90%;
            max-width: 1000px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }

        .box {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: transform 0.2s ease;
        }
        .box:hover { transform: translateY(-5px); }

        .box h2 { margin-bottom: 10px; font-size: 1.2rem; }
        .box b { font-weight: bold; }
    </style>
</head>
<body>

    <div class="head">
        <h1>Global Air Quality Monitor</h1>
        <p>Welcome, <?= htmlspecialchars($_SESSION['email'] ?? 'Guest') ?>!</p>
    </div>

    <nav class="menu">
        <a href="home.html">Home</a>
        <a href="homePage.php">Search</a>
        <a href="compare.html">Compare</a>
        <a href="history.php">History</a>
        <a href="logout.php">Logout</a>
    </nav>

    <div class="menu">
        <input type="text" id="search" placeholder="Enter city or country">
        <button id="search-btn">Search</button>
    </div>

    <div id="air-quality">
        <div class="box"><h2>QUALITY OF AIR: <span id="txt2"></span></h2></div>
        <div class="box"><b>CO:</b> <span id="co"></span></div>
        <div class="box"><b>NO₂:</b> <span id="no2"></span></div>
        <div class="box"><b>O₃:</b> <span id="o3"></span></div>
        <div class="box"><b>SO₂:</b> <span id="so2"></span></div>
        <div class="box"><b>PM2.5:</b> <span id="pm25"></span></div>
        <div class="box"><b>PM10:</b> <span id="pm10"></span></div>
        <div class="box"><b>NH₃:</b> <span id="nh3"></span></div>
    </div>

    <script>
        const apiKey = "57f84fb3948f84ba9de6a31d526820ab";

        async function getCityAirData(city) {
            try {
                const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
                const geoData = await geoRes.json();
                if (!geoData.length) return alert("City not found!");

                const { lat, lon } = geoData[0];
                const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
                const airData = await airRes.json();
                const comp = airData.list[0].components;
                const aqi = airData.list[0].main.aqi;

                const messages = [
                    "Air is clean ✅ Safe",
                    "Fair 🙂 Acceptable, minor effects",
                    "Moderate 😐 Some health concerns",
                    "Poor ⚠️ Unhealthy for sensitive groups",
                    "Very Poor ❌ Unsafe for everyone"
                ];

                document.getElementById("txt2").textContent = messages[aqi - 1] || "Unknown";
                document.getElementById("co").textContent = comp.co;
                document.getElementById("no2").textContent = comp.no2;
                document.getElementById("o3").textContent = comp.o3;
                document.getElementById("so2").textContent = comp.so2;
                document.getElementById("pm25").textContent = comp.pm2_5;
                document.getElementById("pm10").textContent = comp.pm10;
                document.getElementById("nh3").textContent = comp.nh3;
            } catch (err) { console.error(err); }
        }

       function addHistory(city) {
    if (!city.trim()) return;
    const fd = new FormData();
    fd.append("text", city);
    fetch("history.php?action=add", { method: "POST", body: fd })
        .then(res => res.text())
        .then(res => console.log(res))
        .catch(err => console.error(err));
}


        document.getElementById("search-btn").addEventListener("click", () => {
            const city = document.getElementById("search").value.trim();
            if (!city) return alert("Enter a city!");
            document.getElementById("air-quality").style.display = "grid";
            getCityAirData(city);
            addHistory(city);
        });
    </script>

</body>
</html>

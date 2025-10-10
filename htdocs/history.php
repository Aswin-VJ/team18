<?php
session_start();

// -------- DATABASE CONNECTION ----------
$host = "sql102.infinityfree.com";  
$user = "if0_40048739";
$pass = "Aswinvj1404";
$db   = "if0_40048739_users";
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) die("DB error: " . $conn->connect_error);

// Check if user logged in
if (!isset($_SESSION['user_id'])) {
    // For security: prevent access without login
    // You can change this redirect to your login page
    die("User not logged in. Please log in first.");
}

$user_id = $_SESSION['user_id']; // store user_id for this session
$action = $_GET['action'] ?? '';

// ---------- ADD HISTORY ----------
if ($action === 'add' && isset($_POST['text'])) {
    $text = $conn->real_escape_string($_POST['text']);
    $sql = "INSERT INTO history (user_id, text, created_at) VALUES ('$user_id', '$text', NOW())";
    if ($conn->query($sql)) {
        exit("Added");
    } else {
        exit("Error: " . $conn->error);
    }
}

// ---------- FETCH HISTORY ----------
elseif ($action === 'fetch') {
    $res = $conn->query("SELECT * FROM history WHERE user_id = '$user_id' ORDER BY id DESC");

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($rows);
    exit;
}

// ---------- UPDATE HISTORY ----------
elseif ($action === 'update' && isset($_POST['id'], $_POST['text'])) {
    $id = (int)$_POST['id'];
    $text = $conn->real_escape_string($_POST['text']);
    $conn->query("UPDATE history SET text='$text' WHERE id=$id AND user_id='$user_id'");
    exit("Updated");
}

// ---------- DELETE HISTORY ----------
elseif ($action === 'delete' && isset($_POST['id'])) {
    $id = (int)$_POST['id'];
    $conn->query("DELETE FROM history WHERE id=$id AND user_id='$user_id'");
    exit("Deleted");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>History</title>
<style>
/* (same CSS — unchanged) */
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #fff;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
nav.menu{ display:flex; justify-content:center; gap:15px; padding:15px; }
nav.menu a{
  text-decoration:none; color:#fff; font-weight:bold;
  padding:8px 15px; border-radius:5px; background: rgba(0,0,0,0.3);
  transition: background 0.3s;
}
nav.menu a:hover{ background: rgba(0,0,0,0.6); color:white; }
table {
  border-collapse: collapse;
  width: 90%; max-width: 1000px;
  margin: 20px auto;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background-color: rgba(255,255,255,0.15);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
th, td { border: 1px solid rgba(255,255,255,0.3); padding: 10px; text-align: center; }
th { font-size: 1.1rem; }
td { font-size: 1rem; }
button {
  margin: 2px; padding: 5px 10px; cursor: pointer;
  border-radius: 5px; border: none;
  background: rgba(0,0,0,0.3);
  color: #fff; font-weight: bold;
  transition: background 0.3s;
}
button:hover { background: rgba(0,0,0,0.6); }
h2 { text-align: center; margin: 20px 0; font-size: 2rem;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.4);
}
</style>
</head>
<body>

<h2>Search History</h2>

<nav class="menu">
<a href="home.html">Home</a>
<a href="homePage.php">Search</a>
<a href="compare.html">Compare</a>
<a href="history.php">History</a>
<a href="logout.php">Logout</a>

</nav>

<table>
<thead>
<tr><th>ID</th><th>City</th><th>Date</th><th>Action</th></tr>
</thead>
<tbody id="historyBody"></tbody>
</table>

<script>
function fetchHistory() {
    fetch("history.php?action=fetch")
    .then(res => res.json())
    .then(data => {
        let rows = "";
        data.forEach(r => rows += `<tr>
            <td>${r.id}</td>
            <td id="text-${r.id}">${r.text}</td>
            <td>${r.created_at}</td>
            <td>
            <button onclick="editHistory(${r.id})">Edit</button>
            <button onclick="deleteHistory(${r.id})">Delete</button>
            </td>
        </tr>`);
        document.getElementById("historyBody").innerHTML = rows;
    });
}

function editHistory(id) {
    const t = document.getElementById("text-" + id).innerText;
    document.getElementById("text-" + id).innerHTML = `<input id="edit-${id}" value="${t}"><button onclick="updateHistory(${id})">Submit</button>`;
}

function updateHistory(id) {
    const val = document.getElementById("edit-" + id).value;
    const fd = new FormData();
    fd.append("id", id); fd.append("text", val);
    fetch("history.php?action=update", { method:"POST", body:fd }).then(()=>fetchHistory());
}

function deleteHistory(id) {
    if(!confirm("Are you sure?")) return;
    const fd = new FormData(); fd.append("id", id);
    fetch("history.php?action=delete", { method:"POST", body:fd }).then(()=>fetchHistory());
}

document.addEventListener("DOMContentLoaded", fetchHistory);
</script>

</body>
</html>

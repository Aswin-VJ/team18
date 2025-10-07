<?php
$host = "sql102.infinityfree.com";   // ✅ Most reliable fo
$user = "if0_40048739";
$pass = "Aswinvj1404";
$db   = "if0_40048739_users";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
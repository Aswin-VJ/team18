<?php
include 'db.php';

if (isset($_POST['text'])) {
    $text = $_POST['text'];
    $sql = "INSERT INTO history (text) VALUES ('$text')";
    if ($conn->query($sql)) {
        echo "Success";
    } else {
        echo "Error: " . $conn->error;
    }
}
?>
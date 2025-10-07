<?php
include 'db.php';

if (isset($_POST['id']) && isset($_POST['text'])) {
    $id   = $_POST['id'];
    $text = $_POST['text'];
    $sql = "UPDATE history SET text='$text' WHERE id=$id";
    if ($conn->query($sql)) {
        echo "Updated";
    } else {
        echo "Error: " . $conn->error;
    }
}
?>
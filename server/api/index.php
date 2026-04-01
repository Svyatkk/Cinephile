<?php
header('Content-Type: application/json');
echo json_encode([
    "status" => "success",
    "message" => "Привіт від PHP бекенду!",
    "timestamp" => date('Y-m-d H:i:s'),
    "data" => [
        ["id" => 1, "title" => "Inception"],
        ["id" => 2, "title" => "Interstellar"],
        ["id" => 3, "title" => "The Dark Knight"]
    ]
]);

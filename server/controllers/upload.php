<?php
// controllers/upload.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
        
        $uploadDir = __DIR__ . '/../api/uploads/posters/'; 
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileExtension = pathinfo($_FILES['poster']['name'], PATHINFO_EXTENSION);
        $fileName = uniqid('poster_', true) . '.' . $fileExtension;
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['poster']['tmp_name'], $targetPath)) {
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $domain = $_SERVER['HTTP_HOST'];
            
            $fileUrl = $protocol . "://" . $domain . "/api/uploads/posters/" . $fileName;

            http_response_code(200);
            echo json_encode(['success' => true, 'url' => $fileUrl]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Не вдалося зберегти файл']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Файл не знайдено або сталася помилка завантаження']);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Метод не підтримується."]);
}
?>
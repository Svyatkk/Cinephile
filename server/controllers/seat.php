<?php
require_once __DIR__ . '/../services/SeatService.php';

$method = $_SERVER['REQUEST_METHOD'];
$seatService = new SeatService($db);

if ($method === 'GET') {
    if (isset($_GET['session_id'])) {
        $result = $seatService->getSeatsForSession($_GET['session_id']);
        if ($result['success']) {
            http_response_code(200);
            echo json_encode($result['data']);
        } else {
            http_response_code(404);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть session_id"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>

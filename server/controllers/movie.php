<?php
require_once __DIR__ . '/../services/MovieService.php';

$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

$movieService = new MovieService($db);

if ($method === 'POST') {
    if (!empty($data->title)) {
        
        $result = $movieService->create(
            $data->title,
            $data->original_title ?? '',
            $data->description ?? '',
            $data->poster_url ?? '',
            $data->release_year ?? null,
            $data->duration_minutes ?? null,
            $data->genres ?? '',
            $data->director ?? '',
            $data->cast_actors ?? '',
            $data->country ?? '',
            $data->studio ?? '',
            $data->language ?? '',
            $data->age_restriction ?? '',
            $data->inclusive_adaptation ?? 0
        );
    
        if ($result['success']) {
            http_response_code(201); 
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Неповні дані. Введіть хоча б назву фільму (title)."]);
    }
} 
else if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $result = $movieService->getMovieById($_GET['id']);
        
        if ($result['success']) {
            http_response_code(200);
            echo json_encode($result['data']);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => $result['message']]);
        }
    } 
    else {
        $result = $movieService->getAllMovies();
        
        if ($result['success']) {
            http_response_code(200);
            echo json_encode($result['data']);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Помилка при отриманні списку фільмів."]);
        }
    }
} 

else {
    http_response_code(405); 
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>
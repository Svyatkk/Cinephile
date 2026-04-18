<?php
require_once __DIR__ . '/../models/Session.php';

class SessionService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createSession($movie_id, $hall_id, $start_time, $end_time, $base_price, $format, $language_tag) {
        $session = new Session($this->db);
        
        if ($session->checkOverlap($hall_id, $start_time, $end_time)) {
            return ["success" => false, "message" => "У цій залі вже є сеанс у вибраний час."];
        }

        $session->movie_id = $movie_id;
        $session->hall_id = $hall_id;
        $session->start_time = $start_time;
        $session->end_time = $end_time;
        $session->base_price = $base_price;
        $session->format = $format;
        $session->language_tag = $language_tag;

        if ($session->create()) {
            return ["success" => true, "message" => "Сеанс успішно створено."];
        }

        return ["success" => false, "message" => "Помилка при створенні сеансу."];
    }
}
?>

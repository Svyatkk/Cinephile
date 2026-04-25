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

    public function getSessionsByMovieId($movie_id) {
        $query = "SELECT s.*, h.name as hall_name, c.name as cinema_name, c.address as cinema_address, ci.name as city_name
                  FROM sessions s
                  JOIN halls h ON s.hall_id = h.id
                  JOIN cinemas c ON h.cinema_id = c.id
                  JOIN cities ci ON c.city_id = ci.id
                  WHERE s.movie_id = :movie_id
                  AND s.start_time >= NOW()
                  ORDER BY s.start_time ASC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':movie_id', $movie_id);
        $stmt->execute();
        
        return ["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    }
}
?>

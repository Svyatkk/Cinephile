<?php
class Session {
    private $conn;
    private $table_name = "sessions";

    public $id;
    public $movie_id;
    public $hall_id;
    public $start_time;
    public $end_time;
    public $base_price;
    public $format;
    public $language_tag;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllSessions() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (movie_id, hall_id, start_time, end_time, base_price, format, language_tag) 
                VALUES 
                (:movie_id, :hall_id, :start_time, :end_time, :base_price, :format, :language_tag)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':movie_id', $this->movie_id);
        $stmt->bindParam(':hall_id', $this->hall_id);
        $stmt->bindParam(':start_time', $this->start_time);
        $stmt->bindParam(':end_time', $this->end_time);
        $stmt->bindParam(':base_price', $this->base_price);
        $stmt->bindParam(':format', $this->format);
        $stmt->bindParam(':language_tag', $this->language_tag);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
        
    public function checkOverlap($hall_id, $start_time, $end_time) {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE hall_id = :hall_id 
                  AND (
                      (start_time < :end_time AND end_time > :start_time)
                  ) LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':hall_id', $hall_id);
        $stmt->bindParam(':start_time', $start_time);
        $stmt->bindParam(':end_time', $end_time);

            
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true; 
        }
        return false; 
    }
}
?>

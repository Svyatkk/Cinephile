<?php
class City {
    private $conn;
    private $table_name = "cities";
    public $id;
    public $name;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (name) VALUES (:name)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $this->name);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $cities = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $queryCinemas = "SELECT * FROM cinemas";
        $stmtCinemas = $this->conn->prepare($queryCinemas);
        $stmtCinemas->execute();
        $cinemas = $stmtCinemas->fetchAll(PDO::FETCH_ASSOC);

        foreach ($cities as &$city) {
            $city['cinemas'] = [];
            foreach ($cinemas as $cinema) {
                if ($cinema['city_id'] == $city['id']) {
                    $city['cinemas'][] = $cinema;
                }
            }
        }

        return $cities;
    }

    public function getById(int $id) {
        $query = "SELECT * FROM $this->table_name WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
        
}
?>

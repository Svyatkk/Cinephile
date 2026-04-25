<?php
class Cinema {
    private $conn;
    private $table_name = "cinemas";

    public $id;
    public $name;
    public $city_id;
    public $address;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (name, city_id, address) VALUES (:name, :city_id, :address)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':city_id', $this->city_id);
        $stmt->bindParam(':address', $this->address);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

        
    public function readAll() {
        $query = "SELECT c.*, ci.name as city_name 
                  FROM " . $this->table_name . " c 
                  JOIN cities ci ON c.city_id = ci.id 
                  ORDER BY c.name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>

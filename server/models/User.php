<?php

class User {
    private $conn;
    private $table_name = "users";
    
    public $id;
    public $name;
    public $email;
    public $password_hash;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }

    public function getUserByEmail() {
        $query = "SELECT id, name, email, password_hash, role FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function create() {
    $query = "INSERT INTO " . $this->table_name . " (name, email, password_hash) VALUES (:name, :email, :password_hash)";

    $stmt = $this->conn->prepare($query);

    $this->name = htmlspecialchars(strip_tags($this->name));
    $this->email = htmlspecialchars(strip_tags($this->email));

    $stmt->bindParam(":name", $this->name);
    $stmt->bindParam(":email", $this->email);
    $stmt->bindParam(":password_hash", $this->password_hash);

    try {
        if ($stmt->execute()) {
            return true;
        }
    } catch (PDOException $e) {
 
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Помилка бази даних: " . $e->getMessage()
        ]);
        exit(); 
    }
    
    return false;
}
}
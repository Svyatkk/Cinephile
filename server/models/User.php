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
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function getUserByEmail() {
        $query = "SELECT id, name, email, password_hash, role FROM " . $this->table_name . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (name, email, password_hash, role)
                  VALUES (:name, :email, :password_hash, 'user')";
        $stmt = $this->conn->prepare($query);

        $this->name          = htmlspecialchars(strip_tags($this->name));
        $this->email         = htmlspecialchars(strip_tags($this->email));
        $this->password_hash = htmlspecialchars(strip_tags($this->password_hash));

        $stmt->bindParam(':name',          $this->name);
        $stmt->bindParam(':email',         $this->email);
        $stmt->bindParam(':password_hash', $this->password_hash);

        return $stmt->execute();
    }
}
?>
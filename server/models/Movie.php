<?php

class Movie {
    private $conn;
    private $table_name = "movies"; 

    public $id;
    public $title;
    public $original_title;
    public $description;
    public $poster_url;
    public $release_year;
    public $duration_minutes;
    public $genres;
    public $director;
    public $cast_actors;
    public $country;
    public $studio;
    public $language;
    public $age_restriction;
    public $inclusive_adaptation;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() { 
        $query = "INSERT INTO " . $this->table_name . " 
                (title, original_title, description, poster_url, release_year, duration_minutes, genres, director, cast_actors, country, studio, language, age_restriction, inclusive_adaptation) 
                VALUES 
                (:title, :original_title, :description, :poster_url, :release_year, :duration_minutes, :genres, :director, :cast_actors, :country, :studio, :language, :age_restriction, :inclusive_adaptation)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':original_title', $this->original_title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':poster_url', $this->poster_url);
        $stmt->bindParam(':release_year', $this->release_year);
        $stmt->bindParam(':duration_minutes', $this->duration_minutes);
        $stmt->bindParam(':genres', $this->genres);
        $stmt->bindParam(':director', $this->director);
        $stmt->bindParam(':cast_actors', $this->cast_actors);
        $stmt->bindParam(':country', $this->country);
        $stmt->bindParam(':studio', $this->studio);
        $stmt->bindParam(':language', $this->language);
        $stmt->bindParam(':age_restriction', $this->age_restriction);
        $stmt->bindParam(':inclusive_adaptation', $this->inclusive_adaptation);

        // 4. Виконання запиту
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    public function readOne($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->id = $row['id'];
            $this->title = $row['title'];
            $this->original_title = $row['original_title'];
            $this->description = $row['description'];
            $this->poster_url = $row['poster_url'];
            $this->release_year = $row['release_year'];
            $this->duration_minutes = $row['duration_minutes'];
            $this->genres = $row['genres'];
            $this->director = $row['director'];
            $this->cast_actors = $row['cast_actors'];
            $this->country = $row['country'];
            $this->studio = $row['studio'];
            $this->language = $row['language'];
            $this->age_restriction = $row['age_restriction'];
            $this->inclusive_adaptation = $row['inclusive_adaptation'];
            return true;
        }
        return false;
    }
}
?>
<?php
require_once __DIR__ . '/../models/Movie.php';

class MovieService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($title, $original_title, $description, $poster_url, $release_year, $duration_minutes, $genres, $director, $cast_actors, $country, $studio, $language, $age_restriction, $inclusive_adaptation) {
        
        $movie = new Movie($this->db); 

        $movie->title = $title;
        $movie->original_title = $original_title;
        $movie->description = $description;
        $movie->poster_url = $poster_url;
        $movie->release_year = $release_year;
        $movie->duration_minutes = $duration_minutes;
        $movie->genres = $genres;
        $movie->director = $director;
        $movie->cast_actors = $cast_actors;
        $movie->country = $country;
        $movie->studio = $studio;
        $movie->language = $language;
        $movie->age_restriction = $age_restriction;
        $movie->inclusive_adaptation = $inclusive_adaptation;

        if ($movie->create()) {
            return [
                "success" => true, 
                "message" => "Фільм успішно додано."
            ];
        } else {
            return [
                "success" => false, 
                "message" => "Помилка при збереженні фільму в базу даних."
            ];
        }
    }

    public function getAllMovies() {
        $movie = new Movie($this->db);
        $stmt = $movie->read();
        
        $movies_arr = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($movies_arr, $row);
        }
        
        return [
            "success" => true,
            "data" => $movies_arr
        ];
    }
    
        
    public function getMovieById($id) {
        $movie = new Movie($this->db);

        if ($movie->readOne($id)) {
            $movie_data = [
                "id" => $movie->id,
                "title" => $movie->title,
                "original_title" => $movie->original_title,
                "description" => $movie->description,
                "poster_url" => $movie->poster_url,
                "release_year" => $movie->release_year,
                "duration_minutes" => $movie->duration_minutes,
                "genres" => $movie->genres,
                "director" => $movie->director,
                "cast_actors" => $movie->cast_actors,
                "country" => $movie->country,
                "studio" => $movie->studio,
                "language" => $movie->language,
                "age_restriction" => $movie->age_restriction,
                "inclusive_adaptation" => $movie->inclusive_adaptation
            ];
            
            return [
                "success" => true,
                "data" => $movie_data
            ];
        } else {
            return [
                "success" => false,
                "message" => "Фільм не знайдено."
            ];
        }
    }

        
    
        
}
?>
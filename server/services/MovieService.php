<?php
require_once __DIR__ . '/../models/Movie.php';

class MovieService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function create(string $title, string $original_title, string $description, string $poster_url, ?int $release_year, ?int $duration_minutes, string $genres, string $director, string $cast_actors, string $country, string $studio, string $language, string $age_restriction, int $inclusive_adaptation): array {
        
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
    
    public function getAll(?int $cinema_id = null): array {
        try {
            if ($cinema_id) {
                $query = "
                    SELECT m.*, MIN(s.start_time) as nearest_session
                    FROM movies m
                    JOIN sessions s ON m.id = s.movie_id
                    JOIN halls h ON s.hall_id = h.id
                    WHERE h.cinema_id = :cinema_id AND s.start_time >= NOW()
                    GROUP BY m.id
                    ORDER BY nearest_session ASC
                ";
                $stmt = $this->db->prepare($query);
                $stmt->execute([':cinema_id' => $cinema_id]);
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $query = "
                    SELECT m.*, MIN(s.start_time) as nearest_session 
                    FROM movies m
                    LEFT JOIN sessions s ON m.id = s.movie_id AND s.start_time >= NOW()
                    GROUP BY m.id
                    ORDER BY nearest_session IS NULL, nearest_session ASC
                ";
                $stmt = $this->db->query($query);
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            return [];
        }
    }
    
        
    public function getMovieById(int $id): array {
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

    // public functoin getSesionsMovie($name) {
    //     $movie = new Movie($this->db);
    
            

    // }
        
}
?>
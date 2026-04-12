<?php
require_once __DIR__ . '/../models/User.php';

class UserService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function auth($name, $email, $password) {
        $user = new User($this->db);
        $user->email = $email;
    
        if ($user->emailExists()) {
                
            $userData = $user->getUserByEmail(); 

            if ($userData && password_verify($password, $userData['password_hash'])) {
                unset($userData['password_hash']); 
                
                return [
                    "success" => true, 
                    "message" => "Вхід успішний.",
                    "user" => $userData 
                ];
            } else {
                return ["success" => false, "message" => "Невірний пароль."];
            }

        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            $user->name = $name;
            $user->password_hash = $hashed_password;
    
            if ($user->create()) {
                $newUserData = $user->getUserByEmail();
                unset($newUserData['password_hash']);

                return [
                    "success" => true, 
                    "message" => "Реєстрація успішна та виконано вхід.",
                    "user" => $newUserData
                ];
            } else {
                return ["success" => false, "message" => "Помилка при створенні користувача."];
            }
        }
    }


}
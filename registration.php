<?php

$link = new mysqli('localhost', 'root', '', 'dnd');
	if ($link == false)
		echo 'Ошибка: Невозможно подключиться к MySQL ' . mysqli_connect_error();
	else {
		mysqli_set_charset($link, "utf8");	//кодировка
		
		if (!empty($_POST['login']) && !empty($_POST['password'])){
			$login = $_POST['login'];
			$password = $_POST['password'];
			$passwordHash = password_hash($password, PASSWORD_DEFAULT);
			
			/*$res = $link->query('SELECT login FROM users WHERE login="$login"');
			if(empty($res)){*/
			$query = "SELECT * FROM users WHERE login=?";
			$query = $link->prepare($query);
			$query->bind_param("s",$login);
			$query->execute();
			$user = $query->get_result()->fetch_assoc();

			// $result = mysqli_query($link, $query);
			// $user = mysqli_fetch_assoc($result);
			if (empty($user)){
				$query = "INSERT INTO users (login, password) VALUES (?, ?)";
				$query = $link->prepare($query);
				$query->bind_param("ss",$login,$passwordHash);
				$result = $query->execute();

				// $result = mysqli_query($link, $sql);
				if ($result == false) 
					echo "Произошла ошибка при выполнении запроса";				
				else {
					echo "Успешная регистрация";
					$_SESSION['auth'] = true;
					$_SESSION['login'] = $login;

					$key = random_int(1, 1000); 	//Сформируем случайную строку для куки 
					//Пишем куки (имя куки, значение, время жизни - сейчас+месяц)
					setcookie('login', $user['login'], time() + 60 * 60 * 24 * 30); //логин
					setcookie('token', $key, time() + 60 * 60 * 24 * 30); //случайная строка


					header("Location:http://localhost/dnd/page.html");
				}
			}
			else echo "Этот логин уже занят";
		}
		else echo "оно пустое";
			
			
			

			/*$res = $link->query('SELECT * FROM users');	
			while ($user = $res->fetch_object())
				echo "<br> $user->login, $user->password";*/

	}
/*$res = $mysqli->query('SELECT * FROM users');
if (isset($_POST['login']) && isset($_POST['password'])){
$login = $_POST['login'];
$password = $_POST['password'];
$res = $mysqli->query("SELECT login FROM users WHERE login='$login'");
if (!isset($res))
$add = $mysqli->query("INSERT INTO users(login, password) VALUES('$login', '$password')");
}*/
	
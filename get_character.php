<?php
	$link = new mysqli('localhost', 'root', '', 'dnd');
	header('Content-Type: text/html; charset=utf-8');
	if ($link == false)
		echo 'Ошибка: Невозможно подключиться к MySQL ' . mysqli_connect_error();
	else 
	{
        session_start();
		mysqli_set_charset($link, "utf8");
        $login = $_SESSION['login'];
        $name = $_GET['name'];
        $query = "SELECT character_string FROM characters where login = ? and name = ?";
		$query = $link->prepare($query);
		$query->bind_param("ss",$login,$name);
		$query->execute();

		$result = $query->get_result()->fetch_array();
        echo $result[0];
	}
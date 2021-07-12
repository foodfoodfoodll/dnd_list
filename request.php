<?php
	$link = new mysqli('localhost', 'root', '', 'dnd');
	
	if ($link == false)
		echo 'Ошибка: Невозможно подключиться к MySQL ' . mysqli_connect_error();
	else 
	{
		mysqli_set_charset($link, "utf8");
		if (!empty($_GET)){
			$value = $_GET['value'];	
			$table = $_GET['table'];	
			$col = $_GET['col'];	
			//$query = "SELECT * FROM armor WHERE armor='$value'";
			$query = "SELECT * FROM ".$table." WHERE ".$col." = ?" ;
			$query = $link->prepare($query);
			$query->bind_param("s",$value);
			$query->execute();

			$res = $query->get_result()->fetch_assoc();

			if (!empty($res))
				echo json_encode($res);
		}		
	}
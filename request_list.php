<?php
	$link = new mysqli('localhost', 'root', '', 'dnd');
	
	if ($link == false)
		echo 'Ошибка: Невозможно подключиться к MySQL ' . mysqli_connect_error();
	else 
	{
		mysqli_set_charset($link, "utf8");
		if (!empty($_GET)){
			$table = $_GET['table'];	
			$col = $_GET['col'];	
			$query = "SELECT ".$col." FROM ".$table;
			$query=$link->prepare($query);
			$query->execute();
			$result = $query->get_result();
			//$res = mysqli_fetch_assoc($result);
			if (!empty($res))
				echo json_encode($res);

			while ($a =	$result->fetch_array()) {   
				//echo $a[$col];
				$res = '"'.$a[$col].'"';
				//echo $res;
				echo "<option value=".$res.">\n";
			}
		}		
	}
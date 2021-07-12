<?php

$link = new mysqli('localhost','root','','dnd');
if($link == false)
    echo 'Ошибка: Невозможно подключиться к MySQL ' . mysqli_connect_error();
else{
    session_start();
    mysqli_set_charset($link,"utf8");
    $login = $_SESSION['login'];

    $query = "SELECT name FROM characters WHERE login=?";
    $query = $link -> prepare($query);
    $query->bind_param("s",$login);
    $query->execute();
    
    $result = $query->get_result();;
    while ($a = $result->fetch_array()) {   
        $res = '"'.$a['name'].'"';
        echo "<option value=".$res.">\n";
    }
}
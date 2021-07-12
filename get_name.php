<?php
    session_start();
    if(isset($_SESSION['login']) && isset($_COOKIE['login'])){
        echo $_COOKIE['login'];
        exit();
    }
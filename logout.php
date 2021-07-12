<?php
	header('Content-Type: text/html; charset=utf-8');
    session_start();
    setcookie('login', '');
    setcookie('token','');
    session_destroy();
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  error_reporting(E_ALL);
  ini_set('display_errors', 1);

  // Validación de entrada
  $name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_STRING);
  $email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);
  $subject = filter_input(INPUT_POST, "subject", FILTER_SANITIZE_STRING);
  $comments = filter_input(INPUT_POST, "comments", FILTER_SANITIZE_STRING);

  if (!$name || !$email || !$subject || !$comments) {
    echo json_encode(["err" => true, "message" => "Todos los campos son obligatorios y deben ser válidos."]);
    exit;
  }

  $domain = $_SERVER["HTTP_HOST"];
  $to = "jonmircha@gmail.com";
  $subject_mail = "Contacto desde el formulario del sitio $domain.";
  $message = "
    <p>Datos enviados desde el formulario del sitio <b>$domain</b></p>
    <ul>
      <li>Nombre: <b>$name</b></li>
      <li>Email: <b>$email</b></li>
      <li>Asunto: $subject</li>
      <li>Comentarios: " . nl2br(htmlspecialchars($comments)) . "</li>
    </ul>
  ";
  $headers = "MIME-Version: 1.0\r\n" .
             "Content-Type: text/html; charset=utf-8\r\n" .
             "From: No-Reply <$domain>";

  // Enviar el correo
  if (mail($to, $subject_mail, $message, $headers)) {
    $res = ["err" => false, "message" => "Tus datos han sido enviados con éxito."];
  } else {
    $res = ["err" => true, "message" => "Error al enviar tus datos. Intenta nuevamente."];
  }

  header("Access-Control-Allow-Origin: https://tudominio.com"); // Ajustar a tu dominio
  header('Content-type: application/json');
  echo json_encode($res);
  exit;
}

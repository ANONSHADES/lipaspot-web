<?php
// Accept only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Only POST allowed";
    exit;
}

// Input retrieval + sanitization
function get_post($k){
    return isset($_POST[$k]) ? trim($_POST[$k]) : '';
}

$fullname = strip_tags(get_post('fullname') ?: get_post('name') ?: '');
$business = strip_tags(get_post('business') ?: '');
$email    = filter_var(get_post('email') ?: '', FILTER_SANITIZE_EMAIL);
$phone    = strip_tags(get_post('phone') ?: '');
$message  = strip_tags(get_post('message') ?: '');

// Basic validation
if (!$fullname || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo "Please provide a valid name and email";
    exit;
}

// Your WhatsApp number in international format (no +, no spaces, no dashes)
$whatsappNumber = "254712345678"; // 👈 Replace with your real WhatsApp number

// Construct WhatsApp message
$text = "📩 New Demo Request:%0A"
      . "*Name:* $fullname%0A"
      . "*Business:* $business%0A"
      . "*Email:* $email%0A"
      . "*Phone:* $phone%0A"
      . "*Message:* $message";

// Redirect to WhatsApp
header("Location: https://wa.me/$whatsappNumber?text=$text");
exit;
?>

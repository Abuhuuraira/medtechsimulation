<?php
header('Content-Type: application/json; charset=utf-8');

register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error === null) {
        return;
    }

    $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR];
    if (!in_array($error['type'], $fatalTypes, true)) {
        return;
    }

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }

    echo json_encode(['success' => false, 'message' => 'Server error while processing your request.']);
});

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

function respond(int $statusCode, bool $success, string $message): void
{
    http_response_code($statusCode);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

function safeLen(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
}

$name = isset($_POST['name']) ? trim((string)$_POST['name']) : '';
$email = isset($_POST['email']) ? trim((string)$_POST['email']) : '';
$message = isset($_POST['message']) ? trim((string)$_POST['message']) : '';
$honeypot = isset($_POST['website']) ? trim((string)$_POST['website']) : '';

if ($honeypot !== '') {
    respond(200, true, 'Message received.');
}

if ($name === '' || $email === '' || $message === '') {
    respond(422, false, 'Please fill in all required fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Please enter a valid email address.');
}

if (safeLen($name) > 120 || safeLen($email) > 190 || safeLen($message) > 5000) {
    respond(422, false, 'Input exceeds the allowed length.');
}

$workspaceRoot = dirname(__DIR__);
$dataDirectory = $workspaceRoot . DIRECTORY_SEPARATOR . 'data';
$submissionsFile = $dataDirectory . DIRECTORY_SEPARATOR . 'contact_submissions.jsonl';

if (!is_dir($dataDirectory) && !mkdir($dataDirectory, 0755, true) && !is_dir($dataDirectory)) {
    respond(500, false, 'Could not initialize storage directory.');
}

$record = [
    'submittedAt' => gmdate('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'name' => $name,
    'email' => $email,
    'message' => $message,
    'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
];

$writeResult = file_put_contents($submissionsFile, json_encode($record, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
if ($writeResult === false) {
    respond(500, false, 'Failed to save your message.');
}

$adminEmail = getenv('ADMIN_EMAIL') ?: 'info@medtechsimulation.com';
$emailSubject = 'New Contact Form Submission';
$emailBody = "A new contact form submission was received.\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Message:\n{$message}\n\n"
    . "Submitted At (UTC): " . $record['submittedAt'] . "\n"
    . "IP: " . $record['ip'] . "\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: MedTech Simulation <no-reply@medtechsimulation.com>',
    'Reply-To: ' . $email
];

@mail($adminEmail, $emailSubject, $emailBody, implode("\r\n", $headers));

respond(200, true, 'Message received successfully.');

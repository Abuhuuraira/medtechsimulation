<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim(strtolower($uri ?? '/'), '/');

$filePath = __DIR__ . ($uri === '/' ? '/index.html' : $uri);
if ($uri !== '/' && is_file($filePath)) {
    return false;
}

$routes = [
    '' => 'index.html',
    'index' => 'index.html',
    'manikin' => 'manikin.html',
    'task-trainer' => 'task-trainer.html',
    'task-trainers' => 'task-trainer.html',
    'comparison-chart' => 'comparison-chart.html',
    'about-us' => 'about-us.html',
    'contact-us' => 'contact-us.html',

    'manikin/advanced-manikin-women' => 'manikin/advanced-manikin-women.html',
    'manikin/advanced-manikin-man' => 'manikin/advanced-manikin-man.html',
    'manikin/ems-man-manikin' => 'manikin/ems-man-manikin.html',
    'manikin/ems-women-manikin' => 'manikin/ems-women-manikin.html',
    'manikin/pro-adult-manikin-man' => 'manikin/pro-adult-manikin-man.html',
    'manikin/pro-adult-manikin_man' => 'manikin/pro-adult-manikin-man.html',
    'manikin/pro-adult-manikin-women' => 'manikin/pro-adult-manikin-women.html',
    'manikin/pro-plus-men-manikin' => 'manikin/pro-plus-men-manikin.html',
    'manikin/pro-plus-man-manikin' => 'manikin/pro-plus-men-manikin.html',
    'manikin/pro-plus-women-manikin' => 'manikin/pro-plus-women-manikin.html',
    'manikin/burnt-adult-manikin' => 'manikin/burnt-adult-manikin.html',
    'manikin/burn-adult' => 'manikin/burnt-adult-manikin.html',
    'manikin/blasted-adult-manikin' => 'manikin/blasted-adult-manikin.html',
    'manikin/blasted-adult' => 'manikin/blasted-adult-manikin.html',
    'manikin/advanced-child-10-years-old' => 'manikin/advanced-child-10-years-old.html',
    'manikin/advanced-child-10-year' => 'manikin/advanced-child-10-years-old.html',
    'manikin/advanced-child-5-years-old' => 'manikin/advanced-child-5-years-old.html',
    'manikin/advanced-child-5-year' => 'manikin/advanced-child-5-years-old.html',
    'manikin/advanced-infant-manikin-10-years-old' => 'manikin/advanced-infant-manikin-10-years-old.html',
    'manikin/advanced-infant-10-month' => 'manikin/advanced-infant-manikin-10-years-old.html',
    'manikin/advanced-pre-term-28-weeks-old' => 'manikin/advanced-pre-term-28-weeks-old.html',
    'manikin/advanced-pre-term-28-week' => 'manikin/advanced-pre-term-28-weeks-old.html',

    'task-trainers/ems-troso-trainer' => 'task-trainers/ems-troso-trainer.html',
    'task-trainers/ems-torso-trainer' => 'task-trainers/ems-troso-trainer.html',
    'task-trainers/major-leg-trauma-trainer' => 'task-trainers/major-leg-trauma-trainer.html',
    'task-trainers/leg-trauma-trainer' => 'task-trainers/major-leg-trauma-trainer.html',
    'task-trainers/shoulder-packing-wound' => 'task-trainers/shoulder-packing-wound.html',
    'task-trainers/thigh-packing-wound' => 'task-trainers/thigh-packing-wound.html',
];

if (!array_key_exists($path, $routes)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo '404 Not Found';
    exit;
}

$target = __DIR__ . '/' . $routes[$path];
if (!is_file($target)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo '404 Not Found';
    exit;
}

$ext = strtolower(pathinfo($target, PATHINFO_EXTENSION));
if ($ext === 'html') {
    header('Content-Type: text/html; charset=UTF-8');
}

readfile($target);

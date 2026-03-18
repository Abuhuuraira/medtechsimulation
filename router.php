<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim(strtolower($uri ?? '/'), '/');

$filePath = __DIR__ . ($uri === '/' ? '/index.html' : $uri);
if ($uri !== '/' && is_file($filePath)) {
    return false;
}

$routes = [
    '' => 'index.html',
    'manikin' => 'pages/manikin.html',
    'task-trainers' => 'pages/task_trainer.html',
    'comparison-chart' => 'pages/comparison_chart.html',
    'about-us' => 'pages/about_us.html',
    'contact-us' => 'pages/contact_us.html',

    'manikin/advanced-manikin-women' => 'manikin_pages/advanced_manikin_women.html',
    'manikin/advanced-manikin-man' => 'manikin_pages/advanced_manikin_man.html',
    'manikin/ems-man-manikin' => 'manikin_pages/ems_man_manikin.html',
    'manikin/ems-women-manikin' => 'manikin_pages/ems_women_manikin.html',
    'manikin/pro-adult-manikin-man' => 'manikin_pages/pro_adult_manikin_man.html',
    'manikin/pro-adult-manikin-women' => 'manikin_pages/pro_adult_manikin_women.html',
    'manikin/pro-plus-man-manikin' => 'manikin_pages/pro_plus_men_manikin.html',
    'manikin/pro-plus-women-manikin' => 'manikin_pages/pro_plus_women_manikin.html',
    'manikin/burn-adult' => 'manikin_pages/burnt_adult_manikin.html',
    'manikin/blasted-adult' => 'manikin_pages/blasted_adult_manikin.html',
    'manikin/advanced-child-10-year' => 'manikin_pages/advanced_child_10_years_old.html',
    'manikin/advanced-child-5-year' => 'manikin_pages/advanced_child_5_years_old.html',
    'manikin/advanced-infant-10-month' => 'manikin_pages/advanced_infant_manikin_10_years_old.html',
    'manikin/advanced-pre-term-28-week' => 'manikin_pages/advanced_pre-term_28_weeks_old.html',

    'task-trainers/ems-torso-trainer' => 'task_trainer_pages/ems_troso_trainer.html',
    'task-trainers/leg-trauma-trainer' => 'task_trainer_pages/major_leg_trauma_trainer.html',
    'task-trainers/shoulder-packing-wound' => 'task_trainer_pages/shoulder_packing_wound.html',
    'task-trainers/thigh-packing-wound' => 'task_trainer_pages/thigh_packing_wound.html',
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

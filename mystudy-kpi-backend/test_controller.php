<?php

require_once 'vendor/autoload.php';

use App\Kernel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$kernel = new Kernel('dev', true);
$request = Request::create('/api/lecturer/mentorships', 'GET');
// Mocking a lecturer user would be hard here without more setup, 
// but we can at least check if the container can boot and the controller can be reached.

try {
    $kernel->boot();
    $container = $kernel->getContainer();
    $controller = $container->get('App\Controller\Api\LecturerMentorshipController');
    echo "Controller found and instantiated successfully.
";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "
";
    echo $e->getTraceAsString() . "
";
}

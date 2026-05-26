<?php

return [
    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
    ],
    'mailgun' => [
        'secret' => env('MAILGUN_SECRET'),
        'domain' => env('MAILGUN_DOMAIN'),
    ],
    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],
    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
];

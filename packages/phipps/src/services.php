<?php

Use Aws\Sdk;
use Aws\S3\S3Client;
use Aws\S3\S3ClientInterface;
use Illuminate\Container\Container;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Yaml\Yaml;

$container = new Container();

$container->bind(Finder::CLASS, function () {
    return Finder::create()
        ->in(getenv('PHIPPS_LOCAL_ASSETS_DIR'))
        ->exclude('Sync.Cache')
        ->name('/\.(mobi|epub|pdf|mp3)$/');
});

$container->singleton(Sdk::CLASS, function () {
    return new Aws\Sdk([
        'version' => 'latest',
        'region'  => getenv('CLOUD_STORAGE_REGION'),
        'endpoint' => getenv('CLOUD_STORAGE_ENDPOINT'),
        'credentials' => [
            'key' => getenv('CLOUD_STORAGE_KEY'),
            'secret' => getenv('CLOUD_STORAGE_SECRET'),
        ],
    ]);
});

$container->bind(S3ClientInterface::CLASS, function (Container $container) {
    return $container->make(Sdk::CLASS)->createS3();
});


$container->bind(Iterator::CLASS, function () {
    $friendFiles = Finder::create()
        ->in(__DIR__ . '/../../friends/yml')
        ->files()
        ->name('*.yml');

    foreach ($friendFiles as $file) {
        $path = $file->getRelativePathname();
        yield $path => Yaml::parse($file->getContents());
    }
});

return $container;

<?php

namespace App\Services;

use Tinify\Exception as TinifyException;

class ImageCompressor
{
    public function __construct()
    {
        \Tinify\setKey(config('services.tinify.key'));
    }

    /**
     * Compress image and fallback to original if fails
     *
     * @param string $sourcePath - caminho temporário da imagem
     * @param string $destinationPath - onde salvar a imagem final
     * @return bool
     */
    public function compressOrFallback(string $sourcePath, string $destinationPath): bool
    {
        try {
            $source = \Tinify\fromFile($sourcePath);
            $source->toFile($destinationPath);

            return true;

        } catch (TinifyException $e) {

            copy($sourcePath, $destinationPath);

            \Log::warning("Tinify falhou: " . $e->getMessage());

            return false;
        }
    }

    /**
     * Get Tinify compression count (opcional)
     */
    public function getCompressionCount(): ?int
    {
        try {
            return \Tinify\compressionCount();
        } catch (\Exception $e) {
            return null;
        }
    }
}
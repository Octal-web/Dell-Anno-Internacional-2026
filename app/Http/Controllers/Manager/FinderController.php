<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class FinderController extends Controller
{

    private function basePath()
    {
        return public_path('files');
    }

    private function resolve($path = '')
    {
        $base = realpath($this->basePath());

        $target = realpath($base.'/'.$path) ?: $base.'/'.$path;

        if (!str_starts_with($target, $base)) {
            abort(403);
        }

        return $target;
    }

    public function list(Request $request)
    {
        $path = $this->resolve($request->path ?? '');

        $dirs = collect(File::directories($path))->map(fn($d) => [
            'name' => basename($d),
            'isDir' => true
        ]);

        $files = collect(File::files($path))->map(fn($f) => [
            'name' => $f->getFilename(),
            'isDir' => false,
            'size' => $f->getSize()
        ]);

        return $dirs->merge($files)->values();
    }

    public function upload(Request $request)
    {
        $path = $this->resolve($request->path ?? '');

        foreach ($request->file('files') as $file) {

            $name = time().'_'.$file->getClientOriginalName();

            $file->move($path, $name);
        }

        return ['success' => true];
    }

    public function delete(Request $request)
    {
        $path = $this->resolve($request->path);

        if (File::isDirectory($path)) {
            File::deleteDirectory($path);
        } else {
            File::delete($path);
        }

        return ['success' => true];
    }

    public function rename(Request $request)
    {
        $old = $this->resolve($request->old);
        $new = dirname($old).'/'.$request->new;

        File::move($old, $new);

        return ['success' => true];
    }

    public function createFolder(Request $request)
    {
        File::makeDirectory(
            $this->resolve($request->path.'/'.$request->name)
        );

        return ['success' => true];
    }

    public function move(Request $request)
    {
        File::move(
            $this->resolve($request->from),
            $this->resolve($request->to)
        );

        return ['success' => true];
    }
}
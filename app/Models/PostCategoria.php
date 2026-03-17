<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostCategoria extends Model {
    protected $table = 'posts_categorias';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function postsCategoriasIdiomas()
    {
        return $this->hasMany(PostCategoriaIdioma::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
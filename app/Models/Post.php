<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model {
    protected $table = 'posts';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    protected $casts = [
        'publicado' => 'datetime',
    ];
    
    public function postsIdiomas()
    {
        return $this->hasMany(PostIdioma::class);
    }

    public function categoria()
    {
        return $this->belongsTo(PostCategoria::class, 'post_categoria_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagemProjeto extends Model {
    protected $table = 'imagens_projetos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function projeto()
    {
        return $this->belongsTo(Projeto::class);
    }
}
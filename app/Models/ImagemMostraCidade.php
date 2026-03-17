<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagemMostraCidade extends Model {
    protected $table = 'imagens_mostras_cidades';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';
    
    public function mostraCidade()
    {
        return $this->belongsTo(MostraCidade::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagemShowroom extends Model {
    protected $table = 'imagens_showrooms';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';
    
    public function showroom()
    {
        return $this->belongsTo(Showroom::class);
    }
}
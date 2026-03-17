<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Showroom extends Model {
    protected $table = 'showrooms';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function imagens()
    {
        return $this->hasMany(ImagemShowroom::class);
    }
    
    public function showroomsIdiomas()
    {
        return $this->hasMany(ShowroomIdioma::class);
    }
    
    public function loja()
    {
        return $this->belongsTo(Loja::class);
    }
}
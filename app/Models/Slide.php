<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slide extends Model {
    protected $table = 'slides';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function slidesIdiomas()
    {
        return $this->hasMany(SlideIdioma::class);
    }
}
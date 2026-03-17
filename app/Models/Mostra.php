<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mostra extends Model {
    protected $table = 'mostras';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function mostrasIdiomas()
    {
        return $this->hasMany(MostraIdioma::class);
    }

    public function mostrasAnos()
    {
        return $this->hasMany(MostraAno::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destaque extends Model {
    protected $table = 'destaques';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function destaquesIdiomas()
    {
        return $this->hasMany(DestaqueIdioma::class);
    }
}
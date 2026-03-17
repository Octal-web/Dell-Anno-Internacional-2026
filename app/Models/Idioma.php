<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Idioma extends Model {
    protected $table = 'idiomas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';
}
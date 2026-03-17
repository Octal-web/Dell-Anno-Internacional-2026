<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etapa extends Model {
    protected $table = 'etapas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function etapasIdiomas()
    {
        return $this->hasMany(EtapaIdioma::class);
    }
}
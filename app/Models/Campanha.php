<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campanha extends Model {
    protected $table = 'campanhas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function campanhasIdiomas()
    {
        return $this->hasMany(CampanhaIdioma::class);
    }
}
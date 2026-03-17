<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcabamentoBloco extends Model {
    protected $table = 'acabamentos_blocos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function acabamentosBlocosIdiomas()
    {
        return $this->hasMany(AcabamentoBlocoIdioma::class);
    }
    
    public function acabamento()
    {
        return $this->belongsTo(Acabamento::class);
    }
}
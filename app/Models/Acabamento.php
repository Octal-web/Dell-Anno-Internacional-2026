<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acabamento extends Model {
    protected $table = 'acabamentos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function acabamentosIdiomas()
    {
        return $this->hasMany(AcabamentoIdioma::class);
    }
    
    public function blocos()
    {
        return $this->hasMany(AcabamentoBloco::class);
    }
}
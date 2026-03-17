<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pagina extends Model {
    protected $table = 'paginas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function paginasIdiomas()
    {
        return $this->hasMany(PaginaIdioma::class);
    }
}
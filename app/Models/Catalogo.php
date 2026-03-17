<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Catalogo extends Model {
    protected $table = 'catalogos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';
    
    public function catalogosIdiomas()
    {
        return $this->hasMany(CatalogoIdioma::class);
    }
    
    public function catalogoCategoria()
    {
        return $this->belongsTo(CatalogoCategoria::class);
    }
}
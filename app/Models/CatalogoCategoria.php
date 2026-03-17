<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatalogoCategoria extends Model {
    protected $table = 'catalogos_categorias';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function catalogos()
    {
        return $this->hasMany(Catalogo::class);
    }

    public function catalogosCategoriasIdiomas()
    {
        return $this->hasMany(CatalogoCategoriaIdioma::class);
    }
}
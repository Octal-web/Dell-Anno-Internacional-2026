<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model {
    protected $table = 'produtos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function produtosIdiomas()
    {
        return $this->hasMany(ProdutoIdioma::class);
    }

    public function imagens()
    {
        return $this->hasMany(ImagemProduto::class);
    }
    
    public function ambientes()
    {
        return $this->hasMany(Ambiente::class);
    }
}
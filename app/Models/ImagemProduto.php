<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagemProduto extends Model {
    protected $table = 'imagens_produtos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
    
    public function imagensProdutosIdiomas()
    {
        return $this->hasMany(ImagemProdutoIdioma::class);
    }
}
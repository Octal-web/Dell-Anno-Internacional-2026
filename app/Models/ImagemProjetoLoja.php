<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagemProjetoLoja extends Model
{
    protected $table = 'imagens_projetos_lojas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    protected $fillable = ['*'];

    protected $guarded = ['id'];

    public function projeto()
    {
        return $this->belongsTo(ProjetoLoja::class, 'projeto_loja_id');
    }
}
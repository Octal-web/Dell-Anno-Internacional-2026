<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Conteudo extends Model {
    protected $table = 'conteudos';

    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    protected $fillable = ['*'];

    protected $guarded = ['id'];

    public function parametro()
    {
        return $this->hasOne(Parametro::class);
    }

    public function conteudosIdiomas()
    {
        return $this->hasMany(ConteudoIdioma::class);
    }

    public function imagens()
    {
        return $this->hasMany(Imagem::class);
    }
}
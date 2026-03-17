<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estados';

    public $timestamps = false;
    
    public function cities()
    {
        return $this->hasMany(Cidade::class, 'estado_id');
    }
    
    public function loja()
    {
        return $this->belongsToMany(Loja::class, 'loja_estado');
    }
}

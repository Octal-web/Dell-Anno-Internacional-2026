<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MostraAno extends Model {
    protected $table = 'mostras_anos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function mostra()
    {
        return $this->belongsTo(Mostra::class);
    }

    public function mostrasCidades()
    {
        return $this->hasMany(MostraCidade::class);
    }
}
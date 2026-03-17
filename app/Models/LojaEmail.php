<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LojaEmail extends Model {
    protected $table = 'lojas_emails';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function loja()
    {
        return $this->belongsTo(Loja::class);
    }
}
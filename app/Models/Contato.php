<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contato extends Model {
    protected $table = 'contatos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    protected $fillable = ['nome', 'email', 'telefone', 'ocupacao', 'cidade_id', 'mensagem'];

    protected $guarded = ['id'];
}
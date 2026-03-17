<?php

namespace App\Services;

use App\Models\Contato;
use App\Models\Loja;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ContactService
{
    public function create(array $data): Contato
    {
        return DB::transaction(function () use ($data) {
            $lojaId = $this->resolveStoreId($data['cidade_id'] ?? null, $data['estado_id'] ?? null);

            $contatoData = collect($data)
                ->except(['policy', 'estado_id'])
                ->merge([ 
                    'loja_id' => $lojaId
                ])
                ->toArray();
 
            $contato = Contato::create($contatoData);
 
            $emails = ['francimara.frozza@unicasamoveis.com.br'];
            $temLoja = false;
            
            if ($lojaId) {
                $loja = Loja::with('emails')->find($lojaId);
                if ($loja && $loja->emails->isNotEmpty()) {
                    $emails = $loja->emails->pluck('email')->toArray();
                    $temLoja = true;
                }
            }

            $mailData = [
                'emails' => $emails,
                'tem_loja' => $temLoja,
                'contato_nome' => $contato->name,
                'contato_email' => $contato->email,
                'contato_regiao' => $contato->cidade->name . ' - ' . $contato->cidade->estado->codigo,
            ];

            $this->sendInvite($mailData);

            return $contato;
        });
    }

    protected function resolveStoreId(?int $cidadeId, ?int $estadoId): ?int
    {
        if ($cidadeId) {
            $loja = DB::table('loja_cidade')
                ->join('lojas', 'lojas.id', '=', 'loja_cidade.loja_id')
                ->where('loja_cidade.cidade_id', $cidadeId)
                ->select('lojas.id')
                ->first();

            if ($loja) {
                return $loja->id;
            }
        }

        if ($estadoId) {
            $loja = DB::table('loja_estado')
                ->where('estado_id', $estadoId)
                ->join('lojas', 'lojas.id', '=', 'loja_estado.loja_id')
                ->select('lojas.id')
                ->first();

            if ($loja) {
                return $loja->id;
            }
        }

        return null;
    }
     
    protected function sendInvite(array $data): void 
    { 
        foreach ($data['emails'] as $email) {
            Mail::send('emails.notifyStore', $data, function ($message) use ($email, $data) { 
                $message->from('tradeprogramdellanno@dellanno.com', 'Dell Anno') 
                        ->to($email) 
                        ->bcc('rafael@8poroito.com.br')
                        ->subject('A new contact has been sent from the website!'); 
                
                if ($data['tem_loja']) {
                    $message->bcc('francimara.frozza@unicasamoveis.com.br');
                }
            }); 
        }
    } 
}
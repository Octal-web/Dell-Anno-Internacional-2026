<div align="center">
  <h1>Dell Anno - 2026</h1>
</div>

O **Dell Anno 2026** é o uma atualização do site da Dell Anno desenvolvido em Wordpress

---

## Índice

- [Sobre](#sobre)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Como Executar o Projeto](#como-executar-o-projeto)

---

<h2 id="sobre">Sobre:</h2>

Através do painel administrativo é possível gerenciar conteúdos como produtos, lojas, projetos, blog, catálogos, etc. 

Ofere um CMS completo para criação, edição, organização e controle da visibilidade dos dados exibidos no front.

---

<h2 id="tecnologias-utilizadas">Tecnologias Utilizadas:</h2>

- PHP (^8.2): linguagem backend utilizada
- Laravel (^12.0): framework PHP
- Laravel Sanctum (^4.0): autenticação
- Laravel Localization (^2.2): multilinguagem
- Tinify (^1.6): compressão de imagens via API
- Inertia.js (^2.0): biblioteca para construir SPAs usando Laravel e frameworks (como React)
- Ziggy (^2.0): roteamento
- PT-BR Validator: valida dados brasileiros

---

<h2 id="arquitetura-do-projeto">Arquitetura principal do Projeto:</h2>

```bash
Sistema-Benvenutti-API
│
├── app
│   ├── Http
│   │   ├── Controllers    #Controladores responsáveis pelas requisições
│   │   ├── Middleware     #Interceptação e validação de requisições
│   │   ├── Requests       #Validação dos dados
│   ├── Models             #Representação das tabelas do banco (Eloquent)
│   ├── Providers          #Configuração de pacotes
│   ├── Services           #Regras de negócio
├── bootstrap              #Inicialização do framework
├── config                 #Arquivos de configuração
├── database               #Migrations, seeds e factories
├── public                 #Ponto de entrada
├── resources              #Arquivos referentes ao front
├── routes                 #Definição das rotas/endpoints da API
├── storage                #Arquivos gerados (logs, cache e etc.)
├── tests
│

```

---

<h2 id="como-executar-o-projeto">Como Executar o Projeto:</h2>

Clone o repositório:

```bash
git clone https://github.com/Octal-web/Dell-Anno-2026.git
cd Dell-Anno-2026
```

Crie um arquivo `.env`, veja o arquivo `.env.example` para orientação

Instale as dependências:

```bash
composer install
```

Rode o projeto:

```bash
php artisan serve
```

Acesse:

```bash
http://localhost:8000
```

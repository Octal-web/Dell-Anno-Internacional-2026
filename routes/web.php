<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\InstitucionalController;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\LojasController;
use App\Http\Controllers\LojasProjetosController;
use App\Http\Controllers\CidadesController;
use App\Http\Controllers\InspiracaoController;
use App\Http\Controllers\ShowroomsController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\AcabamentosController;
use App\Http\Controllers\MostrasController;
use App\Http\Controllers\OrcamentosController;
use App\Http\Controllers\ContatoController;
use App\Http\Controllers\CatalogosController;
use App\Http\Controllers\PoliticasController;
use App\Http\Controllers\ManualController;

use App\Http\Controllers\Manager\UsuariosController;
use App\Http\Controllers\Manager\ConteudosController as ManagerConteudosController;
use App\Http\Controllers\Manager\ImagensController as ManagerImagensController;
use App\Http\Controllers\Manager\FinderController as ManagerFinderController;
use App\Http\Controllers\Manager\HomeController as ManagerHomeController;
use App\Http\Controllers\Manager\SlidesController as ManagerSlidesController;
use App\Http\Controllers\Manager\CampanhasController as ManagerCampanhasController;
use App\Http\Controllers\Manager\DestaquesController as ManagerDestaquesController;
use App\Http\Controllers\Manager\InstitucionalController as ManagerInstitucionalController;
use App\Http\Controllers\Manager\AcontecimentosController as ManagerAcontecimentosController;
use App\Http\Controllers\Manager\EtapasController as ManagerEtapasController;
use App\Http\Controllers\Manager\ProdutosController as ManagerProdutosController;
use App\Http\Controllers\Manager\ImagensProdutosController as ManagerImagensProdutosController;
use App\Http\Controllers\Manager\AmbientesProdutosController as ManagerAmbientesProdutosController;
use App\Http\Controllers\Manager\ProjetosProdutosController as ManagerProjetosProdutosController;
use App\Http\Controllers\Manager\ImagensProjetosProdutosController as ManagerImagensProjetosProdutosController;
use App\Http\Controllers\Manager\LojasController as ManagerLojasController;
use App\Http\Controllers\Manager\CidadesController as ManagerCidadesController;
use App\Http\Controllers\Manager\ShowroomsController as ManagerShowroomsController;
use App\Http\Controllers\Manager\ImagensShowroomsController as ManagerImagensShowroomsController;
use App\Http\Controllers\Manager\LojasProjetosController as ManagerLojasProjetosController;
use App\Http\Controllers\Manager\ImagensLojasProjetosController as ManagerImagensLojasProjetosController;
use App\Http\Controllers\Manager\MostrasController as ManagerMostrasController;
use App\Http\Controllers\Manager\ContatoController as ManagerContatoController;
use App\Http\Controllers\Manager\AcabamentosController as ManagerAcabamentosController;
use App\Http\Controllers\Manager\BlogController as ManagerBlogController;
use App\Http\Controllers\Manager\PostsController as ManagerPostsController;
use App\Http\Controllers\Manager\PostsCategoriasController as ManagerPostsCategoriasController;
use App\Http\Controllers\Manager\CatalogosController as ManagerCatalogosController;
use App\Http\Controllers\Manager\CatalogosCategoriasController as ManagerCatalogosCategoriasController;
use App\Http\Controllers\Manager\PoliticasController as ManagerPoliticasController;

Route::group(['prefix' => LaravelLocalization::setLocale(), 'middleware' => ['localeSessionRedirect', 'localizationRedirect', 'localeViewPath']], function () {
    Route::get('/', [HomeController::class, 'index'])->name('Home.index');
    Route::post('/cidades/carregar', [CidadesController::class, 'carregar'])->name('Cidades.carregar');    

    Route::get('/brand', [InstitucionalController::class, 'index'])->name('Institucional.index');
    
    Route::get('/products', [ProdutosController::class, 'index'])->name('Produtos.index');
    Route::get('/products/{slug}', [ProdutosController::class, 'produto'])->name('Produtos.produto');
    // Route::get('/products/{slug}/more', [ProdutosController::class, 'colecoes'])->name('Produtos.colecoes');
    Route::get('/products/{slug}/{projeto}', [ProdutosController::class, 'projeto'])->name('Produtos.projeto');

    Route::get('/stores', [LojasController::class, 'index'])->name('Lojas.index');
    Route::get('/stores/{slug}', [LojasController::class, 'loja'])->name('Lojas.loja');
    
    Route::get('/get-inspired', [InspiracaoController::class, 'index'])->name('Inspiracao.index');

    Route::get('/stores-projects', [LojasProjetosController::class, 'index'])->name('Lojas.Projetos.index');
    Route::get('/stores-projects/{slug}', [LojasProjetosController::class, 'projeto'])->name('Lojas.Projetos.projeto');

    Route::get('/showrooms', [ShowroomsController::class, 'index'])->name('Showrooms.index');
    Route::get('/showrooms/{slug}', [ShowroomsController::class, 'showroom'])->name('Showrooms.showroom');

    Route::get('/frame', [BlogController::class, 'index'])->name('Blog.index');
    Route::get('/frame/{slug}', [BlogController::class, 'post'])->name('Blog.post');
    
    Route::get('/smartmaterials', [SmartMaterialsController::class, 'index'])->name('SmartMaterials.index');
    Route::get('/smartmaterials/{slug}', [SmartMaterialsController::class, 'loja'])->name('SmartMaterials.loja');
    
    Route::get('/finishes', [AcabamentosController::class, 'index'])->name('Acabamentos.index');
    Route::get('/finishes/{slug}', [AcabamentosController::class, 'acabamento'])->name('Acabamentos.acabamento');
    
    Route::get('/decoration-fairs', [MostrasController::class, 'index'])->name('Mostras.index');
    Route::get('/decoration-fairs/{slug}/', [MostrasController::class, 'mostra'])->name('Mostras.mostra');
    Route::get('/decoration-fairs/{slug}/{ano}', [MostrasController::class, 'ano'])->name('Mostras.mostra.ano');

    Route::get('/design-consultation', [OrcamentosController::class, 'index'])->name('Orcamentos.index');

    Route::get('/contact', [ContatoController::class, 'index'])->name('Contato.index');
    Route::post('/contact/send', [ContatoController::class, 'enviar'])->name('Contato.enviar');

    Route::get('/catalogs', [CatalogosController::class, 'index'])->name('Catalogos.index');
    Route::get('/catalogs/download/{id}', [CatalogosController::class, 'download'])->name('Catalogos.download');

    Route::get('/privacy-policy', [PoliticasController::class, 'privacidade'])->name('Politicas.privacidade');

    Route::get('/owner-manual', [ManualController::class, 'index'])->name('Manual.index');
});

Route::prefix('/manager')->group(function() {
    Route::get('/', [UsuariosController::class, 'login'])->name('Manager.Usuarios.login');
    Route::post('/', ['as' => 'login', 'uses' => 'App\Http\Controllers\Manager\UsuariosController@authenticate']);

    Route::post('/usuarios/logout', [UsuariosController::class, 'logout'])->name('Manager.Usuarios.logout');

    Route::group(['middleware' => ['auth']], function() {
        Route::post('/paginas/editar/{id}', [ManagerPaginasController::class, 'editarAction'])->name('Manager.Paginas.editar');

        Route::post('/conteudos/editar/{id}', [ManagerConteudosController::class, 'editarAction'])->name('Manager.Conteudos.editar');
        Route::post('/conteudos/baixar-arquivo/{id}', [ManagerConteudosController::class, 'baixarArquivo'])->name('Manager.Conteudos.baixarArquivo');

        Route::get('/imagens/{id}', [ManagerImagensController::class, 'conteudo'])->name('Manager.Imagens.conteudo');
        Route::post('/imagens/conteudo/adicionar/{id}', [ManagerImagensController::class, 'novo'])->name('Manager.Imagens.novo');
        
        Route::post('/imagens/conteudo/ordenar/{id}', [ManagerImagensController::class, 'ordenar'])->name('Manager.Imagens.ordenar');
        Route::post('/imagens/conteudo/visibilidade/{id}', [ManagerImagensController::class, 'visibilidade'])->name('Manager.Imagens.visibilidade');
        Route::post('/imagens/conteudo/excluir/{id}', [ManagerImagensController::class, 'excluir'])->name('Manager.Imagens.excluir');

        Route::get('/finder/list', [ManagerFinderController::class, 'list'])->name('Manager.Finder.list');
        Route::post('/finder/upload', [ManagerFinderController::class, 'upload'])->name('Manager.Finder.upload');
        Route::delete('/finder/delete', [ManagerFinderController::class, 'delete'])->name('Manager.Finder.delete');
        Route::post('/finder/rename', [ManagerFinderController::class, 'rename'])->name('Manager.Finder.rename');
        Route::post('/finder/folder', [ManagerFinderController::class, 'createFolder'])->name('Manager.Finder.createFolder');
        Route::post('/finder/move', [ManagerFinderController::class, 'move'])->name('Manager.Finder.move');


        Route::get('/home', [ManagerHomeController::class, 'index'])->name('Manager.Home.index');

        Route::post('/home/atualizar/dados', [ManagerHomeController::class, 'atualizarInfo'])->name('Manager.Home.atualizarInfo');
        
        Route::post('/slides/ordenar', [ManagerSlidesController::class, 'ordenar'])->name('Manager.Slides.ordenar');
        Route::post('/slides/visibilidade/{id}', [ManagerSlidesController::class, 'visibilidade'])->name('Manager.Slides.visibilidade');
        Route::post('/slides/excluir/{id}', [ManagerSlidesController::class, 'excluir'])->name('Manager.Slides.excluir');

        Route::get('/slides/adicionar/{tipo}', [ManagerSlidesController::class, 'adicionar'])->name('Manager.Slides.adicionar');
        Route::post('/slides/adicionar/{tipo}', [ManagerSlidesController::class, 'novo'])->name('Manager.Slides.novo');
        Route::get('/slides/editar/{id}', [ManagerSlidesController::class, 'editar'])->name('Manager.Slides.editar');
        Route::post('/slides/editar/{id}', [ManagerSlidesController::class, 'atualizar'])->name('Manager.Slides.atualizar');
        Route::get('/slides/baixar-video/{id}/{video}', [ManagerSlidesController::class, 'baixarVideo'])->name('Manager.Slides.baixarVideo');


        Route::post('/campanhas/ordenar', [ManagerCampanhasController::class, 'ordenar'])->name('Manager.Campanhas.ordenar');
        Route::post('/campanhas/visibilidade/{id}', [ManagerCampanhasController::class, 'visibilidade'])->name('Manager.Campanhas.visibilidade');
        Route::post('/campanhas/excluir/{id}', [ManagerCampanhasController::class, 'excluir'])->name('Manager.Campanhas.excluir');

        Route::get('/campanhas/adicionar', [ManagerCampanhasController::class, 'adicionar'])->name('Manager.Campanhas.adicionar');
        Route::post('/campanhas/adicionar', [ManagerCampanhasController::class, 'novo'])->name('Manager.Campanhas.novo');
        Route::get('/campanhas/editar/{id}', [ManagerCampanhasController::class, 'editar'])->name('Manager.Campanhas.editar');
        Route::post('/campanhas/editar/{id}', [ManagerCampanhasController::class, 'atualizar'])->name('Manager.Campanhas.atualizar');
        

        Route::post('/destaques/ordenar', [ManagerDestaquesController::class, 'ordenar'])->name('Manager.Destaques.ordenar');
        Route::post('/destaques/visibilidade/{id}', [ManagerDestaquesController::class, 'visibilidade'])->name('Manager.Destaques.visibilidade');
        Route::post('/destaques/excluir/{id}', [ManagerDestaquesController::class, 'excluir'])->name('Manager.Destaques.excluir');

        Route::get('/destaques/adicionar', [ManagerDestaquesController::class, 'adicionar'])->name('Manager.Destaques.adicionar');
        Route::post('/destaques/adicionar', [ManagerDestaquesController::class, 'novo'])->name('Manager.Destaques.novo');
        Route::get('/destaques/editar/{id}', [ManagerDestaquesController::class, 'editar'])->name('Manager.Destaques.editar');
        Route::post('/destaques/editar/{id}', [ManagerDestaquesController::class, 'atualizar'])->name('Manager.Destaques.atualizar');
        Route::get('/destaques/baixar-video/{id}', [ManagerDestaquesController::class, 'baixarVideo'])->name('Manager.Destaques.baixarVideo');
        

        Route::get('/institucional', [ManagerInstitucionalController::class, 'index'])->name('Manager.Institucional.index');
        
        Route::post('/acontecimentos/ordenar', [ManagerAcontecimentosController::class, 'ordenar'])->name('Manager.Acontecimentos.ordenar');
        Route::post('/acontecimentos/visibilidade/{id}', [ManagerAcontecimentosController::class, 'visibilidade'])->name('Manager.Acontecimentos.visibilidade');
        Route::post('/acontecimentos/excluir/{id}', [ManagerAcontecimentosController::class, 'excluir'])->name('Manager.Acontecimentos.excluir');

        Route::get('/acontecimentos/adicionar', [ManagerAcontecimentosController::class, 'adicionar'])->name('Manager.Acontecimentos.adicionar');
        Route::post('/acontecimentos/adicionar', [ManagerAcontecimentosController::class, 'novo'])->name('Manager.Acontecimentos.novo');
        Route::get('/acontecimentos/editar/{id}', [ManagerAcontecimentosController::class, 'editar'])->name('Manager.Acontecimentos.editar');
        Route::post('/acontecimentos/editar/{id}', [ManagerAcontecimentosController::class, 'atualizar'])->name('Manager.Acontecimentos.atualizar');

        
        Route::post('/etapas/ordenar', [ManagerEtapasController::class, 'ordenar'])->name('Manager.Etapas.ordenar');
        Route::post('/etapas/visibilidade/{id}', [ManagerEtapasController::class, 'visibilidade'])->name('Manager.Etapas.visibilidade');
        Route::post('/etapas/excluir/{id}', [ManagerEtapasController::class, 'excluir'])->name('Manager.Etapas.excluir');

        Route::get('/etapas/adicionar', [ManagerEtapasController::class, 'adicionar'])->name('Manager.Etapas.adicionar');
        Route::post('/etapas/adicionar', [ManagerEtapasController::class, 'novo'])->name('Manager.Etapas.novo');
        Route::get('/etapas/editar/{id}', [ManagerEtapasController::class, 'editar'])->name('Manager.Etapas.editar');
        Route::post('/etapas/editar/{id}', [ManagerEtapasController::class, 'atualizar'])->name('Manager.Etapas.atualizar');


        Route::get('/produtos', [ManagerProdutosController::class, 'index'])->name('Manager.Produtos.index');
        
        Route::post('/produtos/ordenar', [ManagerProdutosController::class, 'ordenar'])->name('Manager.Produtos.ordenar');
        Route::post('/produtos/visibilidade/{id}', [ManagerProdutosController::class, 'visibilidade'])->name('Manager.Produtos.visibilidade');
        Route::post('/produtos/excluir/{id}', [ManagerProdutosController::class, 'excluir'])->name('Manager.Produtos.excluir');

        Route::get('/produtos/adicionar', [ManagerProdutosController::class, 'adicionar'])->name('Manager.Produtos.adicionar');
        Route::post('/produtos/adicionar', [ManagerProdutosController::class, 'novo'])->name('Manager.Produtos.novo');
        Route::get('/produtos/editar/{id}', [ManagerProdutosController::class, 'editar'])->name('Manager.Produtos.editar');
        Route::post('/produtos/editar/{id}', [ManagerProdutosController::class, 'atualizar'])->name('Manager.Produtos.atualizar');
        

        Route::get('/produtos/imagens/{id}', [ManagerImagensProdutosController::class, 'index'])->name('Manager.Produtos.Imagens.index');
        Route::post('/produtos/imagens/adicionar/{id}', [ManagerImagensProdutosController::class, 'novo'])->name('Manager.Produtos.Imagens.novo');
        
        Route::post('/produtos/imagens/cortar/{id}', [ManagerImagensProdutosController::class, 'cortar'])->name('Manager.Produtos.Imagens.cortar');
        Route::post('/produtos/imagens/ordenar/{id}', [ManagerImagensProdutosController::class, 'ordenar'])->name('Manager.Produtos.Imagens.ordenar');
        Route::post('/produtos/imagens/visibilidade/{id}', [ManagerImagensProdutosController::class, 'visibilidade'])->name('Manager.Produtos.Imagens.visibilidade');
        Route::post('/produtos/imagens/excluir/{id}', [ManagerImagensProdutosController::class, 'excluir'])->name('Manager.Produtos.Imagens.excluir');


        Route::get('/produtos/ambientes/{id}', [ManagerAmbientesProdutosController::class, 'index'])->name('Manager.Produtos.Ambientes.index');
        
        Route::post('/produtos/ambientes/ordenar', [ManagerAmbientesProdutosController::class, 'ordenar'])->name('Manager.Produtos.Ambientes.ordenar');
        Route::post('/produtos/ambientes/visibilidade/{id}', [ManagerAmbientesProdutosController::class, 'visibilidade'])->name('Manager.Produtos.Ambientes.visibilidade');
        Route::post('/produtos/ambientes/excluir/{id}', [ManagerAmbientesProdutosController::class, 'excluir'])->name('Manager.Produtos.Ambientes.excluir');

        Route::get('/produtos/ambientes/adicionar/{id}', [ManagerAmbientesProdutosController::class, 'adicionar'])->name('Manager.Produtos.Ambientes.adicionar');
        Route::post('/produtos/ambientes/adicionar/{id}', [ManagerAmbientesProdutosController::class, 'novo'])->name('Manager.Produtos.Ambientes.novo');
        Route::get('/produtos/ambientes/editar/{id}', [ManagerAmbientesProdutosController::class, 'editar'])->name('Manager.Produtos.Ambientes.editar');
        Route::post('/produtos/ambientes/editar/{id}', [ManagerAmbientesProdutosController::class, 'atualizar'])->name('Manager.Produtos.Ambientes.atualizar');

        
        Route::post('/produtos/projetos/ordenar', [ManagerProjetosProdutosController::class, 'ordenar'])->name('Manager.Produtos.Projetos.ordenar');
        Route::post('/produtos/projetos/visibilidade/{id}', [ManagerProjetosProdutosController::class, 'visibilidade'])->name('Manager.Produtos.Projetos.visibilidade');
        Route::post('/produtos/projetos/excluir/{id}', [ManagerProjetosProdutosController::class, 'excluir'])->name('Manager.Produtos.Projetos.excluir');

        Route::get('/produtos/projetos/adicionar/{id}', [ManagerProjetosProdutosController::class, 'adicionar'])->name('Manager.Produtos.Projetos.adicionar');
        Route::post('/produtos/projetos/adicionar/{id}', [ManagerProjetosProdutosController::class, 'novo'])->name('Manager.Produtos.Projetos.novo');
        Route::get('/produtos/projetos/editar/{id}', [ManagerProjetosProdutosController::class, 'editar'])->name('Manager.Produtos.Projetos.editar');
        Route::post('/produtos/projetos/editar/{id}', [ManagerProjetosProdutosController::class, 'atualizar'])->name('Manager.Produtos.Projetos.atualizar');
        

        Route::get('/produtos/projetos/imagens/{id}', [ManagerImagensProjetosProdutosController::class, 'index'])->name('Manager.Produtos.Projetos.Imagens.index');
        Route::post('/produtos/projetos/imagens/adicionar/{id}', [ManagerImagensProjetosProdutosController::class, 'novo'])->name('Manager.Produtos.Projetos.Imagens.novo');
        
        Route::post('/produtos/projetos/imagens/cortar/{id}', [ManagerImagensProjetosProdutosController::class, 'cortar'])->name('Manager.Produtos.Projetos.Imagens.cortar');
        Route::post('/produtos/projetos/imagens/ordenar/{id}', [ManagerImagensProjetosProdutosController::class, 'ordenar'])->name('Manager.Produtos.Projetos.Imagens.ordenar');
        Route::post('/produtos/projetos/imagens/visibilidade/{id}', [ManagerImagensProjetosProdutosController::class, 'visibilidade'])->name('Manager.Produtos.Projetos.Imagens.visibilidade');
        Route::post('/produtos/projetos/imagens/excluir/{id}', [ManagerImagensProjetosProdutosController::class, 'excluir'])->name('Manager.Produtos.Projetos.Imagens.excluir');

        
        Route::get('/lojas', [ManagerLojasController::class, 'index'])->name('Manager.Lojas.index');
        
        Route::post('/lojas/ordenar', [ManagerLojasController::class, 'ordenar'])->name('Manager.Lojas.ordenar');
        Route::post('/lojas/visibilidade/{id}', [ManagerLojasController::class, 'visibilidade'])->name('Manager.Lojas.visibilidade');
        Route::post('/lojas/excluir/{id}', [ManagerLojasController::class, 'excluir'])->name('Manager.Lojas.excluir');

        Route::get('/lojas/adicionar', [ManagerLojasController::class, 'adicionar'])->name('Manager.Lojas.adicionar');
        Route::post('/lojas/adicionar', [ManagerLojasController::class, 'novo'])->name('Manager.Lojas.novo');
        Route::get('/lojas/editar/{id}', [ManagerLojasController::class, 'editar'])->name('Manager.Lojas.editar');
        Route::post('/lojas/editar/{id}', [ManagerLojasController::class, 'atualizar'])->name('Manager.Lojas.atualizar');
        Route::get('/lojas/baixar-video/{id}', [ManagerLojasController::class, 'baixarVideo'])->name('Manager.Lojas.baixarVideo');

        Route::post('/lojas/cities/carregar', [ManagerCidadesController::class, 'carregar'])->name('Manager.Cidades.carregar');

        
        Route::get('/showrooms', [ManagerShowroomsController::class, 'index'])->name('Manager.Showrooms.index');
        
        Route::post('/showrooms/ordenar', [ManagerShowroomsController::class, 'ordenar'])->name('Manager.Showrooms.ordenar');
        Route::post('/showrooms/visibilidade/{id}', [ManagerShowroomsController::class, 'visibilidade'])->name('Manager.Showrooms.visibilidade');
        Route::post('/showrooms/excluir/{id}', [ManagerShowroomsController::class, 'excluir'])->name('Manager.Showrooms.excluir');

        Route::get('/showrooms/adicionar', [ManagerShowroomsController::class, 'adicionar'])->name('Manager.Showrooms.adicionar');
        Route::post('/showrooms/adicionar', [ManagerShowroomsController::class, 'novo'])->name('Manager.Showrooms.novo');
        Route::get('/showrooms/editar/{id}', [ManagerShowroomsController::class, 'editar'])->name('Manager.Showrooms.editar');
        Route::post('/showrooms/editar/{id}', [ManagerShowroomsController::class, 'atualizar'])->name('Manager.Showrooms.atualizar');


        Route::get('/showrooms/imagens/{id}', [ManagerImagensShowroomsController::class, 'index'])->name('Manager.Showrooms.Imagens.index');
        Route::post('/showrooms/imagens/adicionar/{id}', [ManagerImagensShowroomsController::class, 'novo'])->name('Manager.Showrooms.Imagens.novo');
        
        Route::post('/showrooms/imagens/ordenar/{id}', [ManagerImagensShowroomsController::class, 'ordenar'])->name('Manager.Showrooms.Imagens.ordenar');
        Route::post('/showrooms/imagens/visibilidade/{id}', [ManagerImagensShowroomsController::class, 'visibilidade'])->name('Manager.Showrooms.Imagens.visibilidade');
        Route::post('/showrooms/imagens/excluir/{id}', [ManagerImagensShowroomsController::class, 'excluir'])->name('Manager.Showrooms.Imagens.excluir');

        
        Route::get('/lojas/projetos', [ManagerLojasProjetosController::class, 'index'])->name('Manager.Lojas.Projetos.index');
        
        Route::post('/lojas/projetos/ordenar', [ManagerLojasProjetosController::class, 'ordenar'])->name('Manager.Lojas.Projetos.ordenar');
        Route::post('/lojas/projetos/visibilidade/{id}', [ManagerLojasProjetosController::class, 'visibilidade'])->name('Manager.Lojas.Projetos.visibilidade');
        Route::post('/lojas/projetos/excluir/{id}', [ManagerLojasProjetosController::class, 'excluir'])->name('Manager.Lojas.Projetos.excluir');

        Route::get('/lojas/projetos/adicionar', [ManagerLojasProjetosController::class, 'adicionar'])->name('Manager.Lojas.Projetos.adicionar');
        Route::post('/lojas/projetos/adicionar', [ManagerLojasProjetosController::class, 'novo'])->name('Manager.Lojas.Projetos.novo');
        Route::get('/lojas/projetos/editar/{id}', [ManagerLojasProjetosController::class, 'editar'])->name('Manager.Lojas.Projetos.editar');
        Route::post('/lojas/projetos/editar/{id}', [ManagerLojasProjetosController::class, 'atualizar'])->name('Manager.Lojas.Projetos.atualizar');
        Route::get('/lojas/projetos/baixar-video/{id}/', [ManagerLojasProjetosController::class, 'baixarVideo'])->name('Manager.Lojas.Projetos.baixarVideo');
        

        Route::get('/lojas/projetos/imagens/{id}', [ManagerImagensLojasProjetosController::class, 'index'])->name('Manager.Lojas.Projetos.Imagens.index');
        Route::post('/lojas/projetos/imagens/adicionar/{id}', [ManagerImagensLojasProjetosController::class, 'novo'])->name('Manager.Lojas.Projetos.Imagens.novo');
        
        Route::post('/lojas/projetos/imagens/cortar/{id}', [ManagerImagensLojasProjetosController::class, 'cortar'])->name('Manager.Lojas.Projetos.Imagens.cortar');
        Route::post('/lojas/projetos/imagens/ordenar/{id}', [ManagerImagensLojasProjetosController::class, 'ordenar'])->name('Manager.Lojas.Projetos.Imagens.ordenar');
        Route::post('/lojas/projetos/imagens/visibilidade/{id}', [ManagerImagensLojasProjetosController::class, 'visibilidade'])->name('Manager.Lojas.Projetos.Imagens.visibilidade');
        Route::post('/lojas/projetos/imagens/excluir/{id}', [ManagerImagensLojasProjetosController::class, 'excluir'])->name('Manager.Lojas.Projetos.Imagens.excluir');

        
        Route::get('/mostras', [ManagerMostrasController::class, 'index'])->name('Manager.Mostras.index');
        
        Route::post('/mostras/ordenar', [ManagerMostrasController::class, 'ordenar'])->name('Manager.Mostras.ordenar');
        Route::post('/mostras/visibilidade/{id}', [ManagerMostrasController::class, 'visibilidade'])->name('Manager.Mostras.visibilidade');
        Route::post('/mostras/excluir/{id}', [ManagerMostrasController::class, 'excluir'])->name('Manager.Mostras.excluir');

        Route::get('/mostras/adicionar', [ManagerMostrasController::class, 'adicionar'])->name('Manager.Mostras.adicionar');
        Route::post('/mostras/adicionar', [ManagerMostrasController::class, 'novo'])->name('Manager.Mostras.novo');
        Route::get('/mostras/editar/{id}', [ManagerMostrasController::class, 'editar'])->name('Manager.Mostras.editar');
        Route::post('/mostras/editar/{id}', [ManagerMostrasController::class, 'atualizar'])->name('Manager.Mostras.atualizar');


        Route::get('/contato', [ManagerContatoController::class, 'index'])->name('Manager.Contato.index');

        Route::get('/contato/visualizar/{id}', [ManagerContatoController::class, 'visualizar'])->name('Manager.Contato.visualizar');
        Route::post('/contato/excluir/{id}', [ManagerContatoController::class, 'excluir'])->name('Manager.Contato.excluir');

        Route::get('/orcamentos/visualizar/{id}', [ManagerOrcamentosController::class, 'visualizar'])->name('Manager.Orcamentos.visualizar');
        Route::post('/orcamentos/excluir/{id}', [ManagerOrcamentosController::class, 'excluir'])->name('Manager.Orcamentos.excluir');

        
        Route::get('/acabamentos', [ManagerAcabamentosController::class, 'index'])->name('Manager.Acabamentos.index');

        Route::post('/acabamentos/ordenar', [ManagerAcabamentosController::class, 'ordenar'])->name('Manager.Acabamentos.ordenar');
        Route::post('/acabamentos/visibilidade/{id}', [ManagerAcabamentosController::class, 'visibilidade'])->name('Manager.Acabamentos.visibilidade');
        Route::post('/acabamentos/excluir/{id}', [ManagerAcabamentosController::class, 'excluir'])->name('Manager.Acabamentos.excluir');

        Route::get('/acabamentos/adicionar', [ManagerAcabamentosController::class, 'adicionar'])->name('Manager.Acabamentos.adicionar');
        Route::post('/acabamentos/adicionar', [ManagerAcabamentosController::class, 'novo'])->name('Manager.Acabamentos.novo');
        Route::get('/acabamentos/editar/{id}', [ManagerAcabamentosController::class, 'editar'])->name('Manager.Acabamentos.editar');
        Route::post('/acabamentos/editar/{id}', [ManagerAcabamentosController::class, 'atualizar'])->name('Manager.Acabamentos.atualizar');

        
        Route::get('/blog', [ManagerBlogController::class, 'index'])->name('Manager.Blog.index');

        Route::post('/posts/ordenar', [ManagerPostsController::class, 'ordenar'])->name('Manager.Posts.ordenar');
        Route::post('/posts/visibilidade/{id}', [ManagerPostsController::class, 'visibilidade'])->name('Manager.Posts.visibilidade');
        Route::post('/posts/excluir/{id}', [ManagerPostsController::class, 'excluir'])->name('Manager.Posts.excluir');

        Route::get('/posts/adicionar', [ManagerPostsController::class, 'adicionar'])->name('Manager.Posts.adicionar');
        Route::post('/posts/adicionar', [ManagerPostsController::class, 'novo'])->name('Manager.Posts.novo');
        Route::get('/posts/editar/{id}', [ManagerPostsController::class, 'editar'])->name('Manager.Posts.editar');
        Route::post('/posts/editar/{id}', [ManagerPostsController::class, 'atualizar'])->name('Manager.Posts.atualizar');


        Route::post('/posts/categorias/ordenar', [ManagerPostsCategoriasController::class, 'ordenar'])->name('Manager.Posts.Categorias.ordenar');
        Route::post('/posts/categorias/visibilidade/{id}', [ManagerPostsCategoriasController::class, 'visibilidade'])->name('Manager.Posts.Categorias.visibilidade');
        Route::post('/posts/categorias/excluir/{id}', [ManagerPostsCategoriasController::class, 'excluir'])->name('Manager.Posts.Categorias.excluir');

        Route::get('/posts/categorias/adicionar', [ManagerPostsCategoriasController::class, 'adicionar'])->name('Manager.Posts.Categorias.adicionar');
        Route::post('/posts/categorias/adicionar', [ManagerPostsCategoriasController::class, 'novo'])->name('Manager.Posts.Categorias.novo');
        Route::get('/posts/categorias/editar/{id}', [ManagerPostsCategoriasController::class, 'editar'])->name('Manager.Posts.Categorias.editar');
        Route::post('/posts/categorias/editar/{id}', [ManagerPostsCategoriasController::class, 'atualizar'])->name('Manager.Posts.Categorias.atualizar');


        Route::get('/catalogos', [ManagerCatalogosController::class, 'index'])->name('Manager.Catalogos.index');

        Route::post('/catalogos/ordenar', [ManagerCatalogosController::class, 'ordenar'])->name('Manager.Catalogos.ordenar');
        Route::post('/catalogos/visibilidade/{id}', [ManagerCatalogosController::class, 'visibilidade'])->name('Manager.Catalogos.visibilidade');
        Route::post('/catalogos/excluir/{id}', [ManagerCatalogosController::class, 'excluir'])->name('Manager.Catalogos.excluir');

        Route::get('/catalogos/adicionar', [ManagerCatalogosController::class, 'adicionar'])->name('Manager.Catalogos.adicionar');
        Route::post('/catalogos/adicionar', [ManagerCatalogosController::class, 'novo'])->name('Manager.Catalogos.novo');
        Route::get('/catalogos/editar/{id}', [ManagerCatalogosController::class, 'editar'])->name('Manager.Catalogos.editar');
        Route::post('/catalogos/editar/{id}', [ManagerCatalogosController::class, 'atualizar'])->name('Manager.Catalogos.atualizar');
        Route::get('/catalogos/baixar-arquivo/{id}', [ManagerCatalogosController::class, 'baixarArquivo'])->name('Manager.Catalogos.baixarArquivo');
        

        Route::post('/catalogos/categorias/ordenar', [ManagerCatalogosCategoriasController::class, 'ordenar'])->name('Manager.Catalogos.Categorias.ordenar');
        Route::post('/catalogos/categorias/visibilidade/{id}', [ManagerCatalogosCategoriasController::class, 'visibilidade'])->name('Manager.Catalogos.Categorias.visibilidade');
        Route::post('/catalogos/categorias/excluir/{id}', [ManagerCatalogosCategoriasController::class, 'excluir'])->name('Manager.Catalogos.Categorias.excluir');

        Route::get('/catalogos/categorias/adicionar', [ManagerCatalogosCategoriasController::class, 'adicionar'])->name('Manager.Catalogos.Categorias.adicionar');
        Route::post('/catalogos/categorias/adicionar', [ManagerCatalogosCategoriasController::class, 'novo'])->name('Manager.Catalogos.Categorias.novo');
        Route::get('/catalogos/categorias/editar/{id}', [ManagerCatalogosCategoriasController::class, 'editar'])->name('Manager.Catalogos.Categorias.editar');
        Route::post('/catalogos/categorias/editar/{id}', [ManagerCatalogosCategoriasController::class, 'atualizar'])->name('Manager.Catalogos.Categorias.atualizar');


        Route::get('/politicas/privacidade', [ManagerPoliticasController::class, 'privacidade'])->name('Manager.Politicas.privacidade');
    });
});

import { Routes } from '@angular/router';
import { UsuarioComponent } from './pages/usuario/usuario';
import { ClienteComponent } from './pages/cliente/cliente';
import { VeiculoComponent } from './pages/veiculo/veiculo';
import { OrdemServicoComponent } from './pages/ordem-servico/ordem-servico';
import { ServicoComponent } from './pages/servico/servico';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { RelatorioComponent } from './pages/relatorio/relatorio';
import { OpcoesComponent } from './pages/opcoes/opcoes';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path: '', component: DashboardComponent, title: 'Dashboard', canActivate: [authGuard]},
    { path: 'usuario', component: UsuarioComponent, title: 'Usuário', canActivate: [authGuard]},
    { path: 'cliente', component: ClienteComponent, title: 'Cliente', canActivate: [authGuard]},
    { path: 'veiculo', component: VeiculoComponent, title: 'Veículo', canActivate: [authGuard]},
    { path: 'ordemServico', component: OrdemServicoComponent, title: 'Ordem Serviço', canActivate: [authGuard]},
    { path: 'servico', component: ServicoComponent, title: 'Serviço', canActivate: [authGuard]},
    { path: 'login', component: LoginComponent, title: 'Login'},
    { path: 'relatorio', component: RelatorioComponent, title: 'Relatório', canActivate: [authGuard]},
    { path: 'opcoes', component: OpcoesComponent, title: 'Opçoes Usuário', canActivate: [authGuard]},
    { path: '**', redirectTo: ''}
];

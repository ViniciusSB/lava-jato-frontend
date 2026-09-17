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


export const routes: Routes = [
    { path: '', component: DashboardComponent, title: 'Dashboard'},
    { path: 'usuario', component: UsuarioComponent, title: 'Usuário'},
    { path: 'cliente', component: ClienteComponent, title: 'Cliente'},
    { path: 'veiculo', component: VeiculoComponent, title: 'Veículo'},
    { path: 'ordemServico', component: OrdemServicoComponent, title: 'Ordem Serviço'},
    { path: 'servico', component: ServicoComponent, title: 'Serviço'},
    { path: 'login', component: LoginComponent, title: 'Login'},
    { path: 'relatorio', component: RelatorioComponent, title: 'Relatório'},
    { path: 'opcoes', component: OpcoesComponent, title: 'Opçoes Usuário'},
    { path: '**', redirectTo: '' }
];

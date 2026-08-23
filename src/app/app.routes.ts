import { Routes } from '@angular/router';
import { UsuarioComponent } from './pages/usuario/usuario';
import { ClienteComponent } from './pages/cliente/cliente';
import { VeiculoComponent } from './pages/veiculo/veiculo';
import { OrdemServicoComponent } from './pages/ordem-servico/ordem-servico';
import { ServicoComponent } from './pages/servico/servico';


export const routes: Routes = [
    { path: 'usuario', component: UsuarioComponent, title: 'Usuário'},
    { path: 'cliente', component: ClienteComponent, title: 'Cliente'},
    { path: 'veiculo', component: VeiculoComponent, title: 'Veículo'},
    { path: 'ordemServico', component: OrdemServicoComponent, title: 'Ordem Serviço'},
    { path: 'servico', component: ServicoComponent, title: 'Serviço'},
];

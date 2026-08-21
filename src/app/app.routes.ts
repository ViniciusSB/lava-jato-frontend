import { Routes } from '@angular/router';
import { UsuarioComponent } from './pages/usuario/usuario';
import { ClienteComponent } from './pages/cliente/cliente';
import { VeiculoComponent } from './pages/veiculo/veiculo';
import { OrdemServicoComponent } from './pages/ordem-servico/ordem-servico';


export const routes: Routes = [
    { path: 'usuario', component: UsuarioComponent},
    { path: 'cliente', component: ClienteComponent},
    { path: 'veiculo', component: VeiculoComponent},
    { path: 'ordemServico', component: OrdemServicoComponent},
];

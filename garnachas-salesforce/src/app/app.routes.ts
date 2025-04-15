import { Routes } from '@angular/router';
import { PagoComponent } from './pago/pago.component';
import { ExitoComponent } from './exito/exito.component';
import { CanceladoComponent } from './cancelado/cancelado.component';

export const routes: Routes = [
  { path: '', component: PagoComponent },           // Página inicial
  { path: 'exito', component: ExitoComponent },
  { path: 'cancelado', component: CanceladoComponent },
];

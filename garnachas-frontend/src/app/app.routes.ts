import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { DetallesComponent } from './detalles/detalles.component';

const routeConfig: Routes = [
 
     {
        path: '',
        component: HomeComponent,
        title: 'Home page'
    },
    {
        path: 'aboutus',
        component: AboutusComponent,
        title: 'About Us'
    },
    {
        path : 'detalles',
        component: DetallesComponent,
        title: 'Detalles'
    }
];
export default routeConfig;


import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';

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
    } 
];
export default routeConfig;


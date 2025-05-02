import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { DetallesComponent } from './detalles/detalles.component';
import { StripecancelComponent } from './stripecancel/stripecancel.component';
import { StripesuccessComponent } from './stripesuccess/stripesuccess.component';

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
    },
    {
        path : 'stripecancel',
        component: StripecancelComponent,
        title: 'Stripe Cancel'
    },
    {
        path : 'stripesuccess',
        component: StripesuccessComponent,
        title: 'Stripe Success'
    }
];
export default routeConfig;


import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { DetallesComponent } from './detalles/detalles.component';
import { StripecancelComponent } from './stripecancel/stripecancel.component';
import { StripesuccessComponent } from './stripesuccess/stripesuccess.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ContactoComponent } from './contacto/contacto.component';


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
    ,
    {
        path : 'login',
        component: LoginComponent, 
        title: 'Login'
    },
    {
        path : 'register',
        component: RegisterComponent,
        title: 'Register'
    },
    {
        path : '',
        redirectTo: '/',
        pathMatch: 'full'
    },
    {
        path: 'contacto',
        component: ContactoComponent,
        title: 'Contacto'
    }
    
];
export default routeConfig;


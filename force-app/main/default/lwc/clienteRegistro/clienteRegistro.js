import { LightningElement, track } from 'lwc';
import registrarCliente from '@salesforce/apex/ClienteController.registrarCliente';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ClienteRegistro extends LightningElement {
    @track nombre = '';
    @track correo = '';
    @track telefono = '';

    handleInputChange(event) {
        const field = event.target.label.toLowerCase();
        this[field] = event.target.value;
    }

    handleRegister() {
        if (!this.nombre || !this.correo || !this.telefono) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Todos los campos son obligatorios',
                    variant: 'error',
                })
            );
            return;
        }

        registrarCliente({ nombre: this.nombre, correo: this.correo, telefono: this.telefono })
            .then(() => {                
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Éxito',
                        message: 'Cliente registrado con éxito',
                        variant: 'success',
                    })
                );
                // Limpiar los campos después del registro
                this.nombre = '';
                this.correo = '';
                this.telefono = '';
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error al registrar el cliente',
                        variant: 'error',
                    })
                );
                console.error('Error al registrar cliente:', error);
            });
    }
}
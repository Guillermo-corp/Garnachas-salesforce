import { LightningElement, track } from 'lwc';
import registrarCliente from '@salesforce/apex/ClienteController.registrarCliente';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ClienteRegistro extends LightningElement {
    @track nombre = '';
    @track apellido = '';
    @track correo = '';
    @track direccion = ''; // ID de la dirección (lookup)

    handleInputChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    handleRegister() {
        if (!this.nombre || !this.apellido || !this.correo || !this.direccion) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Todos los campos son obligatorios',
                    variant: 'error',
                })
            );
            return;
        }

        registrarCliente({
            nombre: this.nombre,
            apellido: this.apellido,
            correo: this.correo,
            direccionId: this.direccion
        })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Éxito',
                        message: 'Cliente registrado con éxito',
                        variant: 'success',
                    })
                );
                this.nombre = '';
                this.apellido = '';
                this.correo = '';
                this.direccion = '';
            })
            .catch(error => {
                let message = 'Error al registrar el cliente';
                if (error.body && error.body.message) {
                    message = error.body.message;
                }
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: message,
                        variant: 'error',
                    })
                );
                console.error('Error al registrar cliente:', error);
            });
    }
}

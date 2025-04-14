import { LightningElement, track, wire } from 'lwc';
import obtenerClientes from '@salesforce/apex/ClienteController.obtenerClientes';
import eliminarCliente from '@salesforce/apex/ClienteController.eliminarCliente';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class ClienteDatatable extends LightningElement {
    @track clientes = [];
    @track columns = [
        { label: 'Nombre', fieldName: 'Name', type: 'text' },
        { label: 'Correo Electrónico', fieldName: 'Email', type: 'email' },
        { label: 'Teléfono', fieldName: 'Phone', type: 'phone' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Eliminar',
                name: 'eliminar',
                variant: 'destructive'
            }
        }
    ];

    @wire(obtenerClientes)
    wiredClientes({ error, data }) {
        if (data) {
            this.clientes = data;
        } else if (error) {
            console.error('Error al cargar clientes:', error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'eliminar') {
            this.eliminarCliente(row.Id);
        }
    }

    eliminarCliente(clienteId) {
        eliminarCliente({ clienteId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Éxito',
                        message: 'Cliente eliminado correctamente',
                        variant: 'success'
                    })
                );
                // Recargar la lista de clientes
                return refreshApex(this.wiredClientes);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'No se pudo eliminar el cliente',
                        variant: 'error'
                    })
                );
                console.error('Error al eliminar cliente:', error);
            });
    }
}
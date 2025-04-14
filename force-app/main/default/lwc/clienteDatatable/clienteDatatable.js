import { LightningElement, track, wire } from 'lwc';
import obtenerClientes from '@salesforce/apex/ClienteController.obtenerClientes';
import eliminarCliente from '@salesforce/apex/ClienteController.eliminarCliente';
import actualizarCliente from '@salesforce/apex/ClienteController.actualizarCliente';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class ClienteDatatable extends LightningElement {
    @track clienteSeleccionado = {};
    @track mostrarModal = false; // Variable para controlar la visibilidad del modal
   
    handleInputChange(event) {
        const field = event.target.dataset.field;
        this.clienteSeleccionado[field] = event.target.value;
    }
    
    cerrarModal() {
        this.mostrarModal = false;
        this.clienteSeleccionado = {};
    }
    
    guardarCliente() {
        // Llama a un método Apex para actualizar el cliente
        actualizarCliente({ cliente: this.clienteSeleccionado })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Éxito',
                        message: 'Cliente actualizado correctamente',
                        variant: 'success'
                    })
                );
                this.mostrarModal = false;
                this.clienteSeleccionado = {};
                return refreshApex(this.wiredClientes);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'No se pudo actualizar el cliente',
                        variant: 'error'
                    })
                );
                console.error('Error al actualizar cliente:', error);
            });
    }
   
    @track clientes = [];
    @track columns = [
        { label: 'Nombre', fieldName: 'FirstName', type: 'text' },
        { label: 'Apellido', fieldName: 'LastName', type: 'text' },
        { label: 'Correo Electrónico', fieldName: 'Email', type: 'email' },
        { label: 'Teléfono', fieldName: 'Phone', type: 'phone' },
    {
        type: 'button',
        typeAttributes: {
            label: 'Editar',
            name: 'editar',
            variant: 'brand'
        }
    },

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
        } else if (actionName === 'editar') {
            this.editarCliente(row);
        }
    }

    editarCliente(cliente) {
        // Aquí puedes implementar la lógica para editar el cliente
        // Por ejemplo, abrir un modal o redirigir a una página de edición
        this.clienteSeleccionado = { ...cliente }; // Clona los datos del cliente
        this.mostrarModal = true; // Variable para mostrar el modal
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
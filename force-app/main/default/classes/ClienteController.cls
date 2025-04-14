public with sharing class ClienteController {
    
    @AuraEnabled
    public static void registrarCliente(String nombre, String apellido, String correo, String telefono) {
       try{
            if (String.isBlank(nombre) || String.isBlank(apellido) || String.isBlank(correo) || String.isBlank(telefono)) {
                throw new AuraHandledException('Todos los campos son obligatorios.');
            }
            Contact nuevoCliente = new Contact(
                FirstName = nombre,
                LastName = apellido,
                Email = correo,
                Phone = telefono
            );
            insert nuevoCliente;
        } catch (DmlException e) {
            System.debug('Error DML: ' + e.getMessage());
            throw new AuraHandledException('Error al registrar el cliente: ' + e.getMessage());
        } catch (Exception e) {
            System.debug('Error General: ' + e.getMessage());
            throw new AuraHandledException('Error inesperado: ' + e.getMessage());
        }
    }
    

    @AuraEnabled(cacheable=true)
    public static List<Contact> obtenerClientes() {
        return [SELECT Id, Name, FirstName, LastName, Email, Phone FROM Contact];
    }


    @AuraEnabled
    public static void actualizarCliente(Contact cliente) {
        try {
            update cliente;
        } catch (DmlException e) {
            throw new AuraHandledException('Error al actualizar el cliente: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void eliminarCliente(Id clienteId) {
        if (clienteId != null) {
            try {
                Contact cliente = [SELECT Id FROM Contact WHERE Id = :clienteId LIMIT 1];
                delete cliente;
            } catch (Exception e) {
                throw new AuraHandledException('Error al eliminar el cliente: ' + e.getMessage());
            }
        }
    }
}

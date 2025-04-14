public with sharing class ClienteController {
    
    @AuraEnabled
    public static void registrarCliente(String nombre, String correo, String telefono) {
        Contact nuevoCliente = new Contact(
            FirstName = nombre,
            Email = correo,
            Phone = telefono
        );
        insert nuevoCliente;
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> obtenerClientes() {
        return [SELECT Id, Name, Email, Phone FROM Contact];
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

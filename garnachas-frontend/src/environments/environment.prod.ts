export const environment = {
  production: false,
  salesforce: {
    baseUrl: 'https://orgfarm-7bd48eb5b5-dev-ed.develop.my.salesforce.com/services/data/v62.0/sobjects/Purchase__c', // Reemplaza con tu instancia y versión de API
    accessToken: '00DgK000001Krim!AQEAQLOeqfwKvWDjN.GrNTbcFEEZHPW2GaZxgKwXyuz6XU6AqnqRn7FWfMFzGaoBCq0vxGO5OuHTFkAPxa.9.MKPR7Spa.hs', // Reemplaza con tu token de acceso
    refreshToken: '5Aep8612EC5NxGKVYreGs13NIzFX7k8UaPFqYWXrlgaxCIYFsUGPSoD_VC2ih2mlKXmnl.pCzuOSmgHKUgK2D0F', // Agrega el Refresh Token
    clientId: '3MVG9rZjd7MXFdLgVUB54wy8BfunvX_6eaKWUMMprEvNxTad6sEc1gUpXtzUAbf_bxaWWutBwd_RVb1VW_TJR', // Reemplaza con tu Consumer Key
    clientSecret: '16A9B63899FA1F1133E8608900F75C1072BAAF411A9CB7DDF968092CD4A6BCE8', // Reemplaza con tu Consumer Secret
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token', // Endpoint para renovar el token
  },
};
/* export const environment = {
    production: false,
    salesforce: {
      baseUrl: 'https://orgfarm-7bd48eb5b5-dev-ed.develop.my.salesforce.com/services/data/v62.0/sobjects/Purchase__c', // Reemplaza con tu instancia y versión de API
      accessToken: '6Cel800DgK000001Krim888gK0000004CvRCBwNQqjZOailwK8xbxHq5WTplFFNPZt3O3TEZOWMdHdAO4zBX6z0G9SAipSlo3bFbUcAybLD', // Reemplaza con tu token de acceso
    },
  }; */

  export const environment = {
    production: false,
    salesforce: {
      baseUrl: 'https://orgfarm-7bd48eb5b5-dev-ed.develop.my.salesforce.com', // Solo la instancia base
/*       baseUrl: 'https://orgfarm-7bd48eb5b5-dev-ed.develop.my.salesforce.com/services/data/v62.0/sobjects/Purchase__c', // Reemplaza con tu instancia y versión de API
 */   accessToken: '00DgK000001Krim!AQEAQHDNQOkf63d24wveaP_VSUL.ducetJQZUVsxyUSfPdFq9aT3NryoN_ydm6DPEjbpWCJRLdFTQ_mAC17_sRtfoAB2qrZ0', // Reemplaza con tu token de acceso
      refreshToken: '5Aep8612EC5NxGKVYreGs13NIzFX7k8UaPFqYWXrlgaxCIYFsW.7X64fXGArn4uus3Kgm86cO7K5f76jERPU9N_', // Agrega el Refresh Token
      clientId: '3MVG9rZjd7MXFdLgVUB54wy8BfunvX_6eaKWUMMprEvNxTad6sEc1gUpXtzUAbf_bxaWWutBwd_RVb1VW_TJR', // Reemplaza con tu Consumer Key
      clientSecret: '16A9B63899FA1F1133E8608900F75C1072BAAF411A9CB7DDF968092CD4A6BCE8', // Reemplaza con tu Consumer Secret
      tokenUrl: 'https://login.salesforce.com/services/oauth2/token', // Endpoint para renovar el token
    },
  };
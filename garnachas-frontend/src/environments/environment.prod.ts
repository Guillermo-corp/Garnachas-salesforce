export const environment = {
  production: true,
  salesforce: {
    baseUrl: 'https://orgfarm-7bd48eb5b5-dev-ed.develop.my.salesforce.com', // Solo la instancia base
    accessToken: '00DgK000001Krim!AQEAQPT9uc7YT4ve1DrtNEmKrvFPXBtEII.svpGu7rXOehm_YGYnsQJtAQS0Yr9D7wSm5nxg0YKKjk231MLccq4cMedorFYh', // Reemplaza con tu token de acceso
    refreshToken: '5Aep8612EC5NxGKVYreGs13NIzFX7k8UaPFqYWXrlgaxCIYFsUid1St_YKp0FebTl7M1DItuphkMnq_XTxrrMIn', // Agrega el Refresh Token
    clientId: '3MVG9rZjd7MXFdLgVUB54wy8BfunvX_6eaKWUMMprEvNxTad6sEc1gUpXtzUAbf_bxaWWutBwd_RVb1VW_TJR', // Reemplaza con tu Consumer Key
    clientSecret: '16A9B63899FA1F1133E8608900F75C1072BAAF411A9CB7DDF968092CD4A6BCE8', // Reemplaza con tu Consumer Secret
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token', // Endpoint para renovar el token
  },
}; 
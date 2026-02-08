# Challengue - Frontend

## Arquitectura de Autenticación

### Almacenamiento de Tokens
------------
Seguridad - Fintech | Bancario
------------

**Token de Acceso (Access Token):**
- Almacenado en **memoria** (variable JavaScript)
- Volátil: se elimina al cerrar la pestaña/navegador
- No persiste entre sesiones
- Implementado en `src/api/axios.instance.ts`

**Token de Actualización (Refresh Token):**
- Almacenado en cookies `httpOnly` (backend)
- No accesible desde JavaScript
- Gestionado automáticamente por el navegador

### ¿Por qué esta metodología?

1. **Seguridad**: Reduce el riesgo de ataques XSS
2. **Privacidad**: Los tokens no persisten en el dispositivo
3. **Mejores prácticas**: Alineado con OWASP recommendations

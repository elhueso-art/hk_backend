const localAddresses = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']); // Define las direcciones IPv4 e IPv6 locales.
const localHosts = new Set(['localhost', '127.0.0.1', '::1']); // Define los nombres de host permitidos.

const usesLocalDatabase = (uri) => { // Comprueba que la API use una base MongoDB local.
    if (!uri) return false; // Bloquea si no hay una URI configurada.
    try { // Captura URIs de conexión mal formadas.
        const hostname = new URL(uri).hostname.replace('[', '').replace(']', '').toLowerCase(); // Extrae el host sin exponer credenciales.
        return localHosts.has(hostname); // Permite solo loopback o localhost.
    } catch (error) { // Trata una URI inválida como configuración no local.
        return false; // Rechaza la configuración insegura.
    } // Termina el análisis de la URI.
}; // Termina la comprobación de MongoDB local.

const localOnly = (req, res, next) => { // Restringe una ruta a pruebas locales.
    const address = req.socket.remoteAddress; // Lee la dirección de quien abrió la conexión.
    const host = req.hostname?.toLowerCase(); // Lee el host HTTP normalizado.
    if (process.env.NODE_ENV === 'production') return res.status(403).json({ status: 'error', message: 'Las operaciones de escritura locales están deshabilitadas en producción' }); // Bloquea estos endpoints en producción.
    if (!usesLocalDatabase(process.env.MONGO_URI)) return res.status(403).json({ status: 'error', message: 'Las escrituras requieren una base MongoDB local' }); // Evita modificar una base remota.
    if (!localAddresses.has(address) || !localHosts.has(host)) return res.status(403).json({ status: 'error', message: 'Las escrituras solo aceptan conexiones locales' }); // Rechaza conexiones remotas.
    return next(); // Permite continuar con una petición local.
}; // Termina el middleware de acceso local.

module.exports = localOnly; // Exporta la restricción para el servidor.

const cheerio = require('cheerio');
const request = require('request-promise');
const { obtenerDatosDesdeGoogleSheets } = require('./googleSheets');

async function obtenerurlNascar() {
    try {
        const sheetId = "1579842406"; // ID de la hoja que deseas obtener
        const datos = await obtenerDatosDesdeGoogleSheets([sheetId]);

        // Obtener la URL de MotoGP directamente
        const urlNascar = datos[0]?.data[1]?.c[11]?.v;

        return urlNascar;
    } catch (error) {
        console.error('Error al obtener y mostrar datos:', error);
        throw error;
    }
}

async function extraerDatosNascar() {
    try {
        // Obtener la URL de MotoGP
        const urlNascar = await obtenerurlNascar();

        // Realizar una solicitud HTTP GET a la URL de MotoGP
        const html = await request(urlNascar);

        // Load the HTML content using Cheerio
        const $ = cheerio.load(html);

        // Objeto para almacenar los datos extraídos de la tabla
        const data = [];

        // Extraer datos de la tabla
        $('tbody tr').each((index, element) => {
            const posicion = $(element).find('td:nth-child(1)').text().trim();
            const pilotoDirty = $(element).find('td:nth-child(2) .name-short').text().trim();
            // Limpiar el nombre del piloto
            const piloto = pilotoDirty.replace(/\s+/g, ' ').trim();
            const puntos = $(element).find('td:nth-child(3)').text().trim();

            data.push({
                posicion,
                piloto,
                puntos
            });
        });

        return data;
    } catch (error) {
        console.error('Error al extraer datos de MotoGP:', error);
        throw error;
    }
}

module.exports = { extraerDatosNascar };

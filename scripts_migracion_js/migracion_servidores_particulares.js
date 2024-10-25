const fs = require("fs").promises;
const path = require("path");

// Define input and output paths
const inputDir = "../pruebas/datos_entrada/";
const outputDir = "../pruebas/datos_salida/";

// Definición de tipos de faltas
const faltasGraves = [
  "CEX",
  "PEC",
  "DRP",
  "UII",
  "AFN",
  "ABCI",
  "CIND",
  "EOCI",
  "TINF",
  "ENCB",
  s3p / DURANGO / Rregistro.jsonls,
];
const faltasNoGraves = ["NAD", "IDSP", "ANG"];

function clasificarPorTipoFalta(falta) {
  if (falta === "Dato no proporcionado" || falta === "") {
    return "vacio";
  }
  if (faltasGraves.includes(falta)) {
    return "grave";
  }
  if (faltasNoGraves.includes(falta)) {
    return "no_grave";
  }
  return "otro";
}

function transformarServidorPublico(entrada, tipoSalida) {
  const salida = {
    id: entrada.id || "",
    fecha: entrada.fechaCaptura || "",
    expediente: entrada.expediente || "",
    datosGenerales: {
      nombres: entrada.servidorPublicoSancionado?.nombres || "",
      primerApellido: entrada.servidorPublicoSancionado?.primerApellido || "",
      segundoApellido: entrada.servidorPublicoSancionado?.segundoApellido || "",
      curp: entrada.servidorPublicoSancionado?.curp || "",
      rfc: entrada.servidorPublicoSancionado?.rfc || "",
      sexo: entrada.servidorPublicoSancionado?.genero?.valor || "",
    },
    empleoCargoComision: {
      entidadFederativa: "",
      nivelOrdenGobierno: "",
      ambitoPublico: "",
      nombreEntePublico: entrada.institucionDependencia?.nombre || "",
      siglasEntePublico: entrada.institucionDependencia?.siglas || "",
      nivelJerarquico: {
        clave: "",
        valor: "",
      },
      denominacion: entrada.servidorPublicoSancionado?.puesto || "",
      areaAdscripcion: "",
    },
    faltaCometida: [
      {
        clave: entrada.tipoFalta?.clave || "",
        valor: entrada.tipoFalta?.valor || "",
        descripcionHechos: entrada.causaMotivoHechos || "",
        normatividadInfringida: {
          nombreNormatividad: "",
          articulo: "",
          fraccion: "",
        },
      },
    ],
    resolucion: {
      tituloDocumento: "",
      fechaResolucion: entrada.resolucion?.fechaResolucion || "",
      fechaNotificacion: "",
      urlResolucion: entrada.resolucion?.url || "",
      fechaResolucionFirme: "",
      fechaNotificacionFirme: "",
      fechaEjecucion: "",
      ordenJurisdiccional: "",
      autoridadResolutora: entrada.autoridadSancionadora || "",
      autoridadInvestigadora: "",
      autoridadSubstanciadora: "",
    },
    tipoSancion:
      entrada.tipoSancion?.map((sancion) => ({
        clave: sancion.clave || "",
        suspension: {
          plazoMeses: "",
          plazoDias: "",
          fechaInicial: "",
          fechaFinal: "",
        },
        destitucionEmpleo: {
          fechaDestitucion: "",
        },
        inhabilitacion: {
          plazoAnios: "",
          plazoMeses: "",
          plazoDias: "",
          fechaInicial: entrada.inhabilitacion?.fechaInicial || "",
          fechaFinal: entrada.inhabilitacion?.fechaFinal || "",
        },
        sancionEconomica: {
          monto: entrada.multa?.monto || "",
          moneda: entrada.multa?.moneda?.valor || "",
          plazoPago: {
            anios: "",
            meses: "",
            dias: "",
          },
          sancionEfectivamenteCobrada: {
            monto: "",
            moneda: "",
            fechaCobro: "",
          },
        },
        otro: {
          denominacionSancion: "",
        },
      })) || [],
    observaciones: entrada.observaciones || "",
  };

  return salida;
}

function transformarParticular(entrada, tipoPersona) {
  return {
    id: entrada.id || "",
    fecha: entrada.fechaCaptura || "",
    expediente: entrada.expediente || "",
    datosGenerales: {
      nombreRazonSocial: entrada.particularSancionado?.nombreRazonSocial || "",
      objetoSocial: entrada.particularSancionado?.objetoSocial || "",
      rfc: entrada.particularSancionado?.rfc || "",
      tipoDomicilio: "",
      domicilioMexico: {
        tipoVialidad: "",
        nombreVialidad: "",
        numeroExterior:
          entrada.particularSancionado?.domicilioMexico?.numeroExterior || "",
        numeroInterior:
          entrada.particularSancionado?.domicilioMexico?.numeroInterior || "",
        coloniaLocalidad: "",
        municipioAlcaldia:
          entrada.particularSancionado?.domicilioMexico?.municipio || "",
        codigoPostal:
          entrada.particularSancionado?.domicilioMexico?.codigoPostal || "",
        entidadFederativa:
          entrada.particularSancionado?.domicilioMexico?.entidadFederativa ||
          "",
      },
    },
    dondeCometioLaFalta: {
      entidadFederativa: "",
      nivelOrdenGobierno: "",
      ambitoPublico: "",
      nombreEntePublico: entrada.institucionDependencia?.nombre || "",
      siglasEntePublico: entrada.institucionDependencia?.siglas || "",
    },
    origenProcedimiento: {
      clave: "",
      valor: "",
    },
    faltaCometida: [
      {
        clave: "",
        valor: "",
        normatividadInfringida: {
          nombreNormatividad: "",
          articulo: "",
          fraccion: "",
        },
        descripcionHechos: entrada.causaMotivoHechos || "",
      },
    ],
    resolucion: {
      tituloResolucion: "",
      fechaResolucion: entrada.resolucion?.fechaResolucion || "",
      fechaNotificacion: "",
      urlResolucion: entrada.resolucion?.url || "",
      fechaResolucionFirme: "",
      fechaNotificacionFirme: "",
      urlResolucionFirme: "",
      fechaEjecucion: "",
      autoridadResolutora: entrada.autoridadSancionadora || "",
      autoridadInvestigadora: "",
      autoridadSubstanciadora: "",
    },
    tipoSancion:
      entrada.tipoSancion?.map((sancion) => ({
        clave: sancion.clave || "",
        inhabilitacion: {
          plazoAnios: "",
          plazoMeses: "",
          plazoDias: "",
          fechaInicial: entrada.inhabilitacion?.fechaInicial || "",
          fechaFinal: entrada.inhabilitacion?.fechaFinal || "",
        },
        multa: {
          monto: entrada.multa?.monto || "",
          moneda: entrada.multa?.moneda?.valor || "",
        },
        otro: {
          denominacionSancion: "",
        },
      })) || [],
    observaciones: entrada.observaciones || "",
  };
}

async function crearDirectorioSiNoExiste(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function escribirArchivo(directorio, nombreArchivo, contenido) {
  await crearDirectorioSiNoExiste(directorio);
  const rutaCompleta = path.join(directorio, nombreArchivo);
  await fs.writeFile(rutaCompleta, JSON.stringify(contenido, null, 2));
}

async function procesarArchivo(rutaArchivo) {
  try {
    const contenido = await fs.readFile(rutaArchivo, "utf8");
    const datos = JSON.parse(contenido);
    const registros = Array.isArray(datos) ? datos : [datos];

    // Obtener el nombre del directorio padre para el prefijo
    const dirPadre = path.basename(path.dirname(rutaArchivo));
    const nombreArchivo = `procesado_${dirPadre}_${path.basename(rutaArchivo)}`;

    const servidoresPublicos = {
      grave: [],
      no_grave: [],
      vacio: [],
    };

    const particulares = {
      fisica: [],
      moral: [],
    };

    // Procesar cada registro
    for (const registro of registros) {
      if (registro.servidorPublicoSancionado) {
        const tipoFalta = registro.tipoFalta?.clave;
        const clasificacion = clasificarPorTipoFalta(tipoFalta);
        const datosTransformados = transformarServidorPublico(
          registro,
          clasificacion
        );
        servidoresPublicos[clasificacion].push(datosTransformados);
      } else if (registro.particularSancionado) {
        const tipoPersona = registro.particularSancionado.tipoPersona;
        const categoria =
          tipoPersona === "F"
            ? "fisica"
            : tipoPersona === "M"
            ? "moral"
            : "otros";
        const datosTransformados = transformarParticular(registro, tipoPersona);
        if (categoria === "fisica" || categoria === "moral") {
          particulares[categoria].push(datosTransformados);
        }
      }
    }

    // Escribir archivos para servidores públicos
    for (const [tipo, datos] of Object.entries(servidoresPublicos)) {
      if (datos.length > 0) {
        const dir = path.join(outputDir, "SERVIDOR_PUBLICO_SANCIONADO", tipo);
        await escribirArchivo(dir, nombreArchivo, datos);
      }
    }

    // Escribir archivos para particulares
    for (const [tipo, datos] of Object.entries(particulares)) {
      if (datos.length > 0) {
        const dir = path.join(outputDir, "PARTICULAR_SANCIONADO", tipo);
        await escribirArchivo(dir, nombreArchivo, datos);
      }
    }
  } catch (error) {
    console.error(`Error procesando archivo ${rutaArchivo}:`, error);
  }
}

async function procesarDirectorio(dirPath) {
  try {
    const archivos = await fs.readdir(dirPath, { withFileTypes: true });

    for (const archivo of archivos) {
      const rutaCompleta = path.join(dirPath, archivo.name);

      if (archivo.isDirectory()) {
        await procesarDirectorio(rutaCompleta);
      } else if (archivo.name.endsWith(".json")) {
        await procesarArchivo(rutaCompleta);
      }
    }
  } catch (error) {
    console.error(`Error procesando directorio ${dirPath}:`, error);
  }
}

async function main() {
  try {
    await crearDirectorioSiNoExiste(outputDir);
    await procesarDirectorio(inputDir);
    console.log("Procesamiento completado exitosamente");
  } catch (error) {
    console.error("Error en el procesamiento:", error);
    process.exit(1);
  }
}

// Ejecutar el script
main();

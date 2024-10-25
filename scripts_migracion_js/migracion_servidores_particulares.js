const fs = require("fs").promises;
const path = require("path");

// Define input and output paths
const inputDir = "../pruebas/datos_entrada/";
const outputDir = "../pruebas/datos_salida/";

// Definición de tipos de faltas
const faltasGraves = [
  "COHECHO O EXTORSION",
  "PECULADO",
  "DESVÍO DE RECURSOS PÚBLICOS",
  "UTILIZACIÓN INDEBIDA DE INFORMACIÓN",
  "ABUSO DE FUNCIONES",
  "ACTUACIÓN BAJO CONFLICTO DE INTERÉS",
  "CONTRATACIÓN INDEBIDA",
  "ENRIQUECIMIENTO OCULTO U OCULTAMIENTO DE CONFLICTO DE INTERÉS",
  "TRÁFICO DE INFLUENCIAS",
  "ENCUBRIMIENTO",
  "DESACATO",
  "OBSTRUCCIÓN DE LA JUSTICIA",
  "ADMINISTRATIVA GRAVE",
];

const faltasNoGraves = [
  "NEGLIGENCIA ADMINISTRATIVA",
  "INCUMPLIMIENTO EN DECLARACION DE SITUACION PATRIMONIAL",
  "ADMINISTRATIVA NO GRAVE",
];

function clasificarPorTipoFalta(falta) {
  // Caso cuando tipoFalta es un string
  if (typeof falta === "string") {
    if (falta === "Dato no proporcionado" || falta === "") {
      return "vacio";
    }
    return "otro";
  }

  // Caso cuando tipoFalta es un objeto
  if (falta && typeof falta === "object") {
    // Si no existe la clave o es vacía
    if (!falta.clave) {
      return "vacio";
    }

    const clave = falta.clave;

    // Para los casos específicos
    if (clave === "OTRO" || clave === "otro") {
      return "otro";
    }
    if (clave === "AG") return "grave";
    if (clave === "ANG") return "no_grave";

    // Para el resto de los casos
    if (faltasGraves.includes(clave)) return "grave";
    if (faltasNoGraves.includes(clave)) return "no_grave";
  }

  // Si no cumple ninguna condición anterior
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
  try {
    await crearDirectorioSiNoExiste(directorio);
    const rutaCompleta = path.join(directorio, nombreArchivo);
    await fs.writeFile(rutaCompleta, JSON.stringify(contenido, null, 2));
    console.log(`Archivo escrito exitosamente: ${rutaCompleta}`);
  } catch (error) {
    console.error(`Error escribiendo archivo ${nombreArchivo}:`, error);
  }
}

async function procesarArchivo(rutaArchivo) {
  try {
    console.log(`Procesando archivo: ${rutaArchivo}`);
    const contenido = await fs.readFile(rutaArchivo, "utf8");
    let datos;
    try {
      datos = JSON.parse(contenido);
    } catch (parseError) {
      console.error(
        `Error parsing JSON en archivo ${rutaArchivo}:`,
        parseError
      );
      console.log(
        "Contenido problemático:",
        contenido.substring(
          Math.max(parseError.position - 50, 0),
          parseError.position + 50
        )
      );
      return;
    }

    const registros = Array.isArray(datos) ? datos : [datos];

    // Obtener el nombre del directorio padre para el prefijo
    const dirPadre = path.basename(path.dirname(rutaArchivo));
    const nombreArchivo = `procesado_${dirPadre}_${path.basename(rutaArchivo)}`;

    // Inicializar las estructuras para almacenar los resultados
    const resultados = {
      SERVIDOR_PUBLICO_SANCIONADO: {
        grave: [],
        no_grave: [],
        vacio: [],
        otro: [],
      },
      PARTICULAR_SANCIONADO: {
        fisica: [],
        moral: [],
        otros: [],
      },
    };

    // Procesar cada registro
    for (const registro of registros) {
      try {
        if (registro.servidorPublicoSancionado) {
          const tipoFalta = registro.tipoFalta?.clave;
          const clasificacion = clasificarPorTipoFalta(tipoFalta);
          const datosTransformados = transformarServidorPublico(registro);

          if (!resultados.SERVIDOR_PUBLICO_SANCIONADO[clasificacion]) {
            resultados.SERVIDOR_PUBLICO_SANCIONADO[clasificacion] = [];
          }
          resultados.SERVIDOR_PUBLICO_SANCIONADO[clasificacion].push(
            datosTransformados
          );
        } else if (registro.particularSancionado) {
          const tipoPersona = registro.particularSancionado.tipoPersona;
          let categoria = "otros";

          if (tipoPersona === "F") categoria = "fisica";
          else if (tipoPersona === "M") categoria = "moral";

          const datosTransformados = transformarParticular(registro);

          if (!resultados.PARTICULAR_SANCIONADO[categoria]) {
            resultados.PARTICULAR_SANCIONADO[categoria] = [];
          }
          resultados.PARTICULAR_SANCIONADO[categoria].push(datosTransformados);
        }
      } catch (regError) {
        console.error(`Error procesando registro en ${rutaArchivo}:`, regError);
        console.log(
          "Registro problemático:",
          JSON.stringify(registro).substring(0, 200) + "..."
        );
      }
    }

    // Escribir los resultados
    for (const [tipoSancion, categorias] of Object.entries(resultados)) {
      for (const [categoria, datos] of Object.entries(categorias)) {
        if (datos && datos.length > 0) {
          const directorioSalida = path.join(outputDir, tipoSancion, categoria);
          await escribirArchivo(directorioSalida, nombreArchivo, datos);
        }
      }
    }
  } catch (error) {
    console.error(`Error procesando archivo ${rutaArchivo}:`, error);
    if (error.code === "ENOENT") {
      console.error("El archivo no existe");
    }
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

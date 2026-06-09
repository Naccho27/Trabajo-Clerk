export const agregarHistorial = (
  reporte,
  {
    accion,
    valorAnterior = "",
    valorNuevo = "",
    realizadoPor = null,
  }
) => {

  reporte.historial.push({

    accion,

    valorAnterior,

    valorNuevo,

    realizadoPor,

    fecha: new Date(),
  });
};

export const cerrarEstadoAnterior = (
  reporte
) => {

  const ultimoEstado =
    reporte.historialEstados[
      reporte.historialEstados.length - 1
    ];

  if (
    ultimoEstado &&
    !ultimoEstado.fechaFin
  ) {

    ultimoEstado.fechaFin =
      new Date();
  }
};

export const agregarNuevoEstado = (
  reporte,
  estado,
  supervisorId
) => {

  reporte.historialEstados.push({

    estado,

    fechaInicio: new Date(),

    cambiadoPor: supervisorId,
  });
};
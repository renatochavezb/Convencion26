/** Contenido oficial — ihta-terminos-condiciones (IHTA / TAR México) */

export const IHTA_TAR_WEBSITE =
  import.meta.env.VITE_TAR_BOOKING_URL || 'https://tarmexico.com/#/';

export const IHTA_SALES_EMAIL = 'ventas@tarmexico.com';

/** Formato oficial de solicitud (PDF en /public/docs) */
export const IHTA_REQUEST_FORM_PDF = '/docs/formato-solicitud-reserva-tar.pdf';
export const IHTA_REQUEST_FORM_LABEL = 'Formato Solicitud de Reserva TAR';

export const IHTA_BENEFIT =
  'Obtén el 20% de descuento sobre la tarifa base Star y Flex en tu reservación con TAR México.';

export const IHTA_GENERAL_CONDITIONS = [
  'La reserva debe solicitarse al menos 72 horas hábiles antes de la fecha de salida del vuelo.',
  'El pago deberá realizarse el mismo día de la solicitud para mantener el descuento.',
  'El descuento aplica sobre la tarifa base, no incluye impuesto (IVA, TUA).',
  'Se pueden realizar cambios hasta 24 horas hábiles antes del vuelo pagando la penalidad de $499 para la tarifa Flex y $699 para la tarifa Star, más la diferencia tarifaria.',
  'Por ser tarifa promocional, no se permiten cancelaciones.',
] as const;

export const IHTA_REQUEST_INTRO =
  'con el formato proporcionado. Es indispensable incluir todos los datos para procesar la solicitud. Se llena un formato por cada pasajero.';

export const IHTA_REQUEST_FIELDS = [
  'Asunto: nombre del evento al cual asistirán',
  'Nombre completo del pasajero',
  'Fecha de Nacimiento del pasajero',
  'Correo electrónico',
  'Número de contacto',
  'Ruta (Origen – Destino)',
  'Fecha y hora de los vuelos deseados',
] as const;

export const IHTA_PAYMENT_INTRO =
  'Una vez recibida tu información, te enviaremos la cotización con el descuento aplicado. Si decides confirmar:';

export const IHTA_PAYMENT_STEPS = [
  'Se te proporcionará una liga de pago para tarjeta de crédito o datos bancarios para transferencia.',
  'Envía tu comprobante respondiendo al mismo correo de la cotización.',
  'Una vez validado, recibirás tu itinerario por correo electrónico.',
] as const;

export const IHTA_FOOTER_NOTE =
  'Para consultar el detalle de cada tarifa, visita nuestro sitio web';

import { Lang } from '@friends-library/types';
import { Order } from './order';
import env from './env';

export function emailFrom(lang: Lang): string {
  let name = lang === 'en' ? 'Friends Library' : 'Biblioteca de los Amigos';
  if (env.getContext() === 'TEST') {
    name += ' [TEST]';
  }
  return `${name} <app@friendslibrary.com>`;
}

export function orderShippedEmail(
  order: Order,
  trackingUrl?: string,
): { subject: string; text: string } {
  const lang = order.lang;
  const trackingUnavailable =
    lang === 'en' ? 'Sorry, not available' : 'Lo sentimos, no disponible';
  return {
    subject:
      lang === 'es'
        ? '[,] Pedido Enviado – Biblioteca de Amigos'
        : '[,] Friends Library Order Shipped',
    text: (lang === 'es' ? ORDER_SHIPPED_EMAIL_ES : ORDER_SHIPPED_EMAIL_EN)
      .replace('{{salutation}}', salutation(order, lang === 'es' ? '¡Hola!' : 'Hello!'))
      .replace('{{lineItems}}', lineItems(order))
      .replace('{{trackingUrl}}', trackingUrl || `[${trackingUnavailable}]`)
      .replace('{{orderId}}', order.id),
  };
}

export function orderConfirmationEmail(order: Order): { subject: string; text: string } {
  const lang = order.lang;
  return {
    subject:
      lang === 'es'
        ? '[,] Confirmación de Pedido - Biblioteca de Amigos'
        : '[,] Friends Library Order Confirmation',
    text: (lang === 'es' ? CONFIRMATION_EMAIL_ES : CONFIRMATION_EMAIL_EN)
      .replace('{{salutation}}', salutation(order, lang === 'es' ? '¡Hola!' : 'Hello!'))
      .replace('{{lineItems}}', lineItems(order))
      .replace('{{orderId}}', order.id),
  };
}

function salutation(order: Order, fallback: string): string {
  const name = order.address.name;
  if (typeof name === 'string') {
    return name.split(' ').shift() + ',';
  }
  return fallback;
}

function lineItems(order: Order): string {
  const items: { title: string; quantity: number }[] = order.items || [];
  return items.map(item => `* (${item.quantity}) ${item.title}`).join('\n');
}

const CONFIRMATION_EMAIL_EN = `
{{salutation}}

Thanks for ordering from Friends Library Publishing! Your order was successfully created with the following item(s):

{{lineItems}}

For your reference, your order id is: {{orderId}}. We'll be sending you one more email in a few days with your tracking number, as soon as it ships. For many shipping addresses, a normal delivery date is around 7 to 14 days after purchase.

** Note: Due to complications with shipping having to do with the ongoing COVID-19 pandemic, your book order may arrive as much as 10-15 days later than normal. We’re sorry for the inconvenience. **

Please don't hesitate to let us know if you have any questions!

- Friends Library Publishing
`.trim();

const CONFIRMATION_EMAIL_ES = `
{{salutation}}

¡Gracias por realizar un pedido de la Biblioteca de Amigos!  Tu pedido ha sido registrado exitosamente con los siguientes artículos: 

{{lineItems}}

Para tu información, el número de referencia de tu pedido es: {{orderId}}. Dentro de unos pocos días, cuando el envío sea realizado, vamos a enviarte otro correo electrónico con tu número de rastreo. En la mayoría de los casos, el tiempo normal de entrega es de unos 7 a 14 días después de la compra.

** Nota: Debido a las complicaciones que tienen los envíos por la pandemia del COVID-19, tu pedido de libros puede demorar en llegar hasta 10-15 días más de lo normal. Lamentamos las molestias que esto pueda ocasionarte. **

¡Por favor no dudes en hacernos saber si tienes alguna pregunta! 

- Biblioteca de Amigos
`.trim();

const ORDER_SHIPPED_EMAIL_EN = `
{{salutation}}

Good news! Your order ({{orderId}}) containing the following item(s) has shipped:

{{lineItems}}

To track your package, you can use the below link:

{{trackingUrl}}

Please don't hesitate to let us know if you have any questions!

- Friends Library Publishing
`.trim();

const ORDER_SHIPPED_EMAIL_ES = `
{{salutation}}

¡Buenas noticias! Tu pedido ({{orderId}}) que contiene los siguientes artículos ha sido enviado: 

{{lineItems}}

Puedes usar el enlace a continuación para rastrear tu paquete: 

{{trackingUrl}}

¡Por favor no dudes en hacernos saber si tienes alguna pregunta! 

- Biblioteca de Amigos
`.trim();

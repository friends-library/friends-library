import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import Responder from './lib/Responder';
import router from './site/router';
import log from './lib/log';

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  log('*/site fn invocation*', {
    event: {
      path: event.path,
      httpMethod: event.httpMethod,
      queryStringParameters: event.queryStringParameters,
      body: readableBody(event.body),
      headers: {
        origin: event.headers?.origin,
        referer: event.headers?.referer,
        'user-agent': event.headers?.['user-agent'],
      },
    },
  });
  router(event, new Responder(callback));
};

export { handler };

function readableBody(body: any): any {
  if (typeof body === 'object') {
    return body;
  }

  try {
    var obj = JSON.parse(body || '');
  } catch (err) {
    return body;
  }

  return typeof obj === 'object' ? obj : body;
}

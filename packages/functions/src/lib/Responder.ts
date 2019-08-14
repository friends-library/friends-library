import { Callback } from 'aws-lambda';

export default class Responder {
  public constructor(private callback: Callback) {}

  public json(body: Record<string, any>, statusCode: number = 200): void {
    this.callback(null, {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public noContent(): void {
    this.callback(null, { statusCode: 204 });
  }

  public redirect(location: string, statusCode: 302 | 301 = 302): void {
    this.callback(null, {
      statusCode,
      headers: {
        location,
      },
    });
  }

  public text(text: string, statusCode: number = 200): void {
    this.callback(null, {
      statusCode,
      body: text,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  public html(html: string, statusCode: number = 200): void {
    this.callback(null, {
      statusCode,
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  public notFound(): void {
    this.callback(null, {
      statusCode: 404,
      body: 'Not Found',
    });
  }
}
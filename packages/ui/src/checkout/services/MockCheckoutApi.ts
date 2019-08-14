import CheckoutApi, { ApiResponse } from './CheckoutApi';

type MockResponse = ApiResponse & { delay?: number };

export default class MockCheckoutApi extends CheckoutApi {
  private responses: {
    [k: string]: { default: MockResponse; stack?: MockResponse[] };
  } = {
    wakeup: {
      default: {
        ok: true,
        statusCode: 204,
        data: {},
      },
    },
    calculateFees: {
      default: {
        ok: true,
        statusCode: 200,
        data: {
          shippingLevel: 'MAIL',
          shipping: 399,
          taxes: 0,
          ccFeeOffset: 42,
        },
      },
    },
    authorizePayment: {
      default: {
        ok: true,
        statusCode: 201,
        data: {
          chargeId: 'ch_123abc',
          orderId: '123abc',
        },
      },
    },
    createPrintJob: {
      default: {
        ok: true,
        statusCode: 201,
        data: {
          printJobId: 123,
        },
      },
    },
    getPrintJobStatus: {
      default: {
        ok: true,
        statusCode: 200,
        delay: 500,
        data: { status: 'accepted' },
      },
      stack: [
        {
          ok: true,
          statusCode: 200,
          delay: 500,
          data: { status: 'pending' },
        },
      ],
    },
    capturePayment: {
      default: {
        ok: true,
        statusCode: 204,
        data: {},
      },
    },
    updateOrder: {
      default: {
        ok: true,
        statusCode: 200,
        data: { _id: 'order-id', print_job: { status: 'accepted' } },
      },
    },
    getOrder: {
      default: {
        ok: true,
        statusCode: 200,
        data: { _id: 'order-id ' },
      },
    },
  };

  public constructor(private defaultDelay: number = 0) {
    super('');
  }

  public async wakeup(): Promise<ApiResponse> {
    return this.getResponse('wakeup');
  }

  public async calculateFees(): Promise<ApiResponse> {
    return this.getResponse('calculateFees');
  }

  public async authorizePayment(): Promise<ApiResponse> {
    return this.getResponse('authorizePayment');
  }

  public async capturePayment(): Promise<ApiResponse> {
    return this.getResponse('capturePayment');
  }

  public async createPrintJob(): Promise<ApiResponse> {
    return this.getResponse('createPrintJob');
  }

  public async updateOrder(): Promise<ApiResponse> {
    return this.getResponse('updateOrder');
  }

  public async getPrintJobStatus(): Promise<ApiResponse> {
    return this.getResponse('getPrintJobStatus');
  }

  public setResponse(method: string, response: MockResponse): void {
    if (!this.responses[method]) {
      throw new Error(`Unknown method: ${method}`);
    }
    this.responses[method].default = response;
  }

  public pushResponse(method: string, response: MockResponse): void {
    if (!this.responses[method]) {
      throw new Error(`Unknown method: ${method}`);
    }
    if (!this.responses[method].stack) {
      this.responses[method].stack = [];
    }
    (this.responses[method].stack || []).push(response);
  }

  private getResponse(method: string): Promise<ApiResponse> {
    console.log(
      `%cmock checkout api method invoked: %c${method}`,
      'color: grey',
      'color: blue',
    );
    const responses = this.responses[method];
    if (responses.stack && responses.stack.length) {
      return this.maybeDelay(responses.stack.shift() as MockResponse);
    }
    return this.maybeDelay(responses.default);
  }

  private maybeDelay(mockResponse: MockResponse): Promise<ApiResponse> {
    const delay = mockResponse.delay || this.defaultDelay;
    if (delay === 0) {
      return Promise.resolve(mockResponse);
    }
    return new Promise(resolve => setTimeout(() => resolve(mockResponse), delay));
  }
}
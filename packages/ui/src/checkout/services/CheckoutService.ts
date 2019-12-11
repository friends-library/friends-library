import CheckoutApi from './CheckoutApi';
import Cart from '../models/Cart';
import { PrintJobStatus } from '@friends-library/types';

/**
 * CheckoutService exists to orchestrate the series of lambda invocations
 * necessary for checking out. It builds up necessary intermediate state
 * (things like orderId, printJobId, chargeId) in order to pass correct
 * values to the various lambdas throughout the sequence. The CheckoutApi
 * is injected as an independent service for easier unit testing and usage
 * within Storybook.
 */
export default class CheckoutService {
  public orderId = '';
  public chargeId = '';
  public shippingLevel = '';
  public printJobId = -1;
  public printJobStatus?: PrintJobStatus;
  public fees = {
    shipping: 0,
    taxes: 0,
    ccFeeOffset: 0,
  };

  public constructor(public cart: Cart, private api: CheckoutApi) {}

  public async calculateFees(): Promise<null | string> {
    const payload = {
      address: this.cart.address,
      items: this.cart.items.flatMap(item =>
        item.numPages.map(pages => ({
          pages,
          printSize: item.printSize,
          quantity: item.quantity,
        })),
      ),
    };

    const { ok, data } = await this.api.calculateFees(payload);
    if (!ok) {
      return data.msg;
    }

    this.shippingLevel = data.shippingLevel;
    this.fees = {
      shipping: data.shipping,
      taxes: data.taxes,
      ccFeeOffset: data.ccFeeOffset,
    };

    return null;
  }

  public async createOrderAndAuthorizePayment(token: string): Promise<null | string> {
    const { shipping, taxes, ccFeeOffset } = this.fees;
    const payload = {
      token,
      amount: this.cart.subTotal() + this.sumFees(),
      shipping,
      taxes,
      ccFeeOffset,
      email: this.cart.email,
      address: this.cart.address,
      items: this.cart.items.map(item => ({
        documentId: item.documentId,
        edition: item.edition,
        quantity: item.quantity,
        unitPrice: item.price(),
      })),
    };

    const { ok, data } = await this.api.authorizePayment(payload);
    if (!ok) {
      return data.msg;
    }

    this.chargeId = data.chargeId;
    this.orderId = data.orderId;

    return null;
  }

  public async createPrintJob(): Promise<null | string> {
    const payload = {
      orderId: this.orderId,
      chargeId: this.chargeId,
      shippingLevel: this.shippingLevel,
      email: this.cart.email,
      address: this.cart.address,
      items: this.cart.items.flatMap(i =>
        i.numPages.map((pages, idx) => ({
          title: i.printJobTitle(idx),
          coverUrl: i.coverPdfUrl[idx],
          interiorUrl: i.interiorPdfUrl[idx],
          printSize: i.printSize,
          pages,
          quantity: i.quantity,
        })),
      ),
    };

    const { ok, data } = await this.api.createPrintJob(payload);
    if (!ok) {
      return data.msg;
    }

    this.printJobId = data.printJobId;

    return null;
  }

  public async verifyPrintJobAccepted(): Promise<null | string> {
    let attempts = 0;
    do {
      this.printJobStatus && (await new Promise(resolve => setTimeout(resolve, 500)));
      const { ok, data } = await this.api.getPrintJobStatus(this.printJobId);
      if (ok) {
        this.printJobStatus = data.status;
      }
    } while (this.printJobStatus !== 'accepted' && attempts++ < 60);

    if (this.printJobStatus === 'accepted') {
      return null;
    }

    return 'print_job_acceptance_verification_timeout';
  }

  public async updateOrderPrintJobStatus(): Promise<null | string> {
    const { ok, data } = await this.api.updateOrder(this.orderId, {
      'print_job.status': this.printJobStatus,
    });
    return ok ? null : data.msg;
  }

  public async capturePayment(): Promise<null | string> {
    const { ok, data } = await this.api.capturePayment({
      chargeId: this.chargeId,
      orderId: this.orderId,
    });
    return ok ? null : data.msg;
  }

  public async sendWakeup(): Promise<null | string> {
    const { ok, data } = await this.api.wakeup();
    return ok ? null : data.msg;
  }

  public async sendOrderConfirmationEmail(): Promise<null | string> {
    const { ok, data } = await this.api.sendOrderConfirmationEmail(this.orderId);
    return ok ? null : data.msg;
  }

  private sumFees(): number {
    return Object.values(this.fees).reduce((sum, fee) => sum + fee);
  }
}

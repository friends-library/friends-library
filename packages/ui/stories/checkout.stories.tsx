import React from 'react';
import { storiesOf } from '@storybook/react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { action as a } from '@storybook/addon-actions';
import { ThreeD } from '@friends-library/cover-component';
import Modal from '../src/checkout/Modal';
import Delivery from '../src/checkout/Delivery';
import Payment from '../src/checkout/Payment';
import Input from '../src/checkout/Input';
import EmptyCart from '../src/checkout/EmptyCart';
import UnrecoverableError from '../src/checkout/UnrecoverableError';
import Progress from '../src/checkout/Progress';
import Confirmation from '../src/checkout/Confirmation';
import { coverSizes } from './decorators';
import { props as coverProps } from './cover.stories';

storiesOf(`Checkout Components`, module)
  .addDecorator(coverSizes)
  .add(`EmptyCart`, () => (
    <EmptyCart
      recommendedBooks={[
        {
          title: `No Cross, No Crown`,
          path: `/`,
          Cover: <ThreeD {...coverProps} scaler={0.25} scope="1-4" />,
        },
        {
          title: `Journal of George Fox`,
          path: `/`,
          Cover: (
            <ThreeD {...coverProps} edition="modernized" scaler={0.25} scope="1-4" />
          ),
        },
        {
          title: `The Work of Vital Religion in the Soul`,
          path: `/`,
          Cover: <ThreeD {...coverProps} edition="original" scaler={0.25} scope="1-4" />,
        },
      ]}
    />
  ))
  .add(`Payment`, () => (
    <div className="p-8">
      <StripeProvider apiKey="pk_test_DAZbsOWXXbvBe51IEVvVfc4H">
        <Elements>
          <Payment
            throbbing={false}
            onPay={a(`on pay`)}
            onBack={a(`on back`)}
            subTotal={1298}
            shipping={399}
            taxes={132}
            ccFeeOffset={42}
            paymentIntentClientSecret="pi_123_secret_345"
          />
        </Elements>
      </StripeProvider>
    </div>
  ))
  .add(`Payment (throbbing)`, () => (
    <div className="p-8">
      <StripeProvider apiKey="pk_test_DAZbsOWXXbvBe51IEVvVfc4H">
        <Elements>
          <Payment
            throbbing={true}
            onPay={a(`on pay`)}
            onBack={a(`on back`)}
            subTotal={1298}
            shipping={399}
            taxes={132}
            ccFeeOffset={42}
            paymentIntentClientSecret="pi_123_secret_345"
          />
        </Elements>
      </StripeProvider>
    </div>
  ))
  .add(`Progress (order)`, () => <Progress step="Order" />)
  .add(`Progress (delivery)`, () => <Progress step="Delivery" />)
  .add(`Progress (payment)`, () => <Progress step="Payment" />)
  .add(`Progress (confirmation)`, () => <Progress step="Confirmation" />)
  .add(`Input (valid)`, () => (
    <Modal onClose={a(`close modal`)}>
      <div style={{ width: 300 }}>
        <Input
          valid={true}
          onChange={() => {}}
          placeholder="Credit Card #"
          invalidMsg="Invalid Credit Card Number"
        />
      </div>
    </Modal>
  ))
  .add(`Input (invalid)`, () => (
    <Modal onClose={a(`close modal`)}>
      <div style={{ width: 300 }}>
        <Input
          valid={false}
          onChange={() => {}}
          placeholder="Credit Card #"
          invalidMsg="Invalid Credit Card Number"
        />
      </div>
    </Modal>
  ))
  .add(`Input (invalid+value)`, () => (
    <Modal onClose={a(`close modal`)}>
      <div style={{ width: 300 }}>
        <Input
          valid={false}
          onChange={() => {}}
          placeholder="Credit Card #"
          value="444"
          invalidMsg="Invalid Credit Card Number"
        />
      </div>
    </Modal>
  ))
  .add(`Confirmation`, () => (
    <Modal onClose={a(`close modal`)}>
      <Confirmation email="you@example.com" onClose={a(`close`)} />
    </Modal>
  ))
  .add(`Delivery (shipping err)`, () => (
    <div style={{ margin: 25 }}>
      <Delivery onBack={a(`back`)} onSubmit={a(`submit address`)} error />
    </div>
  ))
  .add(`Delivery (throbbing)`, () => (
    <div style={{ margin: 25 }}>
      <Delivery onBack={a(`back`)} throbbing onSubmit={a(`submit address`)} />
    </div>
  ))
  .add(`Delivery`, () => (
    <div style={{ margin: 25 }}>
      <Delivery onBack={a(`back`)} onSubmit={a(`submit address`)} />
    </div>
  ))
  .add(`UnrecoverableError`, () => (
    <UnrecoverableError onClose={a(`close`)} onRetry={a(`retry`)} />
  ));

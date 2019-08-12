import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import MessageThrobber from '../src/checkout/MessageThrobber';
import CostExplanation from '../src/checkout/CostExplanation';
import CollectEmail from '../src/checkout/CollectEmail';
import CollectAddress from '../src/checkout/CollectAddress';
import CollectCreditCard from '../src/checkout/CollectCreditCard';
import Success from '../src/checkout/Success';
import ConfirmFees from '../src/checkout/ConfirmFees';

storiesOf('Checkout Components', module)
  .add('MessageThrobber', () => (
    <Modal onClose={a('close modal')}>
      <MessageThrobber msg="Calculating exact shipping cost" />
    </Modal>
  ))
  .add('CostExplanation', () => (
    <Modal onClose={a('close modal')}>
      <CostExplanation onGotIt={a('got it')} />
    </Modal>
  ))
  .add('Success', () => (
    <Modal onClose={a('close modal')}>
      <Success email="you@example.com" onClose={a('close')} />
    </Modal>
  ))
  .add('CollectEmail', () => (
    <Modal onClose={a('close modal')}>
      <CollectEmail stored="" onSubmit={a('submit email')} />
    </Modal>
  ))
  .add('CollectAddress', () => (
    <Modal onClose={a('close modal')}>
      <CollectAddress onSubmit={a('submit address')} />
    </Modal>
  ))
  .add('CollectCreditCard', () => (
    <Modal onClose={a('close modal')}>
      <CollectCreditCard onPay={a('pay with card')} />
    </Modal>
  ))
  .add('ConfirmFees (no tax)', () => (
    <Modal onClose={a('close modal')}>
      <ConfirmFees
        taxes={0}
        subTotal={824}
        shipping={399}
        ccFeeOffset={42}
        onConfirm={a('confirm shipping')}
        onBackToCart={a('back to cart')}
      />
    </Modal>
  ))
  .add('ConfirmFees (with tax)', () => (
    <Modal onClose={a('close modal')}>
      <ConfirmFees
        taxes={132}
        subTotal={824}
        shipping={399}
        ccFeeOffset={42}
        onConfirm={a('confirm shipping')}
        onBackToCart={a('back to cart')}
      />
    </Modal>
  ));

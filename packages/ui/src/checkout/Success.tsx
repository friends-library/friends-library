import React from 'react';
import Button from '../Button';

const Success: React.FC<{ onClose: () => void; email: string }> = ({
  onClose,
  email,
}) => (
  <div>
    <h1 style={{ marginTop: 0 }}>Success!</h1>
    <p style={{ marginBottom: 25 }}>
      We've processed your order. You will receive an email to <code>{email}</code> with a
      confirmation shortly, and in a few days we'll also send you a tracking number for
      your package once it ships. We really hope you enjoy and benefit from the book you
      ordered!
    </p>
    <Button onClick={onClose}>Close</Button>
  </div>
);

export default Success;

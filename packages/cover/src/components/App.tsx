import React, { useState } from 'react';
import { PrintSizeAbbrev } from '@friends-library/types';
import { Cover } from './Cover';
import './App.css';

function makePdf(props: any): void {
  fetch(`http://localhost:9988`, {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props),
  });
}

const App: React.FC = () => {
  const [printSize, setPrintSize] = useState<PrintSizeAbbrev>('m');
  return (
    <div className="App">
      <select
        value={printSize}
        onChange={e => setPrintSize(e.target.value as PrintSizeAbbrev)}
      >
        <option value="s">Pocket Book</option>
        <option value="m">Standard</option>
        <option value="l">Digest</option>
        <option value="xl">6x9</option>
        <option value="xxl">Extra Large</option>
      </select>
      <p>
        The print size is <code>{printSize}</code>
      </p>
      <Cover title="The Work of Vital Religion in the Soul" author="Samuel Rundell" />
      <button onClick={() => makePdf({ printSize })}>MAKE PDF!</button>
    </div>
  );
};

export default App;

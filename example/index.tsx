import * as React from 'react';
import * as ReactDOM from 'react-dom';

import FramerBottomSheet from '../src';

const App = () => {
  return (
    <div>
      <div>TEST PAGE</div>

      <FramerBottomSheet
        initialPosition="top"
        style={{ backgroundColor: '#FAFAFA' }}
        snapPoint={{ top: { height: 200 }, bottom: { height: 100 } }}
        header={true}
        bottomScrollLock
        headerElement={<div className="h-10 bg-white">헤더</div>}
      >
        <div style={{ height: 1000, backgroundColor: 'blue' }}> 요소 </div>
      </FramerBottomSheet>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

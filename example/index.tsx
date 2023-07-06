import * as React from 'react';
import * as ReactDOM from 'react-dom';

import FramerBottomSheet from '../src';
import { FramerBottomSheetRef } from '../src/sheetType';

const App = () => {
  const ref = React.useRef<FramerBottomSheetRef>(null);
  return (
    <div>
      <div>TEST PAGE</div>
      <button
        onClick={() => {
          const el = ref.current;
          if (el) {
            console.log('el : ', el);
            console.log('el : ', el.getContentScrollTop());
            console.log('el : ', el.getPosition());
          }
        }}
      >
        method
      </button>

      <FramerBottomSheet
        ref={ref}
        initialPosition="bottom"
        style={{ backgroundColor: '#FAFAFA' }}
        snapPoint={{ top: { height: 400 }, bottom: { height: 100 } }}
        bottomScrollLock
        headerElement={<div>헤더</div>}
        footerElement={
          <div style={{ height: 50, backgroundColor: 'black', color: 'white' }}>
            푸터
          </div>
        }
      >
        <div style={{ height: 1000, backgroundColor: 'blue' }}> 요소 </div>
      </FramerBottomSheet>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

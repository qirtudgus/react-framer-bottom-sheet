import { useRef } from 'react';
import { FramerBottomSheet } from './FramerBottomSheet';
import { FramerBottomSheetRef } from './sheetType';

const App = () => {
  const ref = useRef<FramerBottomSheetRef>(null);

  return (
    <>
      Appzz
      <FramerBottomSheet
        ref={ref}
        initialPosition="top"
        style={{ backgroundColor: '#fff' }}
        snapPoint={{ top: { height: 400 }, bottom: { height: 100 } }}
      ></FramerBottomSheet>
    </>
  );
};

export { App };

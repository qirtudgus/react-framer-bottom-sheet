# react-framer-bottom-sheet

![framer](https://github.com/qirtudgus/react-framer-bottom-sheet/assets/70016257/3efd07a1-2b77-4dad-8dba-60f8d2f64512)

## Installation

```sh
npm install react-framer-bottom-sheet
```

or

```sh
yarn add react-framer-bottom-sheet
```

## Usage

```jsx
import FramerBottomSheet from 'react-framer-bottom-sheet';
import { FramerBottomSheetRef } from 'react-framer-bottom-sheet/dist/sheetType';

function App() {
  const sheetRef = useRef < FramerBottomSheetRef > null;

  const buttonHandler = () => {
    sheetRef.current?.snapTo('bottom');
  };

  return (
    <div className="App">
      <button onClick={buttonHandler}>to bottom</button>
      <FramerBottomSheet
        initialPosition="top"
        ref={sheetRef}
        style={{ backgroundColor: '#FAFAFA' }}
        snapPoint={{ top: { height: 400 }, bottom: { height: 100 } }}
        bottomScrollLock
        headerElement={
          <div style={{ height: 50, backgroundColor: 'red' }}>header</div>
        }
        footerElement={
          <div style={{ height: 50, backgroundColor: 'green' }}>footer</div>
        }
      >
        <div style={{ height: 500, backgroundColor: 'blue' }}>Content</div>
      </FramerBottomSheet>
    </div>
  );
}

export default App;
```

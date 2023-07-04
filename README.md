# react-framer-bottom-sheet

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
        header={true}
        bottomScrollLock
        headerElement={<div className="h-10 bg-white">header</div>}
        footerElement={<div className="h-10 bg-white">footer</div>}
      >
        <div>Content</div>
      </FramerBottomSheet>
    </div>
  );
}

export default App;
```

import { App } from './App';
import CreateDOM from 'react-dom/client';

const root = CreateDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);

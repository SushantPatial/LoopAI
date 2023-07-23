import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Upload from './components/Upload';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Upload />} />
          <Route path='*' element={<>404</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

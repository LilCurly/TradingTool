import { Price } from './features/price/Price';
import { Form } from './features/form/Form';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack'
import { useAppDispatch } from './app/hooks';
import { clearMessages } from './features/form/formSlice';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  const dispatch = useAppDispatch()

  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider autoHideDuration={5000} onClose={() => {dispatch(clearMessages())}} anchorOrigin={{horizontal: 'center', vertical: 'top'}}>
        <div className="App">
          <header className="App-body">
            <div className='Tool-col'>
              <Form/>
            </div>
            <div className='Price-col'>
              <Price/>
            </div>
          </header>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

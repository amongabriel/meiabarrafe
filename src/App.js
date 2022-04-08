import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import { SnackbarProvider } from 'notistack';
import GlobalStyle from './styles/global';

const App = () => (
  <>
    <GlobalStyle />
    <Router>
      <SnackbarProvider
        maxSnack={4}
        preventDuplicate
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Routes />
      </SnackbarProvider>
    </Router>
  </>
);

export default App;

import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
// import { ThemeProvider, preset, jss } from 'react-jss';
// import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import store from '../state';
import oldtheme from '../constants/theme';
import 'react-notifications-component/dist/theme.css';
import { Router, Route, Switch } from 'react-router-dom';
import * as routes from '../constants/routes';
import BackGround from '../components/background';
import history from '../constants/history';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const LandingPage = lazy(() => import('./landingpage'));
const Faq = lazy(() => import('./faq'));
const Developers = lazy(() => import('./widget'));
const Swap = lazy(() => import('./swap'));
const Refund = lazy(() => import('./refund'));
const ReverseSwap = lazy(() => import('./reverse'));
const ReverseSwapTimelockExpired = lazy(() => import('./reversetimelock'));
const Continue = lazy(() => import('./continue'));

// const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
// prefersDarkMode ? 'dark' : 'light',
const theme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#7a40ee',
      },
      secondary: {
        main: '#303b47',
      },
    },
    colors: {
      seaPink: '#EF9391',
      elephantBlue: '#134357',
      // matisseBlue: '#1677A0',
      matisseBlue: 'rgba(85,70,255,1)',
      // celloBlue: '#1E485B',
      // celloBlue: 'rgba(75,60,235,1)',
      celloBlue: 'rgba(85,70,255,1)',
      aeroBlue: '#C2FFF1',
      turquoise: '#50E3C2',
      lightGrey: '#D3D3D3',
      mischkaGrey: '#DDD9DF',
      tundoraGrey: '#4A4A4A',
      hoverGrey: '#9D9D9D',
      white: '#fff',
      red: '#FF0000',
      black: '#000',
    },
  },
  oldtheme
);

// jss.setup(preset);
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<BackGround showFooter={false} />}>
          <Router history={history}>
            <Switch>
              <Route exact path={routes.home} component={LandingPage} />
              <Route exact path={routes.faq} component={Faq} />
              <Route exact path={routes.developers} component={Developers} />
              <Route exact path={routes.swap} component={Swap} />
              <Route exact path={routes.refund} component={Refund} />
              <Route exact path={routes.reverseSwap} component={ReverseSwap} />
              <Route exact path={routes.zcontinue} component={Continue} />
              <Route
                exact
                path={routes.reverseExpired}
                component={ReverseSwapTimelockExpired}
              />
              <Route path={'*'} component={LandingPage} />
            </Switch>
          </Router>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

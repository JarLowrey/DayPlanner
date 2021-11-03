import React, { Component } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/header";

import AppRoutes from "./routes/appRoutes.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import withWindowDimensions from "./components/withWindowSize/index.jsx";

import Home from "./routes/home.jsx";
import { styled } from '@mui/styles';

const theme = createTheme({
	typography: {
		htmlFontSize: 14
	},
	palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f44336',
    },
    text:{primary: 'rgba(232, 230, 227, 0.87)'},
	}
});

const Body = styled('div')({
  flex: 1,
});

class App extends Component {
	constructor(props) {
		super(props);

		//simple global data container
		window.globalAppData = {
			appName: "Day Planner"
		};
		document.title = window.globalAppData.appName; //set tab title
	}

	render() {
		return (
      <ThemeProvider theme={theme}>
        <Router>
          <Header appRoutes={AppRoutes} />
          <Body>
            <Switch>
              {AppRoutes.map(x => {
                return (
                  <Route
                    key={x.path}
                    exact={x.exact}
                    path={x.path}
                    component={x.component}
                  />
                );
              })}
              <Route component={Home}/>	
            </Switch>
          </Body>
        </Router>
			</ThemeProvider>
		);
	}
}

export default withWindowDimensions(App)
import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/index";

export default class App1 extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/main">
            <Main />
          </Route>
        </Switch>
      </Router>
    );
  }
}

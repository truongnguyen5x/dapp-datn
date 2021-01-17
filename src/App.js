import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Dapp from './views/Dapp'
import 'antd/dist/antd.css';

function App() {
  return (

    <Router>

      <Switch>
        <Route path="/">
          <Dapp />
        </Route>
      </Switch>

    </Router>
  );
}


export default App;

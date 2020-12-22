import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Dapp1 from './views/Dapp1'
import Dapp2 from './views/Dapp2'
import 'antd/dist/antd.css';

function App() {
  return (

    <Router>

      <Switch>
        <Route path="/dapp1">
          <Dapp1 />
        </Route>
        <Route path="/dapp2">
          <Dapp2 />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

    </Router>
  );
}
const Home = props => {
  return "home"
}

export default App;

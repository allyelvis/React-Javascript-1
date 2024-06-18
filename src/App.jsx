import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HotelManagement from './pages/HotelManagement';
import RestaurantManagement from './pages/RestaurantManagement';
import RetailManagement from './pages/RetailManagement';

const App = () => (
  <Router>
    <div>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/hotel" component={HotelManagement} />
        <Route path="/restaurant" component={RestaurantManagement} />
        <Route path="/retail" component={RetailManagement} />
      </Switch>
    </div>
  </Router>
);

export default App;

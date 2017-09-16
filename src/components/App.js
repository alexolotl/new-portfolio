import React from 'react';
import { Route, Link } from 'react-router-dom'
import './App.css';
import Portfolio from '../containers/Portfolio';
import Home from '../containers/Home'
import About from './About'

export default () => (
  <div className="App">
    <header className="App-header">
      <h1>AEZ</h1>
      { /*
        <Link to="/">Home</Link>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/about">About</Link>
        */}
    </header>
    <main className="App-intro">
      <Route exact path="/" component={Home} />
      <Route path="/portfolio" component={Portfolio} />
      <Route exact path="/about" component={About} />
    </main>
  </div>
)

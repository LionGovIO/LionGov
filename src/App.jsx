import React  from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Proposals } from './pages/proposals/Proposals'
import { Header } from './components/header/Header'
import { Sidebar } from './components/sidebar/Sidebar'
//import "./styles.css"

//import { init } from './init'

//init()

export function App() {

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="app-wrapper">
        <div className="app-content pt-3 p-md-3 p-lg-4">
          <Router>
            <Switch>
              <Route exact path="/" component={Proposals} />
              <Route exact path="/home" component={Home} />
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  )
}

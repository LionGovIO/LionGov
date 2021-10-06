import React  from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Proposals } from './pages/proposals/Proposals'
import { WeightPoints } from './pages/weightPoints/WeightPoints'
import { SubmitProposal } from './pages/submitProposal/SubmitProposal'
import { Header } from './components/header/Header'
import { Sidebar } from './components/sidebar/Sidebar'
import "./styles.css"
import "./template.css"
import { init } from './init'

init()

export function App() {

  return (
    <div>
      <Router>
        <Header />
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content pt-3 p-md-3 p-lg-4">

              <Switch>
                <Route path="/home" component={Home} />
                <Route exact path="/" component={Proposals} />
                <Route path="/SubmitProposal" component={SubmitProposal} />
                <Route path="/WeightPoints" component={WeightPoints} />
              </Switch>

          </div>
        </div>
      </Router>
    </div>
  )
}

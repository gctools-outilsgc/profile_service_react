import React, { Component } from 'react';
import { 
  Container,
  Menu,
  Header
} from 'semantic-ui-react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'


import Home from  './Home'
import Profile from './Profile'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Container>

        <Menu size='massive'>
          <Menu.Item>
            <Header >GCProfile</Header>
          </Menu.Item>
          <Menu.Item>
            <Link to='/'>Home</Link>
          </Menu.Item>    
          <Menu.Item>
            <Link to='/profile/hello'>Profile Route - id is hello</Link>
          </Menu.Item>            
        </Menu>
        
        <Switch>
          <div>
            <Route exact path='/' component={Home} />
            <Route path='/profile/:id' component={Profile} />
          </div>
        </Switch>

      </Container>
      </BrowserRouter> 
    );
  }
}

export default App;

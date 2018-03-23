import React, { Component } from 'react';
import { 
  Container,
  Menu,
  Header,
  Button,
  Divider
} from 'semantic-ui-react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'


import Home from  './Home'
import Profile from './Profile'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Container>

        <Menu secondary style={{ marginBottom: '30px'}}>
          <Menu.Item>
            <Header >GCProfile</Header>
          </Menu.Item>
          <Menu.Item>
            <Link to='/'>Home</Link>
          </Menu.Item>    
          <Menu.Item>
            <Link to='/profile/hello'>Profile Route - id is hello</Link>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Button basic content='Notifications' size='tiny' />
            </Menu.Item>  
            <Menu.Item>
              <Button primary content='Language' size='tiny' />
            </Menu.Item>
          </Menu.Menu>            
        </Menu>
        
        <Divider />

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

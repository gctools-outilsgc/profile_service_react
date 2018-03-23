import React, { Component } from 'react';
import {
    Header,
    Image,
    Item,
    Icon,
    Button,
    Segment,
    List
} from 'semantic-ui-react'

const fakeProps = {
    name: 'John Doe',
    titleEn: 'Job Title (en)',
    titleFR: 'Job Title (fr)',
    department: 'Department',
    phone: {
        work: '1234567890',
        mobile: '0987654321'
    },
    address: '123 Fake Street',
    email: 'john.doe@mail.mail'
}

const Profile = ({ match }) => (
    <div>
        <ProfileInfo id={match.params.id}/>
        <Segment>
            <Header> Here is where the org chart goes </Header>
        </Segment>
    </div>        
    
)

class ProfileInfo extends Component{
    render(){
        return(
            <Item.Group>
            <Item>
                
                <Item.Image style={{backgroundColor:'blue', height:'80px'}} size='tiny' />
                <Item.Content>
                <Button floated='right' basic size='small'> 
                    <Icon size='tiny' name='edit' /> Edit 
                </Button> 
                    <Item.Header> {fakeProps.name} </Item.Header>
                    <Item.Meta> {fakeProps.titleEn} / {fakeProps.titleFR} </Item.Meta>
                    <Item.Meta> {fakeProps.department} </Item.Meta>
                    <Item.Description style={{ marginTop:'20px' }}>
                        <List horizontal>
                            <List.Item>
                                <List.Icon size='large' name='phone'/>
                                <List.Content>
                                    <List.Header> Work </List.Header>
                                    <List.Description> {fakeProps.phone.work} </List.Description>
                                </List.Content>                                        
                            </List.Item>
                            <List.Item>
                                <List.Icon size='large' name='mobile'/>
                                <List.Content>
                                    <List.Header> Mobile </List.Header>
                                    <List.Description> {fakeProps.phone.mobile} </List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon size='large' name='point'/>
                                <List.Content>
                                    <List.Header> Address </List.Header>
                                    <List.Description> {fakeProps.address} </List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon size='large' name='mail'/>
                                <List.Content>
                                    <List.Header> Email </List.Header>
                                    <List.Description> {fakeProps.email} </List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Item.Description>
                    <Item.Extra> {this.props.id} </Item.Extra>                        
                </Item.Content>    
            </Item>
            </Item.Group>                
        )
    }
}

export default Profile;
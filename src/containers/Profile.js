import React, { Component } from 'react';
import {
    Header
} from 'semantic-ui-react'

const Profile = ({ match }) => (
    <div>
        Profile Info for = {match.params.id}
        <ProfileInfo />
    </div>        
    
)

class ProfileInfo extends Component{
    render(){
        return(
            <div>
                <Header> Example Component </Header>
            </div>                
        )
    }
}

export default Profile;
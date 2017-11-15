import React from 'react';
import {View, Text} from 'react-native';
import {Container} from "native-base";
import MapContainer from './MapContainer';
import {Dimensions } from 'react-native';

class Home extends React.Component {

    componentDidMount() {
         this.props.getCurrentLocation();
    }


    render() {

        return (
            <Container>
                {this.props.region.latitude &&
                < MapContainer region={this.props.region}/>
                }
            </Container>
        );
    };
}

export default Home;
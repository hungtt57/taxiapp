import React from 'react';
import {View, Text} from 'react-native';
import {Container} from "native-base";
import MapContainer from './MapContainer';
import {Dimensions} from 'react-native';

class Home extends React.Component {

    componentDidMount() {
        this.props.getCurrentLocation();
    }


    render() {

        return (
            <Container>
                {this.props.region.latitude &&
                < MapContainer region={this.props.region} getInputData={this.props.getInputData}
                               getAddressPredictions = {this.props.getAddressPredictions}
                               toggleSearchResultModal={this.props.toggleSearchResultModal}
                               resultTypes={this.props.resultTypes}
                               predictions = {this.props.predictions}
                />
                }
            </Container>
        );
    };
}

export default Home;
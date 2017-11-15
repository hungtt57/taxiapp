import React from "react";
import {View, Text} from 'react-native';
import MapView  from 'react-native-maps';
import styles from './MapContainerStyles';
export const MapContainer = ({region}) => {
    return (
        <View style={styles.container}>
            <MapView
                // provider={MapView.PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >

            </MapView>
        </View>
    );
};
export default MapContainer;
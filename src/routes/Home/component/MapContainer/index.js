import React from "react";
import {View, Text} from 'native-base';
import MapView  from 'react-native-maps';
import styles from './MapContainerStyles';
import SearchBox from "../SearchBox";
import SearchResults from "../SearchResults";
export const MapContainer = ({region,getInputData,toggleSearchResultModal,
                                 getAddressPredictions,resultTypes,
                                 predictions,
                                 getSelectedAddress,
                                 selectedAddress
                             }) => {
    return (
        <View style={styles.container}>
            <MapView
                 provider={MapView.PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
            >
                <MapView.Marker
                    coordinate={region}
                    pinColor="red"
                />
            </MapView>
            <SearchBox  getInputData={getInputData}
                        toggleSearchResultModal={toggleSearchResultModal}
                        getAddressPredictions = {getAddressPredictions}
                        selectedAddress={selectedAddress}
            />
            {(resultTypes.pickUp || resultTypes.dropOff) &&
            <SearchResults
                predictions={predictions}
                getSelectedAddress={getSelectedAddress}

            />
            }
        </View>
    );
};
export default MapContainer;
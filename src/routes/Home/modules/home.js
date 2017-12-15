import update from "react-addons-update";
import constants from './actionConstants';

import {Dimensions} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import request from "../../../util/request";
import calculateFare from "../../../util/fareCalculator";
//----------------
//Constants
//---------------
const {
    GET_CURRENT_LOCATION,
    GET_INPUT,
    TOGGLE_SEARCH_RESULT,
    GET_ADDRESS_PREDICTIONS,
    GET_SELECTED_ADDRESS,
    GET_DISTANCE_MATRIX,
    GET_FARE,
    BOOK_CAR,
    GET_NEARBY_DRIVERS
} = constants;
const baseUrl = 'http://192.168.0.7:3000';
const {width, height} = Dimensions.get('window');

const ASPECT_RATION = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATION * LATITUDE_DELTA;

//---------ACTION----------
export function getCurrentLocation() {
    return (dispatch) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                dispatch({
                    type: GET_CURRENT_LOCATION,
                    payload: position
                });
            },
            (error) => console.log(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }
}


//GET USER INPUT

export function getInputData(payload) {
    return {
        type: GET_INPUT,
        payload
    }
}

// toogle search result modal

export function toggleSearchResultModal(payload) {
    return {
        type: TOGGLE_SEARCH_RESULT,
        payload
    }
}

//GET_ADDRESS_PREDICTIONS
export function getAddressPredictions() {
    return (dispatch, store) => {
        let userInput = store().home.resultTypes.pickUp ? store().home.inputData.pickUp : store().home.inputData.dropOff;
        RNGooglePlaces.getAutocompletePredictions(userInput,
            {
                coyntry: "VN"
            }
        ).then((results) => {
            dispatch({
                type: GET_ADDRESS_PREDICTIONS,
                payload: results
            });
        }).catch((error) => {
            console.log(error.message);
        });
    };
}

//get nearby drivers
export function getNearByDrivers () {
    return (dispatch, store) => {
        request.get(baseUrl+"/api/driverLocation")
            .query({
                latitude : store().home.region.latitude,
                longitude : store().home.region.longitude,
            })
            .finish((error,res) => {
                dispatch({
                    type:GET_NEARBY_DRIVERS,
                    payload:res.body
                })
            });
    };
}


//-------
// -Action handlers-----
// --

function handleGetCurrenLocation(state, action) {

    return update(state, {
        region: {
            latitude: {
                $set: action.payload.coords.latitude
            },
            longitude: {
                $set: action.payload.coords.longitude
            },
            latitudeDelta: {
                $set: LATITUDE_DELTA
            },
            longitudeDelta: {
                $set: LONGITUDE_DELTA
            }
        }
    });
}

function handleGetInputData(state, action) {
    const {key, value} = action.payload;
    return update(state, {
        inputData: {
            [key]: {
                $set: value
            }
        }
    });
}

function handleToggleSearchResult(state, action) {
    if (action.payload === 'pickUp') {
        return update(state, {
            resultTypes: {
                pickUp: {
                    $set: true,
                },
                dropOff: {
                    $set: false
                }
            },
            predictions: {
                $set: {}
            }
        });
    }

    if (action.payload === 'dropOff') {
        return update(state, {
            resultTypes: {
                pickUp: {
                    $set: false,
                },
                dropOff: {
                    $set: true
                }
            },
            predictions: {
                $set: {}
            }
        });
    }
}

function handleGetAddressPredictions(state, action) {
    return update(state, {
        predictions: {
            $set: action.payload
        }
    });

}

//get selected address
function handleGetSelectedAddress(state, action) {
    let selectedTitle = state.resultTypes.pickUp ? "selectedPickUp" : "selectedDropOff";
    return update(state, {
        selectedAddress: {
            [selectedTitle] : {
                $set: action.payload
            }
        },
        resultTypes : {
            pickUp : {
                $set : false
            },
            dropOff : {
                $set : false
            }
        }
    });
}


export function getSelectedAddress (payload) {
    const dummyNumbers = {
        baseFare : 0.4,
        timeRate : 0.14,
        distanceRate : 0.97,
        surge : 1
    }
    return (dispatch,store)  => {
        // payload is thing when user click
        RNGooglePlaces.lookUpPlaceByID(payload)
            .then((results) => {
                dispatch({
                    type :GET_SELECTED_ADDRESS,
                    payload : results
                });

            }).then(() => {
            //get the distance
                if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff) {
                    request.get('https://maps.googleapis.com/maps/api/distancematrix/json').
                        query({
                            origins: store().home.selectedAddress.selectedPickUp.latitude + ","+ store().home.selectedAddress.selectedPickUp.longitude,
                            destinations: store().home.selectedAddress.selectedDropOff.latitude+ ","+ store().home.selectedAddress.selectedDropOff.longitude,
                            mode : 'driving',
                            key : "AIzaSyBnvzMZd6A-GjvrHCFwCLv7-EY5ZIbftN4"
                    })
                        .finish((error,res) => {
                            dispatch({
                                type : GET_DISTANCE_MATRIX,
                                payload : res.body
                            });
                            let data = res.body;
                            const fare = calculateFare(
                                dummyNumbers.baseFare,
                                dummyNumbers.timeRate,
                                data.rows[0].elements[0].duration.value,
                                dummyNumbers.distanceRate,
                                data.rows[0].elements[0].duration.value,
                                dummyNumbers.surge,
                            );
                            dispatch({
                                type : GET_FARE,
                                payload:fare
                            });
                        });
                }
                // setTimeout(function () {
                //     if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff) {
                //
                //     }
                // },2000);
             }).catch((error) => console.log(error.message));
    }
}

function handleGetDistanceMatrix(state,action) {
    return update(state, {
        distanceMatrix : {
            $set : action.payload
        }
    });
}
function handleGetFare(state,action) {
    return update(state, {
        fare : {
            $set : action.payload
        }
    });
};

export function bookCar () {

    return (dispatch,store) => {
        const nearByDrivers =  store().home.nearByDrivers;
        const nearByDriver = nearByDrivers[Math.floor((Math.random()*nearByDrivers.length))];
        const payload =  {
            data : {
                userName : "hinkeu",
                pickUp : {
                    address : store().home.selectedAddress.selectedPickUp.address,
                    name :store().home.selectedAddress.selectedPickUp.name,
                    latitude :store().home.selectedAddress.selectedPickUp.latitude,
                    longitude :store().home.selectedAddress.selectedPickUp.longitude,
                },
                dropOff : {
                    address : store().home.selectedAddress.selectedDropOff.address,
                    name :store().home.selectedAddress.selectedDropOff.name,
                    latitude :store().home.selectedAddress.selectedDropOff.latitude,
                    longitude :store().home.selectedAddress.selectedDropOff.longitude,
                },
                fare : store().home.fare,
                status: " pending"
            },
            nearByDriver : {
                socketId : nearByDriver.socketId,
                driverId : nearByDriver.driverId,
                latitude : nearByDriver.coordinate.coordinates[1],
                longitude : nearByDriver.coordinate.coordinates[0],
            }
        };
        request.post(baseUrl+"/api/bookings")
            .send(payload)
            .finish((error,res) => {
                dispatch({
                    type:BOOK_CAR,
                    payload:res.body
                })
        });
    }
};

function handleBookCar(state, action){
    return update(state, {
        booking:{
            $set: action.payload
        }
    })
}


//handle get nearby drivers
function handleGetNearbyDrivers(state,action) {
    return update(state,{
        nearByDrivers : {
            $set : action.payload
        }
    })
}



const ACTION_HANDLERS = {
    GET_CURRENT_LOCATION: handleGetCurrenLocation,
    GET_INPUT: handleGetInputData,
    TOGGLE_SEARCH_RESULT: handleToggleSearchResult,
    GET_ADDRESS_PREDICTIONS: handleGetAddressPredictions,
    GET_SELECTED_ADDRESS : handleGetSelectedAddress,
    GET_DISTANCE_MATRIX : handleGetDistanceMatrix,
    GET_FARE : handleGetFare,
    BOOK_CAR : handleBookCar,
    GET_NEARBY_DRIVERS : handleGetNearbyDrivers

};
const initialState = {
    region: {},
    inputData: {},
    resultTypes: {},
    predictions: {},
    selectedAddress : {}
};

export function HomeReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state

}
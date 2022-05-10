import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    ImageBackground
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Colors from '../util/Colors';
import Title from '../reusable_elements/Title';
import LottieView from 'lottie-react-native';
import SectionBanner from '../reusable_elements/SectionBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';
import database from '@react-native-firebase/database';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Constants from '../util/Constants';

const TrackOrderScreen = ({navigation, route}) => {
    const lat = 22.6098639429
    const lan = 88.4011250887
    const [coords,
        setCoords] = useState([]);
    const [region,
        setRegion] = useState(null);
    let images = []
    if (route.params.details.type === 'Items') {
        images = [require('../assets/lottie/serviceOrdered.json'), require('../assets/lottie/confirmed.json'), require('../assets/lottie/smiley.json')];
    } else {
        images = [
            require('../assets/lottie/serviceOrdered.json'),
            require('../assets/lottie/confirming.json'),
            require('../assets/lottie/confirmed.json'),
            require('../assets/lottie/searchDoctor.json'),
            require('../assets/lottie/cycle.json'),
            require('../assets/lottie/smiley.json')
        ];
    }
    const [stepIndicatorHeight,
        setStepIndicatorHeight] = useState(400)
    const [stepCount,
        setStepCount] = useState(0)
    const [status,
        setStatus] = useState(route.params.status);
    const [details,
        setDetails] = useState(route.params.details)
    const [labels,
        setLabels] = useState([])
    const [currentPosition,
        setCurrentPosition] = useState(0);
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };
    const getData = () => {
        if (details.type === 'Items' || details.type === 'Adopt') {
            setStepCount(3)
            setStepIndicatorHeight(400)
            setLabels([
                {
                    "desc": "Order is placed from your end...",
                    "name": "Order Placed",
                    "step": "0"
                }, {
                    "desc": "Your order has been shipped...",
                    "name": "Order Shipped",
                    "step": "1"
                }, {
                    "desc": "We have delivered your order...",
                    "name": "Delivered",
                    "step": "2"
                }
            ])
            if (details.userStatus === 'loggedIn') {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        if (phoneNo) {
                            database()
                                .ref("/users/" + phoneNo + "/orders")
                                .on("value", snapshot => {
                                    if (snapshot.val()) {
                                        var trackItemDetails = snapshot
                                            .val()
                                            .filter(item => item.id === details.id)
                                        // console.log(trackItemDetails)
                                        setCurrentPosition(parseInt(trackItemDetails[0].trackStep))
                                    }
                                })
                        }
                    })

            } else {
                database()
                    .ref("/anonymous/" + details.id)
                    .on("value", snapshot => {
                        if (snapshot.val()) {
                            setCurrentPosition(parseInt(snapshot.val().trackStep))
                        }
                    })
            }

        } else {
            setStepCount(6)
            setStepIndicatorHeight(600)
            database()
                .ref('/stepIndicator')
                .on('value', snapshot => {
                    if (snapshot.val()) {
                        setLabels(snapshot.val())
                    }
                })
            if (details.userStatus === 'loggedIn') {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        if (phoneNo) {
                            database()
                                .ref("/users/" + phoneNo + "/services")
                                .on("value", snapshot => {
                                    if (snapshot.val()) {
                                        var trackItemDetails = snapshot
                                            .val()
                                            .filter(item => item.id === details.id)
                                        setCurrentPosition(parseInt(trackItemDetails[0].trackStep))
                                    }
                                })
                        }
                    })

            } else {
                database()
                    .ref("/anonymous/" + details.id)
                    .on("value", snapshot => {
                        if (snapshot.val()) {
                            setCurrentPosition(parseInt(snapshot.val().trackStep))
                        }
                    })
            }
        }

    }
    const onPressNavBack = () => {
        if (route.params.details.fromScreen === 'Confirm') {
            navigation.navigate("HomeBottomTabBar", {
                screen: "Home",
                status: route.params.details.userStatus
            })
        } else {
            navigation.goBack()
        }

    }

    const getDirections = (url) => {
        const KEY = "AIzaSyBBPGbYThYVRWkyWMt8-N5Y_wjtMFcEmRQ"; //put your API key here.
        //otherwise, you'll have an 'unauthorized' error.
        axios
            .get(url)
            .then(function (response) {
                let points = response.data.waypoints;
                let coords = points.map((point, index) => {
                    return {longitude: point.location[0], latitude: point.location[1]};
                });
                // console.log(coords)
                setCoords(coords)
            })
            .catch(function (error) {
                console.log(error)
            })

    };

    useEffect(() => {
        AsyncStorage
            .getItem("homeAddress")
            .then((address, msg) => {
                let data = JSON.parse(address)
                console.log(data)
                setRegion({latitude: data.lat, longitude: data.lan, latitudeDelta: 0.0032349810554670455, longitudeDelta: 0.0025001540780067444})
                let url = "https://api.mapbox.com/directions/v5/mapbox/walking/" + data.lan + "," + data.lat + ";" + lan + "," + lat + "?annotations=maxspeed&overview=full&geometries=geojson&access_token=" + Constants.MAP_BOX_API
                getDirections(url)
            })
        getData()
    }, [])
    return (
        <View style={{
            flex: 1
        }}>
            <GeneralHeader
                showRigtIcon={false}
                rightIconType={Icons.MaterialIcons}
                rightIconName={'navigate-before'}
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText={"Id: #" + details.id}
                showSubHeaderText={true}
                subHeaderTextSize={16}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={100}
                headerText={'Track Service'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={onPressNavBack}/>
            <View
                style={{
                marginBottom: 80,
                marginTop: 10,
                padding: 20,
                flex: 1,
                width: '100%',
                alignItems: 'flex-start'
            }}>
                <View
                    style={{
                    width: '100%',
                    height: 300
                }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={region}
                        customMapStyle={[
                        {
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#1d2c4d"
                                }
                            ]
                        }, {
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#8ec3b9"
                                }
                            ]
                        }, {
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#1a3646"
                                }
                            ]
                        }, {
                            "featureType": "administrative.country",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#4b6878"
                                }
                            ]
                        }, {
                            "featureType": "administrative.land_parcel",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#64779e"
                                }
                            ]
                        }, {
                            "featureType": "administrative.province",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#4b6878"
                                }
                            ]
                        }, {
                            "featureType": "landscape.man_made",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#334e87"
                                }
                            ]
                        }, {
                            "featureType": "landscape.natural",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#023e58"
                                }
                            ]
                        }, {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#283d6a"
                                }
                            ]
                        }, {
                            "featureType": "poi",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#6f9ba5"
                                }
                            ]
                        }, {
                            "featureType": "poi",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#1d2c4d"
                                }
                            ]
                        }, {
                            "featureType": "poi.park",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#023e58"
                                }
                            ]
                        }, {
                            "featureType": "poi.park",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#3C7680"
                                }
                            ]
                        }, {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#304a7d"
                                }
                            ]
                        }, {
                            "featureType": "road",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#98a5be"
                                }
                            ]
                        }, {
                            "featureType": "road",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#1d2c4d"
                                }
                            ]
                        }, {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#2c6675"
                                }
                            ]
                        }, {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#255763"
                                }
                            ]
                        }, {
                            "featureType": "road.highway",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#b0d5ce"
                                }
                            ]
                        }, {
                            "featureType": "road.highway",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#023e58"
                                }
                            ]
                        }, {
                            "featureType": "transit",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#98a5be"
                                }
                            ]
                        }, {
                            "featureType": "transit",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#1d2c4d"
                                }
                            ]
                        }, {
                            "featureType": "transit.line",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#283d6a"
                                }
                            ]
                        }, {
                            "featureType": "transit.station",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#3a4762"
                                }
                            ]
                        }, {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#0e1626"
                                }
                            ]
                        }, {
                            "featureType": "water",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#4e6d70"
                                }
                            ]
                        }
                    ]}>
                        {coords.length > 0 && <Polyline coordinates={coords}/>}
                    </MapView>
                </View>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>

                    <View>

                        <View
                            style={{
                            height: stepIndicatorHeight,
                            padding: 10
                        }}>
                            <StepIndicator
                                direction='vertical'
                                stepCount={stepCount}
                                customStyles={{
                                labelAlign: 'flex-start',
                                stepIndicatorSize: 30,
                                currentStepIndicatorSize: 40,
                                separatorStrokeWidth: 3,
                                currentStepStrokeWidth: 5,
                                stepStrokeCurrentColor: Colors.primary,
                                separatorFinishedColor: Colors.darkGray,
                                separatorUnFinishedColor: Colors.mediumDark,
                                stepIndicatorFinishedColor: Colors.primary,
                                stepIndicatorUnFinishedColor: Colors.darkGray,
                                stepIndicatorCurrentColor: Colors.appBackground,
                                stepIndicatorLabelFontSize: 15,
                                currentStepIndicatorLabelFontSize: 15,
                                stepIndicatorLabelCurrentColor: Colors.black,
                                stepIndicatorLabelFinishedColor: Colors.appBackground,
                                stepIndicatorLabelUnFinishedColor: Colors.lightOverlayColor
                            }}
                                currentPosition={currentPosition}
                                labels={labels.map((item, index) => <Animatable.View
                                delay={100 * index}
                                animation={'fadeInRight'}
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <View
                                    style={{
                                    marginLeft: 10,
                                    alignItems: 'center',
                                    borderWidth: currentPosition === index
                                        ? 1
                                        : 0,
                                    borderColor: Colors.gray,
                                    borderRadius: 10,
                                    padding: 5
                                }}>
                                    {currentPosition === index
                                        ? <LottieView
                                                style={{
                                                width: 50,
                                                height: 50
                                            }}
                                                source={images[index]}
                                                autoPlay={currentPosition === index
                                                ? true
                                                : false}
                                                loop/>
                                        : null}
                                </View>
                                <View
                                    style={{
                                    marginLeft: 15
                                }}>
                                    <Title
                                        size={18}
                                        label={item.name}
                                        bold={true}
                                        color={currentPosition === index
                                        ? Colors.primary
                                        : Colors.darkGray}/>
                                    <View
                                        style={{
                                        width: '95%'
                                    }}>
                                        <Title
                                            size={15}
                                            label={item.desc}
                                            bold={true}
                                            color={currentPosition === index
                                            ? '#444'
                                            : Colors.gray}/>
                                    </View>
                                </View>
                            </Animatable.View>)}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <ImageBackground
                blurRadius={0}
                source={require('../assets/images/background6.png')}
                style={{
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                height: 100,
                backgroundColor: Colors.secondary,
                borderTopLeftRadius: 50,
                elevation: 10,
                borderTopRightRadius: 50
            }}>
                <View style={{
                    width: '90%'
                }}>
                    {route.params.details.type === 'Service'
                        ? <View
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Animatable.View
                                    delay={100}
                                    animation={'slideInLeft'}
                                    style={{
                                    alignItems: 'center',
                                    backgroundColor: Colors.darkOverlayColor,
                                    borderRadius: 15,
                                    borderColor: Colors.gold,
                                    borderWidth: 1
                                }}>
                                    <Image
                                        source={{
                                        uri: details.image
                                    }}
                                        style={{
                                        width: 80,
                                        height: 80
                                    }}/>
                                </Animatable.View>
                                <Animatable.View
                                    delay={100}
                                    animation={'slideInRight'}
                                    style={{
                                    marginLeft: 10,
                                    width: '70%',
                                    alignItems: 'flex-start'
                                }}>
                                    <Title
                                        size={20}
                                        label={details.title}
                                        bold={true}
                                        color={Colors.appBackground}/>
                                    <View
                                        style={{
                                        flexDirection: 'row'
                                    }}>
                                        <Title size={16} label='Price:' bold={true} color={Colors.appBackground}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={16}
                                                label={"₹ " + details.total + " /-"}
                                                bold={true}
                                                color={Colors.white}/>
                                        </View>
                                    </View>
                                </Animatable.View>
                            </View>
                        : <View>
                            <Animatable.View
                                delay={100}
                                animation={'slideInLeft'}
                                style={{
                                marginLeft: 10,
                                width: '70%',
                                alignItems: 'flex-start'
                            }}>
                                <Title size={20} label={"Pet Items"} bold={true} color={Colors.appBackground}/>
                                <View
                                    style={{
                                    flexDirection: 'row'
                                }}>
                                    <Title size={16} label='Total Price:' bold={true} color={Colors.appBackground}/>
                                    <View
                                        style={{
                                        marginLeft: 5
                                    }}>
                                        <Title
                                            size={16}
                                            label={"₹ " + details.total + " /-"}
                                            bold={true}
                                            color={Colors.white}/>
                                    </View>
                                </View>
                            </Animatable.View>
                        </View>
}

                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    backTextWhite: {
        color: Colors.appBackground
    },
    rowBack: {
        flex: 1
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 20,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: Colors.primary,
        right: 10,
        borderRadius: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: 280
    }
});

export default TrackOrderScreen;

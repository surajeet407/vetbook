import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    ImageBackground,
    Linking
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import StepIndicator from 'react-native-step-indicator';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Colors from '../util/Colors';
import Title from '../reusable_elements/Title';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';
import database from '@react-native-firebase/database';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import axios from 'axios';
import Constants from '../util/Constants';

const TrackOrderScreen = ({navigation, route}) => {
    const mainLat = 22.6098639429
    const mainLan = 88.4011250887
    const isFocused = useIsFocused();
    const [markers,
        setMarkers] = useState(null)
    const mapRef = useRef(null)
    const [estimatedTime,
        setEstimatedTime] = useState(0);
    const [distance,
        setDistance] = useState(0);
    const [coords,
        setCoords] = useState([]);
    const [region,
        setRegion] = useState({latitude: 22.6461341, longitude: 88.786546354235, latitudeDelta: 0.0032349810554670455, longitudeDelta: 0.0025001540780067444});
    let images = []
    if (route.params.details.type === 'Items') {
        images = [require('../assets/lottie/serviceOrdered.json'), require('../assets/lottie/confirmed.json'), require('../assets/lottie/smiley.json')];
    } else {
        images = [
            require('../assets/lottie/serviceOrdered.json'),
            require('../assets/lottie/confirming.json'),
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
        setCurrentPosition] = useState(parseInt(route.params.details.trackStep));
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
                                        if (currentPosition) {
                                            var trackItemDetails = snapshot
                                                .val()
                                                .filter(item => item.id === details.id)
                                            // console.log(trackItemDetails)
                                            setCurrentPosition(parseInt(trackItemDetails[0].trackStep))
                                        }
                                    }
                                })
                        }
                    })

            } else {
                database()
                    .ref("/anonymous/" + details.id)
                    .once("value")
                    .then(snapshot => {
                        if (snapshot.val()) {
                            setCurrentPosition(parseInt(snapshot.val().trackStep))
                        }
                    })
            }

        } else {
            setStepCount(5)
            setStepIndicatorHeight(400)
            setLabels([
                {
                    "name": "We have received your request",
                    "step": "0"
                }, {
                    "name": "Service Confirmed",
                    "step": "1"
                }, {
                    "name": "Assigning to Doctor",
                    "step": "2"
                }, {
                    "name": "Doctor is on the way",
                    "step": "3"
                }, {
                    "name": "Service provided",
                    "step": "4"
                }
            ])
            if (details.userStatus === 'loggedIn') {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        if (phoneNo) {
                            database()
                                .ref("/users/" + phoneNo + "/services")
                                .on("value", snapshot => {
                                    if (snapshot.val()) {
                                        if (currentPosition) {
                                            console.log("here")
                                            let trackItemDetails = snapshot
                                                .val()
                                                .filter(item => item.id === details.id)
                                            setCurrentPosition(parseInt(trackItemDetails[0].trackStep))
                                        }
                                    }
                                })
                        }
                    })

            } else {
                database()
                    .ref("/anonymous/" + details.id)
                    .once("value")
                    .then(snapshot => {
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

    const getDirections = (url, lat, lan) => {
        axios
            .get(url)
            .then(function (response) {
                let points = response.data.routes[0].geometry.coordinates;
                let coords = points.map((point, index) => {
                    return {longitude: point[0], latitude: point[1]};
                });
                setEstimatedTime((response.data.routes[0].duration / 60).toFixed(2))
                setDistance((response.data.routes[0].distance / 1000).toFixed(2))
                setCoords(coords)
            })
            .catch(function (error) {
                console.log(error)
            })

    };

    useEffect(() => {
        if (isFocused) {
            if (details.type === 'Service') {
                AsyncStorage
                    .getItem("homeAddress")
                    .then((address, msg) => {
                        let data = JSON.parse(address)
                        setRegion({latitude: data.lat, longitude: data.lan, latitudeDelta: 0.0032349810554670455, longitudeDelta: 0.0025001540780067444})
                        setMarkers([
                            {
                                latitude: data.lat,
                                longitude: data.lan,
                                title: 'Home'
                            }, {
                                latitude: mainLat,
                                longitude: mainLan,
                                title: 'Doctor'
                            }
                        ])
                        let url = "https://api.mapbox.com/directions/v5/mapbox/driving/" + data.lan + "," + data.lat + ";" + mainLan + "," + mainLat + "?annotations=duration&overview=full&geometries=geojson&access_token=" + Constants.MAP_BOX_API
                        getDirections(url, data.lat, data.lan)
                    })
            }
            getData()
        }
    }, [isFocused])
    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <GeneralHeader
                showRigtIcon={false}
                rightIconType={Icons.MaterialIcons}
                rightIconName={'navigate-before'}
                rightIconSize={35}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText={"Id: #" + details.id}
                showSubHeaderText={details.type === 'Service'? false:true}
                subHeaderTextSize={16}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={details.type === 'Service'? 90: 120}
                headerText={'Track Service'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={35}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={onPressNavBack}/>
            <View
                style={{
                marginBottom: 80,
                flex: 1,
                width: '100%',
                alignItems: 'flex-start'
            }}>
                {details.type === 'Service' && (
                    <View
                        style={{
                        width: '100%',
                        height: 280,
                        marginBottom: 40
                    }}>
                        <MapView
                            ref={mapRef}
                            showsMyLocationButton={true}
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            zoomEnabled={true}
                            minZoomLevel={-1}
                            paddingAdjustmentBehavior="automatic"
                            region={region}
                            onLayout=
                            {() => setTimeout( () => { mapRef.current.fitToCoordinates(markers, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: true, }); }, 2000 )}>
                            {markers && markers.map((marker, index) => (
                                <Marker
                                    identifier={index + ""}
                                    key={index}
                                    coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude
                                }}>
                                    <View style={{}}>
                                        <Icon
                                            size={50}
                                            color={marker.title === 'Home'
                                            ? Colors.green2
                                            : Colors.secondary}
                                            type={Icons.MaterialIcons}
                                            name={marker.title === 'Home'
                                            ? 'location-history'
                                            : 'add-location'}/>
                                    </View>
                                </Marker>
                            ))}
                            {coords.length > 0 && <Polyline
                                strokeColor={Colors.error_toast_color}
                                fillColor={Colors.error_toast_color}
                                strokeWidth={8}
                                coordinates={coords}/>
}
                        </MapView>
                        <View
                            style={{
                            zIndex: 999,
                            position: 'absolute',
                            borderRadius: 20,
                            backgroundColor: Colors.accent,
                            height: "25%",
                            width: "98%",
                            justifyContent: 'center',
                            top: "85%",
                            left: 5
                        }}>
                            <View
                                style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title
                                            size={14}
                                            label={"Estimated Time: "}
                                            bold={true}
                                            color={Colors.darkGray}/>
                                        <Title
                                            size={14}
                                            label={estimatedTime + " Minitues"}
                                            bold={true}
                                            color={Colors.white}/>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={14} label={"Distance: "} bold={true} color={Colors.darkGray}/>
                                        <Title size={14} label={distance + " KM"} bold={true} color={Colors.white}/>
                                    </View>
                                </View>
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Icon
                                        onPress={() => Linking.openURL('tel:7550841824')}
                                        type={Icons.Feather}
                                        name={'phone-call'}
                                        color={Colors.white}
                                        size={30}/>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>

                    <View>

                        <View
                            style={{
                            height: stepIndicatorHeight,
                            padding: 20
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
                                labels={labels.map((item, index) => <View
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
                            </View>)}/>
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

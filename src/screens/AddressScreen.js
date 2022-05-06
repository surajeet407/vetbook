import React, {useEffect, useState, useRef} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Animated,
    TouchableOpacity,
    KeyboardAvoidingView,
    ImageBackground
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import Geocoder from 'react-native-geocoding';
import Icon, {Icons} from '../util/Icons';
import LottieView from 'lottie-react-native';
import Title from '../reusable_elements/Title';
import * as Animatable from 'react-native-animatable';
import RNBounceable from "@freakycoder/react-native-bounceable";
import GeneralHeader from '../reusable_elements/GeneralHeader';
import i18n from '../util/i18n';

const AddressScreen = ({navigation, route}) => {
    const [address] = useState("106, Chaklalpur, radhamohanpur, Debra, West Bengal,721160");
    const [region,
        setRegion] = useState({latitude: 22.357908900473035, longitude: 87.6132639683783, latitudeDelta: 0.0032349810554670455, longitudeDelta: 0.0025001540780067444});
    
    useEffect(() => {    
        // Geocoder.init("AIzaSyBBPGbYThYVRWkyWMt8-N5Y_wjtMFcEmRQ", {language : "en"});
        //     Geocoder.from(22.357908900473035, 87.6132639683783)
        //     .then(json => {
        //         var addressComponent = json.results[0].address_components[0];       
        //         console.log(addressComponent);
        //     })
        //     .catch(error => console.warn(error));   
        Geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);       
            const initialPosition = JSON.stringify(position);       
            setRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025
            })       
               
        },    
        error => console.log('Error',
            JSON.stringify(error)),     
        {enableHighAccuracy: true, timeout: 200000, maximumAge: 10000},   );  
    }, []);

    const onRegionChange = (region) => {
        // setRegion(region)
    }

    return (
        <KeyboardAvoidingView behavior='height' style={{
            flex: 1
        }}>
            <View style={styles.container}>
                <GeneralHeader
                    showRigtIcon={false}
                    rightIconType={Icons.MaterialIcons}
                    rightIconName={'navigate-before'}
                    rightIconSize={45}
                    rightIconColor={Colors.black}
                    rightIconBackgroundColor={Colors.appBackground}
                    onPressRight={() => navigation.goBack()}
                    subHeaderText="A Quick brown fox jumps over the lazy dog... A Quick brown fox jumps over the lazy dog..."
                    showSubHeaderText={false}
                    subHeaderTextSize={20}
                    subHeaderTextColor={Colors.secondary}
                    position={'absolute'}
                    headerHeight={60}
                    headerText={"Address"}
                    headerTextSize={25}
                    headerTextColor={Colors.primary}
                    showHeaderText={true}
                    showLeftIcon={true}
                    leftIconType={Icons.MaterialIcons}
                    leftIconName={'navigate-before'}
                    leftIconSize={45}
                    leftIonColor={Colors.black}
                    leftIconBackgroundColor={Colors.appBackground}
                    onPressLeft={() => navigation.goBack()}/>
                <View
                    style={{
                    flex: 2,
                    marginBottom: 250
                }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={region}
                        onRegionChange={(region) => onRegionChange(region)}></MapView>
                    <View
                        style={{
                        position: 'absolute',
                        top: '50%',
                        left: '40%'
                    }}>
                        <LottieView
                            style={{
                            width: 80,
                            height: 80
                        }}
                            source={require('../assets/lottie/marker.json')}
                            autoPlay={true}
                            loop/>
                    </View>
                </View>
                <ImageBackground
                    blurRadius={5}
                    source={require('../assets/images/background6.png')}
                    style={{
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    height: 300,
                    backgroundColor: Colors.secondary,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View
                        style={{
                        width: "90%",
                        justifyContent: 'space-around',
                        alignItems: 'flex-start'
                    }}>
                        <Text style={styles.headerText}>Select Your Location</Text>
                        <Text style={styles.input}>{address}</Text>
                    </View>
                    <Animatable.View
                        delay={100}
                        animation={'slideInUp'}
                        style={{
                        marginTop: 20
                    }}>
                        <Button
                            backgroundColor={Colors.primary}
                            iconPostionRight={true}
                            useIcon={true}
                            icon="question"
                            title="Confirm Location"
                            onPress={() => navigation.navigate('SaveCurrentAddress')}/>
                    </Animatable.View>
                </ImageBackground>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 2.5,
        width: '100%',
        height: '100%'
    },
    addressContainer: {
        flex: 1.1,
        backgroundColor: Colors.dark,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.darkGray,
        borderRadius: 10,
        height: 80,
        padding: 10,
        width: '100%',
        color: Colors.darkGray,
        fontSize: 18,
        fontFamily: 'PTSerif-BoldItalic'
    },
    headerText: {
        fontSize: 25,
        color: Colors.white,
        textShadowColor: Colors.white,
        fontFamily: 'Oswald-Medium'
    }
});

export default AddressScreen;

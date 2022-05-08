import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, ImageBackground, PermissionsAndroid} from 'react-native';
import Icon, {Icons} from '../util/Icons';
import Colors from '../util/Colors';
import RNBounceable from "@freakycoder/react-native-bounceable";
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Badge} from 'react-native-paper';
import i18n from '../util/i18n';
import Svg, {Path} from 'react-native-svg';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const LandingHeader = (props) => {
    const [status,
        setStatus] = useState(props.status)

    const [address,
        setAddress] = useState('')

    const onPressNotification = () => {
        props
            .navigation
            .navigate('Notifications')
    }
    useEffect(() => {

        Geolocation.getCurrentPosition(
            position => {   
                // console.log(position.coords.latitude);
                // console.log(position.coords.longitude);  
                let positionStackApi = "http://api.positionstack.com/v1/reverse?access_key=1e7810be054a872c3ed9c3b694644" +
                "7c7&query=22.357908900473035,87.6132639683783"
                let url = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude + "&localityLanguage=en"
                axios
                .get(url)
                .then(function (response) {
                    // setAddress(response.data.data[0].label)
                    let address = ""
                    for(let i = response.data.localityInfo.administrative.length - 1; i >= 0; i--) {
                        address = address + response.data.localityInfo.administrative[i].name + ", "
                    }
                    setAddress(address)
                })
                .catch(function (error) {
                    // console.log(error)
                    Toast.show({
                        type: 'customToast',
                        text1: "Unable to get your current location...",
                        position: 'top',
                        visibilityTime: 1500,
                        topOffset: 20,
                        props: {
                            backgroundColor: Colors.error_toast_color
                        }
                    });
                });
            },
            error => console.log('Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          ); 
        
        
    }, [])
    return (
        <View>
            <View
                style={{
                position: 'absolute',
                width: Dimensions
                    .get('window')
                    .width
            }}>
                <View
                    style={{
                    backgroundColor: Colors.primary,
                    height: 100
                }}>
                    <Svg
                        height="100%"
                        width="100%"
                        viewBox="0 0 1440 320"
                        style={{
                        position: 'absolute',
                        top: 90,
                        zIndex: 999
                    }}>
                        <Path
                            fill={Colors.primary}
                            d="M0,256L80,218.7C160,181,320,107,480,112C640,117,800,203,960,202.7C1120,203,1280,117,1360,74.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"/>
                    </Svg>
                </View>
            </View>
            <View style={{
                alignItems: 'center'
            }}>
                <View
                    style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: 20,
                    height: 100
                }}>
                    <View
                        style={{
                        width: status === 'loggedIn'
                            ? '90%'
                            : '100%'
                    }}>
                        <View
                            style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: '38%',
                            justifyContent: 'space-between'
                        }}>
                            <Text
                                style={{
                                fontFamily: 'Oswald-Bold',
                                fontSize: 25,
                                color: Colors.appBackground
                            }}>{i18n.appTitle}</Text>
                        </View>
                        <View
                            style={{
                            marginTop: 5
                        }}>
                            <RNBounceable
                                onPress={() => props.navigation.navigate('Address', {from: 'Home'})}>
                                <Text
                                    style={{
                                    fontFamily: 'Redressed-Regular',
                                    fontSize: 18,
                                    color: Colors.secondary
                                }}>{address}</Text>
                            </RNBounceable>
                        </View>
                    </View>
                    <View
                        style={{
                        marginTop: 5,
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        {status === "loggedIn" && (
                            <RNBounceable>
                                <Icon
                                    onPress={onPressNotification}
                                    type={Icons.Ionicons}
                                    name={'notifications-outline'}
                                    color={Colors.appBackground}
                                    size={35}/>
                                <View
                                    style={{
                                    position: 'absolute',
                                    top: -10,
                                    left: 20
                                }}>
                                    <Badge
                                        style={{
                                        backgroundColor: Colors.secondary,
                                        borderWidth: 1,
                                        borderColor: Colors.appBackground,
                                        color: Colors.appBackground
                                    }}
                                        size={25}>{2}</Badge>
                                </View>
                            </RNBounceable>
                        )}
                    </View>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({});

export default LandingHeader;

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


const TrackOrderScreen = ({navigation, route}) => {
    let images = []
    if (route.params.details.type === 'Items') {
        images = [
            require('../assets/lottie/serviceOrdered.json'),
            require('../assets/lottie/confirmed.json'),
            require('../assets/lottie/smiley.json')
        ];
    } else  {
        images = [
            require('../assets/lottie/serviceOrdered.json'),
            require('../assets/lottie/confirming.json'),
            require('../assets/lottie/confirmed.json'),
            require('../assets/lottie/searchDoctor.json'),
            require('../assets/lottie/cycle.json'),
            require('../assets/lottie/smiley.json')
        ];
    }
    const [stepIndicatorHeight, setStepIndicatorHeight] = useState(400)
    const [stepCount, setStepCount] = useState(0)
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
        if (route.params.details.type === 'Items') {
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
                                .once("value")
                                .then(snapshot => {
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
                                .once("value")
                                .then(snapshot => {
                                    if (snapshot.val()) {
                                        var trackItemDetails = snapshot
                                            .val()
                                            .filter(item => item.id === details.id)
                                        setCurrentPosition(parseInt(trackItemDetails[0].trackStep))
                                    }
                                })
                        }
                    })

            }
        }

    }

    useEffect(() => {
        getData()
    }, [])
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
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText={"Service id: #" + details.id}
                showSubHeaderText={true}
                subHeaderTextSize={18}
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
                onPressLeft={() => navigation.goBack()}/>
            <View
                style={{
                backgroundColor: Colors.appBackground,
                marginBottom: 80,
                marginTop: 20,
                padding: 20,
                flex: 1,
                width: '100%',
                alignItems: 'flex-start'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>

                    <View
                        style={{
                        padding: 10,
                        height: stepIndicatorHeight
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
                        : 
                        <View>
                            <Animatable.View
                                    delay={100}
                                    animation={'slideInLeft'}
                                    style={{
                                    marginLeft: 10,
                                    width: '70%',
                                    alignItems: 'flex-start'
                                }}>
                                    <Title
                                        size={20}
                                        label={"Pet Items"}
                                        bold={true}
                                        color={Colors.appBackground}/>
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
    }
});

export default TrackOrderScreen;

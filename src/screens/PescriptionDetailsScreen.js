import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Animated,
    FlatList,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
    ImageBackground
} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import GeneralHeader from '../reusable_elements/GeneralHeader';
import SectionBanner from '../reusable_elements/SectionBanner';
import Colors from '../util/Colors';
import Toast from 'react-native-toast-message';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Title from '../reusable_elements/Title';
import Icon, {Icons} from '../util/Icons';
import * as Animatable from 'react-native-animatable';
import Button from '../reusable_elements/Button';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker'
import StepIndicator from 'react-native-step-indicator';
import {SwipeListView} from 'react-native-swipe-list-view';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import uuid from 'react-native-uuid';
import i18n from '../util/i18n';
import {getDefaultLocale} from 'react-native-calendars/src/services';

const PescriptionDetailsScreen = ({navigation, route}) => {
    const isFocused = useIsFocused();
    const [labels,
        setLabels] = useState([
        {
            name: "Upload pescription"
        }, {
            name: "Enter delivery address"
        }, {
            name: "Receive call"
        }
    ])
    const [phoneNo,
        setPhoneNo] = useState('');
    const [status,
        setStatus] = useState(route.params.status);
    const [firstImageDetails,
        setFirstImageDetails] = useState(null);
    const [secondImageDetails,
        setSecondImageDetails] = useState(null);
    const [thirdImageDetails,
        setThirdImageDetails] = useState(null);
    const [fourthImageDetails,
        setFourthImageDetails] = useState(null);
    const [fifthImageDetails,
        setFifthImageDetails] = useState(null);
    const [sixImageDetails,
        setSixImageDetails] = useState(null);
    const [checked,
        setChecked] = useState('');
    const [addressess,
        setAddressess] = useState([]);
    const [showSelection,
        setShowSelection] = useState(true);
    const [singleFile,
        setSingleFile] = useState(null);


    const getData = () => {
        if(status === 'loggedIn') {
            database()
                .ref('/users/' + phoneNo + "/addresses")
                .on("value", snapshot => {
                if (snapshot.val()) {
                    setAddressess(snapshot.val())
                }
            })
        } else {
            AsyncStorage
            .getItem('anonymusAddresses')
            .then((data) => {
              if (data && JSON.parse(data).length > 0) {
                setAddressess(JSON.parse(data))
              }
          });
        }
    }

    const onPressNext = () => {
        let count = 0,
            ar = []
        if (firstImageDetails) {
            count++ 
            ar.push(firstImageDetails)
        }
        if (secondImageDetails) {
            count++ 
            ar.push(secondImageDetails)
        }
        if (thirdImageDetails) {
            count++ 
            ar.push(thirdImageDetails)
        }
        if (fourthImageDetails) {
            count++ 
            ar.push(fourthImageDetails)
        }
        if (fifthImageDetails) {
            count++ 
            ar.push(fifthImageDetails)
        }
        if (sixImageDetails) {
            count++ 
            ar.push(sixImageDetails)
        }
        if (count < 1) {
            Toast.show({
                type: 'customToast',
                text1: "Please upload at least one pescription...",
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 100,
                props: {
                    backgroundColor: Colors.error_toast_color
                }
            });

        } else {
            if (checked === "") {
                Toast.show({
                    type: 'customToast',
                    text1: "Please select one address...",
                    position: 'bottom',
                    visibilityTime: 1500,
                    bottomOffset: 100,
                    props: {
                        backgroundColor: Colors.error_toast_color
                    }
                });
            } else {
                let address
                for (let i = 0; i < ar.length; i++) {
                    RNFetchBlob
                        .fs
                        .readFile(ar[i].fileCopyUri, 'base64')
                        .then(base64String => {
                            ar[i].base64String = base64String
                        })
                }
                for (let a = 0; a < addressess.length; a++) {
                    if(addressess[a].id === checked) {
                        address = addressess[a]
                        break;
                    }
                }
                let mainAr = [], obj = {}
                if(status === 'loggedIn') {
                    obj = {
                        userStatus: 'loggedIn',
                        phoneNo: phoneNo,
                        fileDetails: ar,
                        date: moment()
                            .format('yyyy-MM-DD')
                            .toString(),
                        active: true,
                        address: address
                    }
                } else {
                    obj = {
                        userStatus: 'loggedOut',
                        phoneNo: address.phoneNo,
                        fileDetails: ar,
                        date: moment()
                            .format('yyyy-MM-DD')
                            .toString(),
                        active: true,
                        address: address
                    }
                    AsyncStorage
                    .getItem('anonymusPescriptions')
                    .then((data) => {
                        let array = [],
                        obj = {
                            userStatus: 'loggedOut',
                            phoneNo: address.phoneNo,
                            fileDetails: ar,
                            date: moment()
                                .format('yyyy-MM-DD')
                                .toString(),
                            active: true,
                            address: address
                        }
                        if(data && JSON.parse(data).length > 0) {
                            array = JSON.parse(data)
                        }
                        array.push(obj)
                        AsyncStorage
                        .setItem('anonymusPescriptions', JSON.stringify(array))
                    })
                }
                database()
                    .ref("/allPescriptions")
                    .once('value')
                    .then(snapshot => {
                        if (snapshot.val()) {
                            mainAr = snapshot.val()
                        }
                        mainAr.push(obj)
                        database()
                            .ref("/allPescriptions")
                            .set(mainAr)
                            .then(() => {
                                navigation.navigate("HomeBottomTabBar", {
                                    screen: "Home",
                                    status: status
                                })
                                Toast.show({
                                    type: 'customToast',
                                    text1: "We will contact you within few minitues...",
                                    position: 'bottom',
                                    delay: 1500,
                                    visibilityTime: 1500,
                                    bottomOffset: 80,
                                    props: {
                                        backgroundColor: Colors.green3
                                    }
                                });
                            })
                    })  
            }
        }
    }

    const onPressAddAddress = () => {
        navigation.navigate("Address")

    }
    const onPressAddImage1 = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory'
        }).then((result) => {
            // console.log(result)
            setFirstImageDetails(result)
        })
    }
    const onPressAddImage2 = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory'
        }).then((result) => {
            setSecondImageDetails(result)
        })
    }
    const onPressAddImage3 = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory'
        }).then((result) => {
            setThirdImageDetails(result)
        })
    }
    const onPressAddImage4 = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory'
        }).then((result) => {
            setFourthImageDetails(result)
        })
    }
    const onPressAddImage5 = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory'
        }).then((result) => {
            setFifthImageDetails(result)
        })
    }
    const onPressAddImage6 = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory'
        }).then((result) => {
            setSixImageDetails(result)
        })
    }

    const onPressDeleteFirstImage = (id) => {
        setFirstImageDetails(null);
    }
    const onPressDeleteSecondImage = (id) => {
        setSecondImageDetails(null);
    }
    const onPressDeleteThirdImage = (id) => {
        setThirdImageDetails(null);
    }
    const onPressDeleteFourthImage = (id) => {
        setFourthImageDetails(null);
    }
    const onPressDeleteFifthImage = (id) => {
        setFifthImageDetails(null);
    }
    const onPressDeleteSixImage = (id) => {
        setSixImageDetails(null);
    }

    const onPressAddressRadioButton = (id) => {
        setChecked(id);
    }

    useEffect(() => {
        if (isFocused) {
            AsyncStorage
            .getItem("phoneNo")
            .then(phoneNo => {
                if(phoneNo) {
                    setPhoneNo(phoneNo)
                }
                getData()
            })
        }
    }, [isFocused]);

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
                rightIconSize={30}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText={""}
                showSubHeaderText={false}
                subHeaderTextSize={16}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={'Order Medicines'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={35}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>
            <View
                style={{
                paddingHorizontal: 20,
                flex: 1,
                marginBottom: 80
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <View style={{}}>
                        <StepIndicator
                            direction='horizontal'
                            stepCount={3}
                            customStyles={{
                            labelAlign: 'flex-start',
                            stepIndicatorSize: 30,
                            currentStepIndicatorSize: 40,
                            separatorStrokeWidth: 3,
                            currentStepStrokeWidth: 5,
                            stepStrokeCurrentColor: Colors.primary,
                            separatorFinishedColor: Colors.red,
                            separatorUnFinishedColor: Colors.red,
                            stepIndicatorFinishedColor: Colors.primary,
                            stepIndicatorUnFinishedColor: Colors.secondary,
                            stepIndicatorCurrentColor: Colors.appBackground,
                            stepIndicatorLabelFontSize: 15,
                            currentStepIndicatorLabelFontSize: 15,
                            stepIndicatorLabelCurrentColor: Colors.black,
                            stepIndicatorLabelFinishedColor: Colors.appBackground,
                            stepIndicatorLabelUnFinishedColor: Colors.lightOverlayColor
                        }}
                            currentPosition={-1}
                            labels={labels.map((item, index) => 
                            <View
                            style={{
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <View
                                style={{
                                width: 100
                            }}>
                                <Text
                                    numberOfLines={3}
                                    style={{
                                    fontSize: 15,
                                    color: Colors.darkGray,
                                    fontFamily: 'Oswald-Medium'
                                }}>{item.name}
                                </Text>
                                <View style={{}}>
                                    <Title size={15} label={item.desc} bold={true} color={'#444'}/>
                                </View>
                            </View>
                        </View>)}/>
                    </View>
                    <View >
                        <SectionBanner
                            title={"Upload pescriptions"}
                            borderWidth={160}
                            fontSize={16}
                            borderColor={Colors.white}
                            titleColor={Colors.white}/>
                        <View
                            style={{
                            alignItems: 'center'
                        }}>
                            <Text
                                numberOfLines={3}
                                style={{
                                fontSize: 15,
                                marginTop: 10,
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }}>{'You can upload a total of 4 pescriptions per order'}</Text>
                        </View>
                        <View
                            style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            flexWrap: 'wrap'
                        }}>
                            <TouchableOpacity
                                onPress={onPressAddImage1}
                                style={{
                                width: 80,
                                height: 80,
                                backgroundColor: Colors.white,
                                borderColor: Colors.darkGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                elevation: 5
                            }}>
                                {firstImageDetails
                                    ? <ImageBackground
                                            style={{
                                            width: 80,
                                            height: 80,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end'
                                        }}
                                            source={{
                                            uri: firstImageDetails.fileCopyUri
                                        }}>
                                            <Icon
                                                onPress={onPressDeleteFirstImage}
                                                type={Icons.MaterialCommunityIcons}
                                                name="delete"
                                                size={25}
                                                color={Colors.red}/>
                                        </ImageBackground>
                                    : <View
                                        style={{
                                        backgroundColor: Colors.green3,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon
                                            onPress={onPressAddImage1}
                                            type={Icons.Ionicons}
                                            name="add"
                                            size={20}
                                            color={Colors.white}/>
                                    </View>
}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onPressAddImage2}
                                style={{
                                marginLeft: 10,
                                width: 80,
                                height: 80,
                                backgroundColor: Colors.white,
                                borderColor: Colors.darkGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                elevation: 5
                            }}>
                                {secondImageDetails
                                    ? <ImageBackground
                                            style={{
                                            width: 80,
                                            height: 80,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end'
                                        }}
                                            source={{
                                            uri: secondImageDetails.fileCopyUri
                                        }}>
                                            <Icon
                                                onPress={onPressDeleteSecondImage}
                                                type={Icons.MaterialCommunityIcons}
                                                name="delete"
                                                size={25}
                                                color={Colors.red}/>
                                        </ImageBackground>
                                    : <View
                                        style={{
                                        backgroundColor: Colors.green3,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon
                                            onPress={onPressAddImage2}
                                            type={Icons.Ionicons}
                                            name="add"
                                            size={20}
                                            color={Colors.white}/>
                                    </View>
}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onPressAddImage3}
                                style={{
                                marginLeft: 10,
                                width: 80,
                                height: 80,
                                backgroundColor: Colors.white,
                                borderColor: Colors.darkGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                elevation: 5
                            }}>
                                {thirdImageDetails
                                    ? <ImageBackground
                                            style={{
                                            width: 80,
                                            height: 80,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end'
                                        }}
                                            source={{
                                            uri: thirdImageDetails.fileCopyUri
                                        }}>
                                            <Icon
                                                onPress={onPressDeleteThirdImage}
                                                type={Icons.MaterialCommunityIcons}
                                                name="delete"
                                                size={25}
                                                color={Colors.red}/>
                                        </ImageBackground>
                                    : <View
                                        style={{
                                        backgroundColor: Colors.green3,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon
                                            onPress={onPressAddImage3}
                                            type={Icons.Ionicons}
                                            name="add"
                                            size={20}
                                            color={Colors.white}/>
                                    </View>
}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onPressAddImage4}
                                style={{
                                marginLeft: 10,
                                width: 80,
                                height: 80,
                                backgroundColor: Colors.white,
                                borderColor: Colors.darkGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                elevation: 5
                            }}>
                                {fourthImageDetails
                                    ? <ImageBackground
                                            style={{
                                            width: 80,
                                            height: 80,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end'
                                        }}
                                            source={{
                                            uri: fourthImageDetails.fileCopyUri
                                        }}>
                                            <Icon
                                                onPress={onPressDeleteFourthImage}
                                                type={Icons.MaterialCommunityIcons}
                                                name="delete"
                                                size={25}
                                                color={Colors.red}/>
                                        </ImageBackground>
                                    : <View
                                        style={{
                                        backgroundColor: Colors.green3,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon
                                            onPress={onPressAddImage4}
                                            type={Icons.Ionicons}
                                            name="add"
                                            size={20}
                                            color={Colors.white}/>
                                    </View>
}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onPressAddImage5}
                                style={{
                                marginTop: 10,
                                marginBottom: 20,
                                width: 80,
                                height: 80,
                                backgroundColor: Colors.white,
                                borderColor: Colors.darkGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                elevation: 5
                            }}>
                                {fifthImageDetails
                                    ? <ImageBackground
                                            style={{
                                            width: 80,
                                            height: 80,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end'
                                        }}
                                            source={{
                                            uri: fifthImageDetails.fileCopyUri
                                        }}>
                                            <Icon
                                                onPress={onPressDeleteFifthImage}
                                                type={Icons.MaterialCommunityIcons}
                                                name="delete"
                                                size={25}
                                                color={Colors.red}/>
                                        </ImageBackground>
                                    : <View
                                        style={{
                                        backgroundColor: Colors.green3,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon
                                            onPress={onPressAddImage5}
                                            type={Icons.Ionicons}
                                            name="add"
                                            size={20}
                                            color={Colors.white}/>
                                    </View>
}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onPressAddImage6}
                                style={{
                                marginTop: 10,
                                marginLeft: 10,
                                marginBottom: 20,
                                width: 80,
                                height: 80,
                                backgroundColor: Colors.white,
                                borderColor: Colors.darkGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                elevation: 5
                            }}>
                                {sixImageDetails
                                    ? <ImageBackground
                                            style={{
                                            width: 80,
                                            height: 80,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end'
                                        }}
                                            source={{
                                            uri: sixImageDetails.fileCopyUri
                                        }}>
                                            <Icon
                                                onPress={onPressDeleteSixImage}
                                                type={Icons.MaterialCommunityIcons}
                                                name="delete"
                                                size={25}
                                                color={Colors.red}/>
                                        </ImageBackground>
                                    : <View
                                        style={{
                                        backgroundColor: Colors.green3,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon
                                            onPress={onPressAddImage6}
                                            type={Icons.Ionicons}
                                            name="add"
                                            size={20}
                                            color={Colors.white}/>
                                    </View>
}
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                            <View style={{width: '88%'}}>
                                <SectionBanner
                                    title={"Select delivery address"}
                                    borderWidth={180}
                                    fontSize={16}
                                    borderColor={Colors.white}
                                    titleColor={Colors.white}/>
                            </View> 
                            <TouchableOpacity onPress={onPressAddAddress} style={{
                                    width: "10%",
                                    height: 40,
                                    borderRadius: 10,
                                    padding: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    elevation: 5,
                                    backgroundColor: Colors.darkGray
                                }}>
                                    <Icon type={Icons.AntDesign} name="plus" color={Colors.white} size={25}/>
                            </TouchableOpacity>
                        </View>
                        
                            
                            {addressess.length !== 0
                            ? <View
                                    style={{
                                    marginTop: 10,
                                    flex: 1,
                                    width: '100%'
                                }}>
                                    {addressess.map((item, index) => <View
                                        key={index}
                                        style={[
                                        styles.item, {
                                            backgroundColor: checked === item.id
                                                ? Colors.green2
                                                : Colors.appBackground
                                        }
                                    ]}>
                                        <View
                                            style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <View>
                                                <View
                                                    style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text
                                                        style={{
                                                        fontFamily: 'Oswald-SemiBold',
                                                        fontSize: 20,
                                                        color: checked === item.id
                                                            ? Colors.secondary
                                                            : Colors.darkGray
                                                    }}>{item.name}</Text>
                                                    <Text
                                                        style={{
                                                        color: Colors.appBackground,
                                                        marginLeft: 5,
                                                        marginTop: 5,
                                                        paddingHorizontal: 5,
                                                        backgroundColor: Colors.error_toast_color,
                                                        fontFamily: 'Oswald-Medium',
                                                        fontSize: 10
                                                    }}>{item.tag}
                                                    </Text>
                                                    {item.default && (
                                                        <Text
                                                            style={{
                                                            color: Colors.appBackground,
                                                            marginLeft: 5,
                                                            marginTop: 5,
                                                            paddingHorizontal: 5,
                                                            backgroundColor: Colors.green2,
                                                            fontFamily: 'Oswald-Medium',
                                                            fontSize: 10
                                                        }}>Default
                                                        </Text>
                                                    )}
                                                </View>
                                                <View
                                                    style={{
                                                    width: showSelection
                                                        ? '98%'
                                                        : '100%'
                                                }}>
                                                    <Text
                                                        style={{
                                                        fontFamily: 'PTSerif-Italic',
                                                        fontSize: 15,
                                                        color: checked === item.id
                                                            ? Colors.white
                                                            : Colors.darkGray
                                                    }}>{item.address + " " + item.pinCode}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                right: 15
                                            }}>
                                                <RadioButton
                                                    onPress={() => onPressAddressRadioButton(item.id)}
                                                    color={Colors.primary}
                                                    status={checked === item.id
                                                    ? 'checked'
                                                    : 'unchecked'}/>
                                            </View>
                                        </View>
                                    </View>
                                    )}
                                    
                                </View>
                                
                            : <View
                                style={{
                                marginTop: 20
                            }}>
                                <View
                                    style={{
                                    alignItems: 'center',
                                    marginBottom: 20
                                }}>
                                    <Animatable.Text
                                        animation={'slideInUp'}
                                        style={{
                                        fontFamily: 'Redressed-Regular',
                                        fontSize: 25,
                                        color: checked === '#ff9d0a'
                                    }}>There is no saved address
                                    </Animatable.Text>
                                </View>
                            </View>
                        }
                        
                    </View>
                </ScrollView>
            </View>
            <Animatable.View delay={100} animation={'slideInUp'}>
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
                    height: 80,
                    backgroundColor: Colors.secondary,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            backgroundColor={Colors.green3}
                            iconPostionRight={true}
                            useIcon={true}
                            title="Submit"
                            icon="long-arrow-right"
                            onPress={onPressNext}/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingVertical: 15,
        width: '100%',
        color: Colors.mediumDark,
        fontSize: 20
    },
    item: {
        flex: 1,
        padding: 8,
        marginHorizontal: 1,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2
    }
});

export default PescriptionDetailsScreen;

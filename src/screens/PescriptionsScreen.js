import React, {useState, useRef, useEffect} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    Image,
    Dimensions,
    PermissionsAndroid
} from 'react-native';
import Colors from '../util/Colors';
import Title from '../reusable_elements/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import RNBounceable from "@freakycoder/react-native-bounceable";
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import database from '@react-native-firebase/database';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob'
import i18n from '../util/i18n';

const PescriptionsScreen = ({navigation}) => {
    const [details,
        setDetails] = useState([])

    const onPressDelete = (index) => {
        let data = details;
        data.splice(index, 1);
        setDetails(data);
    }
    const getData = () => {
        AsyncStorage
            .getItem('phoneNo')
            .then((number, msg) => {
                if (number) {
                    database()
                        .ref('/users/' + number + '/pescription')
                        .on('value', snapshot => {
                            if (snapshot.val()) {
                                let data = snapshot.val()
                                for(let i = 0; i < data.length; i++) {
                                    if(data[i].fileDetails.type.split("/")[0] === 'image') {
                                        data[i].document = "data:image/png;base64," + data[i].image 
                                    } else {
                                        data[i].document = "data:application/pdf;base64," + data[i].image
                                    } 
                                }
                                setDetails(data)
                            }
                        })
                }
        })
    }

    const onPressDownload = (item) => {
        var Base64Code = item.image; 
        let location = RNFetchBlob.fs.dirs.DocumentDir + '/' + item.name;
        RNFetchBlob.fs.writeFile(location, RNFetchBlob.base64.encode(Base64Code), 'base64')
        .then((res) => {
            Toast.show({
                type: 'customToast',
                text1: "File saved to gallery...",
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 10,
                props: {
                    backgroundColor: Colors.green3
                }
            });
        });
    }

    useEffect(() => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((status) => {
            if(status != "granted"){
                Toast.show({
                    type: 'customToast',
                    text1: "Storage permission is not granted...",
                    position: 'bottom',
                    visibilityTime: 1500,
                    bottomOffset: 10,
                    props: {
                        backgroundColor: Colors.error_toast_color
                    }
                });
            }
        })
        getData();
    }, []);

    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <GeneralHeader
                showRigtIcon={false}
                rightIconType={Icons.MaterialIcons}
                rightIconName={'close'}
                rightIconSize={45}
                rightIconColor={Colors.appBackground}
                rightIconBackgroundColor={Colors.primary}
                onPressRight={() => navigation.goBack()}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={60}
                headerText={'Uploaded Pescriptions'}
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
                marginTop: 20,
                padding: 10,
                flex: 1,
                alignItems: 'flex-start'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {details.map((item, index) => 
                    <View
                        key={index}
                        style={{
                        backgroundColor: Colors.appBackground,
                        marginHorizontal: 10,
                        marginVertical: 4,
                        elevation: 4,
                        marginBottom: 10,
                        width: Dimensions
                            .get("screen")
                            .width - 40
                    }}>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            style={{
                        }}>
                            <RNBounceable
                                onPress={() => navigation.navigate("TrackOrder", {details: {fromScreen: 'Services'}})}
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 10
                            }}>
                                <View
                                    style={{
                                    alignItems: 'center',
                                    backgroundColor: Colors.appBackground,
                                    elevation: 2,
                                    borderRadius: 50,
                                    borderColor: Colors.gray,
                                    borderWidth: 1
                                }}>
                                    <ImageBackground style={{
                                        backgroundColor: Colors.secondary,
                                        borderRadius: 0,
                                        width: 80,
                                        height: 60,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} source={{
                                        uri: item.document
                                    }}>
                                        <Icon
                                            onPress={() => onPressDownload(item)}
                                            type={Icons.FontAwesome5}
                                            name={'download'}
                                            size={30}
                                            color={Colors.error_toast_color}/>
                                    </ImageBackground>
                                </View>
                                <View
                                    style={{
                                    marginLeft: 10,
                                    alignItems: 'flex-start'
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Title size={15} label={item.fileDetails.name} bold={true} color={Colors.darkGray}/>
                                        {item.active && (
                                            <View style={{marginLeft: 5, backgroundColor: Colors.red, paddingHorizontal: 10, borderRadius: 5, elevation: 5}}>
                                                <Title size={10} label={'Active'} bold={true} color={Colors.white}/>
                                            </View>
                                        )}
                                    </View>
                                    <Title size={12} label={"Uploaded on: " + item.date} bold={true} color={Colors.secondary}/>
                                </View>
                            </RNBounceable>
                        </Animatable.View>
                    </View>)}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default PescriptionsScreen;

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
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import database from '@react-native-firebase/database';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import i18n from '../util/i18n';

const PescriptionsScreen = ({navigation, route}) => {
    const [loading,
        setLoading] = useState(true)
    const [details,
        setDetails] = useState([])

    const onPressDelete = (index) => {
        let data = details;
        data.splice(index, 1);
        setDetails(data);
    }
    const getData = () => {
        setLoading(true)
        if (route.params.status === 'loggedIn') {
            AsyncStorage
                .getItem('phoneNo')
                .then((number, msg) => {
                    if (number) {
                        database()
                            .ref('/users/' + number + '/pescriptions')
                            .on('value', snapshot => {
                                setLoading(false)
                                if (snapshot.val()) {
                                    let data = snapshot.val()
                                    for (let i = 0; i < data.length; i++) {
                                        for (let j = 0; j < data[i].fileDetails.length; j++) {
                                            data[i].fileDetails[j].document = "data:image/png;base64," + data[i].fileDetails[j].base64String
                                        }
                                    }
                                    setDetails(data)
                                } else {
                                    setDetails([])
                                }
                            })
                    }
                })
        } else {
            AsyncStorage
                .getItem('anonymusPescriptions')
                .then((data) => {
                    setLoading(false)
                    if (data && JSON.parse(data) > 0) {
                        let mainData = JSON.parse(data)
                        for (let i = 0; i < mainData.length; i++) {
                            for (let j = 0; j < mainData[i].fileDetails.length; j++) {
                                mainData[i].fileDetails[j].document = "data:image/png;base64," + data[i].fileDetails[j].base64String
                            }
                        }
                        setDetails(mainData)
                    } else {
                        setDetails([])
                    }
                })
        }
    }

    const onPressDownload = (item) => {
        var Base64Code = item.image;
        let location = RNFetchBlob.fs.dirs.DocumentDir + '/' + item.name;
        RNFetchBlob
            .fs
            .writeFile(location, RNFetchBlob.base64.encode(Base64Code), 'base64')
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
        PermissionsAndroid
            .request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            .then((status) => {
                if (status != "granted") {
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
                flex: 1
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {loading?
                    <View style={{marginTop: 10, padding: 5}}>
                        <SkeletonPlaceholder >
                            <View style={{borderColor: Colors.darkGray, borderWidth: 1, padding: 10}}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View  style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}/>
                                <View style={{ flexDirection: "row", alignItems: "center", width: '100%' }}>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4}}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                </View>
                            </View>
                            <View style={{marginTop: 40, borderColor: Colors.darkGray, borderWidth: 1, padding: 10}}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View  style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}/>
                                <View style={{ flexDirection: "row", alignItems: "center", width: '100%' }}>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4}}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                </View>
                            </View>
                            <View style={{marginTop: 40, borderColor: Colors.darkGray, borderWidth: 1, padding: 10}}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View  style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}/>
                                <View style={{ flexDirection: "row", alignItems: "center", width: '100%' }}>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4}}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                </View>
                            </View>
                            <View style={{marginTop: 40, borderColor: Colors.darkGray, borderWidth: 1, padding: 10}}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View  style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}/>
                                <View style={{ flexDirection: "row", alignItems: "center", width: '100%' }}>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4}}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                </View>
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    :
                    <View>
                        {details.length > 0
                            ? <View>
                                    {details.map((item, index) => <View
                                        key={index}
                                        style={{
                                        backgroundColor: Colors.appBackground,
                                        marginHorizontal: 10,
                                        marginVertical: 4,
                                        elevation: 4,
                                        marginBottom: 10,
                                        padding: 10,
                                        width: Dimensions
                                            .get("screen")
                                            .width - 40
                                    }}>
                                        <Animatable.View animation={'fadeInLeft'} style={{}}>
                                            <View
                                                style={{
                                                alignItems: 'flex-start'
                                            }}>
                                                <View
                                                    style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <Title size={18} label={"Pescriptions"} bold={true} color={Colors.darkGray}/> 
                                                    {item.active && (
                                                        <View
                                                            style={{
                                                            marginLeft: 10,
                                                            marginTop: 5,
                                                            backgroundColor: Colors.red,
                                                            paddingHorizontal: 10,
                                                            borderRadius: 5,
                                                            elevation: 5
                                                        }}>
                                                            <Title size={10} label={'Active'} bold={true} color={Colors.white}/>
                                                        </View>
                                                    )}
                                                </View>
                                                <Title
                                                    size={12}
                                                    label={"Placed on: " + item.date}
                                                    bold={true}
                                                    color={Colors.primary}/>
                                            </View>

                                            <View
                                                style={{
                                                flexWrap: 'wrap',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 10
                                            }}>
                                                {item
                                                    .fileDetails
                                                    .map((file, fileIndex) => <View
                                                        style={{
                                                        marginTop: 10,
                                                        marginRight: 20
                                                    }}>
                                                        <ImageBackground
                                                            style={{
                                                            backgroundColor: Colors.secondary,
                                                            borderRadius: 0,
                                                            width: 60,
                                                            height: 60,
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                            source={{
                                                            uri: file.document
                                                        }}>
                                                            <Icon
                                                                onPress={() => onPressDownload(file)}
                                                                type={Icons.FontAwesome5}
                                                                name={'download'}
                                                                size={20}
                                                                color={Colors.green3}/>
                                                        </ImageBackground>
                                                        <Title
                                                            fontFamily={"Redressed-Regular"}
                                                            size={12}
                                                            label={"Pescriptions " + (fileIndex + 1)}
                                                            bold={true}
                                                            color={Colors.secondary}/>
                                                    </View>)}
                                            </View>

                                        </Animatable.View>
                                    </View>)}
                                </View>
                            : <View
                                style={{
                                alignItems: 'center',
                                marginTop: 20
                            }}>
                                <Title label="No pesriptions are found..." size={20} color={Colors.darkGray}/>
                            </View>
                        }
                    </View>
                    }
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default PescriptionsScreen;
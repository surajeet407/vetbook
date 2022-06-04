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
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Sound from 'react-native-sound';
import i18n from '../util/i18n';

const PescriptionsScreen = ({navigation, route}) => {
    const filters = [{
        key: "active",
        text: "active"
    },{
        key: "Completed",
        text: "completed"
    }]
    const [loading,
        setLoading] = useState(true)
    const [details,
        setDetails] = useState([])
    const [catIndex,
        setCatIndex] = useState(0);

    const onPressDelete = (index) => {
        let data = details;
        data.splice(index, 1);
        setDetails(data);
    }
    const getData = (cond) => {
        setLoading(true)
        if (route.params.status === 'loggedIn') {
            AsyncStorage
                .getItem('phoneNo')
                .then((number, msg) => {
                    if (number) {
                        database()
                            .ref('/allPescriptions')
                            .on('value', snapshot => {
                                setLoading(false)
                                if (snapshot.val()) {
                                    let data = [], items
                                    for (let len = 0; len < snapshot.val().length; len++) {
                                        if(snapshot.val()[len].phoneNo === phoneNo) {
                                            data.push(snapshot.val()[len])
                                        }
                                    }
                                    for (let i = 0; i < data.length; i++) {
                                        for (let j = 0; j < data[i].fileDetails.length; j++) {
                                            data[i].fileDetails[j].document = "data:image/png;base64," + data[i].fileDetails[j].base64String
                                        }
                                    }
                                    if(cond === 'active') {
                                        items = data.filter(item => item.active === true)
                                    } else {
                                        items = data.filter(item => item.active === false)
                                    }
                                    
                                    setDetails(items)
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
                        let mainData = JSON.parse(data), items
                        for (let i = 0; i < mainData.length; i++) {
                            for (let j = 0; j < mainData[i].fileDetails.length; j++) {
                                mainData[i].fileDetails[j].document = "data:image/png;base64," + data[i].fileDetails[j].base64String
                            }
                        }
                        if(cond === 'active') {
                            items = mainData.filter(item => item.active === true)
                        } else {
                            items = mainData.filter(item => item.active === false)
                        }
                        
                        setDetails(items)
                    } else {
                        setDetails([])
                    }
                })
        }
    }

    const onPressDownload = (item) => {
        var Base64Code = item.image;
        let location = RNFetchBlob.fs.dirs.DocumentDir + '/' + item.name;
        console.log(location)
        RNFetchBlob
            .fs
            .writeFile(location, RNFetchBlob.base64.encode(Base64Code), 'base64')
            .then((res) => {
                RNFetchBlob.android.addCompleteDownload({
                    title: item.name,
                    description: 'Download complete',
                    mime: 'image/png',
                    // path: "file:/data/user/0/com.vetbook/cache/823c999a-fe59-4daa-bd68-154ae4134289/Screenshot%20(51).png",
                    // path: "content://com.android.providers.media.documents/document/image%3A27",
                    path: RNFetchBlob.fs.dirs.DocumentDir + '/' + item.name,
                    showNotification: true,
                })
                // Toast.show({
                //     type: 'customToast',
                //     text1: "File saved to gallery...",
                //     position: 'bottom',
                //     visibilityTime: 1500,
                //     bottomOffset: 10,
                //     props: {
                //         backgroundColor: Colors.green3
                //     }
                // });
            });
    }
    const handleCustomIndexSelect = (index) => {
        setCatIndex(index)
        getData(filters[index].key)
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
        getData('active');
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
                rightIconSize={35}
                rightIconColor={Colors.appBackground}
                rightIconBackgroundColor={Colors.primary}
                onPressRight={() => navigation.goBack()}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={'Uploaded Pescriptions'}
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
                alignItems: 'center',
                width: '100%'
            }}>
                <SegmentedControlTab
                    values={["Active", "Completed"]}
                    borderRadius={0}
                    tabsContainerStyle={{ height: 50, backgroundColor: Colors.white }}
                    tabStyle={{ backgroundColor: Colors.darkGray, borderColor: Colors.white, borderWidth: 1 }}
                    activeTabStyle={{ backgroundColor: Colors.green }}
                    tabTextStyle={{ color: '#444444', fontFamily: 'Oswald-Medium' }}
                    activeTabTextStyle={{ color: Colors.white }}
                    selectedIndex={catIndex}
                    onTabPress={handleCustomIndexSelect}/>
            </View>
            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {loading?
                    <View style={{paddingHorizontal: 20}}>
                        <SkeletonPlaceholder >
                            {[1, 2, 3, 4, 5].map((item, index) => 
                            <View key={index} style={{borderColor: Colors.darkGray, borderWidth: 1, padding: 10, marginTop: 10}}>
                                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                                <View  style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}/>
                                <View style={{ flexDirection: "row", alignItems: "center", width: '100%' }}>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4}}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                    <View  style={{ marginTop: 10, width: 80, height: 80, borderRadius: 4, marginLeft: 20 }}/>
                                </View>
                            </View>
                            )}
                        </SkeletonPlaceholder>
                    </View>
                    :
                    <View>
                        {details.length > 0
                            ? <View style={{
                                paddingHorizontal: 20, 
                                marginTop: 10,
                            }}>
                                    {details.map((item, index) => <View
                                        key={index}
                                        style={{
                                        backgroundColor: Colors.appBackground,
                                        elevation: 4,
                                        marginBottom: 10,
                                        padding: 10
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
                                                    .map((file, fileIndex) => 
                                                    <View
                                                        key={fileIndex}
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
    );
};

const styles = StyleSheet.create({});

export default PescriptionsScreen;
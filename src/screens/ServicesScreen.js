import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions,
    ImageBackground
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Colors from '../util/Colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Title from '../reusable_elements/Title';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Rating} from 'react-native-ratings';
import i18n from '../util/i18n';
import {Button, Chip} from 'react-native-paper'


const width = Dimensions
    .get('screen')
    .width - 50;

const ServicesScreen = ({navigation, route}) => {
    const filters = [{
        key: "ongoing",
        text: "Ongoing"
    },{
        key: "cancelled",
        text: "Cancelled"
    },{
        key: "completed",
        text: "Completed"
    }]
    const bottomSheetRef = useRef(null)
    const [phoneNo,
        setPhoneNo] = useState("");
    const [catIndex,
        setCatIndex] = useState(0);
    const [status,
        setStatus] = useState(route.params.status);
    const [pastServices,
        setPastServices] = useState([])
    const reOrder = () => {}

    const getDataFromStorage = (filter) => {
        AsyncStorage
            .getItem("anonymusService")
            .then((data) => {
                if (data && JSON.parse(data).length > 0) {
                    let allItem = JSON.parse(data);
                    let items = allItem.filter(item => item.mode === filter)
                    setPastServices(items);
                }
            });
    }
    const getDataFromDatabase = (phoneNo, filter) => {
        database()
            .ref("/users/" + phoneNo + "/services")
            .on('value', snapshot => {
                if (snapshot.val()) {
                    let items = snapshot.val().filter(item => item.mode === filter)
                    setPastServices(items);
                }
            })
    }

    const onPressCancel = (id) => {
        if (status === 'loggedIn') {
            database()
            .ref("/users/" + phoneNo + "/services")
            .once('value')
            .then(snapshot => {
                let path;
                snapshot
                    .val()
                    .forEach((dbItem, index) => {
                        if (dbItem.id === id) {
                            path = index;
                        }
                    })
                database()
                    .ref("/users/" + phoneNo + "/services/" + path)
                    .update({mode: 'cancelled'})
                getDataFromDatabase(phoneNo, filters[catIndex].key)
                Toast.show({
                    type: 'customToast',
                    text1: "This Service has been cancelled...",
                    position: 'bottom',
                    visibilityTime: 1500,
                    bottomOffset: 80,
                    props: {
                        backgroundColor: Colors.error_toast_color
                    }
                });
            })
                
        } else {
            AsyncStorage
                .getItem("anonymusService")
                .then((data) => {
                    if (data && JSON.parse(data).length > 0) {
                        let path,
                        mainData = JSON.parse(data);
                        mainData.forEach((dbItem, index) => {
                            if (dbItem.id === id) {
                                path = index
                            }
                        })
                        mainData[path].mode = 'cancelled'
                        AsyncStorage.setItem("anonymusService", JSON.stringify(mainData))
                        getDataFromStorage(filters[catIndex].key)
                        Toast.show({
                            type: 'customToast',
                            text1: "This Service has been cancelled...",
                            position: 'bottom',
                            visibilityTime: 1500,
                            bottomOffset: 80,
                            props: {
                                backgroundColor: Colors.error_toast_color
                            }
                        });
                    }
                });
        }
    }

    const onPressToken = (index) => {
        setCatIndex(index);
        if (status === 'loggedIn') {
            getDataFromDatabase(phoneNo, filters[index].key);
        } else {
            getDataFromStorage(filters[index].key)
        }

    }

    useEffect(() => {
        if (status === 'loggedIn') {
            AsyncStorage
            .getItem('phoneNo')
            .then((phoneNo, msg) => {
                setPhoneNo(phoneNo)
                getDataFromDatabase(phoneNo, "ongoing");
            })
        } else {
            getDataFromStorage("ongoing")
        }
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
                rightIconName={'navigate-before'}
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText="See all your booked services..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={'All Services'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.navigate("HomeBottomTabBar", {screen: "Settings"})}/>
            <View
                style={{
                padding: 10,
                alignItems: 'center',
                width: '100%'
                }}>
                <View
                    style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    }}>
                    {filters
                        .map((item, index) => <Animatable.View
                            delay={index * 100}
                            animation={'fadeInLeft'}
                            key={index}
                            style={{
                            marginHorizontal: 5
                        }}>
                            <Chip
                                style={{
                                backgroundColor: index === catIndex
                                    ? Colors.primary
                                    : Colors.gray
                            }}
                                textStyle={{
                                fontFamily: 'Oswald-SemiBold',
                                color: index === catIndex
                                    ? '#fff'
                                    : 'grey'
                            }}
                                selectedColor={index === catIndex
                                ? '#fff'
                                : 'red'}
                                selected={index === catIndex
                                ? true
                                : false}
                                mode='outlined'
                                icon={index === catIndex
                                ? 'check'
                                : ''}
                                onPress={() => onPressToken(index)}>{item.text}
                            </Chip>
                        </Animatable.View>)}
                    </View>
                </View>
            <FlatList
                ListEmptyComponent={
                    <View style={{alignItems: 'center', marginTop: 20}}>
                        <Title label="No service requests are found..." size={20} color={Colors.darkGray}/>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                data={pastServices}
                keyExtractor={item => item.id}
                renderItem={({item, rowMap}) => {
                return (
                    <Animatable.View
                        delay={50 * rowMap}
                        animation={'slideInLeft'}
                        style={{
                        backgroundColor: Colors.appBackground,
                        marginHorizontal: 20,
                        marginVertical: 10,
                        padding: 10,
                        elevation: 5
                    }}>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Title size={20} label={item.serviceType} bold={true} color={Colors.darkGray}/>
                            <Title
                                size={18}
                                label={"Price: " + item.total + "/-"}
                                bold={true}
                                color={Colors.secondary}/>
                        </View>
                        <View
                            style={{
                            marginTop: 5,
                            marginBottom: 10
                        }}>
                            <Title
                                size={15}
                                label={"Details of Booking: "}
                                bold={true}
                                color={Colors.gray}/>
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
                                        <Title size={15} label={"Booked On:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title size={15} label={item.orderedOn} bold={true} color={Colors.secondary}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"Status:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            {item.mode === 'ongoing' && (<Title size={15} label={'Ongoing'} bold={true} color={Colors.yellow}/>)}
                                            {item.mode === 'completed' && (<Title size={15} label={'Completed'} bold={true} color={Colors.green2}/>)}
                                            {item.mode === 'cancelled' && (<Title
                                                size={15}
                                                label={'Cancelled'}
                                                bold={true}
                                                color={Colors.error_toast_color}/>)}
                                        </View>
                                    </View>
                                </View>
                                <Image
                                    source={{
                                    uri: item.image
                                }}
                                    style={{
                                    width: 60,
                                    height: 60
                                }}/>
                            </View>
                        </View>
                        {item.mode !== 'cancelled' && (
                            <View
                                style={{
                                borderTopColor: Colors.darkGray,
                                borderTopWidth: 1,
                                padding: 5
                            }}>
                                {item.mode === 'ongoing' && (
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("TrackOrder", {details: {...item, fromScreen: 'Services'}})}
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Title size={18} label={'Track'} bold={true} color={Colors.secondary}/>
                                            <Icon
                                                type={Icons.AntDesign}
                                                style={{
                                                marginTop: 5,
                                                marginLeft: 5
                                            }}
                                                name={'arrowright'}
                                                size={20}
                                                color={Colors.secondary}/>
                                        </TouchableOpacity>
                                        <Button
                                            labelStyle={{
                                            color: Colors.white,
                                            fontFamily: 'PTSerif-Bold'
                                        }}
                                            color={Colors.error_toast_color}
                                            mode="contained"
                                            onPress={() => onPressCancel(item.id)}>Cancel</Button>
                                    </View>
                                )}
                                {item.mode === 'completed' && (
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("Confirm", {details: item})}
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Title size={18} label={'Book Again'} bold={true} color={Colors.secondary}/>
                                            <Icon
                                                type={Icons.AntDesign}
                                                style={{
                                                marginTop: 5,
                                                marginLeft: 5
                                            }}
                                                name={'arrowright'}
                                                size={20}
                                                color={Colors.secondary}/>
                                        </TouchableOpacity>
                                        <Rating
                                            type='custom'
                                            ratingColor='#3498db'
                                            ratingBackgroundColor='#c8c7c8'
                                            ratingCount={5}
                                            imageSize={20}
                                            minValue={0}
                                            startingValue={0}
                                            jumpValue={1}
                                            showRating={false}/>
                                    </View>
                                )}
                            </View>
                        )}
                    </Animatable.View>
                )
            }}/>
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
        bottom: 5,
        justifyContent: 'center',
        position: 'absolute',
        top: 5,
        width: 75,
        backgroundColor: 'green',
        right: 10,
        borderRadius: 15,
        overflow: 'hidden'
    }
});

export default ServicesScreen;

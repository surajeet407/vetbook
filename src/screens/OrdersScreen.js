import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Colors from '../util/Colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Title from '../reusable_elements/Title';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../util/i18n';

const width = Dimensions
    .get('screen')
    .width - 50;

const OrdersScreen = ({navigation, route}) => {
    const [status,
        setStatus] = useState(route.params.status);
    const [activeSections,
        setActiveSections] = useState([0]);
    const [pastOrders,
        setPastOrders] = useState([])
    const reOrder = () => {}
    const getData = () => {
        if (status === 'loggedIn') {
            AsyncStorage
                .getItem('phoneNo')
                .then((phoneNo, msg) => {
                    if (phoneNo) {
                        database()
                            .ref("/users/" + phoneNo + "/orders")
                            .on('value', snapshot => {
                                console.log(snapshot.val())
                                if (snapshot.val()) {
                                    setPastOrders(snapshot.val());
                                }
                            })
                    }
                })
        } else {
            AsyncStorage
                .getItem("anonymusOrders")
                .then((data) => {
                    if (data && JSON.parse(data).length > 0) {
                        setPastOrders(JSON.parse(data));
                    }
                });
        }

    }

    const updateSections = (section) => {
        setActiveSections(section);
    }

    useEffect(() => {
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
                rightIconName={'navigate-before'}
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText="See all your orders..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={'Orders'}
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
                alignItems: 'center',
                backgroundColor: Colors.appBackground
            }}>
                <Accordion
                    underlayColor={Colors.appBackground}
                    activeSections={activeSections}
                    sections={pastOrders}
                    renderHeader={(item, index, isActive) => <View
                    style={{
                    width: Dimensions
                        .get('screen')
                        .width - 30
                }}>
                    <View
                        key={index}
                        style={{
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        marginVertical: 5,
                        backgroundColor: isActive
                            ? Colors.darkOverlayColor2
                            : Colors.appBackground
                    }}>
                        <View
                            style={{
                            padding: 5
                        }}>
                            <Title
                                size={20}
                                label={(index + 1) + '. Details (' + item.mode + ')'}
                                bold={true}
                                color={Colors.primary}/>
                        </View>
                        <View>
                            <Title
                                size={14}
                                label={"Price: " + item.total + " /-"}
                                bold={true}
                                color={Colors.white}/>
                            <Title
                                size={12}
                                label={"Ordered On: " + item.orderedOn}
                                bold={true}
                                color={Colors.white}/>
                        </View>
                    </View>
                </View>}
                    renderContent={(item, index,) => <View>
                    {item
                        .cartItems
                        .map((item, index) => <View
                            key={index}
                            style={{
                            backgroundColor: Colors.appBackground,
                            padding: 8,
                            marginHorizontal: 10,
                            marginVertical: 4,
                            borderRadius: 10,
                            elevation: 4
                        }}>
                            <View
                                style={{
                                flexDirection: 'row'
                            }}>
                                <View
                                    style={{
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        source={{
                                        uri: item.image
                                    }}
                                        style={{
                                        width: 80,
                                        height: 80
                                    }}/>
                                </View>
                                <View
                                    style={{
                                    marginLeft: 10,
                                    alignItems: 'flex-start'
                                }}>
                                    <Title size={18} label={item.name} bold={true} color={Colors.primary}/>
                                    <View
                                        style={{
                                        flexDirection: 'row'
                                    }}>
                                        <Title size={16} label='Price:' bold={true} color='#999'/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title size={16} label={item.price + " /-"} bold={true} color='#555'/>
                                        </View>
                                    </View>
                                    <Title size={15} label={"Quantity: " + item.quantity} bold={true} color='grey'/>
                                </View>
                            </View>
                        </View>)}
                </View>}
                    onChange={updateSections}/>

            </View>
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

export default OrdersScreen;

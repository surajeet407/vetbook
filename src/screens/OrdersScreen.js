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
import Toast from 'react-native-toast-message';
import {Rating} from 'react-native-ratings';
import {Button} from 'react-native-paper'
import i18n from '../util/i18n';
import RNBounceable from '@freakycoder/react-native-bounceable';

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

    const onPressCancel = (id) => {
        if (status === 'loggedIn') {
            AsyncStorage
                .getItem('phoneNo')
                .then((phoneNo, msg) => {
                    if (phoneNo) {
                        database()
                            .ref("/users/" + phoneNo + "/orders")
                            .once('value')
                            .then(snapshot => {
                                let path;
                                snapshot
                                    .val()
                                    .forEach((dbItem, index) => {
                                        if (dbItem.id === id) {
                                            path = index
                                        }

                                    })
                                database()
                                    .ref("/users/" + phoneNo + "/orders/" + path)
                                    .update({mode: 'cancelled'})
                                Toast.show({
                                    type: 'customToast',
                                    text1: "This order has been cancelled...",
                                    position: 'bottom',
                                    visibilityTime: 1500,
                                    bottomOffset: 80,
                                    props: {
                                        backgroundColor: Colors.error_toast_color
                                    }
                                });
                            })
                    }
                })
        } else {
            AsyncStorage
                .getItem("anonymusOrders")
                .then((data) => {
                    if (data && JSON.parse(data).length > 0) {
                        let path,
                            data = JSON.parse(data);
                        data.forEach((dbItem, index) => {
                            if (dbItem.id === id) {
                                path = index
                            }
                        })
                        data[path].mode = 'cancelled'
                        AsyncStorage.getItem("anonymusOrders", JSON.stringify(data))
                        getData();
                        Toast.show({
                            type: 'customToast',
                            text1: "This order has been cancelled...",
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
                headerText={'All Orders'}
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
            <FlatList
                showsVerticalScrollIndicator={false}
                data={pastOrders}
                keyExtractor={item => item.id}
                renderItem={({item, rowMap}) => {
                return (
                    <View>
                        {item.serviceType === 'Adopt'? 
                        <RNBounceable onPress={() => navigation.navigate("PetDetail", {item: item})}>
                            <Animatable.View
                                delay={50 * rowMap}
                                animation={'slideInRight'}
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
                                    <Title
                                        size={20}
                                        label={'Adoption Details : '}
                                        bold={true}
                                        color={Colors.darkGray}/>
                                    <Title
                                        size={18}
                                        label={"Price: " + item.cost + "/-"}
                                        bold={true}
                                        color={Colors.secondary}/>
                                </View>
                                <View
                                    style={{
                                    marginTop: 5,
                                    marginBottom: 10
                                }}>
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
                                                <Title size={15} label={"Ordered On:"} bold={true} color={Colors.gray}/>
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
                                                <Title size={15} label={"Status:"} bold={true} color={Colors.gray}/>
                                                <View
                                                    style={{
                                                    marginLeft: 5
                                                }}>
                                                    {item.mode === 'inprocess' && (<Title size={15} label={'In Process'} bold={true} color={Colors.yellow}/>)}
                                                    {item.mode === 'delivered' && (<Title size={15} label={'Delivered'} bold={true} color={Colors.green2}/>)}
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
                                        {item.mode === 'inprocess' && (
                                            <View
                                                style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate("TrackOrder", {details: item})}
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
                                        {item.mode === 'delivered' && (
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
                                                    <Title size={18} label={'Order Again'} bold={true} color={Colors.secondary}/>
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
                        </RNBounceable>  
                        :
                        <Animatable.View
                            delay={50 * rowMap}
                            animation={'slideInRight'}
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
                                <Title
                                    size={20}
                                    label={'Order Details : '}
                                    bold={true}
                                    color={Colors.darkGray}/>
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
                                            <Title size={15} label={"Booked On:"} bold={true} color={Colors.gray}/>
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
                                            <Title size={15} label={"Status:"} bold={true} color={Colors.gray}/>
                                            <View
                                                style={{
                                                marginLeft: 5
                                            }}>
                                                {item.mode === 'inprocess' && (<Title size={15} label={'In Process'} bold={true} color={Colors.yellow}/>)}
                                                {item.mode === 'delivered' && (<Title size={15} label={'Delivered'} bold={true} color={Colors.green2}/>)}
                                                {item.mode === 'cancelled' && (<Title
                                                    size={15}
                                                    label={'Cancelled'}
                                                    bold={true}
                                                    color={Colors.error_toast_color}/>)}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {item
                                    .cartItems
                                    .map((item, index) => <View
                                        key={index}
                                        style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <RNBounceable onPress={() => navigation.navigate("ItemDetails", {item: item, status: status })}>
                                            <View
                                                style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                <Title
                                                    size={15}
                                                    label={(index + 1) + ". "}
                                                    bold={true}
                                                    color={Colors.secondary}/>
                                                <View
                                                    style={{
                                                    marginLeft: 5
                                                }}>
                                                    <Title size={15} label={item.name} bold={true} color={Colors.darkOverlayColor}/>
                                                </View>
                                            </View>
                                        </RNBounceable>
                                        <View
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Title size={15} label={"Quantity:"} bold={true} color={Colors.darkGray}/>
                                            <View
                                                style={{
                                                marginLeft: 5
                                            }}>
                                                <Title size={15} label={item.quantity} bold={true} color={Colors.green2}/>
                                            </View>
                                        </View>
                                    </View>)}
                            </View>
                            {item.mode !== 'cancelled' && (
                                <View
                                    style={{
                                    borderTopColor: Colors.darkGray,
                                    borderTopWidth: 1,
                                    padding: 5
                                }}>
                                    {item.mode === 'inprocess' && (
                                        <View
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate("TrackOrder", {details: item})}
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
                                    {item.mode === 'delivered' && (
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
                                                <Title size={18} label={'Order Again'} bold={true} color={Colors.secondary}/>
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
                        }
                    </View>
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

export default OrdersScreen;

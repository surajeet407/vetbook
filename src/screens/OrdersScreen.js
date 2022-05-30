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
    RefreshControl
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import ServiceScreenLoader from '../reusable_elements/ServiceScreenLoader';
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
import {Button, Chip} from 'react-native-paper'
import i18n from '../util/i18n';
import RNBounceable from '@freakycoder/react-native-bounceable';
import SegmentedControlTab from 'react-native-segmented-control-tab'

const width = Dimensions
    .get('screen')
    .width - 50;

const OrdersScreen = ({navigation, route}) => {
    const filters = [{
        key: "inprocess",
        text: "In Process"
    },{
        key: "cancelled",
        text: "Cancelled"
    },{
        key: "delivered",
        text: "Delivered"
    }]
    
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const [loading,
        setLoading] = useState(true)
    const [pickerItems, 
        setPickerItems] = useState([])
    const [pickerValue, 
        setPickerValue] = useState("");
    const [phoneNo,
        setPhoneNo] = useState("");
    const [catIndex,
        setCatIndex] = useState(0);
    const [status,
        setStatus] = useState(route.params.status);
    const [activeSections,
        setActiveSections] = useState([0]);
    const [pastOrders,
        setPastOrders] = useState([])
    const reOrder = () => {}

    const getDataFromStorage = (filter) => {
        AsyncStorage
            .getItem("anonymusOrders")
            .then((data) => {
                setLoading(false)
                setRefreshing(false)
                if (data && JSON.parse(data).length > 0) {
                    let allItem = JSON.parse(data);
                    let items = allItem.filter(item => item.mode === filter)
                    let pickerValArray = [],
                        obj = {
                            value: "Select reason for cancellation"
                        }
                    for(let i = 0; i < items.length; i++){
                        pickerValArray.push(obj)
                    }
                    setPickerValue(pickerValArray)
                    setPastOrders(items);
                }
            });
    }
    const getDataFromDatabase = (phoneNo, filter) => {
        database()
            .ref("/users/" + phoneNo + "/orders")
            .once('value')
            .then(snapshot => {
                setLoading(false)
                setRefreshing(false)
                if (snapshot.val()) {
                    let items = snapshot.val().filter(item => item.mode === filter)
                    let pickerValArray = [],
                        obj = {
                            value: "Select reason for cancellation"
                        }
                    for(let i = 0; i < items.length; i++){
                        pickerValArray.push(obj)
                    }
                    setPickerValue(pickerValArray)
                    setPastOrders(items);
                }
            })
    }

    const onPressCancel = (item, serviceType) => {
        if(serviceType !== "Adopt") {
            navigation.navigate("Cancel", {type: "order", data: [
                {
                    id: 1,
                    label: "I have changed my mind",
                    value: "I have changed my mind",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }, {
                    id: 2,
                    label: "Found from local store",
                    value: "Found from local store",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }, {
                    id: 3,
                    label: "Quality was not good",
                    value: "Quality was not good",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }, {
                    id: 4,
                    label: "Price is not reasonable",
                    value: "Price is not reasonable",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }, {
                    id: 5,
                    label: "Somewhat not satisfied with the privious order",
                    value: "Somewhat not satisfied with the privious order",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }
            ], item: item})
        } else {
            navigation.navigate("Cancel", {type: "order", data: [
                {
                    id: 1,
                    label: "I have changed my mind",
                    value: "I have changed my mind",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }, {
                    id: 2,
                    label: "Found anywhere else",
                    value: "Found anywhere else",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }, {
                    id: 3,
                    label: "Price is not reasonable",
                    value: "Price is not reasonable",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }, {
                    id: 4,
                    label: "Don't want to mention",
                    value: "Don't want to mention",
                    labelStyle: {
                        fontFamily: 'Redressed-Regular',
                        fontSize: 18
                    }
                }
            ], item: item})
        }
    }

    const handleCustomIndexSelect = (index) => {
        setLoading(true)
        setCatIndex(index)
        setPickerValue("")
        if (status === 'loggedIn') {
            getDataFromDatabase(phoneNo, filters[index].key);
        } else {
            getDataFromStorage(filters[index].key)
        }
    }
    const onRefresh = () => {
        setRefreshing(true)
        if (status === 'loggedIn') {
            getDataFromDatabase(phoneNo, filters[catIndex].key);
        } else {
            getDataFromStorage(filters[catIndex].key)
        }
    }

    useEffect(() => {
        if (isFocused) {
            if (status === 'loggedIn') {
                AsyncStorage
                .getItem('phoneNo')
                .then((phoneNo, msg) => {
                    setPhoneNo(phoneNo)
                    getDataFromDatabase(phoneNo, "inprocess");
                })
            } else {
                getDataFromStorage("inprocess")
            }
        }
    }, [isFocused])
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
                rightIconSize={35}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText="See all your orders..."
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={'All Orders'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={35}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.navigate("HomeBottomTabBar", {screen: "Settings"})}/>
                <View
                    style={{
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    width: '100%'
                    }}>
                    <SegmentedControlTab
                        values={["In Process", "Cancelled", "Delivered"]}
                        borderRadius={0}
                        tabsContainerStyle={{ height: 50, backgroundColor: Colors.white }}
                        tabStyle={{ backgroundColor: Colors.darkGray, borderColor: Colors.white, borderWidth: 1 }}
                        activeTabStyle={{ backgroundColor: Colors.green }}
                        tabTextStyle={{ color: '#444444', fontFamily: 'Oswald-Medium' }}
                        activeTabTextStyle={{ color: Colors.white }}
                        selectedIndex={catIndex}
                        onTabPress={handleCustomIndexSelect}
                    />
            </View>
            {loading?
            <View style={{paddingHorizontal: 20}}>
                <ServiceScreenLoader/>
            </View>
            :
            <FlatList
                refreshControl={<RefreshControl progressViewOffset={20} colors={[Colors.primary, Colors.secondary]} refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={{alignItems: 'center', marginTop: 20}}>
                        <Title label="No orders are found..." size={20} color={Colors.darkGray}/>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                data={pastOrders}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => {
                return (
                    <Animatable.View
                            delay={50 * index}
                            animation={'slideInLeft'}
                            style={{
                            backgroundColor: Colors.appBackground,
                            marginHorizontal: 20,
                            marginVertical: 10,
                            padding: 10,
                            elevation: 5
                        }}>
                        {item.serviceType === 'Adopt'? 
                        <RNBounceable onPress={() => navigation.navigate("PetDetail", {item: item})}>
                            <View>
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
                                        color={Colors.primary}/>
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
                                            <Title size={15} label={"Transaction Id: " + item.txnId} bold={true} color={Colors.darkGray}/>
                                            <View
                                                style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                <Title size={15} label={"Ordered On:"} bold={true} color={Colors.darkGray}/>
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
                                
                            </View> 
                        </RNBounceable>  
                        :
                        <View>
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
                                    color={Colors.primary}/>
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
                                        <Title size={15} label={"Transaction Id: " + item.txnId} bold={true} color={Colors.darkGray}/>
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
                                                {item.mode === 'inprocess' && (<Title size={15} label={'In Process'} bold={true} color={Colors.yellow}/>)}
                                                {item.mode === 'delivered' && (<Title size={15} label={'Delivered'} bold={true} color={Colors.green2}/>)}
                                                {item.mode === 'cancelled' && (<Title
                                                    size={15}
                                                    label={'Cancelled'}
                                                    bold={true}
                                                    color={Colors.error_toast_color}/>)}
                                            </View>
                                        </View>
                                        {item.mode === 'cancelled' && (
                                            <Text style={{color: Colors.darkGray, fontSize: 15, fontFamily: 'Oswald-Medium'}}>{"Reason for cancellation: " + item.reasonForCancellation}</Text>
                                        )}
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
                            
                        </View>   
                        }
                        {item.mode !== 'cancelled' && (
                        <View>
                            {item.mode === 'inprocess' && (
                                <View style={{
                                    borderTopColor: Colors.darkGray,
                                    borderTopWidth: 1,
                                    padding: 5}}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: 5
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("TrackOrder", {
                                            details: {
                                                ...item,
                                                fromScreen: 'Services'
                                            }
                                        })}
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
                                            onPress={() => onPressCancel(item, item.serviceType)}>Cancel</Button>
                                    </View>
                                </View>
                            )}
                            {item.mode === 'delivered' && (
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderTopColor: Colors.darkGray,
                                    borderTopWidth: 1,
                                    padding: 5
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
                )
            }}/>
            }
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

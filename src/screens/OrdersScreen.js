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
            <FlatList
                    showsVerticalScrollIndicator={false}
                    data={pastOrders}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => (<View style={{
                    marginBottom: 10
                }}/>)}
                    renderItem={({item, rowMap}) => {
                    return (
                      <Animatable.View
                      delay={50 * rowMap}
                      animation={'slideInRight'}
                      style={{
                      backgroundColor: Colors.appBackground,
                      marginHorizontal: 20,
                      marginVertical: 10,
                      padding: 20,
                      elevation: 5,
                  }}>
                      <View
                          style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                      }}> 
                        <Title size={18} label={'Order Details : '} bold={true} color={Colors.primary}/>
                        <Title size={18} label={"Price: " + item.total + "/-"} bold={true} color={Colors.primary}/>
                    </View>
                    <View style={{marginTop: 5, marginBottom: 10}}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Title size={15} label={"Booked On:"} bold={true} color={Colors.gray}/>
                            <View style={{marginLeft: 5}}>
                              <Title size={15} label={item.orderedOn} bold={true} color={item.mode === 'inprocess'? Colors.yellow:Colors.green2}/>
                            </View>
                          </View>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Title size={15} label={"Status:"} bold={true} color={Colors.gray}/>
                            <View style={{marginLeft: 5}}>
                              <Title size={15} label={item.mode === 'inprocess'? 'In Process':'Delivered'} bold={true} color={item.mode === 'inprocess'? Colors.yellow:Colors.green2}/>
                            </View>
                          </View>
                        </View>
                      </View>
                      {item.cartItems.map((item, index) => 
                        <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Title size={15} label={(index + 1) + ". "} bold={true} color={Colors.darkGray}/>
                                <View style={{marginLeft: 5}}>
                                    <Title size={15} label={item.name} bold={true} color={Colors.darkGray}/>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Title size={15} label={"Quantity:"} bold={true} color={Colors.darkGray}/>
                                <View style={{marginLeft: 5}}>
                                    <Title size={15} label={item.quantity} bold={true} color={Colors.green2}/>
                                </View>
                            </View>
                        </View>
                    )}
                    </View>
                    <View style={{borderTopColor: Colors.darkGray, borderTopWidth: 1, padding: 5}}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Title size={18} label={item.mode === 'inprocess'? 'Track':'Book Again'} bold={true} color={Colors.secondary}/>
                            <Icon type={Icons.AntDesign} style={{marginTop: 5, marginLeft: 5}} name={'arrowright'} size={20} color={Colors.secondary}/>
                        </TouchableOpacity>
                    </View>
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

export default OrdersScreen;

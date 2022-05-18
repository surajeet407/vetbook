import React, {useRef, useState, useEffect} from 'react';
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

import { CommonActions } from '@react-navigation/native';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import {SwipeListView} from 'react-native-swipe-list-view';
import SectionBanner from '../reusable_elements/SectionBanner';
import * as Animatable from 'react-native-animatable';
import database from '@react-native-firebase/database';
import RazorpayCheckout from 'react-native-razorpay';
import Icon, {Icons} from '../util/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import NumericInput from 'react-native-numeric-input'
import Label, {Orientation} from "react-native-label";
import i18n from '../util/i18n';

const CartScreen = ({navigation, route}) => {
    const [status,
        setStatus] = useState(route.params.status);
    const [cartItems,
        setCartItems] = useState([])
    const [amount,
        setAmount] = useState(0);
    const [tax,
        setTax] = useState(0);
    const [total,
        setTotal] = useState(0);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };
    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...cartItems];
        const prevIndex = cartItems.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setCartItems(newData);
        if (status === 'loggedOut') {
            if (newData.length > 0) {
                AsyncStorage.setItem('cartItems', JSON.stringify(newData));
            } else {
                AsyncStorage.setItem('cartItems', "[]");
            }
        } else {
            if (newData.length > 0) {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        if (phoneNo) {
                            database()
                                .ref('/users/' + phoneNo + "/cartItems")
                                .set(newData)
                        }
                    })
            } else {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        if (phoneNo) {
                            database()
                                .ref('/users/' + phoneNo + "/cartItems")
                                .set(null)
                        }
                    })
            }
        }

        _bindTaxWithTotal(newData);
    };
    const _bindTaxWithTotal = (val) => {
        setCartItems(val);
        let price = 0
        val.forEach((item) => {
            price = price + parseInt(item.discountPrice) * parseInt(item.quantity);
        })
        setAmount(price);
        setTax(parseInt((parseInt(price) * 18) / 100));
        setTotal(parseInt(price + (parseInt(price) * 18) / 100));
    }
    const getData = () => {
        // database() .ref('/users/8900162177/cartItems') .on("value", snapshot => {
        // if(snapshot.val()) {     _bindTaxWithTotal(snapshot.val())   } })
        if (status === 'loggedOut') {
            AsyncStorage
                .getItem('cartItems')
                .then((data) => {
                    if (JSON.parse(data).length > 0) {
                        _bindTaxWithTotal(JSON.parse(data))
                    }
                });
        } else {
            AsyncStorage
                .getItem('phoneNo')
                .then((data, msg) => {
                    if (data) {
                        database()
                            .ref('/users/' + data + "/cartItems")
                            .on('value', snapshot => {
                                if (snapshot.val()) {
                                    _bindTaxWithTotal(snapshot.val())
                                }
                            })
                    }
                })
        }

    }
    const onPressButton = () => {
        if (total === 0) {
            navigation.dispatch(
                CommonActions.navigate({
                  name: 'HomeBottomTabBar',
                  screen: "PetStore",
                  params: {
                    status: status
                  },
                })
            );
        } else {
            navigation.navigate("Confirm", {
                details: {
                    cartItems: cartItems,
                    serviceType: "None",
                    amount: amount,
                    total: total,
                    tax: tax
                }
            });
        }
    }

    const onChangeInput = (val, item, index) => {
        if (status === 'loggedOut') {
            AsyncStorage
                .getItem('cartItems')
                .then((data) => {
                    if (JSON.parse(data).length > 0) {
                        let data = JSON.parse(data)
                        for(let i = 0; i < data.length; i++) {
                            if(data[i].id === item.id) {
                                path = i;
                                itemQuan = parseInt(data[i].quantity)
                            }
                        }
                        data[path].quantity = val.toString()
                        AsyncStorage.setItem('cartItems', JSON.stringify(data))
                    }
                });
        } else {
            AsyncStorage
                .getItem('phoneNo')
                .then((data, msg) => {
                    if (data) {
                        database()
                            .ref('/users/' + data + "/cartItems")
                            .once('value')
                            .then(snapshot => {
                                let path, itemQuan;
                                if (snapshot.val()) {
                                    for(let i = 0; i < snapshot.val().length; i++) {
                                        if(snapshot.val()[i].id === item.id) {
                                            path = i;
                                            itemQuan = parseInt(snapshot.val()[i].quantity)
                                        }
                                    }
                                    database()
                                        .ref('/users/' + data + "/cartItems/" + path).update({
                                            quantity: val.toString()
                                        })
                                }
                            })
                    }
                })
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
                rightIconSize={35}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => {}}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText={cartItems.length === 0
                ? "Add items to your cart..."
                : "Swipe right to delete cart items..."}
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={'Cart Items (' + cartItems.length + ')'}
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
                marginBottom: total === 0
                    ? 80
                    : 200,
                backgroundColor: Colors.appBackground,
                padding: 20,
                flex: 2,
                width: '100%'
            }}>
                {total !== 0
                    ? <SwipeListView
                            scrollEventThrottle={16}
                            disableRightSwipe
                            width="100%"
                            showsVerticalScrollIndicator={false}
                            data={cartItems}
                            keyExtractor={item => item.id}
                            leftOpenValue={60}
                            rightOpenValue={-80}
                            ItemSeparatorComponent={() => (<View
                            style={{
                            marginBottom: 10
                        }}/>)}
                            renderItem={({item, index}) => {
                            return (
                            <View
                                style={{
                                margin: 5,
                                paddingHorizontal: 15,
                                paddingVertical: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                backgroundColor: Colors.appBackground,
                                borderRadius: 15,
                                elevation: 5
                            }}>
                                <View
                                    style={{
                                    flexDirection: 'row'
                                }}>
                                    <Label
                                        orientation={Orientation.TOP_RIGHT}
                                        containerStyle={{
                                        width: 80,
                                        height: 80
                                    }}
                                        style={{
                                        fontSize: 10,
                                        fontFamily: 'Oswald-Regular',
                                        color: Colors.secondary
                                    }}
                                        title={"₹ " + item.discountPrice + " /-"}
                                        color={Colors.white}
                                        ratio={0.2}
                                        distance={50}
                                        extent={0}>
                                            <Image
                                                source={{
                                                uri: item.image
                                            }}
                                                style={{
                                                borderRadius: 15,
                                                width: 80,
                                                height: 80
                                            }}/>
                                    </Label>
                                    <View
                                        style={{
                                        marginLeft: 10,
                                        width: '70%',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-evenly'
                                    }}>
                                        <View
                                            style={{
                                            width: '90%',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Text
                                                style={{
                                                fontFamily: 'Oswald-Medium',
                                                fontSize: 16,
                                                color: Colors.darkGray
                                            }}>{item.name}</Text>
                                            <Icon
                                                type={Icons.Ionicons}
                                                style={{
                                                marginTop: 10,
                                                marginLeft: 2
                                            }}
                                                name={'close'}
                                                size={15}
                                                color={Colors.primary}/>
                                            <Text
                                                style={{
                                                marginLeft: 2,
                                                fontFamily: 'Oswald-Medium',
                                                fontSize: 20,
                                                color: Colors.darkGray
                                            }}>{item.quantity} (Unit)</Text>
                                        </View>
                                        <NumericInput
                                            totalWidth={100}
                                            totalHeight={30}
                                            iconSize={25}
                                            initValue={parseInt(item.quantity)}
                                            value={parseInt(item.quantity)}
                                            onChange={(val) => onChangeInput(val, item, index)}
                                            rounded
                                            minValue={1}
                                            validateOnBlur
                                            maxValue={5}
                                            textColor={Colors.black}
                                            iconStyle={{
                                            color: Colors.white,
                                            fontSize: 20
                                        }}
                                            rightButtonBackgroundColor={Colors.green3}
                                            leftButtonBackgroundColor={Colors.red}/> 
                                        {/* <Text style={{ fontFamily: 'PTSerif-Bold', fontSize: 18, color: 'grey' }}>Price: {item.discountPrice} /-</Text> */}
                                    </View>
                                </View>
                            </View>
                        )}}
                            renderHiddenItem={(data, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity
                                    style={styles.backRightBtn}
                                    onPress={() => deleteRow(rowMap, data.item.key)}>
                                    <Icon type={Icons.MaterialIcons} name={'delete'} color={Colors.red} size={30}/>
                                </TouchableOpacity>
                            </View>
                        )}/>
                    : <View
                        style={{
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{
                            fontFamily: 'Oswald-Medium',
                            fontSize: 20,
                            color: Colors.primary
                        }}>No Items are there...</Text>
                    </View>
}
            </View>
            <Animatable.View animation={'slideInUp'}>
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
                    height: total === 0
                        ? 80
                        : 200,
                    backgroundColor: Colors.secondary,
                    borderTopLeftRadius: 50,
                    elevation: 10,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        {total !== 0
                            ? <View
                                    style={{
                                    marginBottom: 20
                                }}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            style={{
                                            fontFamily: 'Oswald-Medium',
                                            fontSize: 20,
                                            color: Colors.darkGray
                                        }}>{cartItems.length}
                                            Items</Text>
                                        <Text
                                            style={{
                                            fontFamily: 'Oswald-Medium',
                                            fontSize: 20,
                                            color: Colors.darkGray
                                        }}>₹ {amount}
                                            /-</Text>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            style={{
                                            fontFamily: 'Oswald-Medium',
                                            fontSize: 20,
                                            color: Colors.darkGray
                                        }}>Tax</Text>
                                        <Text
                                            style={{
                                            fontFamily: 'Oswald-Medium',
                                            fontSize: 20,
                                            color: Colors.darkGray
                                        }}>₹ {tax}
                                            /-</Text>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            style={{
                                            fontFamily: 'Oswald-SemiBold',
                                            fontSize: 22,
                                            color: Colors.white
                                        }}>Total</Text>
                                        <Text
                                            style={{
                                            fontFamily: 'Oswald-SemiBold',
                                            fontSize: 22,
                                            color: Colors.white
                                        }}>₹ {total}
                                            /-</Text>
                                    </View>
                                </View>
                            : null
}
                        <Button
                            icon={'long-arrow-right'}
                            useIcon={total === 0
                            ? true
                            : false}
                            backgroundColor={Colors.primary}
                            iconPostionRight={true}
                            title={total === 0
                            ? "Go to Store"
                            : "Checkout"}
                            onPress={onPressButton}/>
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
    rowBack: {
        height: 100
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 5,
        justifyContent: 'center',
        position: 'absolute',
        top: 5,
        width: 75,
        backgroundColor: Colors.darkOverlayColor,
        right: 10,
        borderRadius: 10
    }
});

export default CartScreen;

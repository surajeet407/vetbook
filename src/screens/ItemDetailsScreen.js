import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    Animated,
    ImageBackground
} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import Icon, {Icons} from '../util/Icons';
import Title from '../reusable_elements/Title';
import Button from '../reusable_elements/Button';
import Colors from '../util/Colors';
import Toast from 'react-native-toast-message';
import PagerView from 'react-native-pager-view';
import RNBounceable from "@freakycoder/react-native-bounceable";
import NumericInput from 'react-native-numeric-input'
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import * as Animatable from 'react-native-animatable';
import SectionBanner from '../reusable_elements/SectionBanner';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import Label, {Orientation} from "react-native-label";
import i18n from '../util/i18n';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const ItemDetailScreen = ({navigation, route}) => {
    const isFocused = useIsFocused();
    const [status,
        setStatus] = useState(route.params.status);
    const width = Dimensions
        .get('window')
        .width;
    const [cartItemCount,
        setCartItemCount] = useState('0');
    const [price,
        setPrice] = useState(route.params.item.price);
    const [numericInputVal,
        setNumericInputVal] = useState(1);
    const animation = useRef(new Animated.Value(0)).current;
    const scrollOffsetAnimatedValue = React
        .useRef(new Animated.Value(0))
        .current;
    const positionAnimatedValue = React
        .useRef(new Animated.Value(0))
        .current;
    let inputRange = [0, 3];
    let translateX = Animated
        .add(scrollOffsetAnimatedValue, positionAnimatedValue)
        .interpolate({
            inputRange,
            outputRange: [
                0, 3 * width
            ]
        });

    const onPressAddToCart = () => {
        if (numericInputVal > 5) {
            Toast.show({
                type: 'customToast',
                text1: "Try to add items less than 6...",
                position: 'bottom',
                visibilityTime: 1000,
                bottomOffset: 120,
                props: {
                    backgroundColor: '#ea5e48'
                }
            })
            return;
        }
        if (status === 'loggedOut') {
            AsyncStorage
                .getItem('cartItems')
                .then((data) => {
                    if (data) {
                        let cartItem = JSON.parse(data),
                            count = 0;
                        cartItem.forEach((item, index, arr) => {
                            if (item.id === route.params.item.id) {
                                count++;
                                item.quantity = numericInputVal;
                                AsyncStorage.setItem('cartItems', JSON.stringify(cartItem));
                                Toast.show({
                                    type: 'customToast',
                                    text1: "Quantity Updated...",
                                    position: 'bottom',
                                    visibilityTime: 1500,
                                    bottomOffset: 120,
                                    props: {
                                        backgroundColor: Colors.deepGreen
                                    }
                                });
                            }
                        })
                        if (count === 0) {
                            route.params.item.quantity = numericInputVal;
                            cartItem.push(route.params.item);
                            AsyncStorage.setItem('cartItems', JSON.stringify(cartItem));
                            AsyncStorage
                                .getItem('cartItemCount')
                                .then((data, msg) => {
                                    if (data) {
                                        setCartItemCount((parseInt(data) + 1).toString())
                                        AsyncStorage.setItem('cartItemCount', (parseInt(data) + 1).toString());
                                    }
                                })
                            Toast.show({
                                type: 'customToast',
                                text1: "Item added to your cart...",
                                position: 'bottom',
                                visibilityTime: 1500,
                                bottomOffset: 120,
                                props: {
                                    backgroundColor: Colors.deepGreen
                                }
                            });
                        }

                    } else {
                        let data = [];
                        route.params.item.quantity = numericInputVal;
                        data.push(route.params.item);
                        AsyncStorage.setItem('cartItems', JSON.stringify(data));
                        setCartItemCount("1");
                        AsyncStorage.setItem('cartItemCount', "1");
                        Toast.show({
                            type: 'customToast',
                            text1: "Item added to your cart...",
                            position: 'bottom',
                            visibilityTime: 1500,
                            bottomOffset: 120,
                            props: {
                                backgroundColor: Colors.deepGreen
                            }
                        });
                    }

                })
        } else {
            AsyncStorage
                .getItem('phoneNo')
                .then((phoneNo, msg) => {
                    if (phoneNo) {
                        database()
                            .ref('/users/' + phoneNo + "/cartItems")
                            .once('value')
                            .then(snapshot => {
                                if (snapshot.val() && snapshot.val().length > 0) {
                                    let cartItem = snapshot.val(),
                                        count = 0,
                                        indexPath;
                                    cartItem.forEach((item, index, arr) => {
                                        if (item.id === route.params.item.id) {
                                            count++;
                                            indexPath = index;
                                        }
                                    })
                                    if (count === 0) {
                                        route.params.item.quantity = numericInputVal;
                                        cartItem.push(route.params.item);
                                        database()
                                            .ref('/users/' + phoneNo + "/cartItems")
                                            .set(cartItem)
                                        getCartItemCount();
                                        Toast.show({
                                            type: 'customToast',
                                            text1: "Item added to your cart...",
                                            position: 'bottom',
                                            visibilityTime: 1500,
                                            bottomOffset: 120,
                                            props: {
                                                backgroundColor: Colors.deepGreen
                                            }
                                        });
                                    } else {
                                        cartItem[indexPath].quantity = numericInputVal;
                                        database()
                                            .ref('/users/' + phoneNo + "/cartItems")
                                            .set(cartItem)
                                        Toast.show({
                                            type: 'customToast',
                                            text1: "Quantity Updated...",
                                            position: 'bottom',
                                            visibilityTime: 1500,
                                            bottomOffset: 120,
                                            props: {
                                                backgroundColor: Colors.deepGreen
                                            }
                                        });
                                    }
                                } else {
                                    let firstItem = [];
                                    let obj = {...route.params.item};
                                    obj.quantity = numericInputVal;
                                    firstItem.push(obj);
                                    database()
                                        .ref('/users/' + phoneNo + "/cartItems")
                                        .set(firstItem)
                                    setCartItemCount("1");
                                    Toast.show({
                                        type: 'customToast',
                                        text1: "Item added to your cart...",
                                        position: 'bottom',
                                        visibilityTime: 1500,
                                        bottomOffset: 120,
                                        props: {
                                            backgroundColor: Colors.deepGreen
                                        }
                                    });

                                }
                            })
                    }
                })
        }

    }

    const onChangeInput = (value) => {
        setNumericInputVal(value)
        setPrice(parseInt(value) * parseInt(route.params.item.price));
    }

    const getCartItemCount = () => {
        if (status === 'loggedOut') {
            AsyncStorage
                .getItem('cartItemCount')
                .then((data, msg) => {
                    if (data) {
                        setCartItemCount(data)
                    }
                })
        } else {
            AsyncStorage
                .getItem('phoneNo')
                .then((data, msg) => {
                    if (data) {
                        database()
                            .ref('/users/' + data + "/cartItems")
                            .once('value')
                            .then(snapshot => {
                                if (snapshot.val()) {
                                    setCartItemCount(snapshot.val().length)
                                } else {
                                    setCartItemCount("0")
                                }
                            })
                    }
                })
        }

    }

    useEffect(() => {
        if (isFocused) {
            getCartItemCount()
        }
    }, [isFocused]);

    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <GeneralHeader
                showRigtIcon={true}
                rightIconType={Icons.MaterialCommunityIcons}
                rightIconName={'cart'}
                rightIconSize={30}
                rightIconColor={Colors.appBackground}
                rightIconBackgroundColor={Colors.secondary}
                onPressRight={() => navigation.navigate("Cart", {status: route.params.status})}
                showBadgeOverRightIcon={true}
                badgeBackgroundColor={Colors.primary}
                badgeColor={Colors.appBackground}
                badgeBorderColor={Colors.appBackground}
                badgeText={cartItemCount}
                badgeSize={25}
                subHeaderText="A Quick brown fox jumps over the lazy dog... A Quick brown fox jumps over the lazy dog..."
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={60}
                headerText={route.params.item.name}
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
                marginTop: 30,
                flex: 1,
                width: '100%',
                backgroundColor: Colors.appBackground,
                alignItems: 'center'
            }}>
                <Label
                    orientation={Orientation.TOP_RIGHT}
                    containerStyle={{
                    width: "80%",
                    height: 200
                }}
                    style={{
                    fontSize: 25,
                    fontFamily: 'Oswald-Regular'
                }}
                    title={"₹ " + route.params.item.price + " /-"}
                    color={Colors.primary}
                    ratio={0.2}
                    distance={80}
                    extent={0}>
                    <AnimatedPagerView
                        initialPage={0}
                        style={{
                        width: "100%",
                        height: 300
                    }}
                        onPageScroll={Animated.event([
                        {
                            nativeEvent: {
                                offset: scrollOffsetAnimatedValue,
                                position: positionAnimatedValue
                            }
                        }
                    ], {useNativeDriver: false})}>
                        {["1", "2", "3"].map((item, index) => {
                            const inputRange = [0, 0.5, 0.99];
                            const inputRangeOpacity = [0, 0.5, 0.99];
                            const scale = scrollOffsetAnimatedValue.interpolate({
                                inputRange,
                                outputRange: [1, 0, 1]
                            });
                            const opacity = scrollOffsetAnimatedValue.interpolate({
                                inputRange: inputRangeOpacity,
                                outputRange: [1, 0, 1]
                            });
                            return (<Animated.Image
                                key={index}
                                blurRadius={3}
                                style={{
                                opacity: opacity,
                                transform: [
                                    {
                                        scale
                                    }
                                ],
                                width: '100%'
                            }}
                                source={{
                                uri: route.params.item.image
                            }}/>)
                        })}
                    </AnimatedPagerView>
                </Label>
                <ExpandingDot
                    data={["1", "2", "3"]}
                    expandingDotWidth={30}
                    scrollX={translateX}
                    inActiveDotOpacity={0.6}
                    inActiveDotColor={Colors.darkGray}
                    activeDotColor={Colors.primary}
                    containerStyle={{
                    bottom: "45%",
                    right: -20,
                    transform: [
                        {
                            rotate: '90deg'
                        }
                    ]
                }}
                    dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 5
                }}/>
            </View>
            <View
                style={{
                flex: 1,
                paddingHorizontal: 20,
                marginTop: 50,
                backgroundColor: Colors.appBackground,
                justifyContent: 'space-around'
            }}>

                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {route
                        .params
                        .item
                        .description
                        .map((item, index) => <Animatable.View
                            delay={index * 100}
                            animation={'slideInLeft'}
                            key={index}
                            style={{
                            flexDirection: 'row',
                            marginBottom: 5
                        }}>
                            <Icon
                                type={Icons.Octicons}
                                style={{
                                marginRight: 10,
                                marginTop: 5,
                                fontSize: 20
                            }}
                                name={'dot-fill'}
                                color={Colors.secondary}/>
                            <Title size={18} bold={true} label={item}/>
                        </Animatable.View>)}
                </ScrollView>
                <View
                    style={{
                    flexDirection: 'row',
                    height: 80,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <NumericInput
                        totalWidth={100}
                        totalHeight={40}
                        iconSize={25}
                        initValue={numericInputVal}
                        value={numericInputVal}
                        onChange={onChangeInput}
                        rounded
                        minValue={1}
                        validateOnBlur
                        maxValue={5}
                        onLimitReached={(isMax, msg) => Toast.show({
                        type: 'customToast',
                        text1: msg,
                        position: 'bottom',
                        visibilityTime: 1000,
                        bottomOffset: 100,
                        props: {
                            backgroundColor: '#ea5e48'
                        }
                    })}
                        textColor={Colors.black}
                        iconStyle={{
                        color: Colors.primary,
                        fontSize: 20
                    }}
                        rightButtonBackgroundColor={Colors.appBackground}
                        leftButtonBackgroundColor={Colors.appBackground}/>
                    <View
                        style={{
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{
                            color: Colors.Bg9,
                            fontSize: 18,
                            fontFamily: 'Oswald-Medium'
                        }}>Quantity: 500 gm</Text>
                        <Text
                            style={{
                            color: Colors.Bg9,
                            fontSize: 18,
                            fontFamily: 'Oswald-Medium'
                        }}>Price: ₹ {price}
                            /-</Text>
                    </View>
                </View>
            </View>
            <Animatable.View animation={'fadeInUp'}>
                <ImageBackground
                    blurRadius={0}
                    source={require('../assets/images/background6.png')}
                    style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    height: 100,
                    backgroundColor: Colors.secondary,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            iconPostionLeft={true}
                            backgroundColor={Colors.primary}
                            useIcon={true}
                            title="Add To Cart"
                            icon="cart-plus"
                            onPress={onPressAddToCart}/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default ItemDetailScreen;

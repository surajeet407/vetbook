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
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import * as Animatable from 'react-native-animatable';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import Label, {Orientation} from "react-native-label";
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Review from "react-native-customer-review-bars";
import {Rating} from 'react-native-ratings';
import RBSheet from "react-native-raw-bottom-sheet";
import i18n from '../util/i18n';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const ItemDetailScreen = ({navigation, route}) => {
    const [reviews, 
        setReviews] = useState(route.params.item.review? route.params.item.review:[]);
    const refRBSheet = useRef(null)
    const isFocused = useIsFocused();
    const [ratingCountInd,
        setRatingCountInd] = useState(0)
    const [phoneNo,
        setPhoneNo] = useState("");
    const [catIndex,
        setCatIndex] = useState(0);
    const [status,
        setStatus] = useState(route.params.status);
    const width = Dimensions
        .get('window')
        .width;
    const [cartItemCount,
        setCartItemCount] = useState('0');
    const [price,
        setPrice] = useState(route.params.item.discountPrice);
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
                                    .getItem('cartItems')
                                    .then((data, msg) => {
                                        if (data) {
                                            setCartItemCount(JSON.parse(data).length)
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
        setPrice(parseInt(value) * parseInt(route.params.item.discountPrice));
    }

    const getCartItemCount = () => {
        if (status === 'loggedOut') {
            AsyncStorage
                .getItem('cartItems')
                .then((data, msg) => {
                    if (data) {
                        setCartItemCount(JSON.parse(data).length)
                    } else {
                        setCartItemCount(0)
                    }
                })
        } else {
            AsyncStorage
                .getItem('phoneNo')
                .then((data, msg) => {
                    setPhoneNo(data)
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

    const handleCustomIndexSelect = (index) => {
        setCatIndex(index)
    }

    const onPressRateItem = () => {
        refRBSheet.current.open()
    }
    const onPressSubmit = () => {
        if(ratingCountInd === 0) {
            Toast.show({
                type: 'customToast',
                text1: "Select at least one start to rate...",
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 220,
                props: {
                    backgroundColor: '#ea5e48'
                }
            })
        } else {
            refRBSheet.current.close()
            let path
            if (route.params.type  === "Medicine") {
                path = "/petMedicineItems"
            } else if (route.params.type === "Food") {
                path = "/petFoodItems"
            } else if (route.params.type === "Toys") {
                path = "/petToysItems"
            } else if (route.params.type === "Accesorries") {
                path = "/petAccItems"
            } else {
                path = "/petFurItems"
            }
            database()
            .ref(path)
            .once('value')
            .then(snapshot => {
                if(snapshot.val()) {
                    let key
                    snapshot.forEach((child) => {
                        if(child.val().id === route.params.item.id) {
                            // console.log(child.val().review)
                            let ar;
                            if(child.val().review) {
                                ar = child.val().review
                                if(ratingCountInd === 1) {
                                    ar[4].value = parseInt(ar[4].value) + 1
                                } else if(ratingCountInd === 2) {
                                    ar[3].value = parseInt(ar[3].value) + 1
                                } else if(ratingCountInd === 3) {
                                    ar[2].value = parseInt(ar[2].value) + 1
                                } else if(ratingCountInd === 4) {
                                    ar[1].value = parseInt(ar[1].value) + 1
                                } else if(ratingCountInd === 5){
                                    ar[0].value = parseInt(ar[0].value) + 1
                                }
                            } else {
                                ar = [{value: 0},{value: 0},{value: 0},{value: 0},{value: 0}]
                                if(ratingCountInd === 1) {
                                    ar[4].value = 1
                                } else if(ratingCountInd === 2) {
                                    ar[3].value = 1
                                } else if(ratingCountInd === 3) {
                                    ar[2].value = 1
                                } else if(ratingCountInd === 4) {
                                    ar[1].value = 1
                                } else if(ratingCountInd === 5) {
                                    ar[0].value = 1
                                }
                            }
                            setRatingCountInd(0)
                            child.child("review").ref.set(ar)
                            setReviews(ar)
                            return
                        }
                    })
                }
            })
        }
        
    }

    const onRatingCompleted = (ratingCountInd) => {
        setRatingCountInd(ratingCountInd)
        console.log(ratingCountInd)
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
                headerHeight={100}
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
                onPressLeft={() => navigation.navigate("HomeBottomTabBar", {screen: "PetStore", status: status, type: route.params.type})}/>
            <View
                style={{
                width: '100%',
                height: 250,
                backgroundColor: Colors.appBackground,
                alignItems: 'center'
            }}>
                <Label
                    orientation={Orientation.TOP_RIGHT}
                    containerStyle={{
                    width: "90%"
                }}
                    style={{
                    fontSize: 16,
                    fontFamily: 'Oswald-Regular'
                }}
                    title={"₹ " + route.params.item.actualPrice + " /- ( " + ((parseInt(route.params.item.actualPrice) - parseInt(route.params.item.discountPrice)) / 100).toFixed(1) + " % off)"}
                    color={Colors.primary}
                    ratio={0.5}
                    distance={120}
                    extent={0.1}>
                    <AnimatedPagerView
                        initialPage={0}
                        style={{
                        width: "100%",
                        height: 250
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
                    inActiveDotColor={Colors.accent}
                    activeDotColor={Colors.secondary}
                    containerStyle={{
                    bottom: 10,
                    left: "40%",
                }}
                    dotStyle={{
                    width: 12,
                    height: 8,
                    borderRadius: 5,
                    marginHorizontal: 5
                }}/>
            </View>
            <View
                style={{
                flex: 1,
                paddingHorizontal: 20,
                backgroundColor: Colors.appBackground,
                justifyContent: 'space-around'
            }}>
                <SegmentedControlTab
                    values={["Details", "Ratings"]}
                    borderRadius={0}
                    tabsContainerStyle={{ height: 50, backgroundColor: Colors.white }}
                    tabStyle={{ backgroundColor: Colors.darkGray, borderColor: Colors.green, borderWidth: 2 }}
                    activeTabStyle={{ backgroundColor: Colors.green }}
                    tabTextStyle={{ color: '#444444', fontFamily: 'Oswald-Medium' }}
                    activeTabTextStyle={{ color: Colors.white }}
                    selectedIndex={catIndex}
                    onTabPress={handleCustomIndexSelect}
                />

                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {catIndex === 0? 
                    <View style={{marginTop: 10}}>
                        
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
                                    fontSize: 18
                                }}
                                    name={'dot-fill'}
                                    color={Colors.secondary}/>
                                <Title size={16} bold={true} label={item}/>
                        </Animatable.View>)}
                    </View>
                    :
                    <View style={{marginTop: 5}}>
                        {reviews.length > 0 && (
                        <View>
                            <View style={{marginBottom: 10, alignItems: 'center'}}>
                                <View style={{alignItems: 'center', borderBottomColor: Colors.darkGray, borderBottomWidth: 2, width: 160, paddingVertical: 5}}>
                                    <Title size={18} bold={true} label={"Customer Ratings"}/>
                                </View>
                            </View>
                            <Review rightTextStyle={{
                                color: Colors.secondary,
                                fontSize: 12,
                                fontFamily: 'Oswald-Medium'
                            }} reviewTypeStyle={{
                                color: Colors.darkGray,
                                fontSize: 15,
                                fontFamily: 'Oswald-Medium'
                            }} barFillStyle={{
                                marginRight: -5,
                                height: 10
                            }} showCount={true} reviews={reviews} />
                            
                        </View>
                        )}
                        {route.params.status === 'loggedIn' && (
                        <View style={{alignItems: 'center', margin: 10}}>
                            <Button
                                iconColor={Colors.primary}
                                iconPostionRight={true}
                                backgroundColor={Colors.white}
                                textColor={Colors.primary}
                                useIcon={true}
                                title="Rate"
                                icon="long-arrow-right"
                                onPress={onPressRateItem}/>
                        </View>
                        )}
                        
                    </View>
                    }
                </ScrollView>
                
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
            <RBSheet
                height={200}
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                container: {
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    elevation: 10,
                    overflow: 'hidden',
                    paddingHorizontal: 20
                },
                wrapper: {
                    backgroundColor: "transparent",
                },
                draggableIcon: {
                    backgroundColor: Colors.secondary
                }
                }}
                >
                <View style={{marginTop: 10}}>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                    }}>
                        <View style={{marginBottom: 10}}>
                            <Title size={20} bold={true} label={"Rate " + route.params.item.name + ": "}/>
                        </View>
                        <Rating
                            type='custom'
                            ratingColor={Colors.red}
                            ratingBackgroundColor='#c8c7c8'
                            ratingCount={5}
                            imageSize={40}
                            minValue={0}
                            startingValue={0}
                            jumpValue={1}
                            showRating={false}
                            style={{ paddingHorizontal: 40 }}
                            onFinishRating={onRatingCompleted}/>
                    </View>  
                    <View style={{alignItems: 'center', margin: 20}}>
                        <View style={{width: '50%'}}>
                            <Button
                                iconPostionLeft={true}
                                backgroundColor={Colors.primary}
                                useIcon={true}
                                title="Submit"
                                icon="save"
                                onPress={onPressSubmit}/>
                        </View>
                    </View>
                </View>
            </RBSheet>
        </View>
    );
};

const styles = StyleSheet.create({});

export default ItemDetailScreen;

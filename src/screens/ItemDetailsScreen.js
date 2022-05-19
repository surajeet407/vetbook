import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    Animated,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import {useIsFocused, useLinkBuilder} from "@react-navigation/native";
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
import NumericInput from 'react-native-numeric-input'
import uuid from 'react-native-uuid';
import moment from 'moment';
import Star from "../reusable_elements/Star";
import i18n from '../util/i18n';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const ItemDetailScreen = ({navigation, route}) => {
    const isFocused = useIsFocused();



    const [goodCount,
        setGoodCount] = useState(0)
    const [averageCount,
        setAverageCount] = useState(0)
    const [belowAverageCount,
        setBelowAverageCount] = useState(0)
    const [poorCount,
        setPoorCount] = useState(0)
    const [exeCount,
        setExeCount] = useState(0)
    const [ratings, 
        setRatings] = useState([]);
    const [averageRating,
        setAverageRating] = useState(0)
    const [totalRatingCount,
        setTotalRatingCount] = useState(0)
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
                bottomOffset: 100,
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
                                    bottomOffset: 100,
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
                                bottomOffset: 100,
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
                            bottomOffset: 100,
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
                                            bottomOffset: 100,
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
                                            bottomOffset: 100,
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
                                        bottomOffset: 100,
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
            database()
                .ref('/users/' + phoneNo + "/cartItems")
                .once('value')
                .then(snapshot => {
                    if (snapshot.val()) {
                        setCartItemCount(snapshot.val().length)
                    } else {
                        setCartItemCount("0")
                    }
            })
        }

    }

    const handleCustomIndexSelect = (index) => {
        setCatIndex(index)
    }
    const getRatingAndReviews = () => {
        database()
            .ref("/reviews")
            .once('value')
            .then(snapshot => {
                if(snapshot.val()) {
                    let ratingsArray, ratingCount = 0, exeCount = 0, goodCount = 0, averageCount = 0, belowAverageCount = 0, poorCount = 0
                    for(let i = 0; i < snapshot.val().length; i++) {
                        if(snapshot.val()[i].itemId === route.params.item.id) {
                            if(snapshot.val()[i].userId === phoneNo) {
                                // console.log(snapshot.val()[i].ratings)
                               setRatingCountInd(snapshot.val()[i].ratings) 
                            }
                            ratingCount++
                            if(snapshot.val()[i].ratings === 5) {
                                exeCount++
                            } else if(snapshot.val()[i].ratings === 4) {
                                goodCount++
                            } else if(snapshot.val()[i].ratings === 3) {
                                averageCount++
                            } else if(snapshot.val()[i].ratings === 2) {
                                belowAverageCount++
                            } else if(snapshot.val()[i].ratings === 1) {
                                poorCount++
                            }
                        }
                    }
                    let averageRating = ((exeCount * 5) + (goodCount * 4) + (averageCount * 3) + (belowAverageCount * 2) + (poorCount * 1))
                    setExeCount(exeCount)
                    setGoodCount(goodCount)
                    setAverageCount(averageCount)
                    setBelowAverageCount(belowAverageCount)
                    setPoorCount(poorCount)
                    setAverageRating(averageRating / ratingCount)
                    setTotalRatingCount(ratingCount)
                    if(ratingCount > 0) {
                        ratingsArray = [
                            {
                                value: exeCount
                            }, {
                                value: goodCount
                            }, {
                                value: averageCount
                            }, {
                                value: belowAverageCount
                            }, {
                                value: poorCount
                            }
                        ]
                        setRatings(ratingsArray)
                    } else {
                        setRatings([])
                    }
                    
                } else {
                    setRatings([])
                }
        })
    }

    const onRatingCompleted = (ratingCountInd) => {
        setRatingCountInd(ratingCountInd)
        database()
            .ref("/reviews")
            .once('value')
            .then(snapshot => {
                if(snapshot.val()) {
                    let mainData = snapshot.val(), count = 0
                    for(let i = 0; i < mainData.length; i++) {
                        if(mainData[i].itemId === route.params.item.id && mainData[i].userId === phoneNo) {
                            count++
                            mainData[i].ratings = ratingCountInd
                            database()
                            .ref("/reviews").set(mainData).then(() => {
                                getRatingAndReviews()
                            })
                            break;
                        }
                    }
                    if(count === 0) {
                        let updatedReviewData = snapshot.val()
                        let data = {
                            userId: phoneNo,
                            id: uuid.v4(),
                            itemId: route.params.item.id,
                            reviews: "",
                            date: moment().format('yyyy-MM-DD').toString(),
                            ratings: ratingCountInd
                        }
                        updatedReviewData.push(data)
                        database()
                        .ref("/reviews").set(updatedReviewData).then(() => {
                            getRatingAndReviews()
                        })
                    }
                    
                } else {
                    let ratingsAr = [],
                    data = {
                        userId: phoneNo,
                        id: uuid.v4(),
                        itemId: route.params.item.id,
                        reviews: "",
                        date: moment().format('yyyy-MM-DD').toString(),
                        ratings: ratingCountInd
                    }
                    ratingsAr.push(data)
                    database()
                        .ref("/reviews").set(ratingsAr).then(() => {
                            getRatingAndReviews()
                    })
                }
            })
    }

    useEffect(() => {
        if (isFocused) {
            if(status === 'loggedIn') {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        setPhoneNo(phoneNo)
                        getRatingAndReviews()
                })
            }
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
                rightIconSize={35}
                rightIconColor={Colors.secondary}
                rightIconBackgroundColor={Colors.white}
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
                leftIconSize={35}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>
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
                    fontFamily: 'Oswald-Regular',
                    color: Colors.secondary
                }}
                    title={"₹ " + route.params.item.actualPrice + " /- ( " + ((parseInt(route.params.item.actualPrice) - parseInt(route.params.item.discountPrice)) / 100).toFixed(1) + " % off)"}
                    color={Colors.white}
                    ratio={0.5}
                    distance={120}
                    extent={0}>
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
                    tabsContainerStyle={{ height: 50 }}
                    tabStyle={{ backgroundColor: Colors.darkGray, borderColor: Colors.green, borderWidth: 0 }}
                    activeTabStyle={{ backgroundColor: Colors.green }}
                    tabTextStyle={{ color: '#444444', fontFamily: 'Oswald-Medium' }}
                    activeTabTextStyle={{ color: Colors.white }}
                    selectedIndex={catIndex}
                    onTabPress={handleCustomIndexSelect}
                />

                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {catIndex === 0? 
                        <View style={{marginTop: 10}}>
                            <View
                            style={{
                                marginBottom: 10
                            }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Animatable.View
                                    delay={300}
                                    animation={'fadeInLeft'}
                                    style={{
                                    borderRadius: 5,
                                    backgroundColor: Colors.gray,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 100,
                                    height: 60
                                }}>
                                    <Title color={Colors.primary} size={14} bold={true} label={'Price'}/>
                                    <Title color={Colors.secondary} size={15} bold={true} label={price + " /-"}/>
                                </Animatable.View>
                                <Animatable.View delay={200} animation={'fadeInLeft'} style={{
                                    marginLeft: 20
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
                                        color: Colors.white,
                                        fontSize: 20
                                    }}
                                        rightButtonBackgroundColor={Colors.green3}
                                        leftButtonBackgroundColor={Colors.red}/>
                                </Animatable.View>
                                <Animatable.View
                                    delay={100}
                                    animation={'fadeInLeft'}
                                    style={{
                                    borderRadius: 5,
                                    backgroundColor: Colors.gray,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 100,
                                    height: 60,
                                    marginLeft: 20
                                }}>
                                    <Title color={Colors.primary} size={14} bold={true} label={'Unit'}/>
                                    <Title color={Colors.secondary} size={15} bold={true} label={route.params.item.baseQuantity + " " + route.params.item.unit}/>
                                </Animatable.View>
                            </View>
                        </View>
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
                                <Title fontFamily={'PTSerif-Italic'} size={15} bold={true} label={item}/>
                        </Animatable.View>)}
                    </View>
                    :
                    <View style={{marginTop: 15, marginBottom: 10}}>
                        <View style={{alignItems: 'center'}}>
                            <View style={styles.reviewContainer}>
                                <Text style={styles.title}>Customer reviews</Text>
                                <View style={styles.totalWrap}>
                                    <View
                                        style={{
                                        flexDirection: "row",
                                        }}
                                    >
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                    </View>
                                    <Text style={{fontFamily: 'PTSerif-BoldItalic'}}>{averageRating} out of 5</Text>
                                </View>
                                <Text style={styles.amountText}>{totalRatingCount} customer ratings</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("ItemReview", 
                                    { 
                                    details: {
                                        status: status, 
                                        ratings: ratings, 
                                        ratingCountInd: ratingCountInd, 
                                        averageRating: averageRating, 
                                        totalRatingCount: totalRatingCount, 
                                        name: route.params.item.name, 
                                        itemId: route.params.item.id,
                                        exeCount: exeCount,
                                        goodCount: goodCount,
                                        averageCount: averageCount,
                                        belowAverageCount: belowAverageCount,
                                        poorCount: poorCount
                                    }}
                                    )} style={{marginTop: 10, marginBottom: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: Colors.white, paddingVertical: 10}}>
                                    <Title size={16} bold={true} label={'See all reviews'}/>
                                    <Icon
                                            type={Icons.AntDesign}
                                            style={{
                                            marginLeft: 10,
                                            marginTop: 5,
                                            fontSize: 16
                                        }}
                                            name={'arrowright'}
                                            color={Colors.secondary}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
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
                    height: 80,
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

const styles = StyleSheet.create({
    reviewContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        minWidth: "99%",
        elevation: 5,
      },
      title: {
        fontFamily: 'Oswald-Medium',
        fontSize: 25,
        color: "#323357",
        textAlign: "center"
      },
        totalWrap: {
          marginTop: 20,
          marginBottom: 5,
          backgroundColor: "#F5F8FF",
          borderRadius: 40,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 15,
          paddingVertical: 10
        },
        amountText: {
          fontSize: 18,
          color: Colors.secondary,
          textAlign: "center",
          fontFamily: 'Redressed-Regular'
        }
});

export default ItemDetailScreen;

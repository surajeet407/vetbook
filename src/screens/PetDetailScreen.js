import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    Animated,
    Dimensions,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Title from '../reusable_elements/Title';
import Button from '../reusable_elements/Button';
import Colors from '../util/Colors';
import * as Animatable from 'react-native-animatable';
import RNBounceable from "@freakycoder/react-native-bounceable";
import database from '@react-native-firebase/database';
import Share from 'react-native-share';
import PagerView from 'react-native-pager-view';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import i18n from '../util/i18n';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
const DOT_SIZE = 40;

const PetDetailScreen = ({navigation, route}) => {
    const animation = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions
        .get('screen')
        .width;
    const screenHeight = Dimensions
        .get('screen')
        .height;
    const scrollOffsetAnimatedValue = React
        .useRef(new Animated.Value(0))
        .current;
    const positionAnimatedValue = React
        .useRef(new Animated.Value(0))
        .current;
    let inputRange = [0, route.params.item.details.length];
    let translateX = Animated
        .add(scrollOffsetAnimatedValue, positionAnimatedValue)
        .interpolate({
            inputRange,
            outputRange: [
                0, route.params.item.details.length * screenWidth
            ]
        });
    const height = animation.interpolate({
        inputRange: [
            0, 300
        ],
        outputRange: [
            screenHeight / 2,
            200
        ],
        extrapolate: 'clamp'
    })
    const blur = animation.interpolate({
        inputRange: [
            0, 300
        ],
        outputRange: [
            0, 4
        ],
        extrapolate: 'clamp'
    })

    const onPressAdopt = () => {
        navigation.navigate("Confirm", {
            details: {
                ...route.params.item,
                serviceType: "Adopt"
            }
        });
    }
    useEffect(() => {
    }, [])
    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <View
                style={{
                position: 'absolute',
                top: 10,
                left: 20,
                width: '90%',
                height: 40,
                zIndex: 999,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon
                        name={'arrow-back-sharp'}
                        style={{
                        fontSize: 45
                    }}
                        color={'#fff'}/>
                </TouchableOpacity>
            </View>

            <ImageBackground
                ImageBackground
                blurRadius={5}
                source={require('../assets/images/background11.png')}
                style={{
                backgroundColor: route.params.item.color,
                borderBottomRightRadius: 200,
                overflow: 'hidden'
            }}>
                <AnimatedPagerView
                    initialPage={0}
                    style={{
                    width: "100%",
                    height: height
                }}
                    onPageScroll={Animated.event([
                    {
                        nativeEvent: {
                            offset: scrollOffsetAnimatedValue,
                            position: positionAnimatedValue
                        }
                    }
                ], {useNativeDriver: false})}>
                    {route
                        .params
                        .item
                        .details
                        .map((item, index) => {
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
                                borderBottomRightRadius: 200
                            }}
                                source={{
                                uri: route.params.item.image
                            }}/>)
                        })}
                </AnimatedPagerView>

                <ExpandingDot
                    data={route.params.item.details}
                    expandingDotWidth={30}
                    scrollX={translateX}
                    inActiveDotOpacity={0.6}
                    inActiveDotColor={Colors.appBackground}
                    activeDotColor={Colors.primary}
                    containerStyle={{
                    left: 5
                }}
                    dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 5
                }}/>
            </ImageBackground>

            <ScrollView
                style={{
                flex: 1
            }}
                scrollEventThrottle={16}
                onScroll={Animated.event([
                {
                    nativeEvent: {
                        contentOffset: {
                            y: animation
                        }
                    }
                }
            ], {useNativeDriver: false})}
                showsVerticalScrollIndicator={false}>
                <View
                    style={{
                    flex: 1,
                    backgroundColor: Colors.appBackground,
                    padding: 20,
                    justifyContent: 'space-around'
                }}>
                    <View>
                        <Animatable.Text
                            animation={'fadeInDown'}
                            style={{
                            letterSpacing: 2,
                            color: 'grey',
                            fontSize: 45,
                            fontFamily: 'Oswald-Medium'
                        }}>{route.params.item.name}</Animatable.Text>
                        <Title color="grey" size={18} bold={true} label="Location: USA"/>
                        <View
                            style={{
                            marginTop: 5,
                            width: '30%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Title color={'grey'} size={18} bold={true} label="Price:"/>
                            <View
                                style={{
                                alignItems: 'center',
                                marginLeft: 5,
                                paddingHorizontal: 5,
                                backgroundColor: Colors.primary,
                                borderRadius: 10
                            }}>
                                <Text
                                    style={{
                                    color: Colors.appBackground,
                                    fontSize: 18,
                                    fontFamily: 'Oswald-Medium'
                                }}>{route.params.item.cost}
                                    /-</Text>

                            </View>
                        </View>
                    </View>
                    <FlatList
                        style={{
                        marginTop: 20,
                        marginBottom: 20
                    }}
                        data={route.params.item.details}
                        scrollEnabled={true}
                        horizontal
                        pagingEnabled
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => (<View style={{
                        marginLeft: 10
                    }}/>)}
                        renderItem={({item, index, separators}) => (
                        <Animatable.View
                            delay={index * 100}
                            animation={'fadeInLeft'}
                            key={index}
                            style={{
                            borderRadius: 5,
                            backgroundColor: Colors.gray,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80
                        }}>
                            <Title color={Colors.primary} size={18} bold={true} label={item.key}/>
                            <Title color="grey" size={14} bold={true} label={item.value}/>
                        </Animatable.View>
                    )}/>
                    <View
                        style={{
                        backgroundColor: Colors.appBackground,
                        borderRadius: 10,
                        elevation: 5,
                        padding: 10
                    }}>
                        <View
                            style={{
                            width: 92,
                            borderBottomColor: Colors.primary,
                            borderBottomWidth: 1
                        }}>
                            <Title color={Colors.primary} size={25} bold={true} label="About Me"/>
                        </View>
                        <Title color={'grey'} size={15} bold={true} label={route.params.item.desc}/>
                    </View>
                </View>
            </ScrollView>
            <Animatable.View animation={'fadeInUp'}>
                <ImageBackground
                    blurRadius={0}
                    source={require('../assets/images/background6.png')}
                    style={{
                    overflow: 'hidden',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    height: 80,
                    backgroundColor: route.params.item.color,
                    borderTopLeftRadius: 50,
                    elevation: 10,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            backgroundColor={Colors.secondary}
                            iconPostionRight={true}
                            useIcon={true}
                            title="Adopt Me"
                            icon="long-arrow-right"
                            onPress={onPressAdopt}/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default PetDetailScreen;

import React, {useEffect, useRef, useState, useMemo} from 'react';
import {StyleSheet, View, Animated, Dimensions} from 'react-native';
import Colors from '../util/Colors';
import PagerView from 'react-native-pager-view';
import * as Animatable from 'react-native-animatable';
import RNBounceable from "@freakycoder/react-native-bounceable";
import database, {firebase} from '@react-native-firebase/database';
import Button from '../reusable_elements/Button';
import {SlidingBorder} from 'react-native-animated-pagination-dots';
import i18n from '../util/i18n';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const SpalshScreen = ({navigation}) => {
    const width = Dimensions
        .get('window')
        .width;
    const [onBoardingData,
        setOnBoardingData] = useState([])
    const [initialPage,
        setInitialPage] = useState(0)
    const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = useRef(new Animated.Value(0)).current;
    let inputRange = [0, 3];
    let translateX = Animated
        .add(scrollOffsetAnimatedValue, positionAnimatedValue)
        .interpolate({
            inputRange,
            outputRange: [
                0, 3 * width
            ]
        });
    const onPressNext = () => {
        navigation.navigate("Log");
    }
    const getData = () => {
        database()
            .ref('/splashScreenData')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setOnBoardingData(snapshot.val())
                }
            })

    }
    useEffect(() => {
        getData();
    }, []);
    return (
        <View style={styles.container}>
            <AnimatedPagerView
                initialPage={0}
                style={{
                width: '100%',
                height: '100%'
            }}
                onPageScroll={Animated.event([
                {
                    nativeEvent: {
                        offset: scrollOffsetAnimatedValue,
                        position: positionAnimatedValue
                    }
                }
            ], {
                listener: ({
                    nativeEvent: {
                        offset,
                        position
                    }
                }) => {
                    setInitialPage(position)
                },
                useNativeDriver: false
            })}>
                {onBoardingData.map((item, index) => {
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
                    return (

                        <View
                            key={index}
                            style={[
                            styles.splashView, {
                                backgroundColor: item.backgroundColor
                            }
                        ]}>
                            {item.showButton && (
                                <RNBounceable
                                    onPress={onPressNext}
                                    style={{
                                    zIndex: 999,
                                    position: 'absolute',
                                    right: 15
                                }}>
                                    <Button
                                        iconPostionRight={true}
                                        useIcon={true}
                                        title={item.buttonText}
                                        icon="long-arrow-right"
                                        onPress={() => navigation.navigate('Log')}/>
                                </RNBounceable>
                            )}
                            <Animatable.View animation={'zoomIn'} style={[styles.imageContainer]}>
                                <Animated.Image
                                    style={{
                                    flex: 1,
                                    aspectRatio: 1,
                                    transform: [{
                                            scale
                                        }]
                                }}
                                    source={{
                                    uri: item.image
                                }}/>
                            </Animatable.View>
                            <Animatable.View animation={'slideInUp'} View style={styles.quoteContainer}>
                                <Animated.Text
                                    style={[
                                    styles.quoteText, {
                                        transform: [{
                                                scale
                                            }]
                                    }
                                ]}>{item.quote}</Animated.Text>
                                <View style={styles.quoteByContainer}>
                                    <Animated.Text
                                        style={[
                                        styles.quoteBy, {
                                            transform: [{
                                                    scale
                                                }]
                                        }
                                    ]}>- {item.quoteBy}</Animated.Text>
                                </View>
                            </Animatable.View>
                        </View>
                    )
                })}
            </AnimatedPagerView>
            <SlidingBorder
                data={onBoardingData}
                expandingDotWidth={20}
                scrollX={translateX}
                inActiveDotOpacity={0.6}
                dotSize={24}
                borderPadding={5}
                inActiveDotColor={Colors.gray}
                activeDotColor={Colors.appBackground}
                slidingIndicatorStyle={{
                borderWidth: 2,
                borderColor: Colors.appBackground
            }}
                dotStyle={{
                backgroundColor: Colors.gray
            }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        height: "50%",
        overflow: 'hidden',
        alignItems: 'center',
        position: 'relative'
    },
    quoteContainer: {
        height: "30%"
    },
    buttonContainer: {
        margin: 20
    },
    quoteByContainer: {
        alignItems: 'flex-end'
    },
    buttonContainerWrapper: {
        flexDirection: "row",
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 50
    },
    splashView: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '100%'
    },
    quoteText: {
        fontSize: 30,
        color: 'white',
        textShadowColor: "grey",
        fontFamily: 'Oswald-SemiBold'
    },
    quoteBy: {
        fontSize: 30,
        color: Colors.dark,
        marginLeft: 8,
        fontFamily: 'Redressed-Regular'
    },
    buttonText: {
        fontSize: 18,
        marginRight: 10,
        color: Colors.appBackground,
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
});

export default SpalshScreen;
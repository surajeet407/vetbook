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
import {useIsFocused} from "@react-navigation/native";
import Icon, {Icons} from '../util/Icons';
import Title from '../reusable_elements/Title';
import Button from '../reusable_elements/Button';
import Colors from '../util/Colors';
import Toast from 'react-native-toast-message';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import {Rating} from 'react-native-ratings';
import Star from "../reusable_elements/Star";
import ProgressBar from "react-native-animated-progress";
import uuid from 'react-native-uuid';
import moment from 'moment';
import i18n from '../util/i18n';
import SectionBanner from '../reusable_elements/SectionBanner';

const ItemReviewScreen = ({navigation, route}) => {
    const isFocused = useIsFocused();
    const [goodCount,
        setGoodCount] = useState(route.params.details.goodCount)
    const [averageCount,
        setAverageCount] = useState(route.params.details.averageCount)
    const [belowAverageCount,
        setBelowAverageCount] = useState(route.params.details.belowAverageCount)
    const [poorCount,
        setPoorCount] = useState(route.params.details.poorCount)
    const [exeCount,
        setExeCount] = useState(route.params.details.exeCount)
    const [averageRating,
        setAverageRating] = useState(route.params.details.averageRating)
    const [totalRatingCount,
        setTotalRatingCount] = useState(route.params.details.totalRatingCount)
    const [ratings,
        setRatings] = useState(route.params.details.ratings);
    const [ratingCount,
        setRatingCount] = useState(route.params.details.ratingCountInd)
    const [phoneNo,
        setPhoneNo] = useState("");
    const [status,
        setStatus] = useState(route.params.details.status);

    const onRatingCompleted = (ratingCount) => {
        setRatingCount(ratingCount)
        database()
            .ref("/reviews")
            .once('value')
            .then(snapshot => {
                if (snapshot.val()) {
                    let mainData = snapshot.val(),
                        count = 0
                    for (let i = 0; i < mainData.length; i++) {
                        if (mainData[i].itemId === route.params.details.itemId && mainData[i].userId === phoneNo) {
                            count++ 
                            mainData[i].ratings = ratingCount
                            database()
                                .ref("/reviews")
                                .set(mainData)
                                .then(() => {
                                    getRatingAndReviews()
                                })
                            break;
                        }
                    }
                    if (count === 0) {
                        let updatedReviewData = snapshot.val()
                        let data = {
                            userId: phoneNo,
                            id: uuid.v4(),
                            itemId: route.params.details.itemId,
                            reviews: "",
                            date: moment()
                                .format('yyyy-MM-DD')
                                .toString(),
                            ratings: ratingCount
                        }
                        updatedReviewData.push(data)
                        database()
                            .ref("/reviews")
                            .set(updatedReviewData)
                            .then(() => {
                                getRatingAndReviews()
                            })
                    }

                } else {
                    let ratingsAr = [],
                        data = {
                            userId: phoneNo,
                            id: uuid.v4(),
                            itemId: route.params.details.itemId,
                            reviews: "",
                            date: moment()
                                .format('yyyy-MM-DD')
                                .toString(),
                            ratings: ratingCount
                        }
                    ratingsAr.push(data)
                    database()
                        .ref("/reviews")
                        .set(ratingsAr)
                        .then(() => {
                            getRatingAndReviews()
                        })
                }
            })
    }

    const getRatingAndReviews = () => {
        database()
            .ref("/reviews")
            .once('value')
            .then(snapshot => {
                if (snapshot.val()) {
                    let ratingsArray,
                        ratingCount = 0,
                        exeCount = 0,
                        goodCount = 0,
                        averageCount = 0,
                        belowAverageCount = 0,
                        poorCount = 0
                    for (let i = 0; i < snapshot.val().length; i++) {
                        if (snapshot.val()[i].itemId === route.params.details.itemId) {
                            if (snapshot.val()[i].userId === phoneNo) {
                                setRatingCount(snapshot.val()[i].ratings)
                            }
                            ratingCount++ 
                            if (snapshot.val()[i].ratings === 5) {
                                exeCount++
                            } else if (snapshot.val()[i].ratings === 4) {
                                goodCount++
                            } else if (snapshot.val()[i].ratings === 3) {
                                averageCount++
                            } else if (snapshot.val()[i].ratings === 2) {
                                belowAverageCount++
                            } else if (snapshot.val()[i].ratings === 1) {
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
                    if (ratingCount > 0) {
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

    useEffect(() => {
        if (isFocused) {
            if (status === 'loggedIn') {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        setPhoneNo(phoneNo)
                    })
            }
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
                rightIconName={'close'}
                rightIconBorderRadius={40}
                rightIconHeight={40}
                rightIconWidth={40}
                rightIconSize={35}
                rightIconColor={Colors.appBackground}
                rightIconBackgroundColor={'#d35500'}
                onPressRight={() => navigation.goBack()}
                showBadgeOverRightIcon={false}
                badgeBackgroundColor={Colors.primary}
                badgeColor={Colors.appBackground}
                badgeBorderColor={Colors.appBackground}
                badgeText={0}
                badgeSize={25}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={"Ratings & reviews"}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={false}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={35}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>
            <View
                style={{
                flex: 1,
                paddingHorizontal: 20,
                backgroundColor: Colors.appBackground,
                justifyContent: 'space-around'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <View style={{}}>

                        <View
                            style={{
                            alignItems: 'center'
                        }}>
                            <View style={styles.reviewContainer}>
                                <View style={styles.totalWrap}>
                                    <View
                                        style={{
                                        flexDirection: "row"
                                    }}>
                                        <Star/>
                                        <Star/>
                                        <Star/>
                                        <Star/>
                                        <Star/>
                                    </View>
                                    <Text style={{fontFamily: 'PTSerif-BoldItalic'}}>{averageRating} out of 5</Text>
                                </View>
                                <Text style={styles.amountText}>{totalRatingCount} customer ratings</Text>
                                {ratings.length > 0
                                    ? <View>
                                        <View>
                                            <View style={{margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={"Excellent"}/>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={exeCount}/>
                                            </View>
                                            <ProgressBar progress={exeCount} height={5} backgroundColor="green" />
                                        </View>
                                        <View>
                                            <View style={{margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={"Good"}/>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={goodCount}/>
                                            </View>
                                            <ProgressBar progress={goodCount} height={5} backgroundColor="#5397d4" />
                                        </View>
                                        <View>
                                            <View style={{margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={"Average"}/>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={averageCount}/>
                                            </View>
                                            <ProgressBar progress={averageCount} height={5} backgroundColor="#6ecce1" />
                                        </View>
                                        <View>
                                            <View style={{margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={"Below Average"}/>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={belowAverageCount}/>
                                            </View>
                                            <ProgressBar progress={belowAverageCount} height={5} backgroundColor="#f6c969" />
                                        </View>
                                        <View>
                                            <View style={{margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={"Poor"}/>
                                                <Title
                                                    fontFamily={'Redressed-Regular'}
                                                    color={Colors.secondary}
                                                    size={15}
                                                    bold={true}
                                                    label={poorCount}/>
                                            </View>
                                            <ProgressBar progress={poorCount} height={5} backgroundColor="#e66858" />
                                        </View>
                                    </View>
                                    : <View
                                        style={{
                                        marginBottom: 10,
                                        alignItems: 'center'
                                    }}>
                                        <Title
                                            fontFamily={'Redressed-Regular'}
                                            color={Colors.secondary}
                                            size={15}
                                            bold={true}
                                            label={"There is no ratings on this item..., be the first to rate"}/>
                                    </View>
}
                            </View>
                        </View>
                        {status === 'loggedIn'
                            ? <View
                                    style={{
                                    marginTop: 10,
                                    marginBottom: 10
                                }}>
                                    <View
                                        style={{
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <View
                                            style={{
                                            marginBottom: 10
                                        }}>
                                            <Title size={20} bold={true} label={"Rate " + route.params.details.name + ": "}/>
                                        </View>
                                        <Rating
                                            type='custom'
                                            ratingColor={Colors.green3}
                                            ratingBackgroundColor={Colors.darkGray}
                                            ratingCount={5}
                                            imageSize={25}
                                            minValue={0}
                                            startingValue={ratingCount}
                                            jumpValue={1}
                                            showRating={false}
                                            style={{
                                        }}
                                            onFinishRating={onRatingCompleted}/>
                                    </View>
                                </View>
                            : <View
                                style={{
                                alignItems: 'center',
                                margin: 10
                            }}>
                                <Title size={18} bold={true} label={"Please Login to rate..."}/>
                            </View>
                            }
                        <View style={{marginTop: 10}}>
                            <SectionBanner 
                                title={'User reviews'} 
                                borderWidth={80} 
                                fontSize={16}
                                borderColor={Colors.white}
                                titleColor={Colors.white}/>
                            <View style={{marginTop: 20, backgroundColor: Colors.white, elevation: 5, padding: 10, margin: 2}}>
                                <View style={{flexDirection: 'row',  justifyContent: 'space-between'}}>
                                    <Title color={Colors.secondary} size={15} bold={true} label={"Suro Jeet (1 day Ago)"}/>
                                    <Title fontFamily={'Redressed-Regular'} color={Colors.secondary} size={15} bold={true} label={"Helpful?"}/>
                                </View>
                                <View style={{width: '100%', flexDirection: 'row',  justifyContent: 'space-between'}}>
                                    <View style={{width: '80%'}}>
                                        <Title color={Colors.darkGray} size={14} bold={true} label={"Lorem ipsum dolor sit amet , Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet..."}/>
                                    </View>
                                    <View  style={{width: '10%', alignItems: 'center', zIndex: 999, backgroundColor: Colors.white}}>
                                        <View  style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View>
                                                <Icon
                                                    type={Icons.Foundation}
                                                    style={{
                                                    marginRight: 10,
                                                    marginTop: 5,
                                                    fontSize: 18
                                                }}
                                                    name={'like'}
                                                    color={Colors.green3}/>
                                                    <Title color={Colors.secondary} size={10} bold={true} label={"12"}/>
                                            </View>
                                            <View>
                                                <Icon
                                                    type={Icons.Foundation}
                                                    style={{
                                                    marginRight: 10,
                                                    marginTop: 5,
                                                    fontSize: 18
                                                }}
                                                    name={'dislike'}
                                                    color={Colors.red}/>
                                                    <Title color={Colors.secondary} size={10} bold={true} label={"0"}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                            </View>
                            
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewContainer: {
        backgroundColor: Colors.white,
        minWidth: "100%"
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
        color: Colors.darkGray,
        textAlign: "center",
        fontFamily: 'Redressed-Regular'
    }
});

export default ItemReviewScreen;

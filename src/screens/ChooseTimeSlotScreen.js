import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import Title from '../reusable_elements/Title';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import Colors from '../util/Colors';
import Icon, {Icons} from '../util/Icons';
import RNMasonryScroll from "react-native-masonry-scrollview";
import i18n from '../util/i18n';

const ChooseTimeSlotScreen = ({navigation, route}) => {
    let date = {};
    let timeSlots = [
        {
            "startTime": "09:00 AM",
            "endTime": "11:00 PM"
        }, {
            "startTime": "12:00 PM",
            "endTime": "02:00 PM"
        }, {
            "startTime": "03:00 PM",
            "endTime": "05:00 PM"
        }, {
            "startTime": "06:00 PM",
            "endTime": "08:00 PM"
        }
    ]
    date[moment().format('yyyy-MM-DD')] = {
        selected: true,
        marked: true,
        color: Colors.primary
    };
    const [markedDates,
        setMarkedDates] = useState(date);
    const [minDate,
        setMinDate] = useState(moment().format('yyyy-MM-DD').toString());
    const [maxDate,
        setMaxDate] = useState(moment().add(1, 'months').calendar().toString());
    const [userOption,
        setUserOption] = useState("");

    const _validateShots = (cond, navTo, isTotal, total, arg) => {
        if (cond) {
            if (userOption === "") {
                Toast.show({
                    type: 'customToast',
                    text1: "Select one slot",
                    position: 'bottom',
                    visibilityTime: 1500,
                    bottomOffset: 110,
                    props: {
                        backgroundColor: '#bb2423'
                    }
                });
                return;
            } else {
                navigation.navigate(navTo, {details: arg});
            }
        } else {
            navigation.navigate(navTo, {details: arg});
        }
    }

    const onPressNext = () => {
        let date = Object.keys(markedDates)[0],
            timeSlot = "",
            routeParams;
        if (userOption !== "") {
            timeSlot = timeSlots[userOption];
        }
        routeParams = {
            ...route.params.details,
            selectedDate: date,
            timeSlot: timeSlot
        }
        if (route.params.details.serviceType === "Relocation") {
            _validateShots(false, 'RelocationDetails', false, "", routeParams)
        } else {
            _validateShots(true, 'Confirm', false, "", routeParams)
        }
    }
    useEffect(() => {
        if (route.params.details.serviceType === 'Relocation') {
            let date = {};
            date[moment().add(2, 'days').format('yyyy-MM-DD')] = {
                selected: true,
                marked: true,
                color: Colors.primary
            };
            setMarkedDates(date);
            setMinDate(moment().add(2, 'days').format('yyyy-MM-DD').toString())
        }
    }, [])
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
                subHeaderText="Schedule visit date & time ..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={"Time Slot"}
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
                backgroundColor: Colors.appBackground,
                padding: 15,
                flex: 1,
                width: '100%'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <Animatable.View animation={'fadeInDown'}>
                        <Calendar
                            minDate={minDate}
                            maxDate={maxDate}
                            markedDates={markedDates}
                            theme={{
                            backgroundColor: Colors.appBackground,
                            calendarBackground: Colors.appBackground,
                            textSectionTitleColor: '#b6c1cd',
                            textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: Colors.primary,
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: Colors.primary,
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#00adf5',
                            selectedDotColor: Colors.primary,
                            arrowColor: Colors.primary,
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: Colors.primary,
                            indicatorColor: Colors.primary,
                            textDayFontFamily: 'monospace',
                            textMonthFontFamily: 'monospace',
                            textDayHeaderFontFamily: 'monospace',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16
                        }}
                            onDayPress={day => {
                            let markedDates = {};
                            markedDates[day.dateString] = {
                                selected: true,
                                marked: true,
                                color: Colors.primary
                            };
                            setMarkedDates(markedDates)
                        }}
                            enableSwipeMonths={true}/>
                    </Animatable.View>
                    {route.params.details.serviceType !== "Relocation"
                        ? <View>
                                <View
                                    style={{
                                    marginTop: 30,
                                    justifyContent: 'space-around',
                                    flexDirection: 'row'
                                }}>
                                    <RNMasonryScroll
                                        columns={2}
                                        oddColumnStyle={{
                                        marginTop: 0
                                    }}
                                        horizontal={false}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}>
                                        {timeSlots.map((item, index) => <Animatable.View
                                            style={{
                                            margin: 5
                                        }}
                                            key={index}
                                            delay={100 * index}
                                            animation={'slideInLeft'}>
                                            <TouchableOpacity
                                                style={{
                                                alignItems: 'center',
                                                backgroundColor: userOption === index
                                                    ? Colors.secondary
                                                    : Colors.darkGray,
                                                borderRadius: 10,
                                                padding: 10
                                            }}
                                                onPress={() => setUserOption(index)}>
                                                <Title
                                                    size={18}
                                                    label={item.startTime + " - " + item.endTime}
                                                    bold={true}
                                                    color={userOption === index? Colors.white:Colors.mediumDark}/>
                                                <Title size={12} label={"Available"} bold={true} color={userOption === index? Colors.primary:Colors.white}/>
                                            </TouchableOpacity>
                                        </Animatable.View>)}
                                    </RNMasonryScroll>
                                </View>
                            </View>
                        : <View
                            style={{
                            marginTop: 20,
                            justifyContent: 'space-around',
                            flexDirection: 'row',
                            elevation: 4
                        }}>
                            <Animatable.View animation={'slideInLeft'}>
                                <View
                                    style={{
                                    alignItems: 'center',
                                    backgroundColor: Colors.primary,
                                    borderRadius: 10,
                                    width: 200,
                                    paddingVertical: 10
                                }}>
                                    <Title size={18} label='Selected Date' bold={true} color={Colors.white}/>
                                    <Title
                                        size={25}
                                        label={Object.keys(markedDates)[0]}
                                        bold={true}
                                        color={Colors.secondary}/>
                                </View>
                            </Animatable.View>
                        </View>
}
                </ScrollView>
            </View>
            <Animatable.View delay={100} animation={'slideInUp'}>
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
                            backgroundColor={Colors.primary}
                            iconPostionRight={true}
                            useIcon={true}
                            title="Next"
                            icon="long-arrow-right"
                            onPress={onPressNext}/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    selected: {
        backgroundColor: Colors.primary
    },
    unselected: {
        backgroundColor: Colors.gray
    }
});

export default ChooseTimeSlotScreen;

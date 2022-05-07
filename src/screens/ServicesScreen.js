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
    ImageBackground
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Colors from '../util/Colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Title from '../reusable_elements/Title';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import TrackComponent from '../reusable_elements/TrackComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../util/i18n';

const width = Dimensions
    .get('screen')
    .width - 50;

const ServicesScreen = ({navigation, route}) => {
    const [status,
        setStatus] = useState(route.params.status);
    const [showTrackComponent,
        setShowTrackComponent] = useState(true)
    const [pastServices,
        setPastServices] = useState([])
    const reOrder = () => {}
    const getData = () => {
        if (status === 'loggedIn') {
            AsyncStorage
                .getItem('phoneNo')
                .then((phoneNo, msg) => {
                    if (phoneNo) {
                        database()
                            .ref("/users/" + phoneNo + "/services")
                            .on('value', snapshot => {
                                console.log(snapshot.val())
                                if (snapshot.val()) {
                                    setPastServices(snapshot.val());
                                    setShowTrackComponent(true)
                                }
                            })
                    }
                })

        } else {
            AsyncStorage
                .getItem("anonymusService")
                .then((data) => {
                    if (data && JSON.parse(data).length > 0) {
                        setPastServices(JSON.parse(data));
                        setShowTrackComponent(true)
                    }
                });
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
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText="Swipe right to reorder..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={'Previous Services'}
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
              {showTrackComponent && (<TrackComponent onPress={() => navigation.navigate("TrackOrder")}/>)}
            <View
                style={{
                marginBottom: showTrackComponent
                    ? 60
                    : 0,
                marginTop: 10,
                flex: 1,
                alignItems: 'center',
                backgroundColor: Colors.appBackground,
                width: '100%'
            }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={pastServices}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => (<View style={{
                    marginBottom: 5
                }}/>)}
                    renderItem={({item, index}) => {
                    return (
                        <View
                            style={{
                            width: Dimensions
                                .get('screen')
                                .width - 30
                        }}>
                            <View
                                key={index}
                                style={{
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 5,
                                paddingVertical: 10,
                                marginVertical: 5
                            }}>
                                <View
                                    style={{
                                    padding: 5
                                }}>
                                    <Title
                                        size={20}
                                        label={(index + 1) + '. Details ()'}
                                        bold={true}
                                        color={Colors.primary}/>
                                </View>
                            </View>
                        </View>
                    )
                }}/>
            </View>
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

export default ServicesScreen;

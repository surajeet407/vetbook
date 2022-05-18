import React, {useState, useRef, useEffect} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    Image,
    Dimensions
} from 'react-native';
import Colors from '../util/Colors';
import Title from '../reusable_elements/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import RNBounceable from "@freakycoder/react-native-bounceable";
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import database from '@react-native-firebase/database';
import i18n from '../util/i18n';

const NotificationScreen = ({navigation}) => {
    const [details,
        setDetails] = useState([])

    const onPressDelete = (index) => {
        let data = details;
        data.splice(index, 1);
        setDetails(data);
    }
    const getData = () => {
        database()
            .ref('/users/8900162177/notifications')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setDetails(snapshot.val())
                }
            })
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
                rightIconName={'close'}
                rightIconSize={35}
                rightIconColor={Colors.appBackground}
                rightIconBackgroundColor={Colors.primary}
                onPressRight={() => navigation.goBack()}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={60}
                headerText={'Notifications'}
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
                marginTop: 20,
                padding: 10,
                flex: 1,
                alignItems: 'flex-start'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {details.map((item, index) => <ImageBackground
                        key={index}
                        blurRadius={5}
                        source={require('../assets/images/background11.png')}
                        style={{
                        backgroundColor: Colors.appBackground,
                        marginHorizontal: 10,
                        marginVertical: 4,
                        elevation: 4,
                        marginBottom: 10,
                        width: Dimensions
                            .get("screen")
                            .width - 40
                    }}>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            style={{
                            borderLeftWidth: 2,
                            borderLeftColor: Colors.primary
                        }}>
                            <RNBounceable
                                onPress={() => navigation.navigate("TrackOrder", {details: {fromScreen: 'Services'}})}
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 10
                            }}>
                                <View
                                    style={{
                                    alignItems: 'center',
                                    backgroundColor: Colors.appBackground,
                                    elevation: 2,
                                    borderRadius: 50,
                                    borderColor: Colors.gray,
                                    borderWidth: 1
                                }}>
                                    <Image
                                        source={{
                                        uri: item.image
                                    }}
                                        style={{
                                        borderRadius: 50,
                                        width: 30,
                                        height: 30
                                    }}/>
                                </View>
                                <View
                                    style={{
                                    marginLeft: 10,
                                    alignItems: 'flex-start'
                                }}>
                                    <Title size={15} label={item.title} bold={true} color={Colors.darkGray}/>
                                    <Title size={12} label={item.desc} bold={true} color={Colors.secondary}/>
                                </View>
                            </RNBounceable>
                        </Animatable.View>
                        <View
                            style={{
                            position: 'absolute',
                            right: 10,
                            top: "30%",
                            backgroundColor: Colors.primary,
                            padding: 2,
                            borderRadius: 20,
                            elevation: 2,
                            zIndex: 999
                        }}>
                            <Icon
                                onPress={() => onPressDelete(index)}
                                type={Icons.AntDesign}
                                name={'close'}
                                size={20}
                                color={Colors.appBackground}/>
                        </View>
                    </ImageBackground>)}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default NotificationScreen;

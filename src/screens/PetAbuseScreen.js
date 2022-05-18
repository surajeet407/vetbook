import React, {useRef, useState} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Animated,
    Text,
    KeyboardAvoidingView,
    ImageBackground,
    Dimensions
} from 'react-native';

import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Title from '../reusable_elements/Title';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';
import PagerView from 'react-native-pager-view';
import {ExpandingDot} from 'react-native-animated-pagination-dots';

const data = [
    {
        "title": "What is animal abuse?",
        "desc": "Online sale of Pets in India is banned in India according to The Prevention of C" +
                "ruelty to Animals Act 1960. They elaborate on the various terms and conditions u" +
                "nder which a person or organisation will be permitted to set up a pet shop and c" +
                "onduct the buying and selling of pet animals. Some of these rules include regist" +
                "ering the shop with the State Animal Welfare Board, ensuring comfortable and app" +
                "ropriate infrastructure for all the animals housed, veterinary care and health o" +
                "f the animals, among other things. Under no condition, buying and selling of pet" +
                " animals is legal."
    }, {
        "title": "Online Fraud",
        "desc": "Most of the pets are being sold online illegally which leads to fraud. They are " +
                "bred in poor conditions and even sold without vaccination which is dangerous not" +
                " only to the life pet but also the person buying. If you faced such situation, d" +
                "on't be afraid to report the incident to Animal Welfare Board of India or Minist" +
                "ry of Environment, Forest and Climate Change. Your small step can prevent illega" +
                "l trade of animals online. You can report to us if you are unware of the rules."
    }, {
        "title": "Neglect",
        "desc": "Failure to provide basic needs for an animal, makes up the vast majority of crue" +
                "lty cases that animal control officers or animal resque volunteers respond to. N" +
                "eglect often includes hoarding, veterinary care, undernourishment or lack of she" +
                "lter, abandonment and tethering, as well as other forms of abuse or cruelty."
    }, {
        "title": "Direct abuse",
        "desc": "It can be very disturbing to see animal being beaten by someone, but it is impor" +
                "tant not to turn away. It is crucial to involve law enforcement quickly, as abus" +
                "e toward animals is often part of a larger pattern of violence that can include " +
                "people as well. You can report to Animal Welfare Board of India or Ministry of E" +
                "nvironment, Forest and Climate Change."
    }, {
        "title": "Hoarding",
        "desc": "Hoarding behavior often abuses animals. Sufferers of a hoarding disorder may imp" +
                "ose critical neglect on animals by housing far more than they are able to suffic" +
                "iently take care of. Contact your local animal control service if you find out a" +
                "bout animal hoarding. Some animal hoarding situations can be more difficult than" +
                " others to solve."
    }, {
        "title": "Lack of veterinary care",
        "desc": "In extreme cold or heat or any other weather situations, temperatures can be dea" +
                "dly. It can seem unnecessary to report neglect for inadequate sheltering, but co" +
                "nditions can change adversely very fast, causing suffering or even death of the " +
                "animal. Contact a local animal control service immediately if you see an animal " +
                "in inadequate shelter and document the incident with a phone camera if possible."
    }, {
        "title": "Abandonment",
        "desc": "A surprising number of animals die every year when people move out of their resi" +
                "dences and simply leave the animals behind. Sometimes an abandoned dog is barkin" +
                "g or cat is howling can alert the neighbors, but it is wise to keep an eye on a " +
                "recently vacated home, especially if the former residents moved suddenly. Compan" +
                "ion animals kept in cages or tanks are often overlooked upon a resident is sudde" +
                "n passing and may suffer neglect as well. If you find or know of abandoned anima" +
                "ls, contact your local animal control service immediately."
    }, {
        "title": "Pets left in cars",
        "desc": "Time is of the great essence when reporting pets or animals left in parked vehic" +
                "les. Even if the outside temperature seems cool, these animals could be minutes " +
                "away from irreversible organ damage or sudden death. If you cannot locate the ow" +
                "ner or driver immediately, don’t be afraid and call local authorities, detailing" +
                " the location, make, model and license plate number of the vehicle the animal is" +
                " inside."
    }, {
        "title": "Beating and physical abuse",
        "desc": "If you witness direct physical violence or abuse to an animal, report the incide" +
                "nt immediately to your local authorities. If you decide to intervene, use your b" +
                "est judgement and do not get physically involved in the situation; always rememb" +
                "er, even well-intentioned actions could compromise the process of investigation " +
                "into suspected abuse."
    }, {
        "title": "Animal fighting and organized cruelty",
        "desc": "Organized cruelty, such as cockfighting, dogfighting and other bloodsports, is i" +
                "llegal in India and is linked to other criminal activities such as human violenc" +
                "e, gambling and drug distribution. If you hear about or witness such events, imm" +
                "ediately report them to the local authorities."
    }
]

const PetAbuseScreen = ({navigation}) => {
    const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
    const width = Dimensions
        .get('window')
        .width;
    const [initialPage,
        setInitialPage] = useState(0)
    const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = useRef(new Animated.Value(0)).current;
    let inputRange = [0, data.length];
    let translateX = Animated
        .add(scrollOffsetAnimatedValue, positionAnimatedValue)
        .interpolate({
            inputRange,
            outputRange: [
                0, data.length * width
            ]
        });
    return (
        <KeyboardAvoidingView
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
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'absolute'}
                headerHeight={60}
                headerText={'Report Abuse to Animals'}
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
                marginBottom: 80,
                marginTop: 20,
                paddingVertical: 20,
                alignItems: 'center'
            }}>
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
                ], {useNativeDriver: false})}>
                    {data.map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={{
                                padding: 15
                            }}>
                                <View
                                    style={{
                                    marginTop: 20,
                                    borderBottomWidth: 2,
                                    borderBottomColor: Colors.primary,
                                    padding: 10
                                }}>
                                    <Title label={item.title} color={Colors.secondary} size={20}/>
                                </View>
                                <Animatable.View
                                    animation={'zoomIn'}
                                    style={{
                                    marginTop: 20,
                                    padding: 15,
                                    backgroundColor: Colors.appBackground,
                                    elevation: 5
                                }}>
                                    <Title label={item.desc} color={Colors.darkGray} size={16}/>
                                </Animatable.View>
                            </View>
                        )
                    })}
                </AnimatedPagerView>
                <ExpandingDot
                    data={data}
                    expandingDotWidth={30}
                    scrollX={translateX}
                    inActiveDotOpacity={0.6}
                    inActiveDotColor={Colors.darkGray}
                    activeDotColor={Colors.primary}
                    containerStyle={{
                    bottom: 30
                }}
                    dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 5
                }}/>
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
                            onPress={() => navigation.navigate('FillUpAbuseDetails')}
                            backgroundColor={Colors.primary}
                            iconPostionRight={true}
                            useIcon={true}
                            title="Report Abuse"
                            icon="long-arrow-right"/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({});

export default PetAbuseScreen;

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
    Keyboard
} from 'react-native';

import Colors from '../util/Colors';
import FormElement from '../reusable_elements/FormElement';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';

const PetGroomingScreen = ({navigation, route}) => {
    const petCats = ['Dog', 'Cat'];
    const petSize = ['Small', 'Medium', 'Large'];
    const howAggressive = ['Low', 'Normal', 'High'];
    const genderItem = ['Male', 'Female'];
    const [gender,
        setGender] = useState("");
    const [breed,
        setBreed] = useState("");
    const [petType,
        setPetType] = useState("");
    const [size,
        setSize] = useState("");
    const [aggressive,
        setAggressive] = useState("");

    const onPressProceed = () => {
        let text = ""
        if (petType === "") {
            text = "Please select type"
        } else if (breed === "") {
            text = "Please enter breed of your pet";
        } else if (size === "") {
            text = "Please select size";
        } else if (aggressive === "") {
            text = "Please select aggressiveness";
        } else if (gender === "") {
            text = "Please select gender";
        }

        if (petType !== "" && size !== "" && aggressive !== "" && breed !== "" && gender !== "") {
            navigation.navigate('ChooseTimeSlot', {
                details: {
                    ...route.params.item,
                    serviceType: "Grooming",
                    petDetails: [
                        {
                            name: "Type of your Pet",
                            value: petType
                        }, {
                            name: "Breed",
                            value: breed
                        }, {
                            name: "Size",
                            value: size
                        }, {
                            name: "Gender",
                            value: gender
                        }, {
                            name: "Aggressiveness",
                            value: aggressive
                        }
                    ]
                }
            })
        } else {
            Keyboard.dismiss();
            Toast.show({
                type: 'customToast',
                text1: text,
                position: 'top',
                visibilityTime: 1500,
                topOffset: 15,
                props: {
                    backgroundColor: Colors.error_toast_color
                }
            });
        }

    }
    const onPressPetSize = (index) => {
        setSize(petSize[index]);
    }
    const onPressPetAggressive = (index) => {
        setAggressive(howAggressive[index]);
    }
    const onPressPetGender = (index) => {
        setGender(genderItem[index]);
    }
    const onPressPetType = (index) => {
        setPetType(petCats[index]);
    }
    return (
        <KeyboardAvoidingView
            behavior='height'
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
                subHeaderText="Add uour pet details for grooming..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={route.params.item.title}
                headerTextSize={25}
                headerTextColor={route.params.item.backgroundColor}
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
                marginBottom: 80,
                paddingHorizontal: 20,
                marginTop: 10,
                flex: 1,
                width: '100%'
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <FormElement
                            required={true}
                            onPressToken={onPressPetType}
                            tokens={petCats}
                            showLabel={true}
                            title='Type of your Pet'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onChangeText={(val) => setBreed(val)}
                            inputValue={breed}
                            showLabel={false}
                            title='Breed of your Pet'
                            type='input'
                            labelColor={Colors.secondary}
                            keyboardType='default'
                            maxLength={10}/>
                        <FormElement
                            onPressToken={onPressPetSize}
                            required={true}
                            tokens={petSize}
                            showLabel={true}
                            title='Size of your Pet'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onPressToken={onPressPetAggressive}
                            required={true}
                            tokens={howAggressive}
                            showLabel={true}
                            title='How aggressive is your Pet'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onPressToken={onPressPetGender}
                            required={true}
                            tokens={genderItem}
                            showLabel={true}
                            title='Gender of your Pet'
                            type='token'
                            labelColor={Colors.secondary}/>
                    </View>
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
                    backgroundColor: route.params.item.backgroundColor,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            onPress={onPressProceed}
                            backgroundColor={Colors.secondary}
                            iconPostionRight={true}
                            useIcon={true}
                            icon='long-arrow-right'
                            title="Proceed"/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingVertical: 15,
        width: '100%',
        color: Colors.mediumDark,
        fontSize: 20
    },
    containerStyle: {
        backgroundColor: 'white',
        width: '90%',
        left: '5%',
        marginTop: 10,
        height: '90%',
        borderRadius: 20
    }
});

export default PetGroomingScreen;

import React, {useRef, useState} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Animated,
    Text,
    KeyboardAvoidingView,
    ImageBackground
} from 'react-native';

import Colors from '../util/Colors';
import FormElement from '../reusable_elements/FormElement';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';

const BloodTestScreen = ({navigation, route}) => {
    const petCats = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Cattle'];
    const petSize = ['Small', 'Medium', 'Large'];
    const petGender = ['Male', 'Female'];
    const [size,
        setSize] = useState("");
    const [petType,
        setPetType] = useState("");
    const [gender,
        setGender] = useState("");
    const [breed,
        setBreed] = useState("");
    const [petMed,
        setPetMed] = useState("");

    const onPressScheduleTest = () => {
        let text = ""
        if (petType === "") {
            text = "Please select type of your pet";
        } else if (breed === "") {
            text = "Please enter breed of your pet";
        } else if (size === "") {
            text = "Please select size of your pet"
        } else if (gender === "") {
            text = "Please select gender";
        } else if (petMed === "") {
            text = "Please enter pet's medical problem";
        }

        if (size !== "" && petType !== "" && gender !== "" && breed !== "" && petMed !== "") {
            navigation.navigate('ChooseTimeSlot', {
                details: {
                    ...route.params.item,
                    serviceType: "BloodTest",
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
                            name: "Pet's medical problem",
                            value: petMed
                        }
                    ]
                }
            })
        } else {
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
    const onPressPetType = (index) => {
        setPetType(petCats[index]);
    }
    const onPressPetSize = (index) => {
        setSize(petSize[index]);
    }
    const onPressPetGender = (index) => {
        setGender(petGender[index]);
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
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={60}
                headerText={route.params.item.title}
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
                paddingHorizontal: 10,
                flex: 1,
                width: '100%'
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        padding: 10
                    }}>
                        <FormElement
                            onPressToken={onPressPetType}
                            required={true}
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
                            onPressToken={onPressPetGender}
                            required={true}
                            tokens={petGender}
                            showLabel={true}
                            title='Gender of your Pet'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onChangeText={(val) => setPetMed(val)}
                            inputValue={petMed}
                            required={true}
                            showLabel={false}
                            labelColor={Colors.secondary}
                            title="Pet's medical problem"
                            type='input'
                            multiline={true}
                            numberOfLines={5}
                            keyboardType='default'
                            maxLength={50}/>
                    </View>
                </ScrollView>
            </View>
            <Animatable.View delay={100} animation={'slideInUp'}>
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
                    backgroundColor: Colors.primary,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            onPress={onPressScheduleTest}
                            backgroundColor={Colors.secondary}
                            iconPostionRight={true}
                            useIcon={true}
                            icon='long-arrow-right'
                            title="Schedule a test"/>
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

export default BloodTestScreen;

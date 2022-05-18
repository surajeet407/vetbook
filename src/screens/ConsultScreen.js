import React, {useRef, useState} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Animated,
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

const ConsultScreen = ({navigation, route}) => {
    const petCats = [
        'Dog',
        'Cat',
        'Bird',
        'Rabbit',
        'Cattle',
        'Sheep',
        'Goat',
        'Other'
    ];
    const petAge = ['Upto 6 Months', '6 - 18 Months', '1.5 - 3 years', '3 years or more'];
    const genderItem = ['Male', 'Female'];
    const [petType,
        setPetType] = useState("");
    const [gender,
        setGender] = useState("");
    const [breed,
        setBreed] = useState("");
    const [age,
        setAge] = useState("");
    const [petMed,
        setPetMed] = useState("");
    const onPressNext = () => {
        let text = ""
        if (petType === "") {
            text = "Please select species";
        } else if (breed === "") {
            text = "Please enter breed of your pet";
        } else if (age === "") {
            text = "Please enter age"
        } else if (gender === "") {
            text = "Please select gender";
        } else if (petMed === "") {
            text = "Please enter medical problem";
        }

        if (petType !== "" && gender !== "" && petMed !== "" && age !== "" && breed !== "") {
            navigation.navigate('ChooseTimeSlot', {
                details: {
                    ...route.params.item,
                    serviceType: "Consult",
                    petDetails: [
                        {
                            name: "Type of your Pet",
                            value: petType
                        }, {
                            name: "Breed",
                            value: breed
                        }, {
                            name: "Age",
                            value: age
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
    const onPressPetType = (index) => {
        setPetType(petCats[index]);
    }
    const onPressPetGender = (index) => {
        setGender(genderItem[index]);
    }
    const onPressPetAge = (index) => {
        setAge(petAge[index]);
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
                marginBottom: 100,
                marginTop: 20,
                paddingHorizontal: 20,
                flex: 1,
                width: '100%'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <FormElement
                        onPressToken={onPressPetType}
                        tokens={petCats}
                        showLabel={true}
                        title='Species'
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
                        onPressToken={onPressPetAge}
                        tokens={petAge}
                        showLabel={true}
                        title='Age'
                        type='token'
                        labelColor={Colors.secondary}/>
                    <FormElement
                        onPressToken={onPressPetGender}
                        tokens={genderItem}
                        showLabel={true}
                        title='Gender'
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
                    height: 100,
                    backgroundColor: route.params.item.backgroundColor,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            backgroundColor={Colors.secondary}
                            iconPostionRight={true}
                            useIcon={true}
                            title="Next"
                            icon="long-arrow-right"
                            onPress={onPressNext}/>
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
    }
});

export default ConsultScreen;

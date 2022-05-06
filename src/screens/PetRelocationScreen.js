import React, {useState, useRef} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    KeyboardAvoidingView,
    ImageBackground,
    ScrollView
} from 'react-native';
import Colors from '../util/Colors';
import FormElement from '../reusable_elements/FormElement';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';

const PetRelocationScreen = ({navigation, route}) => {
    const petCats = ['Dog', 'Cat'];
    const petAge = ['Upto 6 Months', '6 - 18 Months', '1.5 - 3 years', '3 years or more'];
    const petGender = ['Female', 'Male'];
    const petVaccination = ['Yes, Pet is Vaccinated', 'No, Pet is not Vaccinated'];
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
    const [vaccination,
        setVaccination] = useState("");
    const [weight,
        setWeight] = useState("");

    const onPressPetType = (index) => {
        console.log(petCats[index])
        setPetType(petCats[index]);
    }
    const onPressPetGender = (index) => {
        setGender(petGender[index]);
    }
    const onPressPetAge = (index) => {
        setAge(petAge[index]);
    }
    const onPressPetVaccination = (index) => {
        setVaccination(petVaccination[index]);
    }

    const onPressBookRelocation = () => {
        let text = ""
        if (petType === "") {
            text = "Please select pet type";
        } else if (breed === "") {
            text = "Please enter breed of your pet";
        } else if (age === "") {
            text = "Please select age"
        } else if (gender === "") {
            text = "Please select gender";
        } else if (vaccination === "") {
            text = "Please select vaccination";
        } else if (weight === "") {
            text = "Please enter weight";
        } else if (petMed === "") {
            text = "Please enter medical problem";
        }

        if (petType !== "" && gender !== "" && petMed !== "" && age !== "" && breed !== "" && weight !== "" && vaccination !== "") {
            navigation.navigate('ChooseTimeSlot', {
                details: {
                    ...route.params.item,
                    serviceType: "Relocation",
                    petDetails: [
                        {
                            name: "Type of your Pet",
                            value: age
                        }, {
                            name: "Breed",
                            value: breed
                        }, {
                            name: "Age",
                            value: age
                        }, {
                            name: "Vaccination Details",
                            value: vaccination
                        }, {
                            name: "Gender",
                            value: gender
                        }, {
                            name: "Weight",
                            value: weight
                        }, {
                            name: "Medical details about your Pet",
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
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={route.params.item.title}
                headerTextSize={25}
                headerTextColor={route.params.item.backgroundColor}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>
            <View
                style={{
                paddingHorizontal: 20,
                marginTop: 10,
                flex: 1.5,
                marginBottom: 80,
                backgroundColor: Colors.appBackground
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <View>
                        <FormElement
                            onPressToken={onPressPetType}
                            required={true}
                            tokens={petCats}
                            showLabel={true}
                            title='Pet type'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onChangeText={(val) => setBreed(val)}
                            inputValue={breed}
                            showLabel={true}
                            title='Breed'
                            type='input'
                            labelColor={Colors.secondary}
                            keyboardType='default'
                            maxLength={10}/>
                        <FormElement
                            onPressToken={onPressPetAge}
                            required={true}
                            tokens={petAge}
                            showLabel={true}
                            title='Age of your pet'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onPressToken={onPressPetGender}
                            required={true}
                            tokens={petGender}
                            showLabel={true}
                            title='Gender'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onPressToken={onPressPetVaccination}
                            required={true}
                            tokens={petVaccination}
                            showLabel={true}
                            title='Vaccination'
                            type='token'
                            labelColor={Colors.secondary}/>
                        <FormElement
                            onChangeText={(val) => setWeight(val)}
                            inputValue={weight}
                            showLabel={false}
                            title='Weight (*in KG)'
                            type='input'
                            labelColor={Colors.secondary}
                            keyboardType='numeric'
                            maxLength={3}/>
                        <FormElement
                            onChangeText={(val) => setPetMed(val)}
                            inputValue={petMed}
                            showLabel={false}
                            multiline={true}
                            numberOfLines={5}
                            title='Medical details about your Pet'
                            type='input'
                            labelColor={Colors.secondary}
                            keyboardType='default'
                            maxLength={10}/>
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
                            onPress={onPressBookRelocation}
                            backgroundColor={Colors.secondary}
                            iconPostionRight={true}
                            useIcon={true}
                            icon='long-arrow-right'
                            title="Book a Relocation"/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        width: Dimensions
            .get('window')
            .width - 30,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: Colors.primary,
        overflow: 'hidden',
        borderRadius: 18,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 30
    },
    itemImage: {
        width: Dimensions
            .get('screen')
            .width - 60,
        height: 150
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: "20%"

    }
});

export default PetRelocationScreen;
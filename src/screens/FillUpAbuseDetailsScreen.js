import React, {useRef, useState} from 'react';
import {
    StyleSheet,
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

const PetAbuseScreen = ({navigation}) => {
    const [initialDate,
        setInitialDate] = useState(new Date());
    const [showDatePicker,
        setShowDatePicker] = useState(false);
    const [issue,
        setIssue] = useState("");
    const [name,
        setName] = useState("");
    const [website,
        setWebsite] = useState("");
    const [address,
        setAddress] = useState("");
    const [city,
        setCity] = useState("");
    const [state,
        setState] = useState("");
    const [zip,
        setZip] = useState("");
    const [desc,
        setDesc] = useState("");
    const [email,
        setEmail] = useState("");
    const [contactNo,
        setContactNo] = useState("");
    const [date,
        setDate] = useState(initialDate.toDateString());

    const onPressSubmit = () => {
        let text = ""
        if (issue === "") {
            text = "Please enter issue";
        } else if (name === "") {
            text = "Please enter name";
        } else if (address === "") {
            text = "Please select address";
        } else if (city === "") {
            text = "Please enter city";
        } else if (state === "") {
            text = "Please enter state";
        } else if (zip === "") {
            text = "Please enter postal code";
        } else if (desc === "") {
            text = "Please enter description";
        } else if (email === "") {
            text = "Please enter email";
        } else if (contactNo === "") {
            text = "Please enter contact no";
        } else if (date === "") {
            text = "Please select date";
        }
        if (name !== "" && address !== "" && city !== "" && state !== "" && zip !== "" && desc !== "" && email !== "" && contactNo !== "" && date !== "") {
            Toast.show({
                type: 'customToast',
                text1: 'Submitted Successfully...',
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 80,
                props: {
                    backgroundColor: '#4a8f4b'
                }
            });
            navigation.navigate('Home')
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
    const onChangeDatePickerValue = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowDatePicker(false);
        setInitialDate(currentDate);
        setDate(currentDate.toDateString());
    };
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
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={'Fill up Details'}
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
                marginBottom: 80,
                marginTop: 10,
                flex: 1,
                width: '100%'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                        paddingHorizontal: 20
                    }}>
                        <FormElement
                            onChangeText={(val) => setIssue(val)}
                            inputValue={issue}
                            showLabel={false}
                            title="The issue I'm reporting involves"
                            type='input'
                            labelColor={Colors.primary}
                            maxLength={20}/>
                        <FormElement
                            onChangeText={(val) => setName(val)}
                            inputValue={name}
                            showLabel={false}
                            title='Your Name'
                            type='input'
                            labelColor={Colors.primary}
                            maxLength={2}/>
                        <FormElement
                            onChangeText={(val) => setWebsite(val)}
                            inputValue={website}
                            showLabel={false}
                            title='Website URL or Name involved'
                            type='input'
                            labelColor={Colors.primary}
                            maxLength={20}/>
                        <FormElement
                            onChangeText={(val) => setAddress(val)}
                            inputValue={address}
                            showLabel={false}
                            title='Address of incident'
                            type='input'
                            labelColor={Colors.primary}
                            maxLength={50}/>
                        <View
                            style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <View
                                style={{
                                width: '49%'
                            }}>
                                <FormElement
                                    onChangeText={(val) => setCity(val)}
                                    inputValue={city}
                                    showLabel={false}
                                    title='City of incident'
                                    type='input'
                                    labelColor={Colors.primary}
                                    maxLength={20}/>
                            </View>
                            <View
                                style={{
                                width: '49%'
                            }}>
                                <FormElement
                                    onChangeText={(val) => setState(val)}
                                    inputValue={state}
                                    showLabel={false}
                                    title='State of incident'
                                    type='input'
                                    labelColor={Colors.primary}
                                    maxLength={20}/>
                            </View>
                        </View>
                        <FormElement
                            onChangeText={(val) => setZip(val)}
                            inputValue={zip}
                            showLabel={false}
                            title='Zip code'
                            type='input'
                            labelColor={Colors.primary}
                            keyboardType='numeric'
                            maxLength={6}/>
                        <FormElement
                            onChangeText={(val) => setDesc(val)}
                            inputValue={desc}
                            showLabel={false}
                            multiline={true}
                            numberOfLines={5}
                            title='Please describe your concern in details'
                            type='input'
                            maxLength={100}/>
                        <View
                            style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <View
                                style={{
                                width: '49%'
                            }}>
                                <FormElement
                                    autoComplete={'email'}
                                    onChangeText={(val) => setEmail(val)}
                                    inputValue={email}
                                    showLabel={false}
                                    title='Email'
                                    type='input'
                                    labelColor={Colors.primary}
                                    maxLength={50}/>
                            </View>
                            <View
                                style={{
                                width: '49%'
                            }}>
                                <FormElement
                                    onChangeText={(val) => setContactNo(val)}
                                    inputValue={contactNo}
                                    showLabel={false}
                                    title='Contact No'
                                    type='input'
                                    labelColor={Colors.primary}
                                    keyboardType='numeric'
                                    maxLength={10}/>
                            </View>
                        </View>
                        <FormElement
                            initialDate={initialDate}
                            onPressOpenDatePicker={() => {
                            setShowDatePicker(true)
                        }}
                            showDatePicker={showDatePicker}
                            onChangeDatePickerValue={onChangeDatePickerValue}
                            currentDate={new Date()}
                            inputValue={date}
                            showLabel={false}
                            title='Date of Incident'
                            type='date'/>
                    </View>
                </ScrollView>
            </View>
            <Animatable.View delay={1000} animation={'slideInUp'}>
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
                            onPress={onPressSubmit}
                            backgroundColor={Colors.primary}
                            iconPostionRight={true}
                            useIcon={false}
                            title="Submit"/>
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

export default PetAbuseScreen;

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
 
 import FormElement from '../reusable_elements/FormElement';
 import Button from '../reusable_elements/Button';
 import GeneralHeader from '../reusable_elements/GeneralHeader';
 import * as Animatable from 'react-native-animatable';
 import Toast from 'react-native-toast-message';
 import Title from '../reusable_elements/Title';
import Colors from '../util/Colors';
import Icon, { Icons } from '../util/Icons';
import i18n from '../util/i18n';
 
const EmergencyScreen = ({navigation, route}) => {
  const [status, setStatus] = useState(route.params.status);
  const petCats = ['Dog', 'Cat', 'Goat', 'Bird', 'Sheep', 'Rabbit', 'Cow'];
  const [petType, setPetType] = useState("");
  const [petMed, setPetMed] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [contactNo, setContactNo] = useState("");

    const onPressPetType = (index) => {
      setPetType(petCats[index]);
    }
    const onPressSubmit = () => {
      let text = ""
      if (status === 'loggedOut') {
        if(petType === "") {
          text = "Please select species";
        } else if(petMed === "") {
          text = "Please enter medical problem";
        } else if (name === "") {
          text = "Please enter name";
        } else if(address === "") {
          text = "Please enter address";
        } else if(city === "") {
          text = "Please enter city";
        } else if(state === "") {
          text = "Please enter state";
        } else if(zip === "") {
          text = "Please enter postal code";
        }  else if(contactNo === "") {
          text = "Please enter contact no";
        }
        if(petType !== "" && petMed !== "" && name !== "" && address !== "" && city !== "" && state !== "" && zip !== "" && contactNo !== ""){
          Toast.show({
            type: 'customToast',
            text1: "Emergency service is booked...",
            position: 'top',
            visibilityTime: 1500,
            topOffset: 0,
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

      } else {
        if(petType === "") {
          text = "Please select species";
        } else if(petMed === "") {
          text = "Please enter medical problem";
        }
        if(petType !== "" && petMed !== ""){
          Toast.show({
            type: 'customToast',
            text1: "Emergency service is booked...",
            position: 'top',
            visibilityTime: 1500,
            topOffset: 50,
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
            position: 'bottom',
            visibilityTime: 1500,
            bottomOffset: 100,
            props: {
                backgroundColor: Colors.error_toast_color
            }
          });
        }
      }
      
    }
    return (
    <KeyboardAvoidingView behavior='height' style={{ flex: 1, backgroundColor: Colors.appBackground}} >
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
            headerHeight={60}

            headerText={'Emergency Service'} 
            headerTextSize={25} 
            headerTextColor={Colors.primary} 
            showHeaderText={true}

            showLeftIcon={true}
            leftIconType={Icons.MaterialIcons} 
            leftIconName={'navigate-before'} 
            leftIconSize={35} 
            leftIonColor={Colors.black}
            leftIconBackgroundColor={Colors.appBackground}
            onPressLeft={() => navigation.goBack()} 
        />
        <View style={{ backgroundColor: Colors.appBackground, marginBottom: 80, marginTop: 20, flex: 1, width: '100%', }}>
            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
              <View style={{paddingHorizontal: 20}}>
                {status === 'loggedIn' && (
                <View style={{marginBottom: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Title color={Colors.mediumDark} size={18} bold={true} label="Surajeet Hazari"/>
                        <View style={{backgroundColor: Colors.primary, marginLeft: 10, borderRadius: 10,  padding: 5}}>
                        <Title color={Colors.appBackground} size={10} bold={true} label="Home"/>
                        </View>
                    </View>
                    <Title color='grey' size={16} bold={false} label="106, Chaklalpur, Radhamohanpur, West Mindnapore, 721160"/>
                    <View style={{width: '100%', marginTop: 10}}>
                        <Button backgroundColor={Colors.appBackground} textColor={Colors.primary} iconColor="grey" iconPostionLeft={true} useIcon={true} icon="plus" title="Change / Add address" onPress={() => navigation.navigate("ManageAddress", {showSelection: true})}/>
                    </View>
                </View>
                )}
                <FormElement onPressToken={onPressPetType} required={true} tokens={petCats}  showLabel={true} title='Species' type='token' labelColor={Colors.secondary}/>
                <FormElement onChangeText={(val) => setPetMed(val)} inputValue={petMed} required={true} showLabel={false} labelColor={Colors.secondary} title="Pet's medical problem" type='input' multiline={true} numberOfLines={5} keyboardType='default' maxLength={100}/>
                {status !== 'loggedIn' && (
                <View>
                  <FormElement onChangeText={(val) => setName(val)} inputValue={name} showLabel={false} title='Your Name' type='input' labelColor={Colors.primary} maxLength={2}/>
                  <FormElement onChangeText={(val) => setAddress(val)} inputValue={address} showLabel={false} title='Address of incident' type='input' labelColor={Colors.primary} maxLength={50}/>
                  <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <View style={{width: '49%'}}>
                        <FormElement onChangeText={(val) => setCity(val)} inputValue={city} showLabel={false} title='City of incident' type='input' labelColor={Colors.primary} maxLength={20}/>
                      </View>
                      <View style={{width: '49%'}}>
                        <FormElement onChangeText={(val) => setState(val)} inputValue={state} showLabel={false} title='State of incident' type='input' labelColor={Colors.primary} maxLength={20}/>
                      </View>
                  </View>
                  <FormElement onChangeText={(val) => setZip(val)} inputValue={zip} showLabel={false} title='Zip code' type='input' labelColor={Colors.primary} keyboardType='numeric' maxLength={6}/>
                  <FormElement onChangeText={(val) => setContactNo(val)} inputValue={contactNo} showLabel={false} title='Contact No' type='input' labelColor={Colors.primary} keyboardType='numeric' maxLength={10}/>
                </View>
                )}
              </View>
            </ScrollView>
        </View>
        <Animatable.View delay={100} animation={'slideInUp'}>
          <ImageBackground blurRadius={0} source={require('../assets/images/background6.png')} style={{overflow: 'hidden', position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, height: 80,  backgroundColor: Colors.secondary, borderTopLeftRadius: 50, elevation: 15, borderTopRightRadius: 50}}>
            <View style={{width: '90%'}}>
              <Button onPress={onPressSubmit} backgroundColor={Colors.primary} iconPostionRight={true} useIcon={true} title="Submit" icon="send" />
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
      borderRadius: 20,
    }
 });
 
 export default EmergencyScreen;
 
 
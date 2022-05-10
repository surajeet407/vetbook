import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../util/Colors';
import {Picker} from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';
import {TextInput, Chip, TouchableRipple, Checkbox} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../util/i18n';

const FormElement = (props) => {
    const [checked,
        setChecked] = useState(props.checked);
    const [date,
        setDate] = useState(new Date());
    const [catIndex,
        setCatIndex] = useState(props.defaultSelection);
    const onPressToken = (org) => {
        props.onPressToken(org.index)
        setCatIndex(org.index);
    }
    const onSelectCheck = (cond) => {
        props.onSelectCheck(cond)
        setChecked(cond);
    }
    return (
        <View
            style={[
            props.formElemetStyle, {
                justifyContent: 'space-around',
                marginBottom: 5
            }
        ]}>
            {props.showLabel && (
                <Animatable.View
                    delay={100}
                    animation={'fadeInLeft'}
                    style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {props.required && (
                        <Text
                            style={{
                            marginTop: -5,
                            marginRight: 5,
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>*</Text>
                    )}
                    <Text
                        style={{
                        fontFamily: 'Redressed-Regular',
                        color: props.labelColor,
                        fontSize: 20
                    }}>{props.title}</Text>
                    <Text
                        style={{
                        marginLeft: 5,
                        color: props.labelColor,
                        fontWeight: 'bold',
                        fontSize: 20
                    }}>:</Text>
                </Animatable.View>
            )}
            {props.type === 'radio' && (<RadioGroup
                onPress={props.radioButtonPress}
                containerStyle={{
                marginTop: 10,
                alignItems: 'flex-start',
                justifyContent: 'flex-start'
            }}
                radioButtons={props.radioButtons}/>)}
            {props.type === 'input' && (
                <Animatable.View delay={100} animation={'fadeInLeft'}>
                    <TextInput
                        autoComplete={props.autoComplete}
                        error={props.textInputError}
                        value={props.inputValue}
                        multiline={props.multiline}
                        numberOfLines={props.numberOfLines}
                        style={{
                        height: props.textHight
                            ? props.textHight
                            : 0,
                        backgroundColor: Colors.appBackground,
                        fontSize: 20,
                        fontFamily: 'Redressed-Regular',
                        elevation: 2
                    }}
                        outlineColor={Colors.primary}
                        activeOutlineColor={Colors.primary}
                        mode={props.textLayout
                        ? props.textLayout
                        : 'outlined'}
                        label={props.title}
                        editable={props.inputEditable}
                        onFocus={props.onFocus}
                        placeholder={props.placeholder
                        ? props.placeholder
                        : props.title}
                        onChangeText={props.onChangeText}
                        onSubmitEditing={props.onSubmitEditing}
                        keyboardType={props.keyboardType}
                        maxLength={props.maxLength}
                        theme={{
                        colors: {
                            placeholder: Colors.dark,
                            text: "#504f40"
                        },
                        fonts: {
                            regular: {
                                fontFamily: 'Redressed-Regular'
                            }
                        }
                    }}/>
                </Animatable.View>
            )}
            {props.type === 'token' && (
                <View
                    style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    marginBottom: 5,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    width: '100%'
                }}>
                    {props
                        .tokens
                        .map((item, index) => <Animatable.View
                            delay={index * 100}
                            animation={'fadeInLeft'}
                            key={index}
                            style={{
                            margin: 2
                        }}>
                            <Chip
                                style={{
                                backgroundColor: index === catIndex
                                    ? Colors.primary
                                    : Colors.gray
                            }}
                                textStyle={{
                                fontFamily: 'Oswald-SemiBold',
                                color: index === catIndex
                                    ? '#fff'
                                    : 'grey'
                            }}
                                selectedColor={index === catIndex
                                ? '#fff'
                                : 'red'}
                                selected={index === catIndex
                                ? true
                                : false}
                                mode='outlined'
                                icon={index === catIndex
                                ? 'check'
                                : ''}
                                onPress={() => onPressToken({index})}>{item}
                            </Chip>
                        </Animatable.View>)}
                </View>
            )}
            {props.type === 'picker' && (
                <Animatable.View
                    delay={100}
                    animation={'fadeInLeft'}
                    style={{
                    marginTop: 5,
                    borderRadius: 5,
                    borderColor: Colors.primary,
                    borderWidth: 1
                }}>
                    <Picker
                        style={{
                        padding: 0
                    }}
                        mode='dialog'
                        dropdownIconColor={Colors.mediumDark}
                        selectedValue={props.value}
                        prompt={props.pickerPrompt}
                        dropdownIconRippleColor={Colors.gray}
                        onValueChange={props.onValueChange}>
                        {props
                            .pickerItems
                            .map((item, index) => <Picker.Item
                                key={index}
                                style={{
                                color: Colors.mediumDark,
                                fontSize: 20
                            }}
                                label={item.label}
                                value={item.value}/>)}
                    </Picker>
                </Animatable.View>
            )}
            {props.type === 'date' && (
                <Animatable.View
                    delay={100}
                    animation={'fadeInLeft'}
                    style={{
                    width: '100%'
                }}>
                    <TextInput
                        value={props.inputValue}
                        style={{
                        height: props.textHight
                            ? props.textHight
                            : 0,
                        backgroundColor: Colors.appBackground,
                        fontSize: 20,
                        fontFamily: 'Oswald-Medium',
                        elevation: 2
                    }}
                        outlineColor={Colors.primary}
                        mode={props.textLayout
                        ? props.textLayout
                        : 'outlined'}
                        label={props.title}
                        editable={false}
                        selectionColor={Colors.primary}
                        onSubmitEditing={props.onSubmitEditing}
                        theme={{
                        colors: {
                            placeholder: Colors.dark,
                            text: "#504f40"
                        },
                        fonts: {
                            regular: {
                                fontFamily: 'Oswald-Regular'
                            }
                        }
                    }}/>
                    <TouchableRipple
                        onPress={props.onPressOpenDatePicker}
                        style={{
                        zIndex: 999,
                        position: 'absolute',
                        top: 6,
                        right: 0,
                        width: '15%',
                        height: 58,
                        padding: 5,
                        alignItems: 'center',
                        borderTopEndRadius: 5,
                        borderBottomEndRadius: 5,
                        backgroundColor: Colors.primary
                    }}>
                        <Icon name="date-range" size={40} color={'#fff'}/>
                    </TouchableRipple>
                    {props.showDatePicker && (<DateTimePicker
                        value={props.initialDate}
                        minimumDate={new Date()}
                        mode={'date'}
                        is24Hour={true}
                        onChange={props.onChangeDatePickerValue}/>)}
                </Animatable.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomColor: Colors.mediumDark,
        borderBottomWidth: 2,
        paddingVertical: 15,
        width: '100%',
        color: Colors.mediumDark,
        fontSize: 20,
        paddingLeft: 15
    }
});

export default FormElement;

import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import * as Animatable from 'react-native-animatable';
import Title from '../reusable_elements/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import i18n from '../util/i18n';

const DefaltAddressComponent = (props) => {
    const [showAddress, setShowAddress] = useState(false)
    const [address, setAddress] = useState({})
    const [status, setStatus]  = useState();
    const onPressAddAddress = () => { 
        props
            .navigation
            .navigate("ManageAddress", {details: {...props.params}, status: status, showSelection: true})
    }
    useEffect(() => {
        AsyncStorage.getItem('userStatus').then((status) => {
            setStatus(status)
            if(status === 'loggedIn') {
                AsyncStorage
                  .getItem('phoneNo')
                  .then((phoneNo, msg) => {
                    if (phoneNo) {
                      database()
                      .ref('/users/' + phoneNo + "/addresses")
                      .on("value", snapshot => {
                        if(snapshot.val()) {
                            let count = 0
                          for(let i = 0; i < snapshot.val().length; i++) {
                              if(snapshot.val()[i].default) {
                                setAddress(snapshot.val()[i])
                                count++
                              } 
                          } 
                          if (count === 0) {
                            setShowAddress(false)
                          } else {
                            setShowAddress(true) 
                          }
                        } else {
                            setShowAddress(false)
                        }
                      })
                    }
                })
              }
        })
    }, [])

    return (
        <Animatable.View
            delay={100}
            animation={'slideInDown'}
            style={{
            marginTop: 20
        }}>
            {showAddress? 
            <View>
                <View
                    style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Title color={Colors.mediumDark} size={18} bold={true} label={address.nearby}/>
                    <View
                        style={{
                        backgroundColor: Colors.primary,
                        marginLeft: 10,
                        borderRadius: 10,
                        padding: 5
                    }}>
                        <Title color={Colors.appBackground} size={10} bold={true} label={address.tag}/>
                    </View>
                </View>
                <Title
                    color={Colors.darkGray}
                    size={16}
                    bold={false}
                    label={address.address}/>
            </View>
            :
            <View style={{alignItems: 'center'}}>
                <Title color={Colors.darkGray} size={20} bold={true} label={"No address found"}/>
            </View>
            }
            <View
                style={{
                width: '100%',
                marginTop: 10,
                padding: 5
            }}>
                <Button
                    iconColor={Colors.darkGray}
                    textColor={Colors.primary}
                    backgroundColor={Colors.appBackground}
                    iconPostionLeft={true}
                    useIcon={true}
                    icon="plus"
                    title="Change / Add address"
                    onPress={onPressAddAddress}/>
            </View>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({});

export default DefaltAddressComponent;

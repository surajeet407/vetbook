import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Colors from '../util/Colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Title from '../reusable_elements/Title';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';

const width = Dimensions
    .get('screen')
    .width - 50;

const OrdersScreen = ({navigation, route}) => {
    const [pastOrders,
        setPastOrders] = useState([])
    const reOrder = () => {}
    const getData = () => {
        database()
            .ref('/users/8900162177/pastOrders')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPastOrders(snapshot.val());
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
                rightIconName={'navigate-before'}
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText="Swipe right to reorder..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={'Orders'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.navigate("HomeBottomTabBar", {screen: "Settings"})}/>
            <View
                style={{
                marginTop: 10,
                marginBottom: 0,
                flex: 1,
                alignItems: 'center',
                backgroundColor: Colors.appBackground,
                width: '100%'
            }}>
                <SwipeListView
                    style={{}}
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                    data={pastOrders}
                    keyExtractor={item => item.id}
                    leftOpenValue={60}
                    rightOpenValue={-78}
                    ItemSeparatorComponent={() => (<View style={{
                    marginBottom: 10
                }}/>)}
                    renderItem={({item, rowMap}) => (
                    <Animatable.View
                        delay={50 * rowMap}
                        animation={'slideInRight'}
                        style={{
                        backgroundColor: Colors.appBackground,
                        padding: 8,
                        marginHorizontal: 10,
                        marginVertical: 4,
                        borderRadius: 10,
                        elevation: 4
                    }}>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <View
                                style={{
                                alignItems: 'center'
                            }}>
                                <Image
                                    source={{
                                    uri: item.image
                                }}
                                    style={{
                                    width: 80,
                                    height: 80
                                }}/>
                            </View>
                            <View
                                style={{
                                marginLeft: 10,
                                width: '70%',
                                alignItems: 'flex-start'
                            }}>
                                <Title size={18} label={item.title} bold={true} color={Colors.primary}/>
                                <View
                                    style={{
                                    flexDirection: 'row'
                                }}>
                                    <Title size={16} label='Price:' bold={true} color='#999'/>
                                    <View
                                        style={{
                                        marginLeft: 5
                                    }}>
                                        <Title size={16} label={item.cost + " /-"} bold={true} color='#555'/>
                                    </View>
                                </View>
                                <Title
                                    size={15}
                                    label={"Ordered On: " + item.orderedOn}
                                    bold={true}
                                    color='grey'/>
                            </View>
                        </View>
                    </Animatable.View>
                )}
                    renderHiddenItem={(data, rowMap) => (
                    <View style={styles.rowBack}>
                        <TouchableOpacity
                            style={styles.backRightBtn}
                            onPress={() => reOrder(rowMap, data.item.key)}>
                            <Text style={styles.backTextWhite}>Reorder</Text>
                        </TouchableOpacity>
                    </View>
                )}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    backTextWhite: {
        color: Colors.appBackground
    },
    rowBack: {
        flex: 1
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 5,
        justifyContent: 'center',
        position: 'absolute',
        top: 5,
        width: 75,
        backgroundColor: 'green',
        right: 10,
        borderRadius: 15,
        overflow: 'hidden'
    }
});

export default OrdersScreen;

import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions,
    ImageBackground,
    RefreshControl
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import ServiceScreenLoader from '../reusable_elements/ServiceScreenLoader';
import Colors from '../util/Colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Title from '../reusable_elements/Title';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Rating} from 'react-native-ratings';
import i18n from '../util/i18n';
import {Button, Chip} from 'react-native-paper'
import {Picker} from '@react-native-picker/picker';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Constants from '../util/Constants';
import RBSheet from "react-native-raw-bottom-sheet";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const width = Dimensions
    .get('screen')
    .width - 50;

const ServicesScreen = ({navigation, route}) => {
    const filters = [{
        key: "ongoing",
        text: "Ongoing"
    },{
        key: "cancelled",
        text: "Cancelled"
    },{
        key: "completed",
        text: "Completed"
    }]
    const [refreshing, setRefreshing] = useState(false);
    const [loading,
        setLoading] = useState(true)
    const refRBSheet = useRef(null)
    const [itemId, 
        setItemId] = useState("");
    const [pickerValue, 
        setPickerValue] = useState("");
    const [phoneNo,
        setPhoneNo] = useState("");
    const [catIndex,
        setCatIndex] = useState(0);
    const [status,
        setStatus] = useState(route.params.status);
    const [pastServices,
        setPastServices] = useState([])
    const reOrder = () => {}

    const getDataFromStorage = (filter) => {
        AsyncStorage
            .getItem("anonymusService")
            .then((data) => {
                setLoading(false)
                setRefreshing(false)
                if (data && JSON.parse(data).length > 0) {
                    let allItem = JSON.parse(data);
                    let items = allItem.filter(item => item.mode === filter)
                    setPastServices(items);
                }
            });
    }
    const getDataFromDatabase = (phoneNo, filter) => {
        database()
            .ref("/users/" + phoneNo + "/services")
            .once('value')
            .then(snapshot => {
                setLoading(false)
                setRefreshing(false)
                if (snapshot.val()) {
                    let items = snapshot.val().filter(item => item.mode === filter)
                    setPastServices(items);
                }
            })
    }
    const onPressSubmit = () => {
        if(pickerValue === "") {
            Toast.show({
                type: 'customToast',
                text1: "Select reason for cancellation...",
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 200,
                props: {
                    backgroundColor: Colors.error_toast_color
                }
            });
        } else {
            refRBSheet.current.close()
            if (status === 'loggedIn') {
                database()
                .ref("/users/" + phoneNo + "/services")
                .once('value')
                .then(snapshot => {
                    let path;
                    snapshot
                        .val()
                        .forEach((dbItem, index) => {
                            if (dbItem.id === itemId) {
                                path = index;
                            }
                        })
                    database()
                        .ref("/users/" + phoneNo + "/services/" + path)
                        .update({mode: 'cancelled', reasonForCancellation: pickerValue}).then(() => {
                            getDataFromDatabase(phoneNo, filters[catIndex].key)
                            Toast.show({
                                type: 'customToast',
                                text1: "This Service has been cancelled...",
                                position: 'bottom',
                                visibilityTime: 1500,
                                bottomOffset: 80,
                                props: {
                                    backgroundColor: Colors.error_toast_color
                                }
                            });
                        })
                    
                })
                    
            } else {
                AsyncStorage
                    .getItem("anonymusService")
                    .then((data) => {
                        if (data && JSON.parse(data).length > 0) {
                            let path,
                            mainData = JSON.parse(data);
                            mainData.forEach((dbItem, index) => {
                                if (dbItem.id === itemId) {
                                    path = index
                                }
                            })
                            mainData[path].mode = 'cancelled'
                            mainData[path].reasonForCancellation = pickerValue
                            AsyncStorage.setItem("anonymusService", JSON.stringify(mainData)).then(() => {
                                getDataFromStorage(filters[catIndex].key)
                                Toast.show({
                                    type: 'customToast',
                                    text1: "This Service has been cancelled...",
                                    position: 'bottom',
                                    visibilityTime: 1500,
                                    bottomOffset: 80,
                                    props: {
                                        backgroundColor: Colors.error_toast_color
                                    }
                                });
                            }) 
                        }
                    });
            }
        }
        
    }

    const onPressCancel = (id) => {
        refRBSheet.current.open()
        setItemId(id)
    }
    
    const handleCustomIndexSelect = (index) => {
        setCatIndex(index)
        setPickerValue("")
        if (status === 'loggedIn') {
            getDataFromDatabase(phoneNo, filters[index].key);
        } else {
            getDataFromStorage(filters[index].key)
        }
    }
    const onRefresh = () => {
        setRefreshing(true)
        if (status === 'loggedIn') {
            getDataFromDatabase(phoneNo, filters[catIndex].key);
        } else {
            getDataFromStorage(filters[catIndex].key)
        }
    }

    useEffect(() => {
        if (status === 'loggedIn') {
            AsyncStorage
            .getItem('phoneNo')
            .then((phoneNo, msg) => {
                setPhoneNo(phoneNo)
                getDataFromDatabase(phoneNo, "ongoing");
            })
        } else {
            getDataFromStorage("ongoing")
        }
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
                subHeaderText="See all your booked services..."
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={100}
                headerText={'All Services'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.navigate("HomeBottomTabBar", {screen: "Settings", status: status})}/>
            <View
                style={{
                paddingHorizontal: 20,
                alignItems: 'center',
                width: '100%'
                }}>
                <SegmentedControlTab
                    values={["Ongoing", "Cancelled", "Completed"]}
                    borderRadius={0}
                    tabsContainerStyle={{ height: 50, backgroundColor: Colors.white }}
                    tabStyle={{ backgroundColor: Colors.darkGray, borderColor: Colors.white, borderWidth: 1 }}
                    activeTabStyle={{ backgroundColor: Colors.green }}
                    tabTextStyle={{ color: '#444444', fontFamily: 'Oswald-Medium' }}
                    activeTabTextStyle={{ color: Colors.white }}
                    selectedIndex={catIndex}
                    onTabPress={handleCustomIndexSelect}
                />
            </View>
            {loading?
            <View style={{marginTop: 10, padding: 20}}>
                <ServiceScreenLoader/>
            </View>
            :
            <FlatList
                refreshControl={<RefreshControl progressViewOffset={20} colors={[Colors.primary, Colors.secondary]} refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={{alignItems: 'center', marginTop: 20}}>
                        <Title label="No service requests are found..." size={20} color={Colors.darkGray}/>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                data={pastServices}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => {
                return (
                    <Animatable.View
                        delay={50 * index}
                        animation={'slideInLeft'}
                        style={{
                        backgroundColor: Colors.appBackground,
                        marginHorizontal: 20,
                        marginVertical: 10,
                        padding: 10,
                        elevation: 5
                    }}>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Title size={20} label={item.serviceType} bold={true} color={Colors.darkGray}/>
                            <Title
                                size={18}
                                label={"Price: " + item.total + "/-"}
                                bold={true}
                                color={Colors.secondary}/>
                        </View>
                        <View
                            style={{
                            marginTop: 5,
                            marginBottom: 10
                        }}>
                            <View >
                                <Title
                                    size={16}
                                    label={"Details of Booking: "}
                                    bold={true}
                                    color={Colors.primary}/>
                            </View>
                            <View>
                                    <Title size={15} label={"Transaction Id: " + item.txnId} bold={true} color={Colors.darkGray}/>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"Booked On:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title size={15} label={item.orderedOn} bold={true} color={Colors.secondary}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"Status:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            {item.mode === 'ongoing' && (<Title size={15} label={'Ongoing'} bold={true} color={Colors.yellow}/>)}
                                            {item.mode === 'completed' && (<Title size={15} label={'Completed'} bold={true} color={Colors.green2}/>)}
                                            {item.mode === 'cancelled' && (<Title
                                                size={15}
                                                label={'Cancelled'}
                                                bold={true}
                                                color={Colors.error_toast_color}/>)}
                                        </View>
                                    </View>
                                    {item.mode === 'cancelled' && (
                                     <Text style={{color: Colors.darkGray, fontSize: 15, fontFamily: 'Oswald-Medium'}}>{"Reason for cancellation: " + item.reasonForCancellation}</Text>
                                    )}
                                    
                            </View>
                        </View>
                        {item.mode !== 'cancelled' && (
                            <View>
                                {item.mode === 'ongoing' && (
                                    <View style={{
                                        borderTopColor: Colors.darkGray,
                                        borderTopWidth: 1,
                                        padding: 5}}>
                                        <View
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: 5
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate("TrackOrder", {details: {...item, fromScreen: 'Services'}})}
                                                style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                <Title size={18} label={'Track'} bold={true} color={Colors.secondary}/>
                                                <Icon
                                                    type={Icons.AntDesign}
                                                    style={{
                                                    marginTop: 5,
                                                    marginLeft: 5
                                                }}
                                                    name={'arrowright'}
                                                    size={20}
                                                    color={Colors.secondary}/>
                                            </TouchableOpacity>
                                            <Button
                                                labelStyle={{
                                                color: Colors.white,
                                                fontFamily: 'PTSerif-Bold'
                                            }}
                                                color={Colors.error_toast_color}
                                                mode="contained"
                                                onPress={() => onPressCancel(item.id)}>Cancel</Button>
                                        </View>
                                    </View>
                                )}
                                {item.mode === 'completed' && (
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderTopColor: Colors.darkGray,
                                        borderTopWidth: 1,
                                        padding: 5
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("Confirm", {details: item})}
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Title size={18} label={'Book Again'} bold={true} color={Colors.secondary}/>
                                            <Icon
                                                type={Icons.AntDesign}
                                                style={{
                                                marginTop: 5,
                                                marginLeft: 5
                                            }}
                                                name={'arrowright'}
                                                size={20}
                                                color={Colors.secondary}/>
                                        </TouchableOpacity>
                                        <Rating
                                            type='custom'
                                            ratingColor='#3498db'
                                            ratingBackgroundColor='#c8c7c8'
                                            ratingCount={5}
                                            imageSize={20}
                                            minValue={0}
                                            startingValue={0}
                                            jumpValue={1}
                                            showRating={false}/>
                                    </View>
                                )}
                            </View>
                        )}
                    </Animatable.View>
                )
            }}/>
            }
            <RBSheet
                height={180}
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                container: {
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    elevation: 10,
                    overflow: 'hidden',
                    paddingHorizontal: 20
                },
                wrapper: {
                    backgroundColor: "transparent",
                },
                draggableIcon: {
                    backgroundColor: Colors.secondary
                }
                }}
                >
                <View style={{marginTop: 20}}>
                    <View
                        style={{
                        borderWidth: 1,
                        borderColor: Colors.darkGray
                    }}>
                        <Picker
                            placeholder='Select reason for cancellation'
                            dropdownIconColor={Colors.darkGray}
                            mode="dropdown"
                            selectedValue={pickerValue}
                            onValueChange={(itemValue) => { 
                            setPickerValue(itemValue)
                        }}>
                            <Picker.Item
                                style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }}
                                label="Select reason for cancellation"
                                value=""/>
                            <Picker.Item
                                style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }}
                                label="I have changed my mind"
                                value="I have changed my mind"/>
                            <Picker.Item
                                style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }}
                                label="Found local doctor"
                                value="Found local doctor"/>
                            <Picker.Item
                                style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                                }}
                                label="Price is not reasonable"
                                value="Price is not reasonable"/>
                            <Picker.Item
                                style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }}
                                label="Somewhat not satisfied with the privious service"
                                value="Somewhat not satisfied with the privious service"/>
                        </Picker>
                    </View>  
                    <View style={{alignItems: 'center', margin: 20}}>
                        <View style={{width: '50%'}}>
                            <Button
                                labelStyle={{
                                color: Colors.white,
                                fontFamily: 'PTSerif-Bold'
                                }}
                                color={Colors.error_toast_color}
                                mode="contained"
                                onPress={onPressSubmit}>Submit</Button>   
                        </View>
                    </View>
                </View>
            </RBSheet>
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

export default ServicesScreen;

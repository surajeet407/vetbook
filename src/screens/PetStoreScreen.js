import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Animated,
    FlatList,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
    ToastAndroid
} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {Badge} from 'react-native-paper';
import Colors from '../util/Colors';
import {Searchbar} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import RNMasonryScroll from "react-native-masonry-scrollview";
import database from '@react-native-firebase/database';
import StoreItems from '../reusable_elements/StoreItems'
import HorizontalCategoryList from '../reusable_elements/HorizontalCategoryList'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LandingHeader from '../reusable_elements/LandingHeader';
import RNBounceable from "@freakycoder/react-native-bounceable";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Title from '../reusable_elements/Title';
import uuid from 'react-native-uuid';
import i18n from '../util/i18n';

const PetStoreScreen = ({navigation, route}) => {
    const isFocused = useIsFocused();
    const [homeAddress, setHomeAddress] = useState("")
    const [status,
        setStatus] = useState(route.params.status);
    const [cartItemCount,
        setCartItemCount] = useState('0');
    const [petStoreCategories,
        setPetStoreCategories] = useState([]);
    const [petStoreItems,
        setPetStoreItems] = React.useState([]);
    const [searchQuery,
        setSearchQuery] = React.useState('');
    const categoryCarousel = useRef(null);
    const [selectedCategoryIndex,
        setSelectedCategoryIndex] = useState(0);

    const onPressCaraousel = (orgs) => {
        setSelectedCategoryIndex(orgs.index);
        categoryCarousel
            .current
            .scrollToIndex(orgs, {
                animated: true,
                viewPosition: 0.5
            })
        let path = ""
        if (petStoreCategories[orgs.index].name === 'Medicine') {
            path = "/petMedicineItems"
        } else if (petStoreCategories[orgs.index].name === 'Food') {
            path = "/petFoodItems"
        } else if (petStoreCategories[orgs.index].name === 'Toys') {
            path = "/petToysItems"
        } else if (petStoreCategories[orgs.index].name === 'Accesorries') {
            path = "/petAccItems"
        } else {
            path = "/petFurItems"
        }
        database()
            .ref(path)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPetStoreItems(snapshot.val())
                } else {
                    setPetStoreItems([])
                }
            })
    }
    const onChangeSearch = query => {
        setSearchQuery(query)
        let path = ""
        if (petStoreCategories[selectedCategoryIndex].name === 'Medicine') {
            path = "/petMedicineItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Food') {
            path = "/petFoodItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Toys') {
            path = "/petToysItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Accesorries') {
            path = "/petAccItems"
        } else {
            path = "/petFurItems"
        }
        if (query.length > 0) {
            database()
                .ref(path)
                .on('value', snapshot => {
                    if (snapshot.val()) {
                        setPetStoreItems(snapshot.val().filter(item => item.name.toLowerCase().includes(query.toLowerCase())))
                    }
                })
        } else {
            database()
                .ref(path)
                .on('value', snapshot => {
                    if (snapshot.val()) {
                        setPetStoreItems(snapshot.val())
                    }
                })
        }
    };
    const onPressAddToCart = () => {
        Toast.show({type: 'customToast', text1: 'Item added to your cart', position: 'bottom', visibilityTime: 1000});
    }
    const onPressRightIcon = () => {
        navigation.navigate("Cart", {status: status});
    }
    const getData = () => {
        database()
            .ref('/petStoreCategories')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPetStoreCategories(snapshot.val())
                }
            })
        database()
            .ref('/petMedicineItems')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPetStoreItems(snapshot.val())
                }
            })

    }

    const getCartItems = () => {
        if (status === 'loggedOut') {
            AsyncStorage
                .getItem('cartItems')
                .then((data, msg) => {
                    if (data) {
                        setCartItemCount(JSON.parse(data).length)
                    } else {
                        setCartItemCount(0)
                    }
                })
        } else {
            AsyncStorage
                .getItem('phoneNo')
                .then((data, msg) => {
                    if (data) {
                        database()
                            .ref('/users/' + data + "/cartItems")
                            .on('value', snapshot => {
                                if (snapshot.val()) {
                                    setCartItemCount(snapshot.val().length)
                                } else {
                                    setCartItemCount("0")
                                }
                            })
                    }
                })
        }

    }

    useEffect(() => {
        if (isFocused) {
            AsyncStorage
                .getItem("homeAddress")
                .then((homeAddress, msg) => {
                setHomeAddress(JSON.parse(homeAddress))
            })
            getCartItems()
            getData();
        }
        
    }, [isFocused]);

    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <LandingHeader homeAddress={homeAddress} status={status} navigation={navigation}/>
            <View
                style={{
                borderTopLeftRadius: 50,
                marginTop: 50,
                marginBottom: 0,
                borderTopRightRadius: 50,
                paddingHorizontal: 20,
                flex: 1,
                width: '100%'
            }}>
                <View
                    style={{
                    marginTop: 20,
                    marginBottom: 25,
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between'
                }}>
                    <View style={{
                        width: '82%'
                    }}>
                        <Searchbar
                            placeholder="Search"
                            onChangeText={onChangeSearch}
                            value={searchQuery}/>
                    </View>
                    <RNBounceable
                        onPress={() => navigation.navigate("Cart", {status: status})}
                        style={{
                        width: '15%',
                        padding: 10,
                        height: 48,
                        borderRadius: 10,
                        elevation: 2,
                        backgroundColor: Colors.secondary,
                        alignItems: 'center'
                    }}>
                        <MaterialCommunityIcons name={'cart'} color={Colors.appBackground} size={30}/>
                        <View
                            style={{
                            position: 'absolute',
                            top: -15,
                            left: 30
                        }}>
                            <Badge
                                style={{
                                backgroundColor: Colors.primary,
                                borderWidth: 1,
                                borderColor: Colors.appBackground,
                                color: Colors.appBackground
                            }}
                                size={25}>{cartItemCount}</Badge>
                        </View>
                    </RNBounceable>
                </View>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>

                    <FlatList
                        ref={categoryCarousel}
                        data={petStoreCategories}
                        scrollEnabled={true}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => (<View style={{
                        marginLeft: 15
                    }}/>)}
                        snapToAlignment={'center'}
                        snapToInterval={Dimensions
                        .get('window')
                        .width / 5}
                        getItemLayout={(data, index) => ({
                        length: Dimensions
                            .get('window')
                            .width / 5,
                        offset: Dimensions
                            .get('window')
                            .width / 5 * index,
                        index
                    })}
                        renderItem={({item, index}) => (<HorizontalCategoryList
                        categoryTitle={item.name}
                        onPress={() => onPressCaraousel({index})}
                        image={item.image}
                        selectedCategoryIndex={selectedCategoryIndex}
                        index={index}
                        animationStyle="fadeInLeft"/>)}/>
                    <View style={{
                        marginTop: 30
                    }}>
                    {petStoreItems.length > 0?
                        <RNMasonryScroll
                            removeClippedSubviews={true}
                            columns={2}
                            oddColumnStyle={{
                            marginTop: 30
                        }}
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.id}>
                            {petStoreItems.map((item, index) => <View key={index}>
                                <StoreItems
                                    animationStyle="fadeInUp"
                                    navToDetail={() => navigation.navigate("ItemDetails", {
                                    item: item,
                                    status: status
                                })}
                                    name={item.name}
                                    image={item.image}
                                    price={item.discountPrice}
                                    index={item.id}
                                    width={Dimensions
                                    .get('screen')
                                    .width / 2 - 40}/>
                            </View>)}
                        </RNMasonryScroll>
                    :
                    <View style={{alignItems: 'center', marginTop: 20}}>
                        <Title label="No items are found..." size={20} color={Colors.darkGray}/>
                    </View>
                    }
                    </View>
                </ScrollView>
            </View>
        </View>
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

export default PetStoreScreen;

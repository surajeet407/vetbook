import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    ImageBackground,
    RefreshControl
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Title from '../reusable_elements/Title';
import Colors from '../util/Colors';
import database from '@react-native-firebase/database';
import RNMasonryScroll from "react-native-masonry-scrollview";
import HorizontalCategoryList from '../reusable_elements/HorizontalCategoryList'
import * as Animatable from 'react-native-animatable';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Icon, {Icons} from '../util/Icons';
import {Searchbar} from 'react-native-paper';
import i18n from '../util/i18n';

const AdoptPetScreen = ({navigation}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [loadind,
        setLoading] = useState(true);
    const [selectedCategoryIndex,
        setSelectedCategoryIndex] = useState(0);
    const [petCategories,
        setPetCategories] = useState([]);
    const [pets,
        setPets] = useState([]);
    const categoryCarousel = useRef(null);
    const [searchQuery,
        setSearchQuery] = React.useState('');

    const onPressCaraousel = (orgs) => {
        setSelectedCategoryIndex(orgs.index);
        categoryCarousel
            .current
            .scrollToIndex(orgs, {
                animated: true,
                viewPosition: 2
            })
        let path = ""
        if (petCategories[orgs.index].name === 'Dogs') {
            path = "/petDogs"
        } else if (petCategories[orgs.index].name === 'Cats') {
            path = "/petCats"
        } else if (petCategories[orgs.index].name === 'Birds') {
            path = "/petBirds"
        } else {
            path = "/petRabbits"
        }
        database()
            .ref(path)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPets(snapshot.val())
                } else {
                    setPets([])
                }
            })
    }
    const ITEM_SIZE = Dimensions
        .get('window')
        .width / 2 - 15;
    const onChangeSearch = query => {
        setSearchQuery(query)
        let path = ""
        if (petCategories[selectedCategoryIndex].name === 'Dogs') {
            path = "/petDogs"
        } else if (petCategories[selectedCategoryIndex].name === 'Cats') {
            path = "/petCats"
        } else if (petCategories[selectedCategoryIndex].name === 'Birds') {
            path = "/petBirds"
        } else {
            path = "/petRabbits"
        }
        if (query.length > 0) {
            database()
                .ref(path)
                .on('value', snapshot => {
                    if (snapshot.val()) {
                        setPets(snapshot.val().filter(item => item.name.toLowerCase().includes(query.toLowerCase())))
                    }
                })
        } else {
            database()
                .ref(path)
                .on('value', snapshot => {
                    if (snapshot.val()) {
                        setPets(snapshot.val())
                    }
                })
        }
    };
    const getData = () => {
        database()
            .ref('/petCategories')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPetCategories(snapshot.val())
                }
            })
        database()
            .ref('/petDogs')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setLoading(false);
                    setPets(snapshot.val())
                }
            })

    }
    const onRefresh = () => {
        setRefreshing(true)
        let path
        if (petCategories[selectedCategoryIndex].name === 'Dogs') {
            path = "/petDogs"
        } else if (petCategories[selectedCategoryIndex].name === 'Cats') {
            path = "/petCats"
        } else if (petCategories[selectedCategoryIndex].name === 'Birds') {
            path = "/petBirds"
        } else {
            path = "/petRabbits"
        }
        database()
            .ref(path)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setRefreshing(false)
                    setPets(snapshot.val())
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
                headerHeight={100}
                headerText={'Adopt'}
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
                flex: 1,
                backgroundColor: Colors.appBackground,
                width: '100%'
            }}>
                <View style={{alignItems: 'center'}}>
                    <View style={{
                            width: '90%'
                        }}>
                        <Searchbar
                            placeholder="Search"
                            onChangeText={onChangeSearch}
                            value={searchQuery}/>
                    </View>
                </View>
                {loadind
                    ? <ScrollView>
                            <Animatable.View
                                style={{
                                marginTop: 20,
                                paddingHorizontal: 20
                            }}
                                animation={'fadeIn'}>
                                <SkeletonPlaceholder
                                    style={{
                                    padding: 20
                                }}>
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{alignItems: 'center'}}>
                                            <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                            <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                            <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                            <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                            <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        marginTop: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View
                                            style={{
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                        <View
                                            style={{
                                            marginTop: 20,
                                            marginLeft: 5,
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                    </View>
                                    <View
                                        style={{
                                        marginTop: 5,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View
                                            style={{
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                        <View
                                            style={{
                                            marginTop: 20,
                                            marginLeft: 5,
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                    </View>
                                    <View
                                        style={{
                                        marginTop: 5,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View
                                            style={{
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                        <View
                                            style={{
                                            marginTop: 20,
                                            marginLeft: 5,
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                    </View>
                                    <View
                                        style={{
                                        marginTop: 5,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View
                                            style={{
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                        <View
                                            style={{
                                            marginTop: 20,
                                            marginLeft: 5,
                                            width: Dimensions
                                                .get('screen')
                                                .width / 2 - 30,
                                            height: 160,
                                            borderRadius: 20
                                        }}/>
                                    </View>
                                </SkeletonPlaceholder>
                            </Animatable.View>
                        </ScrollView>
                    : <View
                        style={{
                        paddingHorizontal: 20,
                        marginBottom: 140
                    }}>
                        <FlatList
                            ref={categoryCarousel}
                            style={{
                            marginTop: 20,
                            height: 120
                        }}
                            data={petCategories}
                            scrollEnabled={true}
                            keyExtractor={(item) => item.id}
                            horizontal
                            pagingEnabled
                            bounces={false}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (<View
                            style={{
                            marginLeft: 15
                        }}/>)}
                            snapToAlignment={'center'}
                            snapToInterval={Dimensions
                            .get('window')
                            .width / 8}
                            getItemLayout={(data, index) => ({
                            length: Dimensions
                                .get('window')
                                .width / 8,
                            offset: Dimensions
                                .get('window')
                                .width / 8 * index,
                            index
                        })}
                            renderItem={({item, index, separators}) => (
                            <HorizontalCategoryList
                                categoryTitle={item.name}
                                onPress={() => onPressCaraousel({index})}
                                image={item.image}
                                selectedCategoryIndex={selectedCategoryIndex}
                                index={index}
                                animationStyle="fadeInLeft"/>
                            )}/> 
                            {pets.length > 0
                            ? <RNMasonryScroll
                                    refreshControl={<RefreshControl progressViewOffset={20} colors={[Colors.primary, Colors.secondary]} refreshing={refreshing} onRefresh={onRefresh} />}
                                    style={{
                                    marginTop: 20
                                }}
                                    removeClippedSubviews={true}
                                    columns={2}
                                    oddColumnStyle={{
                                    marginTop: 30
                                }}
                                    horizontal={false}
                                    showsVerticalScrollIndicator={false}>
                                    {pets.map((item, index) => 
                                    <Animatable.View
                                        delay={100 * index}
                                        animation={'fadeInUp'}
                                        key={index}
                                        style={{
                                        backgroundColor: item.color,
                                        borderRadius: 15,
                                        elevation: 5,
                                        overflow: "hidden",
                                        margin: 5
                                    }}>
                                        <TouchableOpacity
                                            style={{
                                            borderRadius: 15,
                                            alignItems: 'flex-start'
                                        }}
                                            onPress={() => navigation.navigate("PetDetail", {item: item})}>
                                            <Image
                                                style={{
                                                width: ITEM_SIZE - 15,
                                                height: 180
                                            }}
                                                source={{
                                                uri: item.image
                                            }}></Image>
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                            backgroundColor: Colors.darkOverlayColor,
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            paddingHorizontal: 15,
                                            paddingVertical: 5,
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20
                                        }}>
                                            <View style={{}}>
                                                <Title fontFamily={'Redressed-Regular'} color={'#fff'} size={20} bold={true} label={item.name}/>
                                            </View>
                                            <View
                                                style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}>
                                                <View
                                                    style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <Icon
                                                        type={Icons.Ionicons}
                                                        style={{
                                                        marginRight: 5
                                                    }}
                                                        name={'time-outline'}
                                                        color={Colors.appBackground}
                                                        size={12}/>
                                                    <Title fontFamily={'PTSerif-BoldItalic'} color={'#fff'} size={12} bold={true} label={item.details[1].value}/>
                                                </View>
                                                <View
                                                    style={{
                                                    marginLeft: 15,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <Icon
                                                        type={Icons.Ionicons}
                                                        style={{
                                                        marginRight: 5
                                                    }}
                                                        name={item.details[2].value === 'Male'
                                                        ? 'male'
                                                        : 'female'}
                                                        color={Colors.appBackground}
                                                        size={16}/>
                                                    <Title
                                                        fontFamily={'PTSerif-BoldItalic'}
                                                        color={'#fff'}
                                                        size={12}
                                                        bold={true}
                                                        label={item.details[2].value === 'Male'
                                                        ? 'boy'
                                                        : 'Girl'}/>
                                                </View>
                                            </View>
                                        </View>
                                    </Animatable.View>)}
                                </RNMasonryScroll>
                            : <View
                                style={{
                                alignItems: 'center',
                                marginTop: 20
                            }}>
                                <Title label="No pets are found in here..." size={20} color={Colors.darkGray}/>
                            </View>
}
                    </View>
}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    categoriesListContainer: {
        justifyContent: 'space-around'
    }
});

export default AdoptPetScreen;

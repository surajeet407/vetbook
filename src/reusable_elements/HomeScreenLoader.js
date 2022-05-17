import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Colors from '../util/Colors';
import * as Animatable from 'react-native-animatable';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const HomeScreenLoader = () => {

    return (

        <Animatable.View
            animation={'fadeIn'}
            style={{
            padding: 10
        }}>
            <SkeletonPlaceholder style={{
                padding: 20
            }}>
                <View
                    style={{
                    borderColor: Colors.darkGray,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 20
                }}>
                    <View
                        style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        alignItems: "center",
                        width: '100%'
                    }}>
                        <View
                            style={{
                            justifyContent: 'space-between',
                            alignItems: "center"
                        }}>
                            <View
                                style={{
                                width: Dimensions
                                    .get("screen")
                                    .width / 2 - 50,
                                height: 20,
                                borderRadius: 4
                            }}/>
                            <View
                                style={{
                                width: 50,
                                marginTop: 20,
                                height: 20,
                                borderRadius: 4
                            }}/>
                        </View>
                        <View
                            style={{
                            marginTop: 6,
                            width: Dimensions
                                .get("screen")
                                .width / 2 - 50,
                            height: 120,
                            borderRadius: 30
                        }}/>
                    </View>
                </View>
                <View
                    style={{
                    borderColor: Colors.darkGray,
                    borderWidth: 1,
                    padding: 10,
                    alignItems: 'center',
                    marginTop: 20
                }}>
                    <View
                        style={{
                        width: 80,
                        height: 20,
                        borderRadius: 4
                    }}/>
                </View>
                <View
                    style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View
                        style={{
                        borderColor: Colors.darkGray,
                        borderWidth: 1,
                        padding: 10,
                        width: Dimensions
                            .get('screen')
                            .width / 2 - 30,
                        height: 140,
                        borderRadius: 20
                    }}>
                        <View
                            style={{
                            width: 80,
                            height: 20,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            width: 100,
                            height: 15,
                            marginTop: 10,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View
                                style={{
                                width: 20,
                                height: 15,
                                borderRadius: 4
                            }}/>
                            <View
                                style={{
                                width: 40,
                                height: 40,
                                borderRadius: 4
                            }}/>
                        </View>
                    </View>
                    <View
                        style={{
                        borderColor: Colors.darkGray,
                        borderWidth: 1,
                        padding: 10,
                        width: Dimensions
                            .get('screen')
                            .width / 2 - 30,
                        height: 140,
                        borderRadius: 20
                    }}>
                        <View
                            style={{
                            width: 80,
                            height: 20,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            width: 100,
                            height: 15,
                            marginTop: 10,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View
                                style={{
                                width: 20,
                                height: 15,
                                borderRadius: 4
                            }}/>
                            <View
                                style={{
                                width: 40,
                                height: 40,
                                borderRadius: 4
                            }}/>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View
                        style={{
                        borderColor: Colors.darkGray,
                        borderWidth: 1,
                        padding: 10,
                        width: Dimensions
                            .get('screen')
                            .width / 2 - 30,
                        height: 140,
                        borderRadius: 20
                    }}>
                        <View
                            style={{
                            width: 80,
                            height: 20,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            width: 100,
                            height: 15,
                            marginTop: 10,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View
                                style={{
                                width: 20,
                                height: 15,
                                borderRadius: 4
                            }}/>
                            <View
                                style={{
                                width: 40,
                                height: 40,
                                borderRadius: 4
                            }}/>
                        </View>
                    </View>
                    <View
                        style={{
                        borderColor: Colors.darkGray,
                        borderWidth: 1,
                        padding: 10,
                        width: Dimensions
                            .get('screen')
                            .width / 2 - 30,
                        height: 140,
                        borderRadius: 20
                    }}>
                        <View
                            style={{
                            width: 80,
                            height: 20,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            width: 100,
                            height: 15,
                            marginTop: 10,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View
                                style={{
                                width: 20,
                                height: 15,
                                borderRadius: 4
                            }}/>
                            <View
                                style={{
                                width: 40,
                                height: 40,
                                borderRadius: 4
                            }}/>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                    borderColor: Colors.darkGray,
                    borderWidth: 1,
                    marginTop: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 20
                }}>
                    <View
                        style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50
                    }}/>
                    <View style={{
                        marginLeft: 20
                    }}>
                        <View
                            style={{
                            width: 100,
                            height: 20,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            marginTop: 10,
                            width: 200,
                            height: 10,
                            borderRadius: 4
                        }}/>
                    </View>
                </View>
                <View
                    style={{
                    borderColor: Colors.darkGray,
                    borderWidth: 1,
                    marginTop: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 20
                }}>
                    <View
                        style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50
                    }}/>
                    <View style={{
                        marginLeft: 20
                    }}>
                        <View
                            style={{
                            width: 100,
                            height: 20,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            marginTop: 10,
                            width: 200,
                            height: 10,
                            borderRadius: 4
                        }}/>
                    </View>
                </View>
                <View
                    style={{
                    borderColor: Colors.darkGray,
                    borderWidth: 1,
                    marginTop: 20,
                    padding: 10,
                    borderRadius: 20
                }}>
                    <View
                        style={{
                        marginTop: 10,
                        width: Dimensions
                            .get("screen")
                            .width - 120,
                        height: 20,
                        borderRadius: 4
                    }}/>
                    <View
                        style={{
                        marginTop: 10,
                        width: Dimensions
                            .get("screen")
                            .width - 50,
                        height: 10,
                        borderRadius: 4
                    }}/>
                    <View
                        style={{
                        marginTop: 10,
                        width: Dimensions
                            .get("screen")
                            .width - 90,
                        height: 10,
                        borderRadius: 4
                    }}/>
                    <View
                        style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View
                            style={{
                            width: 60,
                            height: 10,
                            borderRadius: 4
                        }}/>
                        <View
                            style={{
                            width: 40,
                            height: 25,
                            borderRadius: 4
                        }}/>
                    </View>
                </View>
            </SkeletonPlaceholder>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({});

export default HomeScreenLoader;

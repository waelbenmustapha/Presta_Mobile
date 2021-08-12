import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
export default function Homepage({ navigation }) {
    return (
        <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} style={styles.container} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
            <View style={styles.header}>
               <Text style={{fontSize:80}}>Descrpition goes BRRRRR</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Text style={styles.title}>Notre plaisir est de vous faire plaisir !</Text>
                <Text style={styles.text}>Nous cherchons à vous faciliter la vie</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('ListeCategorie')}>
                        <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.start}  >
                            <Text style={styles.textSign}>Consulter les Categories</Text>
                            <AntDesign style={styles.icon} name="rightcircle" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </Animatable.View>


        </LinearGradient>
    );
}

const { height } = Dimensions.get("screen");

const height_logo = height * 0.25;
const width_logo = height * 0.17;


const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: width_logo,
        height: height_logo,
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 30
    },
    title: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        opacity: 0.6
    },
    text: {
        color: '#000',
        opacity: 0.5,
        marginTop: 5,
        marginBottom: 26

    },
    button: {
        marginTop: 20
    },
    start: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    textSign: {
        color: '#fff',
        fontWeight: 'bold'
    },
    icon: {
        marginLeft: 10
    }
})
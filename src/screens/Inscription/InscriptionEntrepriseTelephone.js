import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InscriptionPrestataireTelephone({ route, navigation }) {
    let clockCall = null
    const defaultCountdown = 30
    const [countdown, setCountdown] = useState(defaultCountdown)
    const [enableResend, setEnableResend] = useState(false)
    const [code, setCodeNumber] = useState("")
    const [valcode, setvalcode] = useState("");
    const [testok, setTestok] = useState(false)
    const [valCode2, setValcode2] = useState("")
    
    const [service, setService] = useState(route.params.service)
    const [picone, setPicone] = useState(route.params.image1)
    const [nom, setNom] = useState(route.params.nom)
    const [phone, setPhone] = useState(route.params.phone)
    const [email, setEmail] = useState(route.params.email)
    const [password, setPassword] = useState(route.params.password)
    const [matfisc, setMatfisc] = useState(route.params.matfisc)


    const axiosApiCallAdd = () => {
        const config = {
            headers:
            {
                'Content-Type': 'application/json',
            }
        }
        axios.post("http://192.168.43.100:8090/entreprise/ajouterEntreprise/" + service,
            {
                email: email,
                mot_de_passe: password,
                nom: nom,
                numero_telephone: phone,
             latitude:route.params.marker.latitude,
             longitude:route.params.marker.longitude,
                image_verification1: picone,
                matfisc:matfisc
            }, config)
            .then((response) => {
                Alert.alert("Inscription est en attente pour la validation de l'administrateur");
                navigation.navigate('LoginDemandeur');
            })
            .catch((error) => {
                console.log(error)
            }
        )
    }
    const Callforput = () => {
        const x = {
            mobilenumber: phone,
            otp: code
        }
        if (code.length === 4) {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios.put("http://192.168.43.100:8090/mobilenumbers/otp", x, config)
                .then((response) => {
                    console.log(response.data)
                    console.log(x)
                    if (response.data == "OTP is verified Successfully")
                    {
                        Alert.alert("Code verifié avec succès");
                        axiosApiCallAdd();
                    }
                    else
                    {
                        Alert.alert("Code invalide");
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        setTestok(false)
    }
    const axiosApiCall = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.post("http://192.168.43.100:8090/mobilenumbers/otp", phone, config, {
            auth: {
                username: "user",
                password: "24d65986-53c6-4fcc-b76f-1056199328f0"
            }
        })
            .then((response) => {

            })
            .catch((error) => {
                console.log(error)
            })
    }
    useEffect(() => {
        if (testok == true) {
            Callforput()
            //setValcode2(valcode)
        }
        if (valcode !== "") {
            setValcode2(valcode)
            setTimeout(function () {
                setValcode2("")
            }, 1000);
        }
    }, [testok, valcode])


    useEffect(() => {
        clockCall = setInterval(() => {
            decrementClock();
        }, 1000)
        return () => {
            clearInterval(clockCall)
        }
    })
    const decrementClock = () => {
        if (countdown === 0) {
            setEnableResend(true)
            setCountdown(0)
            clearInterval(clockCall)
        } else {
            setCountdown(countdown - 1)
        }
    }
    const onResendOTP = () => {
        axiosApiCall();
        if (enableResend) {
            setCountdown(defaultCountdown)
            setEnableResend(false)
            clearInterval(clockCall)
            clockCall = setInterval(() => {
                decrementClock()
            }, 1000)
        }
    }
    return (
        <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} style={{ flex: 1 }} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
            <KeyboardAvoidingView keyboardVerticalOffset={50} behavior={'padding'} style={styles.containerAvoidingView}>
                <View style={styles.header}>
                    <Text style={styles.text_header}>Vérification du compte</Text>
                    <Text style={styles.text}>Tapez le code que vous avez reçu! </Text>
                </View>
                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.otpInputStyle}
                        placeholder="Tapez le code"
                        keyboardType="numeric"
                        maxLength={4}
                        value={code}
                        onChangeText={(text) => setCodeNumber(text)}
                    />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.button}>
                        <TouchableOpacity style={[styles.start, { backgroundColor: enableResend ? '#fff' : '#DCECFD' }]} onPress={onResendOTP} >
                            <Text style={[styles.textStart, { opacity: enableResend ? 0.6 : 0.45 }]} >Renvoyer le SMS ({countdown})</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={[styles.start, { backgroundColor: code.length === 4 ? '#fff' : '#DCECFD' }]} onPress={Callforput}>
                            <Text style={[styles.textStart, { opacity: code.length === 4 ? 0.6 : 0.45 }]} >Continuer</Text>
                            <AntDesign style={[styles.icon, { opacity: code.length === 4 ? 0.6 : 0.45 }]} name="rightcircle" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    containerAvoidingView: {
        flex: 1,
        padding: 10
    },
    header: {
        paddingTop: 22,
        alignItems: 'center',
    },
    start: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fff'
    },
    icon: {
        marginLeft: 10,
    },
    button: {
        flex: 1,
        margin: 6,
        marginBottom: 92,
    },
    textStart: {
        fontWeight: 'bold',
        color: '#000',
        opacity: 0.45
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20
    },
    text: {
        color: '#fff',
        opacity: 0.7,
        marginTop: 8,
        fontSize: 16
    },
    containerInput: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
        borderBottomColor: 'gray',
        marginTop: 58,
        marginBottom: 92,
        borderBottomWidth: 1.5
    },
    otpInputStyle: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? 0 : -12,
        paddingLeft: 12,
        color: '#05375a',
        height: 50
    }
});
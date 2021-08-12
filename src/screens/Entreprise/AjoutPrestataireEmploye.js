import React, {  useEffect, useState } from 'react';
import { Picker, TextInput, Alert,  View, StyleSheet, Text,   TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Feather,  FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';


export default function AjoutPrestataireEmploye({ navigation }) {
    const [check_textInputChange, setCheck_textInputChange] = React.useState(false)
    const [check_emailInputChange, setCheck_emailInputChange] = React.useState(false)
    const [check_passwordInputChange, setCheck_passwordInputChange] = React.useState(false)
    const [check_phoneInputChange, setCheck_phoneInputChange] = React.useState(false)
    const [check_adresseInputChange, setCheck_adresseInputChange] = React.useState(false)
    const [secureTextEntry, setSecureTextEntry] = React.useState(false)
    
    const [nom, setNom] = React.useState()
    const [email, setEmail] = React.useState()
    const [password, setPassword] = React.useState()
    const [phone, setPhone] = React.useState()
    const [adresse, setAdresse] = React.useState()

    
    const [selectedcategorie, setSelectedcat] = useState('');
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedservice, setSelectedservice] = useState('');
    const [selectagain, setSelectagain] = useState(true);
    const [connecteduser, setconnecteduser] = useState();
    //constants to handle inputs errors
    const [emailError, setEmailError] = React.useState(null)
    const [passwordError, setPasswordError] = React.useState(null)
    const [textError, setTextError] = React.useState(null)
    const [phoneError, setPhoneError] = React.useState(null)
    const [adresseError, setAdresseError] = React.useState(null)

    async function getconnecteduser() {
        const tokeen = await AsyncStorage.getItem('token');
        await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/" + tokeen).then(response => {
            setconnecteduser(response.data);
        })
        } 
    function ajouteremploye() {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            axios.post("http://192.168.43.100:8090/employe/ajouterEmploye",
                {
                    "nom": nom,
                    "email": email,
                    "mot_de_passe": password,
                    "numero_telephone": phone,
                    "addresse":adresse,
                    "entreprise": {
                        "id": connecteduser.id,
                    }
                }
                , config, {
                auth: {
                    username: "user",
                    password: "0000"
                }
            })
            Alert.alert("Employé ajouté")
    }
    //Fonction pour vérifier l'input de nom
    const textInputChange = (text) => {
        let reg = /^[A-Za-z ]+$/;
        if (reg.test(text) === true) {
            setCheck_textInputChange(true);
            setNom(text);
            setTextError(null);
        }
        else
        {
            setCheck_textInputChange(false);
        }
    }
    //Fonction pour valider l'email
    const validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === true) {
            setCheck_emailInputChange(true);
            setEmail(text);
            setEmailError(null);
        }
        else
        {
            setCheck_emailInputChange(false);
        }
    }
    //Fonction pour valider le mot de passe
    const handlePasswordChange = (text) => {
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (reg.test(text) === true) {
            setCheck_passwordInputChange(true);
            setPassword(text);
            setPasswordError(null);
        }
        else
        {
            setCheck_passwordInputChange(false);
        }
    }
    //Fonction pour valider le numéro de téléphone
    const validatePhoneNumber = (text) => {
        let reg = /^[2,4,5,9][0-9]{7}$/;
        if (reg.test(text) === true) {
            setCheck_phoneInputChange(true);
            setPhone(text); 
            setPhoneError(null);
        }
        else
        {
            setCheck_phoneInputChange(false);
        }
    }
    //Fonction pour vérifier l'input de Adresse
    const adresseInputChange = (text) => {
        let reg = /^[A-Za-z0-9 -_,./]+$/;
        if (reg.test(text) === true) {
            setCheck_adresseInputChange(true);
            setAdresse(text);
            setAdresseError(null);
        }
        else
        {
            setCheck_adresseInputChange(false)
        }
    }
    useEffect(() => {
        getconnecteduser();
    }, []);
    //Fonction pour changer l'etat de secure Text Entry du mot  de passe
    const updateSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    }
    const checkInputs = () => {
        if (check_textInputChange === false )
        {
            setTextError("Vérifiez votre nom")
        }
        if (check_emailInputChange === false )
        {
            setEmailError("Vérifiez votre email")
        }
        if (check_phoneInputChange === false)
        {
            setPhoneError("Vérifiez votre numéro de téléphone")
        }
        if (check_passwordInputChange === false) 
        {
            setPasswordError("Vérifiez votre mot de passe");
        }
        if (check_adresseInputChange === false) {
            setAdresseError("Vérifiez votre adresse")
        }
    }
    const onPressContinue = () => {
        checkInputs();
        if (check_textInputChange && check_emailInputChange && check_phoneInputChange && check_adresseInputChange && check_passwordInputChange)
        {
            ajouteremploye();
            navigation.replace('ListeEmployeEntreprise')
        }
        else
        {
            Alert.alert(" Vous devez remplir tous les champs")
            }
        
    }
    return (
        <SafeAreaView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1,paddingTop:3}}>
                <ScrollView style={styles.footer}>
                    <View style={styles.action}>
                        <FontAwesome style={styles.icon} name="user-o" size={20} color="#000" />
                        <TextInput 
                            placeholder="Nom et prénom" 
                            style={styles.textInput} 
                            autoCapitalize="none"
                            onChangeText={(text) => textInputChange(text)} />
                    </View>
                    {textError !== null ?
                        <Text style={styles.textError}>{textError}</Text> : null
                    }
                    <View style={styles.action}>
                        <Feather style={styles.icon} name="map-pin" size={18} color="#000" />
                        <TextInput 
                            placeholder="Adresse" 
                            style={styles.textInput} 
                            autoCapitalize="none"
                            onChangeText={(text) => adresseInputChange(text)} />
                    </View>
                    {adresseError !== null?
                        <Text style={styles.textError}>{adresseError}</Text> : null
                    }
                    <View style={styles.action}>
                        <Feather style={styles.icon} name="phone" size={18} color="#000" />
                        <TextInput 
                            placeholder="Numéro de téléphone" 
                            style={styles.textInput} 
                            autoCapitalize="none"
                            keyboardType="numeric"
                            onChangeText ={(text) => validatePhoneNumber(text)}/>
                    </View>
                    {phoneError !== null ?
                        <Text style={styles.textError}>{phoneError}</Text> : null
                     }
                    <View style={styles.action}>
                        <FontAwesome5 style={styles.icon} name="envelope" size={18} color="#000" />
                        <TextInput 
                            placeholder="Email" 
                            style={styles.textInput} 
                            autoCapitalize="none"
                            onChangeText={(text) => validateEmail(text)} />
                    </View>
                    {emailError !== null ?
                        <Text style={styles.textError}>{emailError}</Text> : null
                    }
                    <View style={styles.action}>
                        <Feather style={styles.icon} name="lock" color="#000" size={18} />
                        <TextInput 
                            placeholder="Mot de passe"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(text) => handlePasswordChange(text)}
                            secureTextEntry={secureTextEntry ? false : true} />
                        <TouchableOpacity onPress={updateSecureTextEntry}>
                            {secureTextEntry ?
                                <Feather name="eye" color="grey" size={20} />
                                :
                                <Feather name="eye-off" color="grey" size={20} />
                            }
                        </TouchableOpacity>
                    </View>
                    {passwordError !== null ?
                        <Text style={styles.textError}>{passwordError}</Text> :
                        <Text style={styles.textPass}>Minimum 8 caractères, 1 lettre majuscule, 1 lettre minuscule et 1 chiffre</Text>     
                }
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={styles.button} onPress={onPressContinue}>
                        <LinearGradient style={styles.start} colors={['#0dacfa', '#45d3f4', '#70e9ef']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
                            <Text style={styles.textSign} >Ajouter un employé</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                    <View style={styles.login}>
                    </View>
                </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopRightRadius: 55
    },
    start: {
       height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        flexDirection: 'row',
        width: '100%',
        
    },
    header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    footer: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 50
    },
    textPass: {
        margin: 2,
        opacity: 0.6,
        fontSize: 10
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 25
    },
    text_footer: {
        color: '#05375a',
        fontSize: 16
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 6
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    text: {
        color: '#fff',
        opacity: 0.7,
        marginTop: 4,
        fontSize: 18

    },
    login: {
        padding: 10
    },
    appButtoncontainer: {
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? 0 : -12,
        paddingLeft: 12,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
       flex: 1,
        margin: 6,
        marginTop: 32,
    },
    textSign: {
        fontWeight: 'bold',
        color: '#fff'
    },
    textError:{
        color:'#CA0B00',
        fontSize: 12
    },
    icon: {
        margin: 4
    }

});
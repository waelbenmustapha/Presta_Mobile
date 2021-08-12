import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModificationMdp({ route, navigation }) {

  let clockCall = null
  const defaultCountdown = 30
  const [countdown, setCountdown] = useState(defaultCountdown)
  const [enableResend, setEnableResend] = useState(false)
  const [password, setPassword] = useState("")
  const [valcode, setvalcode] = useState("")
  const [testok, setTestok] = useState(false)
  const [valCode2, setValcode2] = useState("")
const [passwrong,setpasswrong]=useState(false);
  const Callforput = () => {

    //if (code.length === 4){}
    //setTestok(false)
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

  const Ok = () => {
    if (passwrong == false) {
     
      let email = route.params.userEmail;
      console.log(email)
      axios.put("http://192.168.43.100:8090/demandeur/changeDemandeurPassword/" + `${email}` + "/" + `${password}`).then((response) => {
        console.log(response)
        if (response.data == "Success") {
          Alert.alert("Mot de passe modifié");
          navigation.navigate('LoginDemandeur')
        }
        else
          Alert.alert("Nous rencontrons un problème à modifier votre mot de passe !");
      })
        .catch((error) => {
          console.log(error)
        })

      setTestok(true)
    }
    else {
      Alert.alert("Vérifiez votre mot de passe")
    }

  }

 

  useEffect(() => {
    clockCall = setInterval(() => {
      decrementClock();
    }, 1000)
    return () => {
      clearInterval(clockCall)
    }
  })
  const handlePasswordChange = (text) => {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (reg.test(text) === true) {
       setpasswrong(false);
    }
    else
    {
      setpasswrong(true);
    }
  }
  const decrementClock = () => {
    if (countdown === 0) {
      setEnableResend(true)
      setCountdown(0)
      clearInterval(clockCall)
    } else {
      setCountdown(countdown - 1)
    }
  }
  return (
    <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} style={{ flex: 1 }} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
      <KeyboardAvoidingView keyboardVerticalOffset={50} behavior={'padding'} style={styles.containerAvoidingView}>
        <View style={styles.header}>
          <Text style={styles.text_header}>Modification du mot de passe</Text>
          <Text style={styles.text}>Entrer le nouveau mot de passe ! </Text>
        </View>
        <View style={styles.containerInput}>
          <TextInput

            style={styles.otpInputStyle}
            placeholder="Tapez votre nouveau mot de passe ..."
            //maxLength={4}
            value={password}
            onChangeText={(text)=>{setPassword(text);handlePasswordChange(text);}}
            secureTextEntry={true}
          />
          
        </View>
        <View>
          <Text style={[styles.text,{fontSize:12}]}>Minimum 8 caractères, 1 lettre majuscule, 1 lettre minuscule et 1 chiffre </Text>
        </View>

        <View style={{ flexDirection: "row" ,marginTop:36}}>
   
          <View style={styles.button}>
            <TouchableOpacity style={[styles.start, { backgroundColor: passwrong === false ? '#fff' : '#DCECFD' }]} onPress={Ok}>
              <Text style={[styles.textStart,{opacity: passwrong === false ? 0.2:0.7  }]} >Valider</Text>
              <AntDesign style={[styles.icon]} name="rightcircle" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>


      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  containerAvoidingView: {
    padding: 10
  },
  header: {
    paddingTop: 22,
    alignItems: 'center',
  },
  number: {
    color: '#000',
    opacity: 0.6
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

  },textError:{
    color:'black',
    fontSize: 12,opacity:0.8,padding:6,
  },
  containerInput: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderBottomColor: 'gray',
    marginTop: 58,
    borderBottomWidth: 1.5

  },
  openDialogView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputStyle: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : -12,
    paddingLeft: 12,
    color: '#05375a',
    height: 50
  }
});
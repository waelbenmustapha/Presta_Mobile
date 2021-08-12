import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VerificationCodePourMdp({ route, navigation }) {

  let clockCall = null
  const defaultCountdown = 30
  const [countdown, setCountdown] = useState(defaultCountdown)
  const [enableResend, setEnableResend] = useState(false)
  const [code, setCode] = useState("")
  const [user, setUser] = useState("")
  const [valcode, setvalcode] = useState("")
  const [testok, setTestok] = useState(false)
  const [valCode2, setValcode2] = useState("")

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

  const Ok = async () => {
  await axios.get("http://192.168.43.100:8090/demandeur/verifyCodeForPasswordChange/" + `${code}`).then((response) => {
    console.log(response.data)
    if (response.data !=null){
       let userEmail=response.data.email;
        console.log("userEmail")
        console.log(userEmail);
        navigation.navigate('ModificationMdp',{userEmail})}
      else
        Alert.alert("Code Invalide !"); 
    })
      .catch((error) => {
        Alert.alert("Code Invalide !"); 
      })

    setTestok(true)

  }

  const onChangeCode = (code) => {
    setCode(code)
  }

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
 
  return (
    <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} style={styles.container} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
      <KeyboardAvoidingView keyboardVerticalOffset={50} behavior={'padding'} style={styles.containerAvoidingView}>
        <View style={styles.header}>
          <Text style={styles.text_header}>Vérification du compte</Text>
          <Text style={styles.text}>Tapez le code reçu par email ! </Text>
        </View>
        <View style={styles.containerInput}>
          <TextInput

            style={styles.otpInputStyle}
            placeholder="Tapez le code"
            //maxLength={4}
            value={code}
            onChangeText={onChangeCode}
          />


        </View>
        <View style={{ flexDirection: "row" }}>
   
          <View style={styles.button}>
          <TouchableOpacity disabled={code.length==0} style={[styles.start, { backgroundColor: code.length === 6 ? '#fff' : '#DCECFD' }]} onPress={()=>{Ok()}}>
              <Text style={[styles.textStart, { opacity: code.length == 6 ? 0.6 : 0.45 }]} >Continuer</Text>
              <AntDesign  style={[styles.icon, { opacity: code.length == 6 ? 0.6 : 0.45 }]} name="rightcircle" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>


      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container:{flex:1},
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
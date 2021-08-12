import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';

export default function MotDePasseOublie({ route, navigation }) {

  let clockCall = null
  const defaultCountdown = 30
  const [countdown, setCountdown] = useState(defaultCountdown)
  const [enableResend, setEnableResend] = useState(false)
  const [email, setEmail] = useState("")
  const [check_emailInputChange, setCheck_emailInputChange] = React.useState(false)
  const [valcode, setvalcode] = useState("")
  const [testok, setTestok] = useState(false)
  const [valCode2, setValcode2] = useState("")
  const [loading, setLoading] = useState(false)

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

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const Ok = () => {
    if (check_emailInputChange) {
       setLoading(true);
      axios.post("http://192.168.43.100:8090/demandeur/resetPasswordVerification/" + `${email}`).then((response) => {
       
        console.log(response)
        if (response.data == "Succes") {
          setLoading(false);
          navigation.navigate('VerificationCodePourMdp')
          //wait(2000).then(() => setLoading(false));
        }
        else
          Alert.alert("Le compte n'existe pas !");
      })
        .catch((error) => {
          console.log(error)
        })

      setTestok(true)
    }
    else
    {
      Alert.alert("Vérifiez votre email")
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

  const decrementClock = () => {
    if (countdown === 0) {
      setEnableResend(true)
      setCountdown(0)
      clearInterval(clockCall)
    } else {
      setCountdown(countdown - 1)
    }
  }
  //Fonction pour valider l'email
    const validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === true) {
            setCheck_emailInputChange(true);
            setEmail(text);
        }
        else
        {
            setCheck_emailInputChange(false);
        }
    }
    return(
    <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} style={styles.container} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>  
        {loading == true ? (<View style={styles.overlay}>
          <View style={styles.containerLoading}>
            <ActivityIndicator color={'black'} />
            <Text style={styles.textLoading}>Loading...</Text>
          </View>
        </View>) :
    (
     <KeyboardAvoidingView keyboardVerticalOffset={50} behavior={'padding'} style={styles.containerAvoidingView}>
       <View style={styles.header}>
         <Text style={styles.text_header}>Mot de passe oublié</Text>
       </View>
       <View style={styles.containerInput}>
         <TextInput
           style={styles.otpInputStyle}
           placeholder="Tapez votre email ..."
           //maxLength={4}
           onChangeText={(text)=> validateEmail(text)}
         />
       </View>
       <View style={{ flexDirection: "row" }}>
          <View style={styles.button}>
            <TouchableOpacity style={[styles.start, { backgroundColor: check_emailInputChange ? '#fff' : '#DCECFD' }]} onPress={() => { Ok();}}>
              <Text style={[styles.textStart, { opacity: check_emailInputChange? 0.6 : 0.45 }]} >Continuer</Text>
              <AntDesign  style={[styles.icon, { opacity: check_emailInputChange ? 0.6 : 0.45 }]} name="rightcircle" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
   }    
  </LinearGradient> 
)
}
const styles = StyleSheet.create({
  container:
    { flex: 1 },
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
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#45d3f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLoading: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 8,
  },

  textLoading:{ marginLeft: 16,
    fontSize: 18,
    fontWeight: '500',}
});
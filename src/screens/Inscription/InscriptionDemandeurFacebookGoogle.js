import * as React from 'react';
import { View, Text, StyleSheet, Platform, TextInput, ScrollView ,TouchableOpacity, Alert } from 'react-native';
import { FontAwesome, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function InscriptionDemandeurFacebookGoogle({ navigation,route}) {
  const [phone, setPhone] = React.useState()
  const [check_phoneInputChange, setCheck_phoneInputChange] = React.useState(false)
  const [check_textInputChange, setCheck_textInputChange] = React.useState(false)
  const [secureTextEntry, setSecureTextEntry] = React.useState(false)
  const [validate, setValidate] = React.useState()
  //constants to handle inputs errors
  const [phoneError, setPhoneError] = React.useState(null)
  //Fonction pour vérifier l'input de nom
  
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
  //Fonction pour valider l'email
  
  //Fonction pour valider le mot de passe
  
  //Fonction pour changer l'etat de secure Text Entry du mot  de passe
  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }
  //Fonction pour vérifier les inputs
  const checkInputs = () => {
  
   
    
    if (check_phoneInputChange === false)
    {
      setPhoneError("Vérifiez votre numéro de téléphone");
    }
  }
  // fonction pour envoyer code de validation de compte par email
  const axiosApiCallEmail = () => {
    const config = {
    headers: {
      'Content-Type': 'application/json',
    }
    }
    axios.post("http://192.168.43.100:8090/demandeur/processRegister", route.params.email, config)
      .then((response) => {
        navigation.navigate('InscriptionDemandeurEmail',{password: "", nom: route.params.nom, phone: phone,email:route.params.email, code: response.data });
      })
      .catch((error) => {
        console.log(error)
      })
  }
  // fonction pour envoyer code de validation de compte par téléphone
  const axiosApiCall = () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      }
      axios.post("http://192.168.43.100:8090/mobilenumbers/otp", phone, config)
        .then((response) => {
          setValidate(response.data);
          navigation.navigate('InscriptionDemandeurTelephone', {password: "", nom: route.params.nom, phone: phone,email:route.params.email });

        })
        .catch((error) => {
          console.log(error)
        })
  }
  //fonction qui vérifie l'existance de l'email et envoi fait appel à la fonction de code de validation par email
  const verifyExistanceEmail = () => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
        }
    }
    axios.post("http://192.168.43.100:8090/demandeur/demandeurExistant", route.params.email, config)
      .then((response) => {
        if (response.data == "Compte existant") {
          Alert.alert("Adresse email utilisée pour un autre compte");
        }
        else
        {
          axiosApiCallEmail();
        }
      })
      .catch((error) => {
        console.log(error)
      })
    
  }
   //fonction qui vérifie l'existance de l'email et envoi fait appel à la fonction de code de validation par téléphone
  const verifyExistance = () => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
        }
    }
    axios.post("http://192.168.43.100:8090/demandeur/demandeurExistant", route.params.email, config)
      .then((response) => {
        if (response.data == "Compte existant") {
          Alert.alert("Adresse email utilisée pour un autre compte");
        }
        else
        {
          axiosApiCall();
        }
      })
      .catch((error) => {
        console.log(error)
      })
    
  }
  //vérification de compte avec numéro de téléphone
  const onPressContinuePhone = () => {
    checkInputs();
    if ( check_phoneInputChange) {
      verifyExistance();
    }
  }
  //vérification de compte avec adresse email
  const onPressContinueEmail = () => {
    checkInputs();
   
      verifyExistanceEmail();
    
  }
  return (
    <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} style={styles.container} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Bienvenue</Text>
        <Text style={styles.text}>Créez votre compte !</Text>
      </View>
      <View style={styles.footer}>
        <ScrollView>
          <View style={styles.action}>
            <FontAwesome style={styles.icon} name="user-o" size={20} color="#000" />
            <TextInput 
              value={route.params.nom}
              style={styles.textInput} 
              editable={false}
              autoCapitalize="none"
              onChangeText={(text) => textInputChange(text)} />
          </View>
          
          
          <View style={styles.action}>
            <FontAwesome5 style={styles.icon} name="envelope" size={18} color="#000" />
            <TextInput
              value={route.params.email}
              editable={false}
              style={styles.textInput} 
              autoCapitalize="none"
              onChangeText={(text) => validateEmail(text)} />
          </View>
         
          <View style={styles.action}>
            <Feather style={styles.icon} name="phone" size={20} color="#000" />
            <TextInput 
              placeholder="Tapez votre numéro de téléphone"
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText ={(text) => validatePhoneNumber(text)} />
          </View>
          {phoneError !== null ?
            <Text style={styles.textError}>{phoneError}</Text> : null
          }          
          <View style={styles.verif}>
            <Text style={styles.textVerif}>Vérifier votre compte</Text>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button} onPress={onPressContinuePhone}>
                <Feather name="phone" size={20} style={styles.iconVerif} />
                <Text style={styles.textSign} >Téléphone</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onPressContinueEmail}>
                <MaterialCommunityIcons name="email-outline" size={20} style={styles.iconVerif} />
                <Text style={styles.textSign} >Email</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.75,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: '#05375a',
    fontSize: 16
  },
  textPass: {
    margin: 2,
    opacity: 0.6,
    fontSize: 10
  },
  textError:{
    color:'#CA0B00',
    fontSize: 12
  },
  button: {
    borderRadius: 6,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical:12,
    backgroundColor: '#45d3f4',
    flexDirection: 'row',
    margin: 8
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16
  },
  verif: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 6
  },
  text: {
    color: '#fff',
    opacity: 0.7,
    marginTop: 4,
    fontSize: 18
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : -12,
    paddingLeft: 12,
    color: '#05375a',
  },
  textSign: {
    fontWeight: 'bold',
    color: '#fff'
  },
  icon: {
    margin: 4,
    opacity: 0.6,
    alignSelf:'center',
  },
  textVerif: {
    color: '#000',
    fontSize: 14,
    opacity: 0.6
  },
  iconVerif: {
    color: '#fff',
    marginRight: 8
  }

});
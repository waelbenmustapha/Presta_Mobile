import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, StatusBar, Alert} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { FontAwesome, Feather } from "@expo/vector-icons";
import axios from 'axios';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import AsyncStorage from '@react-native-community/async-storage';
import { registerForPushNotificationsAsync } from '../../Notifications/Notifications'
const LoginDemandeur = ({ navigation }) => {
  
  const [notificationtoken, setNotifToken] = React.useState("example")
  const [notification, setNotification] =  React.useState(false);
  const notificationListener =  React.useRef();
  const responseListener = React.useRef();
  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [secureTextEntry, setSecureTextEntry] = React.useState(false)
  const [check_emailInputChange, setCheck_emailInputChange] = React.useState(false)
  const [check_passwordInputChange, setCheck_passwordInputChange] = React.useState(false)
  const [token, setToken] = React.useState('test login')
  
  //constants to handle inputs errors
  const [emailError, setEmailError] = React.useState(null)
  const [passwordError, setPasswordError] = React.useState(null)
  //Fonction pour valider l'email
  const validate = (text) => {
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
  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {setNotifToken(token);console.log(token)});
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });
  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  });
  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
  }, []);
  const signInFB = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '3120349578207139',
      });

      const
        {
          type,
          token,
          expirationDate,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
        });
      if (type === 'success') {
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
          .then(response => response.json())
          .then(data => {
            const config = {
              headers:
              {
                'Content-Type': 'application/json',
              }
            }
            axios.post("http://192.168.43.100:8090/demandeur/ConsulterDemandeurByEmail/"+data.email,data.picture.data.url, config).then(response => {
              if (response.data.validation == 1 || response.data.role == 'Employe') {
                AsyncStorage.setItem("token", response.data.token)
                  if(response.data.role=='Prestataire'){navigation.reset({
                    index: 0,
                    routes: [{ name: 'ConnectedPrestataire' }],
                  });}
                  else if(response.data.role=='Demandeur'){navigation.reset({
                    index: 0,
                    routes: [{ name: 'ConnectedDemandeur' }],
                  });
                }  else if(response.data.role=='Entreprise'){navigation.reset({
                  index: 0,
                  routes: [{ name: 'ConnectedEntreprise' }],
                });}
                else if(response.data.role=='Employe'){navigation.reset({
                  index: 0,
                  routes: [{ name: 'ConnectedEmploye' }],
                });}
            }
            else{Alert.alert("Compte non valide","Compte n'est pas encore validé par l'administrateur")}
          
          })
          })
          .catch(e => console.log(e))

      } else {
        // type === 'cancel'
        console.log("FB login canceled");
      }
    } catch (error) {
      console.log("FB login error : " + error);
    }
  }

  //Fonction pour se connecter avec Google 
 const signIngoogle = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '708650245144-011vtv04ckgjt581kcdoccvk54ncot0v.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      if (result.type = "success") {
        const config = {
          headers:
          {
            'Content-Type': 'application/json',
          }
        }
        axios.post("http://192.168.43.100:8090/demandeur/ConsulterDemandeurByEmail/"+result.user.email,result.user.photoUrl, config).then(response => {
          if (response.data.validation == 1 || response.data.role == 'Employe') {
            AsyncStorage.setItem("token", response.data.token)
              if(response.data.role=='Prestataire'){navigation.reset({
                index: 0,
                routes: [{ name: 'ConnectedPrestataire' }],
              });}
              else if(response.data.role=='Demandeur'){navigation.reset({
                index: 0,
                routes: [{ name: 'ConnectedDemandeur' }],
              });
            }  else if(response.data.role=='Entreprise'){navigation.reset({
              index: 0,
              routes: [{ name: 'ConnectedEntreprise' }],
            });}
            else if(response.data.role=='Employe'){navigation.reset({
              index: 0,
              routes: [{ name: 'ConnectedEmploye' }],
            });}
        }
        else{Alert.alert("Compte non valide","Compte n'est pas encore validé par l'administrateur")}
      
      })
      }

      else {
        console.log("Canceled");
      }
    } catch (error) {
      console.log("Auth error : " + error);
    }
  }
  const signIn = async() => {
    const req = {
      "email": email,
      "mot_de_passe": password,
      "notification_token": notificationtoken
    }
      setLoading(true);
     await axios.post("http://192.168.43.100:8090/demandeur/loginDemandeur", req)
        .then(res => {
          setLoading(false);
            axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/" + res.data).then(response => {
              if (response.data.validation == 1 || response.data.role == 'Employe') {
                AsyncStorage.setItem("token", res.data)
                  if(response.data.role=='Prestataire'){navigation.reset({
                    index: 0,
                    routes: [{ name: 'ConnectedPrestataire' }],
                  });}
                  else if(response.data.role=='Demandeur'){navigation.reset({
                    index: 0,
                    routes: [{ name: 'ConnectedDemandeur' }],
                  });
                }  else if(response.data.role=='Entreprise'){navigation.reset({
                  index: 0,
                  routes: [{ name: 'ConnectedEntreprise' }],
                });}
                else if(response.data.role=='Employe'){navigation.reset({
                  index: 0,
                  routes: [{ name: 'ConnectedEmploye' }],
                });}
            }
            else{Alert.alert("Compte non valide","Compte n'est pas encore validé par l'administrateur")}
          
          }
        );
        },
          err => {
            setLoading(false);
            Alert.alert("Login ou mot de passe invalide!")
          }
    )
  }
  const checkInputs = () => {
    if (check_emailInputChange === false )
    {
      setEmailError("Vérifiez votre email")
    }
    if (check_passwordInputChange === false) 
    {
      setPasswordError("Vérifiez votre mot de passe");
    }
  }
  const onPressContinue = () => {
    checkInputs();
    if (check_emailInputChange && check_passwordInputChange) {
      signIn();
    }
  }
  
return (
  <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} style={styles.container} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>

  <View style={{flex:1}}>
    <StatusBar backgroundColor='#000' barStyle="light-content"/>
      <View style={styles.header}></View>
      <Animatable.View animation="fadeInUpBig" style={[styles.footer, {backgroundColor: '#FFF'}]}>
      <View style={styles.action}>
      <Feather
          name="user"
          style={{paddingBottom:7}}
          size={22}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#666666"
          style={styles.textInput} 
          autoCapitalize="none"
          onChangeText={(text) => validate(text)}
        />
      </View>
      {emailError !== null ?
            <Text style={styles.textError}>{emailError}</Text> : null
          }
      <View style={styles.action}>
        <Feather
          name="lock"
         
          size={20}
        />
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#666666"
          secureTextEntry={secureTextEntry ? false : true}
          style={styles.textInput} 
          autoCapitalize="none"
          onChangeText={(text) => handlePasswordChange(text)}
        />
        <TouchableOpacity
          onPress={updateSecureTextEntry}
        >
          {secureTextEntry ?
            <Feather
              name="eye-off"
              color="grey"
              size={20}/>:
            <Feather
              name="eye"
              color="grey"
              size={20} />
          }
        </TouchableOpacity>
      </View>
      {passwordError !== null ?
        <Text style={styles.textError}>{passwordError}</Text> : null
      }
    <TouchableOpacity onPress={()=>{navigation.navigate('MotDePasseOublie')}}>
      <Text style={{color: '#0dacfa', marginTop:15}}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
        <View style={styles.button}>
        <TouchableOpacity
          style={styles.signIn}
          onPress={onPressContinue}
        >
        <LinearGradient
          colors={['#0dacfa', '#0dacfa']}
          style={styles.signIn}
        >
        <Text style={[styles.textSign, {color:'#fff'}]}>Se connecter</Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text>--- OU ---</Text>
       <TouchableOpacity style={[styles.box, { backgroundColor: '#4267B2' }, { marginTop: 20 }]} onPress={signInFB}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome name="facebook-square" size={15} style={styles.icon} />
            <Text style={[{ color: '#fff',fontSize:12 }]}>Se connecter avec Facebook</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, { backgroundColor: '#DB4437' }, { marginTop: 20 }]} onPress={signIngoogle}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome name="google" size={15} style={styles.icon} />
            <Text style={[styles.text, { color: '#fff',fontSize:12  }]}>Se connecter avec Google</Text>
          </View>
        </TouchableOpacity>
<TouchableOpacity style={{width:'100%'}}
onPress={() => navigation.navigate('TypeUtilisateur')}>
<Text style={{color: '#0dacfa', marginTop:13,fontSize:15,margin:5,alignSelf:'flex-end'}}>Pas de compte ? S'inscrire</Text>
</TouchableOpacity>
</View>
     
<TouchableOpacity style={{height:70,marginTop:50}}
      onPress={() => navigation.navigate('Accueil')}>
      <Text style={[styles.textSign, {color: '#0dacfa',opacity:0.7,fontSize:15,textAlign:'center',flex:1,textAlignVertical:'center'}]}>Continuer sans s'inscrire
      </Text>
      </TouchableOpacity>
    </Animatable.View>
</View>
</LinearGradient>
);
};
export default LoginDemandeur;
const styles = StyleSheet.create({
 
 textError:{   color:'#CA0B00',
 fontSize: 12},
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 30
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 6
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 12,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 25
  },

  textSign: {
    fontSize: 15,
    fontWeight: 'bold'},
container: {
flex: 1,
backgroundColor: '#0dacfa'
},
icon: {
    color: '#fff',
    opacity: 0.8,
    marginRight: 8
  },
header: {
flex: 0.5,
justifyContent: 'flex-end',
paddingHorizontal: 20,
paddingBottom: 50
},
footer: {
flex: 3,
backgroundColor: '#fff',
borderTopLeftRadius: 30,
borderTopRightRadius: 30,
paddingHorizontal: 20,
paddingVertical: 30
},
text_header: {
color: '#fff',
fontWeight: 'bold',
fontSize: 30
},
text_footer: {
color: '#05375a',
fontSize: 18
},
action: {
flexDirection: 'row',
marginTop: 10,
borderBottomWidth: 1,
borderBottomColor: '#f2f2f2',
paddingBottom: 5
},
actionError: {
flexDirection: 'row',
marginTop: 10,
borderBottomWidth: 1,
borderBottomColor: '#FF0000',
paddingBottom: 5
},
textInput: {
flex: 1,
marginTop: Platform.OS === 'ios' ? 0 : -12,
paddingLeft: 10,
color: '#05375a',
},
errorMsg: {
color: '#FF0000',
fontSize: 14,
},
button: {
alignItems: 'center',
marginTop: 25
},
signIn: {
width: '90%',
height: 50,
justifyContent: 'center',
alignItems: 'center',
borderRadius: 10
},
textSign: {
fontSize: 15,
fontWeight: 'bold'
},
box: {
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 9
  }
});
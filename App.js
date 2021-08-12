import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import ConnectedEmploye from "./src/screens/Employe/ConnectedEmploye";
import LoginDemandeur from './src/screens/Connexion/LoginDemandeur';
import PasserDemandeDemandeur from './src/screens/Demande/PasserDemandeDemandeur';
import TypeUtilisateur from './src/screens/Inscription/TypeUtilisateur';
import ListeCategorie from './src/screens/Categorie/ListeCategorie';
import ListeService from './src/screens/service/ListeService';
import RechercheService from './src/screens/service/RechercheService';
import Presta from './src/screens/Connexion/Presta';
import ProfilePrestataire from './src/screens/Prestataire/ProfilePrestataire';
import InscriptionDemandeurTelephone from './src/screens/Inscription/InscriptionDemandeurTelephone';
import ListePrestataire from './src/screens/Prestataire/ListePrestataire';
import InscriptionDemandeur from './src/screens/Inscription/InscriptionDemandeur';
import ConnectedPrestataire from './src/screens/Prestataire/ConnectedPrestataire';
import ConnectedEntreprise from './src/screens/Entreprise/ConnectedEntreprise';
import InscriptionDemandeurEmail from './src/screens/Inscription/InscriptionDemandeurEmail';
import LoginLoading from './src/screens/Connexion/LoginLoading';
import ConnectedDemandeur from './src/screens/Demandeur/ConnectedDemandeur';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InscriptionEntreprise from './src/screens/Inscription/InscriptionEntreprise';
import InscriptionEntrepriseEmail from './src/screens/Inscription/InscriptionEntrepriseEmail';
import InscriptionEntrepriseTelephone from './src/screens/Inscription/InscriptionEntrepriseTelephone';
import { ActivityIndicator } from 'react-native';
import MotDePasseOublie from './src/screens/Connexion/MotDePasseOublie'
import VerificationCodePourMdp from './src/screens/Connexion/VerificationCodePourMdp'
import ModificationMdp from './src/screens/Connexion/ModificatonMdp'
import Deconnexion from './src/screens/Connexion/Deconnexion';
import Accueil from './src/screens/Accueil';
import InscriptionPrestataire from './src/screens/Inscription/InscriptionPrestataire';
import InscriptionPrestataireEmail from './src/screens/Inscription/InscriptionPrestataireEmail';
import InscriptionPrestataireTelephone from './src/screens/Inscription/InscriptionPrestataireTelephone';
import LoginFacebookGoogle from './src/screens/Inscription/loginfacebookgoogle';
import InscriptionDemandeurFacebookGoogle from './src/screens/Inscription/InscriptionDemandeurFacebookGoogle';
const Tab= createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack=createStackNavigator();
const EntrepriseStack=createStackNavigator();





const Loading=()=>(
  <View style={styles.overlay}>
     <View style={styles.container}>
     <ActivityIndicator color={'black'}/>
     <Text style={styles.text}>Loading...</Text>
     </View>
     </View>
)
const Connectedstackscreen=()=>(
<Stack.Navigator screenOptions={{headerShown:false}} >
<Stack.Screen name="LoginLoading" component={LoginLoading}/>
<Stack.Screen name="LoginDemandeur" component={LoginDemandeur} />
<Stack.Screen name='ConnectedEntreprise' component={ConnectedEntreprise}/>
<Stack.Screen name='ConnectedPrestataire' component={ConnectedPrestataire}/>
<Stack.Screen name='ConnectedDemandeur' component={ConnectedDemandeur}/>
<Stack.Screen name='ConnectedEmploye'  component={ConnectedEmploye}/>
<Stack.Screen name='Deconnexion'  component={Deconnexion}/>


  </Stack.Navigator>
)

const Somethingelse=()=>(
  <Stack.Navigator>
<Stack.Screen name='Loading' component={Loading}/>
</Stack.Navigator>
)
const Notconnectedstackscreen=()=>(
  
  <Stack.Navigator
      initialRouteName="Presta"
      screenOptions={{
        headerShown:false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
      }}
      mode="modal"
  ><Stack.Screen name="Presta" component={Presta} />
    <Stack.Screen name="Accueil" component={Accueil} />
    <Stack.Screen name="InscriptionDemandeurFacebookGoogle" component={InscriptionDemandeurFacebookGoogle} />
    <Stack.Screen name="LoginFacebookGoogle" component={LoginFacebookGoogle} />
    <Stack.Screen name="TypeUtilisateur" component={TypeUtilisateur} />
    <Stack.Screen name="LoginDemandeur" component={LoginDemandeur} />
    <Stack.Screen name="ListeCategorie" component={ListeCategorie} />
    <Stack.Screen name="InscriptionDemandeurEmail" component={InscriptionDemandeurEmail} />
    <Stack.Screen name="RechercheService" component={RechercheService} />
    <Stack.Screen name="ListeService" component={ListeService} />
    <Stack.Screen name="InscriptionDemandeur" component={InscriptionDemandeur} />
    <Stack.Screen name="LoginLoading" component={LoginLoading} />
    <Stack.Screen name="ListePrestataire" component={ListePrestataire} />
    <Stack.Screen name="ProfilePrestataire" component={ProfilePrestataire} />
    <Stack.Screen name='Passerdemande' component={PasserDemandeDemandeur} />
    <Stack.Screen name='ConnectedEntreprise' component={ConnectedEntreprise} />
    <Stack.Screen name='ConnectedPrestataire' component={ConnectedPrestataire} />
    <Stack.Screen name='ConnectedDemandeur' component={ConnectedDemandeur} />
    <Stack.Screen name='ConnectedEmploye' component={ConnectedEmploye} />
    <Stack.Screen name="MotDePasseOublie" component={MotDePasseOublie} />
    <Stack.Screen name="VerificationCodePourMdp" component={VerificationCodePourMdp} />
    <Stack.Screen name="ModificationMdp" component={ModificationMdp} />
    <Stack.Screen name="InscriptionDemandeurTelephone" component={InscriptionDemandeurTelephone} />
    <Stack.Screen name="Deconnexion" component={Deconnexion} />
    <Stack.Screen name="InscriptionEntreprise" component={InscriptionEntreprise} />
    <Stack.Screen name="InscriptionPrestataire" component={InscriptionPrestataire} />
    <Stack.Screen name="InscriptionPrestataireEmail" component={InscriptionPrestataireEmail} />
    <Stack.Screen name="InscriptionPrestataireTelephone" component={InscriptionPrestataireTelephone} />
    <Stack.Screen name="InscriptionEntrepriseEmail" component={InscriptionEntrepriseEmail} />
    <Stack.Screen name="InscriptionEntrepriseTelephone" component={InscriptionEntrepriseTelephone} />
  </Stack.Navigator>
)
export default function Home({ navigation, props }) {
  const [data, setData] = React.useState({
  userToken:'test'
});
const [isconnected,setisconnected]=useState(null);
const [connecteduser,setconnecteduser]=useState(null);

async function getconnecteduser() {
  const tokeen = await AsyncStorage.getItem('token');
  await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/" + tokeen).then(response => {
    setconnecteduser(response.data);
  })
  }
  const getToken = async () => {
    let token = await AsyncStorage.getItem('token').then(value => setData({ userToken: value }));
    return token;
  } 
 
  useEffect(() => {
   getToken();
 //AsyncStorage.removeItem('token')
getconnecteduser();
AsyncStorage.getItem('token')
.then((item) => {
if (item) {
setisconnected(true);}
else{setisconnected(false);}
});
  }, []);
  /*
}*/
return(
<NavigationContainer independent={true}>
{
   isconnected==false?
<Notconnectedstackscreen />
:
isconnected==true?
<Connectedstackscreen />:
<Somethingelse /> }
 
</NavigationContainer>
);}
const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flexDirection: 'row',
      padding: 20,
      borderRadius: 8,
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: '#45d3f4',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginLeft: 16,
      fontSize: 18,
      fontWeight: '500',
    }
  })
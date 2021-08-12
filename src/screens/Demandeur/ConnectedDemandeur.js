import { View,Text } from "react-native-animatable";
import React, { useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfilePrestataire from '../Prestataire/ProfilePrestataire';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import {Image,TouchableOpacity} from 'react-native' ; 
import Accueil from '../Accueil';
import Deconnexion from '../Connexion/Deconnexion';
import { FontAwesome,MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import TousDemande from '../Demande/DemandesDemandeurSent/TousDemandes';
import { Icon } from 'react-native-elements'
import PasserDemandeDemandeur from '../Demande/PasserDemandeDemandeur';
import ListeCategorie from '../Categorie/ListeCategorie';
import ProfileDemandeur from './ProfileDemandeur';
import ListePrestataire from '../Prestataire/ListePrestataire';
import ListeService from '../service/ListeService';
import RechercheService from '../service/RechercheService';

import {DrawerContent} from "./DrawerContent";
import AffectationEmployesDemande from "../Entreprise/AffectationEmployesDemande";
export default function ConnectedDemandeur({navigation}) {
    const [swipabale,setswipabale]=useState(true);
    const Tab = createBottomTabNavigator();
    const Drawerr = createDrawerNavigator();
    useEffect(() => {
      }, []);
      const mesdemandes=({navigation})=>(
        <Stack.Navigator screenOptions={{  title: 'Demandes',
        headerTitleAlign:"center",
        headerStyle: {
          backgroundColor: '#0dacfa',
          height:70,
          borderBottomRightRadius:55
        },
        headerRight: () => (
            <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}><MaterialIcons
            style={{ paddingRight:40,alignSelf: "center" }}
            name="menu"
            size={25}
            color="white"
          /></TouchableOpacity>
          ),       
        headerTintColor: '#fff',
       }}>
            <Stack.Screen name='TousDemande' component={TousDemande}/> 
        </Stack.Navigator>      )
     
   
     const Acceuilstackscreen=({navigation})=>(
        <Stack.Navigator screenOptions={{  title: 'Accueil',
        headerTitleAlign:"center",
        headerStyle: {
          backgroundColor: '#0dacfa',
          height:70,
          borderBottomRightRadius:55
        },
        headerRight: () => (
            <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}><MaterialIcons
            style={{ paddingRight:40,alignSelf: "center" }}
            name="menu"
            size={25}
            color="white"
          /></TouchableOpacity>
          ),        
        headerTintColor: '#fff',
       }}><Stack.Screen name="Accueil" component={Accueil}></Stack.Screen>
           <Stack.Screen   name="ListeCategorie" component={ListeCategorie} />
        <Stack.Screen name="RechercheService" component={RechercheService}/>   
        <Stack.Screen name="ListeService" component={ListeService}/>
    <Stack.Screen name="ListePrestataire" component={ListePrestataire}/>
    <Stack.Screen options={{title:'Profile prestataire'}} name="ProfilePrestataire" component={ProfilePrestataire}/>
    <Stack.Screen options={{title:'Passer une demande'}} name='Passerdemande' component={PasserDemandeDemandeur}/>
    </Stack.Navigator>
          )
const Stack = createStackNavigator();
const Tabnav=()=>(
    <Tab.Navigator>
    <Tab.Screen
      name = "Acceuil"
      component = {Acceuilstackscreen}
      
      options={{
          
          tabBarLabel: 'Accueil',
          tabBarIcon:({focused }) => (
              focused
              ? <Image 
              source={require('../../images/accueil.png')}

              resizeMode='contain'
              style={{width: 24, height:24}}
              />
              : <Image
              source={require('../../images/accueil_active.png')}
              resizeMode='contain'
              style={{width: 24, height:24}}
              />
          )
      }}
    />
    <Tab.Screen
    name = "Categorie"
    component = {CategorieStackScreen}
    options={{
        tabBarLabel: 'Categorie',
        tabBarIcon:({focused}) => (
            focused
            ? <Image 
            source={require('../../images/categorie.png')}
            resizeMode='contain'
            style={{width: 24, height:24}}
            />
            : <Image 
            source={require('../../images/categorie_active.png')}
            resizeMode='contain'
            style={{width: 24, height:24}}
            />
        )
    }}
    /> 
    <Tab.Screen
    name = "Demande"
    component = {mesdemandes}
    options={{
        tabBarLabel: 'Demande',
        tabBarIcon:({focused}) => (
            focused
            ? <Image 
            source={require('../../images/demande_bleu.png')}
            resizeMode='contain'
            style={{width: 24, height:24}}
            />
            : <Image 
            source={require('../../images/demande_gris.png')}
            resizeMode='contain'
            style={{width: 24, height:24}}
            />
        )
    }}
    /> 
    
</Tab.Navigator>

)
const CategorieStackScreen=({navigation})=>(
    <Stack.Navigator  screenOptions={{  title: 'Liste Des Categories',
    headerTitleAlign:"center",
    headerStyle: {
      backgroundColor: '#0dacfa',
      height:70,
      borderBottomRightRadius:55
    },
    headerRight: () => (
        <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}><MaterialIcons
        style={{ paddingRight:40,alignSelf: "center" }}
        name="menu"
        size={25}
        color="white"
      /></TouchableOpacity>
      ),       
    headerTintColor: '#fff',
   }}>
    <Stack.Screen   name="ListeCategorie" component={ListeCategorie} />
<Stack.Screen name="RechercheService" component={RechercheService}/>   
<Stack.Screen name="ListeService" component={ListeService}/>
<Stack.Screen name="ListePrestataire" component={ListePrestataire}/>
<Stack.Screen options={{title:'Profil prestataire'}} name="ProfilePrestataire" component={ProfilePrestataire}/>
<Stack.Screen options={{title:'Passer une demande'}} name='Passerdemande' component={PasserDemandeDemandeur}/>

</Stack.Navigator>
)
    return (
<NavigationContainer independent={true}>
    <Drawerr.Navigator drawerContent={props => <DrawerContent{...props}/>}>
        <Drawerr.Screen name='acceuil' component={Tabnav}/>
        <Drawerr.Screen name='gerer compte' component={ProfileDemandeur}/>
        <Drawerr.Screen name='Deconnexion' component={Deconnexion}/>
    </Drawerr.Navigator>
   
  </NavigationContainer>);}
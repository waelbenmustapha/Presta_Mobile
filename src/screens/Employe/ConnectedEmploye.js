import { View,Text } from "react-native-animatable";
import React, { useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome,MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { createDrawerNavigator,DrawerContentScrollView,
    DrawerItemList,DrawerItem} from '@react-navigation/drawer';
    import {
        useTheme,
        Avatar,
        Title,
        Caption,
        Paragraph,
        Drawer,
        TouchableRipple,
        Switch,
      } from "react-native-paper";
import { createStackNavigator } from '@react-navigation/stack';
import {Image,TouchableOpacity} from 'react-native' ; 
import Deconnexion from '../Connexion/Deconnexion';

import DemandesAcceptees from '../Demande/DemandeEmploye/DemandesAcceptees';
import DemandesAnnulees from '../Demande/DemandeEmploye/DemandesAnnulees';
import DemandesEnCours from '../Demande/DemandeEmploye/DemandesEnCours';
import DemandesTerminees from '../Demande/DemandeEmploye/DemandesTerminees';
import ProfileEmploye from './ProfileEmploye';


import {DrawerContent} from "./DrawerContent";
export default function ConnectedEntreprise({navigation}) {
    const Tab = createBottomTabNavigator();
    const [connecteduser,setconnecteduser]=useState({image:'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png'});
    const Drawerr = createDrawerNavigator();
   
    useEffect(() => {
      }, []);

      
              const demandeclientsstackscreen=({navigation})=>(
<Stack.Navigator screenOptions={{  title: 'Clients',
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
<Stack.Screen name="DemandesAcceptees" component={DemandesAcceptees}/> 
        <Stack.Screen name="DemandesEnCours" component={DemandesEnCours}/>   
        <Stack.Screen name="DemandesAnnulees" component={DemandesAnnulees}/>   
        <Stack.Screen name="DemandesTerminees" component={DemandesTerminees}/> 
                  </Stack.Navigator>             )
                    
    
    const Acceuilstackscreen=()=>(
        <View style={{flex:1}}><Text style={{flex:1,textAlign:'center',textAlignVertical:'center',fontSize:35}}>Acceuil</Text></View>)
const Stack = createStackNavigator();
const Tabnav=()=>(
    <Tab.Navigator>
    
    
   
    <Tab.Screen
    name = "Clients"
    component = {demandeclientsstackscreen}
    options={{
        tabBarLabel: 'Clients',
        tabBarIcon:({focused}) => (
            focused
            ? <Image 
            source={require('../../images/client_bleu.png')}
            resizeMode='contain'
            style={{width: 24, height:24}}
            />
            : <Image 
            source={require('../../images/client_gris.png')}
            resizeMode='contain'
            style={{width: 24, height:24}}
            />
        )
    }}
    /> 
</Tab.Navigator>

)

    return (
<NavigationContainer independent={true}>
    <Drawerr.Navigator drawerContent={props => <DrawerContent{...props}/>}>
        <Drawerr.Screen name='acceuil' component={Tabnav}/>
        <Drawerr.Screen name='gerer compte' component={ProfileEmploye}/>
        <Drawerr.Screen name='Deconnexion' component={Deconnexion}/>
    </Drawerr.Navigator>
   
  </NavigationContainer>);}
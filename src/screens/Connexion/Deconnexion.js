import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import * as Updates from 'expo-updates';



import {View} from 'react-native';

class Deconnexion extends React.Component{
  constructor()
  {
    super();
    this.doLogout();
  }
doLogout = async () =>
{ const token = await AsyncStorage.getItem("token");

  
   AsyncStorage.removeItem("token") 
 
  .then(Updates.reloadAsync());
  

}
 render() {
     return(

     <View >
    
     </View>
 )

 }

}

export default Deconnexion;

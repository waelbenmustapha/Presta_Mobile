import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Alert,View,StyleSheet,ActivityIndicator,Text} from 'react-native';
import axios from 'axios';
import Deconnexion from './Deconnexion';
class LoginLoading extends React.Component{
constructor(){
    super();
    this.checkToken();
}

checkToken= async() => {
let token = await AsyncStorage.getItem("token");
if (token){{await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/"+token).then(response => {

  if(response.data.role=='Prestataire'){this.props.navigation.reset({
    index: 0,
    routes: [{ name: 'ConnectedPrestataire' }],
  });}
  else if(response.data.role=='Demandeur'){this.props.navigation.reset({
    index: 0,
    routes: [{ name: 'ConnectedDemandeur' }],
  });
}  else if(response.data.role=='Entreprise'){this.props.navigation.reset({
  index: 0,
  routes: [{ name: 'ConnectedEntreprise' }],
});}
else if(response.data.role=='Employe'){this.props.navigation.reset({
  index: 0,
  routes: [{ name: 'ConnectedEmploye' }],
});}
  else {this.props.navigation.replace("Deconnexion");
  }
}
  )
}} 
else {this.props.navigation.navigate('LoginDemandeur');
}
}

 render() {
     return(
     <View style={styles.overlay}>
     <View style={styles.container}>
     <ActivityIndicator color={'black'}/>
     <Text style={styles.text}>Loading...</Text>
     </View>
     </View>
 )

 }

}

export default LoginLoading;

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
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

class LoginFacebookGoogle extends Component {

  constructor(props) {
    super(props);
    this.state =
    {
      userAuth: {},
      loaded: false,
    }
  }

  //fonction pour se connecter avec facebook
  signInFB = async () => {
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
              console.log(data);
            this.props.navigation.navigate("InscriptionDemandeurFacebookGoogle",{email:data.email,nom:data.name})
            this.setState({
              userAuth: data,
              loaded: true,
            })
            //this.ApiCall();
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
  signIn = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '708650245144-011vtv04ckgjt581kcdoccvk54ncot0v.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      if (result.type = "success") {
        this.props.navigation.navigate("InscriptionDemandeurFacebookGoogle",{email:result.user.email,nom:result.user.name})
        console.log("Token : " + result.accessToken);
        this.setState({
          userAuth: result.user,
          loaded: true,
        })
      }
      else {
        console.log("Canceled");
      }
    } catch (error) {
      console.log("Auth error : " + error);
    }
  }

  ApiCall = () => {
    const user =
    {
      nom: this.state.userAuth.name,
      email: this.state.userAuth.email
    }
    console.log("user: ", user);
    axios.post('http://192.168.43.100:8090/consommateur/nouveauCompteConsommateur', user).then((response) => {
    })
      .catch((error) => {
        console.log(error)
      })
  }


  render() {
    return (
      <LinearGradient colors={['#0dacfa', '#45d3f4', '#70e9ef']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.container}>
        <TouchableOpacity style={[styles.box, { backgroundColor: '#fff' }]} onPress={() => this.props.navigation.navigate("InscriptionDemandeur")}>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="email-outline" size={20} style={[styles.icon, { color: '#000' }, { opacity: 0.6 }]} />
            <Text style={[styles.text, { color: '#000' }, { opacity: 0.6 }]}>Créer un compte</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, { backgroundColor: '#4267B2' }, { marginTop: 20 }]} onPress={this.signInFB}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome name="facebook-square" size={20} style={styles.icon} />
            <Text style={[styles.text, { color: '#fff' }]}>Se connecter avec Facebook</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, { backgroundColor: '#DB4437' }, { marginTop: 20 }]} onPress={this.signIn}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome name="google" size={20} style={styles.icon} />
            <Text style={[styles.text, { color: '#fff' }]}>Se connecter avec Google</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#45d3f4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  box: {
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: 'bold'
  },
  icon: {
    color: '#fff',
    opacity: 0.8,
    marginRight: 8
  }
});
export default LoginFacebookGoogle;
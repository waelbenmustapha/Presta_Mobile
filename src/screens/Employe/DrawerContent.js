import React, { useContext, useCallback, useState, useEffect } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Linking,Alert,StyleSheet, View, StatusBar } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export function DrawerContent(props) {
  const [connecteduser,setconnecteduser]=useState({image:'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png'})
  async function getconnecteduser() {
    const tokeen = await AsyncStorage.getItem('token');
await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/"+tokeen).then(response => {
        setconnecteduser(response.data);
        })
        } 

 

  useEffect(() => {
    getconnecteduser();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
              style={{alignSelf:'center'}}
                source={{
                  uri: connecteduser.image
                }}
                size={100}
              />
              <View style={{ marginLeft: 15, flexDirection: "column",justifyContent:'center' }}>
                <Title style={styles.title}>{connecteduser.nom}</Title>
               
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Accueil"
              onPress={() => {
                props.navigation.navigate("acceuil");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profil"
              onPress={() => {
                props.navigation.navigate("gerer compte");
              }}
            />

           
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="help-network" color={color} size={size} />
              )}
              label="Aide"
              onPress={() => {
                Alert.alert(
                  'Aide',
                  "Avez-vous besoin de l'aide ? \nContactez-nous",
                  [
                    {text: 'Enovyez-nous un email', onPress: () => Linking.openURL('mailto:presta.tn.app@gmail.com')},
                   
                  ],
                  {cancelable: true},
                );             }}
            />
          </Drawer.Section>
         
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="power" color={color} size={size} />
          )}
          label="Déconnexion"
          onPress={() => {
            props.navigation.navigate("Deconnexion");
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {width:130,
    fontSize: 16,
    marginTop: 3, 
    fontWeight: "bold",
    opacity:0.7
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

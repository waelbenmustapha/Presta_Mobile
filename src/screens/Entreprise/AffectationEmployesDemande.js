import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { Icon } from "react-native-elements";
import axios from "axios";
import { Alert } from "react-native";
import { sendPushNotification } from "../../Notifications/Notifications";
import React, { useState, useEffect } from "react";
import { FontAwesome, Feather, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";

export default function AffectationEmployesDemande({ navigation, route }) {
  const [data, setData] = useState();
  async function getconnecteduser() {
    const tokeen = await AsyncStorage.getItem("token");
    await axios
      .get("http://192.168.43.100:8090/demandeur/consulterDemandeur/" + tokeen)
      .then((response) => {
        fetchData(response.data.id);
      });
  }
  async function fetchData(id) {
    await axios
      .get(
        "http://192.168.43.100:8090/entreprise/getListeDesEmployes/" + id,
        {},
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      )
      .then((response) => {
        setData(response.data);
      });
  }
  async function funcsaccepterourefuser(id, statut) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.put(
      "http://192.168.43.100:8090/demande/changerStatut/" +
        id +
        "/" +
        statut,
      {},
      config,
      {
        auth: {
          username: "user",
          password: "0000",
        },
      }
    );
    getconnecteduser();
  }
  async function affecterDemandeEmploye(id) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios
      .put(
        "http://192.168.43.100:8090/employe/affecterDemandeEmploye/" +
          id +
          "/" +
          route.params.item.id,
        {},
        config,
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      )
      .then(navigation.replace("TousDemande"));
  }

  useEffect(() => {
    getconnecteduser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(
          { item } //navigation.route.params=  demande
        ) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              affecterDemandeEmploye(item.id);
              sendPushNotification(
                route.params.item.notification_token,
                "Nouvelle demande",
                item.nom + " vous êtes affecté à une nouvelle demande"
              );
            }}
          >
            <Image style={styles.image} source={{ uri: item.image }} />
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              ></View>
              <View style={styles.text}>
                <View>
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}
                  >
                    {item.nom}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome
                      style={{ marginRight: 5, marginVertical: 10 }}
                      name="phone"
                      size={22}
                      color="#000"
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        opacity: 0.6,
                        fontWeight: "400",
                        textAlignVertical: "center",
                      }}
                    >
                      {item.numero_telephone}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
paddingHorizontal:20,paddingVertical:35  },
  action: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 6,
    opacity: 0.6,

    alignItems: "center",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 5,
    shadowColor: "#0DACFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  text: {
    flex: 2,
    color: "black",
    alignItems: "flex-start",
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
});

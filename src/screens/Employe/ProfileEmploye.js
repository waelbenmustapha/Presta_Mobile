import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileEmploye({ navigation }) {
  const [emailnotvalid, setEmailnotvalid] = useState("");
  const [nomprenimvide, setNomprevide] = useState("");
  const [mobilenotvalid, setMobVal] = useState("");
  const [nom, setnom] = useState();
  const [Email, setEmail] = useState();
  const [addresse, setAddresse] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [numero, setnumero] = useState();
  const [connecteduser, setconnecteduser] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = React.useState({
    secureTextEntry: true,
    checktextInputChange: false,
    checkaddInputChange: false,
    checkemailInputChange: false,
    emailError: "",
    champVideError: "",
  });
  async function getconnecteduser() {
    const tokeen = await AsyncStorage.getItem("token");
    await axios
      .get("http://192.168.43.100:8090/demandeur/consulterDemandeur/" + tokeen)
      .then((response) => {
        setconnecteduser(response.data);
        setnom(response.data.nom);
        setEmail(response.data.email);
        setnumero(response.data.numero_telephone);
        setAddresse(response.data.addresse);
      });
  }
  useFocusEffect(
    React.useCallback(() => {
      getconnecteduser();
    }, [])
  );
  function modifiercompte() {
    if (
      mobilenotvalid == "" &&
      nom.length > 0 &&
      Email.length > 0 &&
      emailnotvalid == ""
    ) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios.put(
        "http://192.168.43.100:8090/employe/modifierEmploye",

        {
          id: connecteduser.id,
          nom: nom,
          email: Email,
          addresse: addresse,
          numero_telephone: numero,
        },
        config,
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      );
      Alert.alert("Compte Modifié");
    } else {
      Alert.alert("Vérifier les données");
    }
  }

  const textInputChange = (text) => {
    if (text == "") {
      setNomprevide("Vous devez entrez le nom et prénom !");
      setData({
        ...data,
        checktextInputChange: false,
      });
    } else {
      setNomprevide("");

      setData({
        ...data,
        nom: text,
        checktextInputChange: true,
      });
    }
  };

  const validatePhoneNumber = (text) => {
    let reg = /^[2,4,5,9][0-9]{7}$/;
    if (text.length == 0) {
      setMobVal("");
    } else if (reg.test(text) === false) {
      setMobVal("Vérifier votre Numero de telephone !");
    } else {
      setMobVal("");
      setData({
        ...data,
        phoneNumber: text,
        check_phoneInputChange: true,
      });
    }
  };

  function enablemodification() {
    setEnabled(!enabled);
  }

  const validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(text) == false) {
      setEmailnotvalid("Vérifier votre adresse mail !");
      setData({
        ...data,
        checkemailInputChange: false,
      });
    }

    if (reg.test(text) == true) {
      setEmailnotvalid("");

      setData({
        ...data,
        email: text,
        checkemailInputChange: true,
      });
    }
  };
  if (connecteduser == null) {
    return (
      <View style={styles.overlayy}>
        <View style={styles.containerr}>
          <ActivityIndicator color={"black"} />
          <Text style={styles.textt}>Loading...</Text>
        </View>
      </View>
    );
  } else
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <LinearGradient
            colors={["#0dacfa", "#45d3f4", "#70e9ef"]}
            style={styles.container}
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={{ flex: 0.6, paddingTop: 10,alignItems:'center' }}>
              <View style={styles.profileImgContainer}>
                <Image
                  source={{ uri: connecteduser.image }}
                  style={styles.profileImg}
                />
              </View>
            </View>
            <Text
              style={{
                fontSize: 25,
                color: "white",
                fontWeight: "600",
                paddingBottom: 15,
                textAlign: "center",
              }}
            >
              {connecteduser.nom}
            </Text>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.start3}
                onPress={() => {
                  enablemodification();
                }}
              >
                <Text style={styles.textSign}>Modifier Compte</Text>
              </TouchableOpacity>
              <View style={{ flex: 3, justifyContent: "center" }}>
                <View style={styles.action}>
                  <FontAwesome
                    style={styles.icon}
                    name="user-o"
                    size={22}
                    color="#000"
                  />
                  <TextInput
                    onChangeText={(text) => {
                      setnom(text);
                      textInputChange(text);
                    }}
                    editable={enabled}
                    value={nom}
                    style={[
                      styles.textInput,
                      enabled
                        ? {
                            color: "black",
                          }
                        : {
                            color: "black",
                            opacity: 0.5,
                          },
                    ]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={()=>{ enablemodification();}}>
                    {enabled ? (
                      <Feather />
                    ) : (
                      <Feather name="lock" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{nomprenimvide}</Text>
                <View style={styles.action}>
                  <FontAwesome
                    style={styles.icon}
                    name="envelope-o"
                    size={20}
                    color="#000"
                  />
                  <TextInput
                    editable={enabled}
                    onChangeText={(text) => {
                      setEmail(text);
                      validate(text);
                    }}
                    value={Email}
                    style={[
                      styles.textInput,
                      enabled
                        ? {
                            color: "black",
                          }
                        : {
                            color: "black",
                            opacity: 0.5,
                          },
                    ]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity>
                    {enabled ? (
                      <Feather />
                    ) : (
                      <Feather name="lock" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{emailnotvalid}</Text>

                <View style={styles.action}>
                  <FontAwesome
                    style={styles.icon}
                    name="mobile-phone"
                    size={38}
                    color="#000"
                  />
                  <TextInput
                    editable={enabled}
                    onEndEditing={()=>{}}
                    onChangeText={(text) => {
                      setnumero(text);
                      validatePhoneNumber(text);
                    }}
                    value={numero}
                    style={[
                      styles.textInput,
                      enabled
                        ? {
                            color: "black",
                          }
                        : {
                            color: "black",
                            opacity: 0.5,
                          },
                    ]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity>
                    {enabled ? (
                      <Feather />
                    ) : (
                      <Feather name="lock" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{mobilenotvalid}</Text>
                <View style={styles.action}>
                <FontAwesome
                  style={styles.icon}
                  name="map-marker"
                  size={30}
                  color="#000"
                />
                <TextInput
                  onChangeText={(text) => {
                    setAddresse(text);
                  }}
                  editable={enabled}
                  value={addresse}
                  style={[
                    styles.textInput,
                    enabled
                      ? {
                          color: "black",
                        }
                      : {
                          color: "black",
                          opacity: 0.5,
                        },
                  ]}
                  autoCapitalize="none"
                />
                <TouchableOpacity>
                  {enabled ? (
                    <Feather />
                  ) : (
                    <Feather name="lock" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              </View>
             
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginVertical: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.start}
                  onPress={() => {
                    modifiercompte();
                  }}
                >
                  <LinearGradient
                    style={styles.start}
                    colors={["#0dacfa", "#45d3f4", "#70e9ef"]}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.textSign}>
                      Sauvegarder modifications
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerr: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 20,
    borderRadius: 8,
  },
  overlayy: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#45d3f4",
    alignItems: "center",
    justifyContent: "center",
  },
  textt: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "500",
  },
  start: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    marginVertical: -20, //-45
  },
  header: {
    flex: 0.75,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 2.3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 16,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
    paddingBottom: 6,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  text: {
    color: "#fff",
    opacity: 0.7,
    marginTop: 4,
    fontSize: 18,
  },
  login: {
    padding: 10,
  },
  appButtoncontainer: {
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 0 : -12,
    paddingLeft: 12,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    marginVertical: 30,
  },
  profileImgcontainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  profileImg: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderRadius: 60,
    overflow: "hidden",
    borderColor: "grey",
    borderWidth: 4,
  },
  nom: {
    color: "white",
    fontSize: 20,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  start3: {
    backgroundColor: "#0dacfa",
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "flex-end",
    height: 50,
    width: 150,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  textSign: {
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    margin: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 30,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 15,
    textAlign: "center",
  },
});

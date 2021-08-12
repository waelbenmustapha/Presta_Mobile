import React from 'react';
import {  TextInput,Alert, View, Text, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { sendPushNotification } from '../../Notifications/Notifications'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

export default function PasserDemandeDemandeur ({ route, navigation }) {
const [date, setDate] = useState(new Date());
const [mode, setMode] = useState('date');
const [show, setShow] = useState(false);
const [description, setDescription] = useState();
const [connecteduser,setconnecteduser]=useState(null);

async function getconnecteduser() {
    const tokeen = await AsyncStorage.getItem('token');
await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/"+tokeen).then(response => {
        setconnecteduser(response.data);
        })
        } 
        async function _getStorageValue(){
            var value = await AsyncStorage.getItem('token');
            return value
          }
useEffect(() => {
    getconnecteduser();
//get his push token and set it for user something
}, []);
//date and time picker function
const onChange = (event, selectedDate) => {
const currentDate = selectedDate || date;
setShow(Platform.OS === 'ios');
setDate(currentDate);
};
//date and time picker function
const showMode = (currentMode) => {
setShow(true);
setMode(currentMode);
};
//date and time picker function
const showDatepicker = () => {
showMode('date');
};
//date and time picker function
const showTimepicker = () => {
showMode('time');
};



//get prestataire notification token by his id

/*async function getpresnotif() {

await axios.get("http://192.168.43.100:8090/prestataire/getPrestataireNotificationToken/1").then(response => {
setNotiftoken(response.data);

})
}
*/
//format the date so the user can understand it
var dateFormat = require("dateformat");
dateFormat.i18n = {
dayNames: [
"Lun",
"Mar",
"Mer",
"Jeu",
"Ven",
"Sam",
"Dim",
"Lundi",
"Mardi",
"Mercredi",
"Jeudi",
"Vendredi",
"Samedi",
"Dimanche",
],
monthNames: [
"Jan",
"Fev",
"Mar",
"Avr",
"May",
"Jun",
"Jul",
"Aou",
"Sep",
"Oct",
"Nov",
"Dec",
"Janvier",
"Février",
"Mars",
"Avril",
"Mai",
"Juin",
"Juillet",
"Aout",
"Septembre",
"Octobre",
"Novembrr",
"Decembre",
],
timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"],
};
//PASSER demande avec descrip et la description
function passerDemande(description) {
const config = {
headers: {
'Content-Type': 'application/json',
}
}
axios.post("http://192.168.43.100:8090/demande/creerDemande",
{
nom: route.params.service.nom,
description: description,
date_debut: dateFormat(date, "dddd, mmmm dS, yyyy, h:MM TT"),
statut: 0,
demandeur: { id: connecteduser.id },
prestataire: { id: route.params.prestataire.id },
service: { id: route.params.service.id },

}, config, {
auth: {
username: "user",
password: "06bc221e-a244-49f8-af62-a7a25f3ef79a"
}
})
}

return (

<View style={styles.footer}>
<View style={styles.action}>
<FontAwesome style={styles.icon} name="sticky-note-o" size={24} color="black" />
<TextInput
placeholder="Details concernant votre demande"
style={styles.textInput} autoCapitalize="none"
onChangeText={(text) => setDescription(text)} />
</View>
<Text style={styles.textnote}>Choisissez la date qui vous convient</Text>
<View style={styles.part}>
<View style={{ flexDirection: 'row' }}>
<View style={[styles.action1]}>
<TouchableOpacity style={{ flexDirection: 'row' }} onPress={showDatepicker}>
<View style={{ flexDirection: 'column' }}>
<Icon color='#0dacfa' name='calendar' type='font-awesome' size={42} />
<Text style={{textAlign:'center'}}>Jour</Text></View>
</TouchableOpacity>
</View>
<View style={[styles.action1]}>
<TouchableOpacity
style={{ flexDirection: 'row' }}
onPress={showTimepicker}>
<View style={{ flexDirection: 'column' }}>
<Icon
color='#0dacfa'
name='clock-o'
type='font-awesome'
size={42}
/>
<Text style={{textAlign:'center'}}>Heure</Text>
</View>
</TouchableOpacity>
{show && (
<DateTimePicker
timeZoneOffsetInSeconds={3600}
testID="dateTimePicker"
value={date}
mode={mode}
is24Hour={true}
display="default"
onChange={onChange}
/>
)}
</View>
</View>
</View>
<View style={styles.button}>
<TouchableOpacity onPress={() => { _getStorageValue().then(res => {
  if(res==null){Alert.alert("Connectez-vous","vous devez d'abord vous connecter");navigation.navigate("LoginDemandeur")}else{passerDemande(description);
   sendPushNotification(route.params.prestataire.notification_token, 'Nouvelle Demande', "nouvelle demande pour Service : "+route.params.service.nom);
   Alert.alert("Demande envoyée"),navigation.navigate('ListeCategorie')}})}}>
<LinearGradient style={styles.start} colors={['#0dacfa', '#45d3f4', '#70e9ef']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
<Text style={styles.textSign} >Passer une demande</Text>
</LinearGradient>
</TouchableOpacity>
</View>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
},
start: {
width: '100%',
height: 50,
justifyContent: 'center',
alignItems: 'center',
borderRadius: 10,
flexDirection: 'row',
},
header: {
flex: 1,
paddingLeft:'3%',
justifyContent: 'center',

},
textnote: {
fontSize: 16,
alignSelf: 'center',
fontWeight: 'bold',
opacity: 0.6,
paddingVertical:32
},
footer: {
flex: 2,

backgroundColor: '#fff',
borderTopLeftRadius: 30,
borderTopRightRadius: 30,
paddingHorizontal: '4%',
paddingVertical: '4%'
},
text_header: {
color: '#fff',
fontWeight: 'bold',
fontSize: 30
},
text_footer: {
color: '#05375a',
fontSize: 16
},
action1: {
flex: 1,
opacity: 0.6,
alignItems: 'center'
},
action: {
flexDirection: 'row',
paddingVertical:40,
borderBottomWidth: 1,
borderBottomColor: '#f2f2f2',
opacity: 0.6,
alignItems: 'center'
},
textInput: {
flex: 1,
color: '#05375a',
height: 100,
paddingLeft: 12,
},
button: {
marginVertical: 40,
},
textSign: {
fontWeight: 'bold',
color: '#fff'
},


});
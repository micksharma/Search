/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState , useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import filter from 'lodash.filter';
const API_ENDPOINT = `https://randomuser.me/api/?results=30`;

function App(){
  const [isLoading , setLoading] = useState(false);
  const [data , setData] = useState([]);
  const [error , setError] = useState(null);
  const [fullData , setFullData] = useState([]);
  const [searchQuery , setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData(API_ENDPOINT);
  },[])

  const fetchData = async (url) => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setFullData(json.results);
        setData(json.results);
        console.log(json.results);
        setLoading(false);
      } catch (error){
        setError(error);
        console.log(error);
        setLoading(false);
      }
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData,(user) => {
      return contains(user , formattedQuery);
    })
    setData(filteredData);
  }
   const contains = ({name , email} , query) => {
     const {first , last} = name;
    
     if( first.includes(query) || last.includes(query) || email.includes(query)){
       return true;
     }
     return false;
   }
  if( isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
         <ActivityIndicator size={"large"} color="#5500dc" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text>Error in fetching Data</Text>
       </View>
    )
  }
  return (
    <SafeAreaView style={{flex:1 , marginHorizontal:20}}>
      <TextInput 
      placeholder='Search' 
      clearButtonMode='always' 
       style={{paddingHorizontal:20, paddingVertical:10 , borderColor:'#ccc', borderWidth:1 , borderRadius:8 }} 
       autoCapitalize='none'
       autoCorrect={false}
       value={searchQuery}
       onChangeText={(query) => handleSearch(query)}/> 
       <FlatList 
         data={data}
         keyExtractor={(item) => item.login.username}
         renderItem={({item}) => (
          <View style={{flexDirection:"row", alignItems:'center' , marginLeft:10 ,marginTop:10}}>
             <Image source={{uri: item.picture.thumbnail}}  style={{width:50 , height:50, borderRadius: 25}}/>
              <View>
                <Text style={{fontSize:17 , marginLeft: 10 , fontWeight: '600'}}>{item.name.first} {item.name.last}</Text>
                <Text style={{fontSize:14 , marginLeft: 10 , color:'grey'}}>{item.email}</Text>
              </View>
          </View>
         )} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

import { FlatList, View, StyleSheet, Text, ListRenderItem } from "react-native";
import {mockAssets} from "../constants/mockAssets";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Asset } from "../models/Asset";



export default function DisplayList(){
    return (
        <SafeAreaProvider>
            <SafeAreaView style = {styles.container}>
                <FlatList
                    data = {mockAssets}
                    renderItem = {({ item  } : { item : Asset}) => {
                        return (
                            <View style = {styles.item} key={item.assetId}>
                                <Text style = {styles.name}>{item.buildingName}</Text>
                            </View>
                        )
                    }
                }
                keyExtractor={item => item.assetId.toString()} 
                />
            </SafeAreaView>
        </SafeAreaProvider>
        
    )
    
        
}
const styles = StyleSheet.create({
        container:{
            flex: 1,
            
        },
        item:{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ebdcdcdd',
            padding: 20,
            margin: 20
        },
        name:{
            fontSize: 28,
            fontWeight: 'semibold',
            fontStyle: 'italic'
        }
    }

)
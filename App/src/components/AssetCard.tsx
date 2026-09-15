import { View, StyleSheet, Text } from "react-native";
import { Asset } from "../models/Asset";

type AssetCardProps = {
    asset: Asset
}

export default function AssetCard({asset} : AssetCardProps){

    return (
        <View style = {styles.container}>
            <View style = {styles.Card}>
                <Text style = {styles.name}>
                    {asset.buildingName}
                    <Text style={styles.id}>  ID{asset.assetId}</Text>
                </Text>
                <Text style = {styles.text}>
                    {asset.buildingCode}
                </Text>
                <Text style = {styles.text}>
                    {asset.constructionStage}
                </Text>
                <Text style = {styles.text}>
                    Status : {asset.inspectionStatus}
                </Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#FAFAF7'
    },
    Card: {
        flex: 1,
        padding: 10,
        elevation: 5,
        borderRadius: 12,
        backgroundColor: '#E8E4D8',
        flexDirection: 'column',
        
    },
    text: {
        fontSize: 16,
        marginTop: 8,
        fontFamily: 'l'
        
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3A3530',
        fontFamily: 'serif',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 5,
    },
    id: {
        alignItems: 'flex-end',
        fontSize: 16,
        color: '#814c41'
        
    }
})
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Asset } from "../models/Asset";
import { RootStackList } from "../navigation/types"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import  AssetDetails  from "../screens/AssetDetailsScreen";
import {colors, spacing, typography} from '../theme'

type AssetCardProps = {
    asset: Asset
} 
export default function AssetCard({asset} : AssetCardProps){
    const navigation = useNavigation<NativeStackNavigationProp<RootStackList>>();
    return (
        <Pressable onPress={() => navigation.navigate("AssetDetails",{asset})}>
            <View style = {styles.container}>
            <View style = {styles.detailsCard}>
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
        </Pressable>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 5
    },
    detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
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
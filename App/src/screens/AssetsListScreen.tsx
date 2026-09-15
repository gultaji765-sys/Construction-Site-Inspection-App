import {
  FlatList,
  View,
  StyleSheet,
  Text,
  ListRenderItem,
  TextInput,
} from 'react-native';
import { mockAssets } from '../constants/mockAssets';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from '../models/Asset';
import AssetCard from '../components/AssetCard';
import { useState } from 'react';

const onSearch = (text: string) => {
    if(text === ''){
        return mockAssets;
    }
  let filteredData = mockAssets.filter(item => {
    return item.buildingName.toLowerCase().includes(text.toLowerCase());
  });
  return filteredData;
};

export default function DisplayList() {
  const [filterName, setFilterName] = useState('');
  let filteredData = onSearch(filterName);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          value={filterName}
          onChangeText={text => {
            setFilterName(text);
          }}
          placeholder="Enter Building Name"
          keyboardType="default"
        />
        <Text style={{margin: 10, fontSize: 18}}>
            Filter
        </Text>
        <FlatList
          numColumns={2}
          data={filteredData}
          renderItem={({ item }: { item: Asset }) => <AssetCard asset={item} />}
          keyExtractor={item => item.assetId.toString()}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebdcdcdd',
    padding: 20,
    margin: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'semibold',
    fontStyle: 'italic',
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 15,
  },
});

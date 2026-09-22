import {
  FlatList,
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Pressable,
  Button,
} from 'react-native';
import { mockAssets } from '../constants/mockAssets';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from '../models/Asset';
import AssetCard from '../components/AssetCard';
import { Dispatch, SetStateAction, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

const filterByData = (
  zone: string,
  status: string,
  stage: string,
  searchText: string,
) => {
  const result = mockAssets.filter(item => {
    return (
      (zone === '' || item.zone.toLowerCase().includes(zone.toLowerCase())) &&
      (stage === '' ||
        item.constructionStage.toLowerCase().includes(stage.toLowerCase())) &&
      (status === '' ||
        item.inspectionStatus.toLowerCase().includes(status.toLowerCase())) &&
      (searchText === '' ||
        item.buildingName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.buildingCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.projectId
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()))
    );
  });
  return result;
};

const closePanel = (setShowSortOptions: Dispatch<SetStateAction<boolean>>) => {
  setShowSortOptions(false);
};

export default function DisplayList() {
  const [searchText, setSearchText] = useState('');
  const [zone, setZone] = useState('');
  const [status, setStatus] = useState('');
  const [stage, setStage] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const filteredData = filterByData(zone, status, stage, searchText);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.toolbar}>
          <View style={styles.input}>
            <MaterialIcons name="search" size={24} color={colors.textSecondary} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Enter building name"
              placeholderTextColor={colors.textTertiary}
              style={styles.searchInput}
            />
          </View>

          <Pressable
            onPress={() => setShowSortOptions(!showSortOptions)}
            style={[
              styles.filterButton,
              showSortOptions && styles.filterButtonActive,
            ]}
          >
            <Text style={styles.filterText}>Filter</Text>
            <MaterialIcons name="tune" size={23} color={colors.primary} />
          </Pressable>
        </View>
        {filteredData.length !== 0 ? (
          <FlatList
            numColumns={2}
            data={filteredData}
            renderItem={({ item }: { item: Asset }) => (
              <AssetCard asset={item} />
            )}
            keyExtractor={item => item.assetId.toString()}
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 0.5,
            }}
          >
            <Text style={{ fontSize: 40, color: '#ca9898dd' }}>
              No Data Found
            </Text>
          </View>
        )}

        {showSortOptions && (
          <View style={styles.overlay}>
            <Pressable
              style={styles.background}
              onPress={() => closePanel(setShowSortOptions)}
            />
            <View style={styles.filterPanel}>
              <Text
                style={{ fontSize: 25, marginLeft: 10, textAlign: 'center' }}
              >
                Filter By
              </Text>
              <Text style={styles.filterItem}>Construction Stage</Text>
              <View style={{ marginLeft: 25, marginTop: 10 }}>
                <Pressable
                  onPress={() => {
                    setStage('Stage 1');
                  }}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      stage === 'Stage 1'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                    color=''
                  />
                  <Text style={styles.filterOptions}>Stage 1</Text>
                </Pressable>
              </View>
              <View style={{ marginLeft: 25, marginTop: 10 }}>
                <Pressable
                  onPress={() => {
                    setStage('Stage 2');
                  }}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      stage === 'Stage 2'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={styles.filterOptions}>Stage 2</Text>
                </Pressable>
              </View>
              <View style={{ marginLeft: 25, marginTop: 10 }}>
                <Pressable
                  onPress={() => {
                    setStage('Stage 3');
                  }}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      stage === 'Stage 3'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={styles.filterOptions}>Stage 3</Text>
                </Pressable>
              </View>
              <Text style={styles.filterItem}>Inspection Status</Text>
              <View style={{ marginLeft: 25, marginTop: 10 }}>
                <Pressable
                  onPress={() => setStatus('Due')}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      status === 'Due' ? 'radio-button-on' : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>Due</Text>
                </Pressable>
              </View>
              <View
                style={{ marginLeft: 25, marginTop: 10, flexDirection: 'row' }}
              >
                <Pressable
                  onPress={() => setStatus('Pending')}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      status === 'Pending'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>Pending</Text>
                </Pressable>
              </View>
              <View style={{ marginLeft: 25, marginTop: 10 }}>
                <Pressable
                  onPress={() => setStatus('Completed')}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      status === 'Completed'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>
                    Completed
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.filterItem}>Zone</Text>
              <View style={{ marginLeft: 25, marginTop: 10 }}>
                <Pressable
                  onPress={() => setZone('Zone 1')}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      zone === 'Zone 1' ? 'radio-button-on' : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>Zone 1</Text>
                </Pressable>
              </View>
              <View
                style={{ marginLeft: 25, marginTop: 10, flexDirection: 'row' }}
              >
                <Pressable
                  onPress={() => setZone('Zone 2')}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      zone === 'Zone 2' ? 'radio-button-on' : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>Zone 2</Text>
                </Pressable>
              </View>
              <View
                style={{ marginLeft: 25, marginTop: 10, flexDirection: 'row' }}
              >
                <Pressable
                  onPress={() => setZone('Zone 3')}
                  style={{ flexDirection: 'row' }}
                >
                  <MaterialIcons
                    name={
                      zone === 'Zone 3' ? 'radio-button-on' : 'radio-button-off'
                    }
                    size={24}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>Zone 3</Text>
                </Pressable>
              </View>
              <View
                style={{
                  height: 150,
                  marginLeft: 100,
                  width: 80,
                  borderRadius: 15,
                  marginTop: 20,
                  justifyContent: 'space-evenly',
                }}
              >
                <Button
                  title="Apply"
                  onPress={() => closePanel(setShowSortOptions)}
                />
                <Button
                  title="clear"
                  onPress={() => {
                    setZone('');
                    setStage('');
                    setStatus('');
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    paddingHorizontal: spacing.sm,
  },
  filterButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterButtonActive: {
    opacity: 0.55,
  },
  filterText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  filterPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '78%',
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  filterItem: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  filterOptions: {
    ...typography.body,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '22%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(0,0,0,0.3)',
  },
});
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Asset } from '../models/Asset';
import { RootStackList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { useState, useEffect, useCallback } from 'react';
import { getAssetById, createAsset, updateAsset, deleteAsset } from '../repositories/buildingAssets';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AssetDetailsRouteProp = RouteProp<
  RootStackList,
  'AssetDetails'
>;

export default function AssetDetails() {
  const { params } = useRoute<AssetDetailsRouteProp>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackList>>();
  
  useFocusEffect(
      useCallback(() => {
        const loadAsset = async () => {
      try {
        if (params) {
          const asset = await getAssetById(params.asset_id);
          setAsset(asset);
        }
      } catch (error) {
        console.log(error);
      } 
    };
    loadAsset();
    }, [])
    )
  
  if (!asset) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Asset details unavailable</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={typography.h1}>{asset.building_name}</Text>
          <Text style={typography.body}>{asset.building_code} | {asset.asset_id}</Text>
        </View>
        <Pressable
          style={styles.edit}
          onPress={() => navigation.navigate('AssetForm', { mode: 'edit', assetId: asset.asset_id })}
        >
          <MaterialIcons name="edit-note" color="#000" size={28} />
          <Text style={styles.icon}>Edit</Text>
          
        </Pressable>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{asset.inspection_status}</Text>
      </View>

      <View style={styles.detailsCard}>
        <DetailRow
          label="Construction Stage"
          value={asset.construction_stage}
        />
        <DetailRow label="Floor" value={String(asset.floor_number)} />
        <DetailRow label="Zone" value={asset.zone} />
        <DetailRow label="Project ID" value={String(asset.project_id)} />
      </View>

      <View style={styles.notesCard}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.notes}>
          {asset.notes || 'No notes available for this asset.'}
        </Text>
      </View>
      <View style={styles.button}>
        <Button title="Start Inspection" />
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,

  },
  icon: {
    ...typography.h3,
    marginLeft: 5
  },
  button: {
    height: 40,
    width: 200,
    alignSelf: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DFF3E4',
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    marginBottom: spacing.lg,
  },
  statusText: {
    color: colors.success,
    fontSize: 15,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  detailRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 14,
  },
  label: {
    color: '#777777',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: 8,
  },
  notes: {
    color: '#555555',
    fontSize: 16,
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777777',
  },
});

import { RouteProp, useRoute } from '@react-navigation/native';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Asset } from '../models/Asset';
import { RootStackList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type AssetDetailsRouteProp = RouteProp<RootStackList>;

export default function AssetDetails() {
  const { params } = useRoute<AssetDetailsRouteProp>();
  const asset = params?.asset as Asset | undefined;

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
        <Text style={typography.h1}>{asset.buildingName}</Text>
        <Text style={typography.body}>{asset.buildingCode}</Text>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{asset.inspectionStatus}</Text>
      </View>

      <View style={styles.detailsCard}>
        <DetailRow label="Construction Stage" value={asset.constructionStage} />
        <DetailRow label="Floor" value={String(asset.floorNo)} />
        <DetailRow label="Zone" value={asset.zone} />
        <DetailRow label="Project ID" value={String(asset.projectId)} />
      </View>

      <View style={styles.notesCard}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.notes}>
          {asset.notes || 'No notes available for this asset.'}
        </Text>
      </View>
      <View style={styles.button}>
        <Button title='Start Inspection'/>
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
    marginBottom: spacing.lg,
  },
  button: {
    height: 40,
    width: 200,
    alignSelf: 'center'
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
    color: '#287A43',
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
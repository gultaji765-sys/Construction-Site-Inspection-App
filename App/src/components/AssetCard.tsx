import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Asset } from '../models/Asset';
import { RootStackList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type AssetCardProps = {
  asset: Asset;
  onDelete: () => void;
};

export default function AssetCard({ asset, onDelete }: AssetCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackList>>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${asset.building_name}`}
          onPress={() =>
            navigation.navigate('AssetDetails', { asset_id: asset.asset_id })
          }
          style={styles.details}
        >
          <Text numberOfLines={1} style={styles.name}>
            {asset.building_name}
          </Text>
          <Text style={styles.id}>ID {asset.asset_id}</Text>
          <Text style={styles.text}>{asset.building_code}</Text>
          <Text style={styles.text}>{asset.construction_stage}</Text>
          <Text style={styles.text}>{asset.inspection_status}</Text>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${asset.building_name}`}
            onPress={() =>
              navigation.navigate('AssetForm', {
                mode: 'edit',
                assetId: asset.asset_id,
              })
            }
            style={({ pressed }) => [
              styles.actionButton,
              styles.editButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialIcons name="edit" size={17} color={colors.primaryDark} />
            <Text style={styles.editLabel}>Edit</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${asset.building_name}`}
            onPress={onDelete}
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialIcons name="delete-outline" size={18} color={colors.error} />
            <Text style={styles.deleteLabel}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: spacing.sm,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  details: {
    padding: spacing.md,
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  id: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  text: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  actionButton: {
    flex: 1,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: spacing.sm,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: colors.errorLight,
    borderColor: colors.errorLight,
  },
  editLabel: {
    ...typography.label,
    color: colors.primaryDark,
  },
  deleteLabel: {
    ...typography.label,
    color: colors.error,
  },
  pressed: {
    opacity: 0.7,
  },
});
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { captureImage } from '../services/cameraService';
import { colors, spacing } from '../theme';
import { RootStackList } from '../navigation/types';

type InspectionFormRouteProp = RouteProp<RootStackList, 'InspectionForm'>;

const safetyItems = [
  'Personal protective equipment',
  'Site access and barricading',
];
const structuralItems = [
  'Visible cracks or damage',
  'Concrete surface condition',
];

export default function InspectionForm() {
  const navigation = useNavigation<NavigationProp<RootStackList>>();
  const { params } = useRoute<InspectionFormRouteProp>();
  const assetId = params?.assetId;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [weather, setWeather] = useState('');
  const [stage, setStage] = useState('');
  const [openDropdown, setOpenDropdown] = useState<'weather' | 'stage' | null>(
    null,
  );
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [defectCount, setDefectCount] = useState(0);
  const [capturing, setCapturing] = useState(false);

  const toggleChecklistItem = (item: string) => {
    setCheckedItems(current =>
      current.includes(item)
        ? current.filter(value => value !== item)
        : [...current, item],
    );
  };

  const takePhoto = async () => {
    setCapturing(true);
    try {
      const uri = await captureImage();
      if (uri) setImageUri(uri);
    } catch (error) {
      console.error('Error capturing image:', error);
    } finally {
      setCapturing(false);
    }
  };

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    type: 'weather' | 'stage',
    onSelect: (option: string) => void,
    required = false,
  ) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <Pressable
        style={styles.select}
        onPress={() => setOpenDropdown(openDropdown === type ? null : type)}
      >
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <MaterialIcons
          name={openDropdown === type ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={22}
          color={colors.textSecondary}
        />
      </Pressable>
      {openDropdown === type && (
        <View style={styles.options}>
          {options.map(option => (
            <Pressable
              key={option}
              style={styles.option}
              onPress={() => {
                onSelect(option);
                setOpenDropdown(null);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  const renderChecklist = (title: string, items: string[]) => {
    const selectedCount = items.filter(item => checkedItems.includes(item)).length;

    return (
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {selectedCount} / {items.length}
            </Text>
          </View>
        </View>
        <Text style={styles.helperText}>Example checklist item — illustrative only</Text>
        {items.map((item, index) => {
          const checked = checkedItems.includes(item);
          return (
            <Pressable
              key={item}
              style={[
                styles.checklistRow,
                index === items.length - 1 && styles.lastChecklistRow,
              ]}
              onPress={() => toggleChecklistItem(item)}
            >
              <Text style={styles.checklistText}>{item}</Text>
              <View style={[styles.checkDot, checked && styles.checkedDot]}>
                {checked && (
                  <MaterialIcons name="check" size={15} color="#FFFFFF" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      

      <View style={styles.card}>
        <Text style={styles.eyebrow}>BUILDING ASSET</Text>
        <Text style={styles.assetTitle}>Tower A — Block 01</Text>
        <Text style={styles.projectText}>
          {assetId ? `Asset ID: ${assetId}` : 'Project: Northcrest Residential'}
        </Text>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Inspection date</Text>
          <Text style={styles.infoValue}>Today</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Inspector</Text>
          <Text style={styles.infoValue}>Current user</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>GPS validation</Text>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Inspection Details</Text>
          <MaterialIcons name="keyboard-arrow-up" size={23} color={colors.textSecondary} />
        </View>

        {renderDropdown(
          'Weather condition',
          weather,
          ['Sunny', 'Cloudy', 'Rainy', 'Windy'],
          'weather',
          setWeather,
        )}
        {renderDropdown(
          'Construction stage',
          stage,
          ['Foundation', 'Framing', 'Roofing', 'Finishing'],
          'stage',
          setStage,
          true,
        )}

        <Text style={styles.fieldLabel}>Overall status</Text>
        <View style={[styles.badge, styles.progressBadge]}>
          <Text style={styles.progressText}>In Progress</Text>
        </View>
        <Text style={styles.requiredNote}>* Required field</Text>
      </View>

      {renderChecklist('Safety Checklist', safetyItems)}
      {renderChecklist('Structural Checklist', structuralItems)}

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Evidence</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Required</Text>
          </View>
        </View>

        <View style={styles.evidenceBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} />
          ) : (
            <MaterialIcons name="camera-alt" size={28} color={colors.textSecondary} />
          )}
          <Text style={styles.evidenceTitle}>Site Overview Photo *</Text>
          <Text style={styles.helperText}>Capture an overview of the site</Text>
          <Pressable
            style={styles.takePhotoButton}
            onPress={takePhoto}
            disabled={capturing}
          >
            <Text style={styles.takePhotoText}>
              {capturing ? 'Opening camera…' : imageUri ? 'Retake Photo' : 'Take Photo'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.defectsHeader}>
          <Text style={styles.defectsTitle}>Defects</Text>
          <Pressable onPress={() => setDefectCount(count => count + 1)}>
            <Text style={styles.addDefect}>+ Add Defect</Text>
          </Pressable>
        </View>
        <Text style={styles.helperText}>
          {defectCount ? `${defectCount} defect${defectCount === 1 ? '' : 's'} recorded` : 'No defects recorded yet'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Comments</Text>
        <TextInput
          value={comments}
          onChangeText={setComments}
          placeholder="Additional observations..."
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
          style={styles.commentsInput}
        />
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Draft</Text>
        </Pressable>
        <Pressable style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>Review &amp; Complete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.sm,
    paddingBottom: spacing.lg,
  },
  topBar: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  pageTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    backgroundColor: '#D5EFE2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#438D5A',
    fontSize: 13,
    fontWeight: '700',
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  assetTitle: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: '700',
  },
  projectText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5EAF0',
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedText: {
    color: '#249653',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  select: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 11,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: colors.textPrimary,
    fontSize: 17,
  },
  placeholder: {
    color: '#44505E',
  },
  options: {
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  option: {
    padding: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5EAF0',
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  badge: {
    backgroundColor: '#FDE7DD',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#A25230',
    fontSize: 13,
    fontWeight: '700',
  },
  progressBadge: {
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  progressText: {
    color: '#A25230',
    fontSize: 13,
    fontWeight: '700',
  },
  requiredNote: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  checklistRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E6ED',
  },
  lastChecklistRow: {
    borderBottomWidth: 0,
  },
  checklistText: {
    color: colors.textPrimary,
    fontSize: 17,
    flex: 1,
    marginRight: spacing.sm,
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedDot: {
    backgroundColor: '#249653',
  },
  evidenceBox: {
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 12,
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  evidenceTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  takePhotoButton: {
    width: '100%',
    minHeight: 60,
    backgroundColor: '#18212B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  takePhotoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  defectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  defectsTitle: {
    color: colors.textPrimary,
    fontSize: 17,
  },
  addDefect: {
    color: colors.info,
    fontSize: 17,
    fontWeight: '700',
  },
  commentsInput: {
    minHeight: 78,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 10,
    padding: spacing.sm,
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#18212B',
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  saveButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  reviewButton: {
    minHeight: 60,
    backgroundColor: '#2864E8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
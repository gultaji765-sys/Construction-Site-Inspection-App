import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootStackList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import {
  createAsset,
  getAssetById,
  updateAsset,
} from '../repositories/buildingAssets';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getLocation } from '../services/locationServices';
import { PermissionsAndroid, Platform } from 'react-native';
import getCurrentTimestamp from '../utils/dateUtils';

type AssetFormRouteProp = RouteProp<RootStackList, 'AssetForm'>;
const projects = [234, 345, 456, 678].map(projectId => ({
  label: `Project ${projectId}`,
  value: String(projectId),
}));

const constructionStages = ['Stage 1', 'Stage 2', 'Stage 3'].map(stage => ({
  label: stage,
  value: stage,
}));

type AssetInputRowProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

function validateForm(
  isEditing: boolean,
  buildingName: string,
  buildingCode: string,
  zone: string,
  floorNumber: string,
): string | null {
  if (buildingName.trim() === '') {
    return 'Building Name cannot be Empty !';
  }
  if (buildingCode.trim() === '') {
    return 'Building Code is required !';
  }
  if (floorNumber.trim() === '' || isNaN(Number(floorNumber))) {
    return 'Please Enter a valid Floor Number !';
  }
  if (zone.trim() === '') {
    return 'Zone cannot be empty !';
  }
  return null;
}

async function handleSave(
  assetId: number | undefined,
  isEditing: boolean,
  buildingName: string,
  buildingCode: string,
  zone: string,
  floorNumber: string,
  project: string,
  latitude: string,
  longitude: string,
  stage: string,
  notes: string,
  navigation: NativeStackNavigationProp<RootStackList>,
) {
  const message = validateForm(
    isEditing,
    buildingName,
    buildingCode,
    zone,
    floorNumber,
  );
  if (message) {
    Alert.alert(message);
    return;
  }
  try {
    if (isEditing) {
      if (assetId === undefined) {
        console.log('Asset Id undefined');
        return;
      }
      await updateAsset(
        assetId,
        Number(project),
        buildingName,
        buildingCode,
        Number(floorNumber),
        zone,
        Number(latitude),
        Number(longitude),
        stage,
        'Due',
        notes,
      );
      Alert.alert('Success', 'Asset Updated Successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      await createAsset(
        Number(project),
        buildingName,
        buildingCode,
        Number(floorNumber),
        zone,
        Number(latitude),
        Number(longitude),
        stage,
        'Due',
        notes,
        0,
      );
      Alert.alert('Success', 'Asset Created Successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  } catch (error) {
    console.error('Save failed:', error);
    Alert.alert('Save Failed', String(error));
  }
}

const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') return false;

  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);

  return (
    result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED ||
    result[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED
  );
};

export default function AssetFormScreen() {
  const { params } = useRoute<AssetFormRouteProp>();
  const [project, setProject] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [buildingName, setBuildingName] = useState('');
  const [buildingCode, setBuildingCode] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [zone, setZone] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [notes, setNotes] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const isEditing = params.mode === 'edit';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackList>>();
  useEffect(() => {
    if (isEditing && params.assetId !== undefined) {
      const asset_id = params.assetId;
      const getValues = async () => {
        try {
          const getParams = await getAssetById(asset_id);
          setBuildingName(String(getParams?.building_name));
          setBuildingCode(String(getParams?.building_code));
          setProject(String(getParams?.project_id));
          setFloorNumber(String(getParams?.floor_number));
          setZone(String(getParams?.zone));
          setStage(String(getParams?.construction_stage));
          setLatitude(String(getParams?.gps_latitude));
          setLongitude(String(getParams?.gps_longitude));
          setNotes(String(getParams?.notes));
          setUpdatedAt(String(getParams?.updated_at));
        } catch (error) {
          console.log(error);
        }
      };
      getValues();
    }
  }, []);

  const getCoordinates = async () => {
    setIsLocating(true);

    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permission required',
          'Location permission is required to capture coordinates.',
        );
        return;
      }

      const location = await getLocation();

      setLatitude(String(location.latitude));
      setLongitude(String(location.longitude));
    } catch (error) {
      Alert.alert(
        'Location unavailable',
        error instanceof Error
          ? error.message
          : 'Check your device location settings and try again.',
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <View style={styles.headerIcon}>
          <MaterialIcons name="apartment" size={25} color={colors.primary} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Asset' : 'Create Asset'}
          </Text>
          <Text style={styles.subtitle}>Building information</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <AssetInputRow
          label="Building Name"
          value={buildingName}
          onChangeText={setBuildingName}
          placeholder="Enter name"
        />
        <AssetInputRow
          label="Building Code"
          value={buildingCode}
          onChangeText={setBuildingCode}
          placeholder="Enter code"
          autoCapitalize="characters"
        />

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Project</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.inputText}
            data={projects}
            labelField="label"
            valueField="value"
            placeholder="Select project"
            value={project}
            onChange={item => setProject(item.value)}
            renderRightIcon={() => (
              <MaterialIcons
                name="expand-more"
                size={22}
                color={colors.textSecondary}
              />
            )}
          />
        </View>

        <AssetInputRow
          label="Floor Number"
          value={String(floorNumber)}
          onChangeText={setFloorNumber}
          placeholder="Enter floor"
          keyboardType="number-pad"
        />
        <AssetInputRow
          label="Zone"
          value={zone}
          onChangeText={setZone}
          placeholder="Enter zone"
        />

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Construction Stage</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.inputText}
            data={constructionStages}
            labelField="label"
            valueField="value"
            placeholder="Select stage"
            value={stage}
            onChange={item => setStage(item.value)}
            renderRightIcon={() => (
              <MaterialIcons
                name="expand-more"
                size={22}
                color={colors.textSecondary}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <MaterialIcons
              name="location-on"
              size={19}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>GPS Location</Text>
          </View>
          <View style={styles.coordinates}>
            <View style={styles.coordinateField}>
              <Text style={styles.coordinateLabel}>Latitude</Text>
              <TextInput
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="26.00000"
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.coordinateField}>
              <Text style={styles.coordinateLabel}>Longitude</Text>
              <TextInput
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="80.00000"
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <Pressable
            style={[
              styles.locationButton,
              isLocating && styles.locationButtonDisabled,
            ]}
            onPress={getCoordinates}
            disabled={isLocating}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <MaterialIcons
                name="my-location"
                size={18}
                color={colors.primary}
              />
            )}
            <Text style={styles.locationButtonText}>
              {isLocating ? 'Getting location...' : 'Capture Location'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this building..."
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <Pressable
        style={styles.submitButton}
        onPress={() => {
          handleSave(
            params.assetId,
            isEditing,
            buildingName,
            buildingCode,
            zone,
            floorNumber,
            project,
            latitude,
            longitude,
            stage,
            notes,
            navigation,
          );
        }}
      >
        <MaterialIcons
          name={isEditing ? 'save' : 'add'}
          size={21}
          color={colors.white}
        />
        <Text style={styles.submitButtonText}>
          {isEditing ? 'Update Asset' : 'Create Asset'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function AssetInputRow({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
}: AssetInputRowProps) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
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
    paddingBottom: spacing.xxxl,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    minHeight: 64,
  },
  fieldLabel: {
    width: '39%',
    paddingRight: spacing.sm,
    color: colors.textSecondary,
    ...typography.label,
    fontSize: 13,
  },
  input: {
    flex: 1,
    minHeight: 46,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    ...typography.bodySmall,
  },
  dropdown: {
    flex: 1,
    minHeight: 46,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
  },
  placeholder: {
    color: colors.textTertiary,
    ...typography.bodySmall,
  },
  inputText: {
    color: colors.textPrimary,
    ...typography.bodySmall,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  coordinates: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  coordinateField: {
    flex: 1,
  },
  coordinateLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  locationButton: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationButtonText: {
    ...typography.label,
    color: colors.primary,
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  notesInput: {
    minHeight: 112,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.md,
    marginTop: spacing.sm,
    color: colors.textPrimary,
    ...typography.bodySmall,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});

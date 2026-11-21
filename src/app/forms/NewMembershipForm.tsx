import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import SectionHeader from "../components/FormComponents/SectionHeader";
import SuccessModal from "../components/FormComponents/SuccessModal";

// ----------------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------------

type Gender = "Male" | "Female" | "Other";
type ProfessionType =
  | "Proprietor"
  | "Partnership"
  | "Company"
  | "Student"
  | "Employ"
  | "Unemployed"
  | "Service"
  | "Freelancer"
  | "Other";
type MembershipType = "Basic Member" | "Premium Member" | "Lifetime Member";
type PaymentMode = "Cash" | "UPI" | "Bank Transfer";

type MembershipFormValues = {
  fullName: string;
  fatherSpouseName: string;
  dob: Date;
  gender: Gender | null;
  mobileNumber: string;
  email: string;

  residentialAddress: string;
  city: string;
  state: string;
  pinCode: string;

  education: string;
  occupation: string;
  businessName: string;
  professionType: ProfessionType | null;
  annualIncome: string;

  membershipType: MembershipType | null;

  reasonToJoin: string;
  skillsInterests: string;

  referenceName: string;
  referenceContact: string;

  amountPaid: string;
  paymentMode: PaymentMode | null;
  transactionId: string;
  paymentDate: Date;

  agreedToDeclaration: boolean;
  signature: string;
  declarationDate: Date;
};

// ----------------------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------------------

const GENDER_OPTIONS: Gender[] = ["Male", "Female", "Other"];

const PROFESSION_TYPE_OPTIONS: ProfessionType[] = [
  "Proprietor",
  "Partnership",
  "Company",
  "Student",
  "Employ",
  "Unemployed",
  "Service",
  "Freelancer",
  "Other",
];

const MEMBERSHIP_TYPE_OPTIONS: MembershipType[] = [
  "Basic Member",
  "Premium Member",
  "Lifetime Member",
];

const PAYMENT_MODE_OPTIONS: PaymentMode[] = ["Cash", "UPI", "Bank Transfer"];

const DEFAULT_VALUES: MembershipFormValues = {
  fullName: "",
  fatherSpouseName: "",
  dob: new Date(),
  gender: null,
  mobileNumber: "",
  email: "",

  residentialAddress: "",
  city: "",
  state: "",
  pinCode: "",

  education: "",
  occupation: "",
  businessName: "",
  professionType: null,
  annualIncome: "",

  membershipType: null,

  reasonToJoin: "",
  skillsInterests: "",

  referenceName: "",
  referenceContact: "",

  amountPaid: "",
  paymentMode: null,
  transactionId: "",
  paymentDate: new Date(),

  agreedToDeclaration: false,
  signature: "",
  declarationDate: new Date(), // Default to today's date in YYYY-MM-DD format
};

// ----------------------------------------------------------------------------------
// Dummy API call
// ----------------------------------------------------------------------------------
// Swap this out for your real endpoint. Falls back to a public dummy endpoint
// (jsonplaceholder) if EXPO_PUBLIC_API_BASE_URL isn't set, so the form is
// testable out of the box.

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

async function submitMembershipApplication(payload: MembershipFormValues) {
  const response = await fetch(
    // `${API_BASE_URL}/api/memberships/membershipform`,
    `${API_BASE_URL}/api/membershipform`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        dob: payload.dob.toISOString(),
        declarationDate: payload.declarationDate.toISOString(),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

// ----------------------------------------------------------------------------------
// Small reusable pieces
// ----------------------------------------------------------------------------------

const FieldLabel = ({ label }: { label: string }) => (
  <Text style={style.fieldLabel}>{label}</Text>
);

const ErrorText = ({ message }: { message?: string }) =>
  message ? <Text style={style.errorText}>{message}</Text> : null;

function RadioGroupField<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T | null;
  onChange: (val: T) => void;
}) {
  return (
    <View style={style.radioGroup}>
      {options.map((option) => {
        const isSelected = value === option;
        return (
          <Pressable
            key={option}
            style={style.radioOption}
            onPress={() => onChange(option)}
          >
            <View
              style={[
                style.radioCircle,
                isSelected && style.radioCircleSelected,
              ]}
            >
              {isSelected && <View style={style.radioInnerDot} />}
            </View>
            <Text style={style.radioLabel}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ----------------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------------

const NewMembershipForm = () => {
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showDeclarationPicker, setShowDeclarationPicker] = useState(false);
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MembershipFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });

  const dob = watch("dob");
  const declarationDate = watch("declarationDate");
  const paymentDate = watch("paymentDate");

  const onSubmit = async (data: MembershipFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitMembershipApplication(data);
      console.log("Membership Form Submitted:", data, "API response:", result);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Membership submission failed:", error);
      Alert.alert(
        "Submission Failed",
        "Something went wrong while submitting your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.navy, colors.navyRaised, colors.blue, colors.blueDeep]}
      locations={[0, 0.35, 0.75, 1.0]}
      style={style.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <SuccessModal
        visible={showSuccessModal}
        formTitle="membership"
        onClose={() => setShowSuccessModal(false)}
      />

      <SafeAreaView style={style.safeArea}>
        <ScrollView
          style={style.scrollContent}
          contentContainerStyle={style.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Navigation */}
          <View style={style.headerNav}>
            <TouchableOpacity
              style={style.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={style.orgTitle}>MISSION UDYOJAK FOUNDATION</Text>
            <Text style={style.title}>Membership Application Form</Text>
          </View>

          {/* 1. Personal Details */}
          <SectionHeader title="1. Personal Details" />

          <FieldLabel label="Full Name" />
          <Controller
            control={control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter full name"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />
          <ErrorText message={errors.fullName?.message} />

          <FieldLabel label="Father's / Spouse Name" />
          <Controller
            control={control}
            name="fatherSpouseName"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter father's / spouse name"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <FieldLabel label="Date of Birth" />
          <Pressable
            style={style.dateInput}
            onPress={() => setShowDobPicker(true)}
          >
            <Text style={dob ? style.dateText : style.placeholder}>
              {dob ? dob.toLocaleDateString("en-GB") : "Select Date of Birth"}
            </Text>
          </Pressable>

          {showDobPicker && (
            <Controller
              control={control}
              name="dob"
              render={({ field: { value, onChange } }) => (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDobPicker(Platform.OS === "ios");
                    if (event.type === "set" && selectedDate) {
                      onChange(selectedDate);
                    }
                    if (Platform.OS !== "ios") {
                      setShowDobPicker(false);
                    }
                  }}
                />
              )}
            />
          )}

          <FieldLabel label="Gender" />
          <Controller
            control={control}
            name="gender"
            rules={{ required: "Please select a gender" }}
            render={({ field: { value, onChange } }) => (
              <RadioGroupField
                options={GENDER_OPTIONS}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <ErrorText message={errors.gender?.message as string | undefined} />

          <FieldLabel label="Mobile Number" />
          <Controller
            control={control}
            name="mobileNumber"
            rules={{
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter mobile number"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
                maxLength={10}
              />
            )}
          />
          <ErrorText message={errors.mobileNumber?.message} />

          <FieldLabel label="Email ID" />
          <Controller
            control={control}
            name="email"
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter email address"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          <ErrorText message={errors.email?.message} />

          {/* 2. Address Details */}
          <SectionHeader title="2. Address Details" />

          <FieldLabel label="Residential Address" />
          <Controller
            control={control}
            name="residentialAddress"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={[style.input, style.textArea]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter residential address"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={3}
              />
            )}
          />

          <View style={style.row}>
            <View style={style.rowItem}>
              <FieldLabel label="City" />
              <Controller
                control={control}
                name="city"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={style.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="City"
                    placeholderTextColor={colors.placeholder}
                  />
                )}
              />
            </View>
            <View style={style.rowItem}>
              <FieldLabel label="State" />
              <Controller
                control={control}
                name="state"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={style.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="State"
                    placeholderTextColor={colors.placeholder}
                  />
                )}
              />
            </View>
          </View>

          <FieldLabel label="PIN Code" />
          <Controller
            control={control}
            name="pinCode"
            rules={{
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Enter a valid 6-digit PIN code",
              },
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter PIN code"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                maxLength={6}
              />
            )}
          />
          <ErrorText message={errors.pinCode?.message} />

          {/* 3. Professional Details */}
          <SectionHeader title="3. Professional Details" />

          <FieldLabel label="Education" />
          <Controller
            control={control}
            name="education"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter education"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <FieldLabel label="Occupation" />
          <Controller
            control={control}
            name="occupation"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter occupation"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <FieldLabel label="Business Name (if any)" />
          <Controller
            control={control}
            name="businessName"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter business name"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <FieldLabel label="Type" />
          <Controller
            control={control}
            name="professionType"
            render={({ field: { value, onChange } }) => (
              <RadioGroupField
                options={PROFESSION_TYPE_OPTIONS}
                value={value}
                onChange={onChange}
              />
            )}
          />

          <FieldLabel label="Annual Income (Approx)" />
          <Controller
            control={control}
            name="annualIncome"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter approx annual income"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
            )}
          />

          {/* 4. Membership Type */}
          <SectionHeader title="4. Membership Type" />
          <Controller
            control={control}
            name="membershipType"
            rules={{ required: "Please select a membership type" }}
            render={({ field: { value, onChange } }) => (
              <RadioGroupField
                options={MEMBERSHIP_TYPE_OPTIONS}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <ErrorText
            message={errors.membershipType?.message as string | undefined}
          />

          {/* 5. Reason to join */}
          <SectionHeader title="5. Why do you want to join Mission Udyojak Foundation?" />
          <Controller
            control={control}
            name="reasonToJoin"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={[style.input, style.textArea]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Share your reason"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={4}
              />
            )}
          />

          {/* 6. Skills / Interests */}
          <SectionHeader title="6. Skills / Interests" />
          <Controller
            control={control}
            name="skillsInterests"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={[style.input, style.textArea]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="List your skills / interests"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={3}
              />
            )}
          />

          {/* 7. Reference */}
          <SectionHeader title="7. Reference (if any)" />

          <FieldLabel label="Name" />
          <Controller
            control={control}
            name="referenceName"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter reference name"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <FieldLabel label="Contact" />
          <Controller
            control={control}
            name="referenceContact"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter reference contact"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
              />
            )}
          />

          {/* 8. Membership Fee Details */}
          <SectionHeader title="8. Membership Fee Details" />

          <FieldLabel label="Amount Paid (₹)" />
          <Controller
            control={control}
            name="amountPaid"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter amount paid"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
            )}
          />

          <FieldLabel label="Payment Mode" />
          <Controller
            control={control}
            name="paymentMode"
            render={({ field: { value, onChange } }) => (
              <RadioGroupField
                options={PAYMENT_MODE_OPTIONS}
                value={value}
                onChange={onChange}
              />
            )}
          />

          <FieldLabel label="Transaction ID" />
          <Controller
            control={control}
            name="transactionId"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter transaction ID"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <FieldLabel label="Payment Date" />
          <Pressable
            style={style.dateInput}
            onPress={() => setShowPaymentDatePicker(true)}
          >
            <Text style={paymentDate ? style.dateText : style.placeholder}>
              {paymentDate
                ? paymentDate.toLocaleDateString("en-GB")
                : "Select Payment Date"}
            </Text>
          </Pressable>

          {showPaymentDatePicker && (
            <Controller
              control={control}
              name="paymentDate"
              render={({ field: { value, onChange } }) => (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowPaymentDatePicker(Platform.OS === "ios");
                    if (event.type === "set" && selectedDate) {
                      onChange(selectedDate);
                    }
                    if (Platform.OS !== "ios") {
                      setShowPaymentDatePicker(false);
                    }
                  }}
                />
              )}
            />
          )}

          {/* 9. Declaration */}
          <SectionHeader title="9. Declaration" />
          <Text style={style.declarationText}>
            I hereby declare that the information provided is true and correct.
            I agree to follow the rules and regulations of Mission Udyojak
            Foundation.
          </Text>

          <Controller
            control={control}
            name="agreedToDeclaration"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Pressable
                style={style.checkboxRow}
                onPress={() => onChange(!value)}
              >
                <View style={[style.checkbox, value && style.checkboxChecked]}>
                  {value && <Text style={style.checkmark}>✓</Text>}
                </View>
                <Text style={style.checkboxLabel}>
                  I agree to the declaration
                </Text>
              </Pressable>
            )}
          />
          {errors.agreedToDeclaration && (
            <ErrorText message="You must accept the declaration to proceed" />
          )}

          <FieldLabel label="Signature (type full name)" />
          <Controller
            control={control}
            name="signature"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={style.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter signature"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <FieldLabel label="Date" />
          <Pressable
            style={style.dateInput}
            onPress={() => setShowDeclarationPicker(true)}
          >
            <Text style={declarationDate ? style.dateText : style.placeholder}>
              {declarationDate
                ? declarationDate.toLocaleDateString("en-GB")
                : "Select Declaration Date"}
            </Text>
          </Pressable>

          {showDeclarationPicker && (
            <Controller
              control={control}
              name="declarationDate"
              render={({ field: { value, onChange } }) => (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDeclarationPicker(Platform.OS === "ios");
                    if (event.type === "set" && selectedDate) {
                      onChange(selectedDate);
                    }
                    if (Platform.OS !== "ios") {
                      setShowDeclarationPicker(false);
                    }
                  }}
                />
              )}
            />
          )}

          <Pressable
            style={[
              style.submitButton,
              isSubmitting && style.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <Text style={style.submitButtonText}>Submit Application</Text>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default NewMembershipForm;

// ----------------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------------

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  orgTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.gold,
    marginBottom: 2,
    letterSpacing: 1.5,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerNav: {
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassStrong,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textOnDarkMuted,
    marginTop: 12,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.white,
  },
  dateInput: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 15,
    color: colors.white,
  },
  placeholder: {
    fontSize: 15,
    color: colors.placeholder,
  },
  textArea: {
    minHeight: 85,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 6,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: colors.white,
  },
  declarationText: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.orange,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "bold",
  },
});

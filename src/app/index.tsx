import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";

export default function Index() {
  return (
    <LinearGradient
      colors={[colors.navy, colors.navyRaised, colors.blue, colors.blueDeep]}
      locations={[0, 0.35, 0.75, 1.0]}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Top Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Image
                source={require("../../assets/appIcon/appIcon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Middle Content */}
          <View style={styles.textSection}>
            <Text style={styles.welcomeLabel}>WELCOME TO</Text>
            <Text style={styles.title}>Mission Udyojak</Text>
            <Text style={styles.title}>Foundation</Text>
            <Text style={styles.subtitle}>
              Empowering entrepreneurs and communities to build a better future,
              one opportunity at a time.
            </Text>
          </View>

          {/* Bottom Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.getStartedButton}
              activeOpacity={0.85}
              onPress={() => router.push("/Forms")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  logoCircle: {
    width: 270,
    height: 270,
    borderRadius: 32,
    backgroundColor: colors.navy,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    padding: 16,
  },
  logoImage: {
    width: 238,
    height: 238,
  },

  textSection: {
    marginBottom: 36,
  },
  welcomeLabel: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 42,
  },
  subtitle: {
    color: colors.textOnDarkMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    fontWeight: "400",
  },

  buttonSection: {
    marginBottom: 24,
  },
  getStartedButton: {
    backgroundColor: colors.orange,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

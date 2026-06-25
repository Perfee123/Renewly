import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignUpPress = async () => {
    if (!signUp) return;
    setLoading(true);
    setError("");
    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });

      if (result?.error) {
        setError(result.error.longMessage || "An error occurred.");
      } else if (signUp.status === "complete") {
        await signUp.finalize();
        router.replace("/(tabs)");
      } else {
        console.error("Sign up incomplete: status", signUp.status);
        setError(`Sign up incomplete. Status: ${signUp.status}`);
      }
    } catch (err: any) {
      console.error("Sign up error:", err.errors?.[0]?.code || err.message || "Unknown error");
      setError(err.errors?.[0]?.longMessage || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="auth-screen"
    >
      <ScrollView className="auth-scroll" contentContainerClassName="auth-content">
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">R</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Renewly</Text>
              <Text className="auth-wordmark-sub">SMART BILLING</Text>
            </View>
          </View>
          <Text className="auth-title">Create Account</Text>
          <Text className="auth-subtitle">
            Sign up to start managing your subscriptions
          </Text>
        </View>

        <View className="auth-card">
          <View className="auth-form">
            <View className="auth-field">
              <Text className="auth-label">Email</Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor="rgba(0,0,0,0.4)"
                onChangeText={setEmailAddress}
                className={`auth-input ${error ? "auth-input-error" : ""}`}
                keyboardType="email-address"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                value={password}
                placeholder="Create a password"
                placeholderTextColor="rgba(0,0,0,0.4)"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setPassword}
                className={`auth-input ${error ? "auth-input-error" : ""}`}
              />
            </View>

            {error ? <Text className="auth-error">{error}</Text> : null}

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading || !emailAddress || !password}
              className={`auth-button ${
                loading || !emailAddress || !password ? "auth-button-disabled" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#081126" />
              ) : (
                <Text className="auth-button-text">Sign up</Text>
              )}
            </TouchableOpacity>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="auth-link">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

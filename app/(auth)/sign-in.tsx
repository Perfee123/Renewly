import { useSignIn } from "@clerk/expo";
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

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Sign in is incomplete.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
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
          <Text className="auth-title">Welcome back</Text>
          <Text className="auth-subtitle">
            Sign in to continue managing your subscriptions
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
                placeholder="Enter your password"
                placeholderTextColor="rgba(0,0,0,0.4)"
                secureTextEntry={true}
                onChangeText={setPassword}
                className={`auth-input ${error ? "auth-input-error" : ""}`}
              />
            </View>

            {error ? <Text className="auth-error">{error}</Text> : null}

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading || !emailAddress || !password}
              className={`auth-button ${
                loading || !emailAddress || !password ? "auth-button-disabled" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#081126" />
              ) : (
                <Text className="auth-button-text">Sign in</Text>
              )}
            </TouchableOpacity>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Renewly?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="auth-link">Create an account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

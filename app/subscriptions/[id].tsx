import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="mt-10 items-center justify-center">
      <Text>Subscription Details : {id}</Text>
      <Link href="/" className="mt-5 rounded-full bg-primary text-white p-4">
        Go back
      </Link>
    </View>
  );
};

export default SubscriptionDetails;

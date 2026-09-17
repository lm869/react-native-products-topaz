import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ProductsStackParamList = {
  Products: undefined;
  ProductDetail: { productId: number };
};

export type RootTabParamList = {
  ProductsTab: NavigatorScreenParams<ProductsStackParamList> | undefined;
  FavoritesTab: undefined;
};

export type ProductsStackScreenProps<T extends keyof ProductsStackParamList> =
  NativeStackScreenProps<ProductsStackParamList, T>;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

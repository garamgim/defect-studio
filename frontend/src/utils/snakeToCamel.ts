// snake_case 문자열을 camelCase로 변환하는 utility Type
export type SnakeToCamelString<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelString<U>>}`
  : S;

// 객체의 키를 snake_case에서 camelCase로 변환하는 Mapped Type
export type SnakeToCamel<T> = {
  [K in keyof T as K extends string ? SnakeToCamelString<K> : K]: T[K];
};

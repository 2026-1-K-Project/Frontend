declare module '@react-native-documents/picker' {
  export type PickResponse = {
    uri: string;
    name?: string | null;
    type?: string | null;
  };

  export function pick(options?: {
    allowMultiSelection?: boolean;
    type?: string[];
  }): Promise<PickResponse[]>;
}

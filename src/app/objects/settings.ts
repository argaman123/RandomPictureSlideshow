export interface Settings {
  keywords: string[],
  resolution: string,
  interval: number,
  specificCategory: SpecificOptions
  specific: string,
  clock: boolean,
  animation: boolean
}

export enum SpecificOptions {
  Random,
  All,
  Featured,
  Collection,
  User,
  Custom
}

export const specificRequired = [SpecificOptions.User, SpecificOptions.Collection, SpecificOptions.Custom]

import { atom } from 'recoil';

export const errorState = atom<Error | null | unknown>({
  key: 'errorState',
  default: null,
});

export interface BirthdayConfig {
  friendName: string;
  age: number;
  nickname: string;
  senderName: string;
  birthdayMessage: string;
  favCar: string;
  favHamster: string;
  seedsFed: number;
  photos: {
    id: string;
    url: string;
    caption: string;
    tag?: string;
  }[];
}

export type Stage = 'surprise' | 'cake' | 'gift';

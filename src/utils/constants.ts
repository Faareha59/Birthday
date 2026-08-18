import { BirthdayConfig } from '../types';
import twinDoodleImg from '../assets/images/twin_bday_doodle_1786915683396.jpg';
import doodleHamsterBday from '../assets/images/hamster_bday_doodle_1786915345347.jpg';
import doodleHamsterDriving from '../assets/images/hamster_driving_doodle_1786915359282.jpg';
import doodleHamsterSeed from '../assets/images/hamster_seed_doodle_1786915371450.jpg';

export const HAMSTER_IMAGES = {
  twinDoodle: twinDoodleImg,
  doodleBday: doodleHamsterBday,
  doodleDriving: doodleHamsterDriving,
  doodleSeed: doodleHamsterSeed,
};

export const DEFAULT_CONFIG: BirthdayConfig = {
  friendName: 'Twin',
  age: 0,
  nickname: 'Speedy Twin',
  senderName: 'Your Twin & Friends',
  birthdayMessage: `happy birthday twin! 🎂✨\n\nwishing you the happiest birthday filled with fun moments, good coffee, fast smooth drives, zero traffic, and lots of happy hamster cheer! 🏎️🐹\n\nyou are the absolute best with great taste, maximum smiles, and unmatched energy. may this year bring exciting adventures, endless sunflower seeds, smooth roads, and all the treats you deserve!\n\ncheers to you twin and many more wonderful memories ahead! 🥂✨`,
  favCar: 'Porsche 911 GT3 / Nissan GT-R',
  favHamster: 'Happy Birthday Doodle Hamster',
  seedsFed: 0,
  photos: [
    {
      id: '1',
      url: twinDoodleImg,
      caption: "happy b'day twin! making a big wish with cake & candles 🎂✨",
      tag: 'Birthday Star',
    },
    {
      id: '2',
      url: doodleHamsterDriving,
      caption: 'cruising with peak horsepower and tiny shades 🏎️💨',
      tag: 'Fast & Fluffy',
    },
    {
      id: '3',
      url: doodleHamsterSeed,
      caption: 'snacking on victory sunflower seeds on your special day 🌻🐹',
      tag: 'Cheek Stuffer',
    },
    {
      id: '4',
      url: doodleHamsterBday,
      caption: 'pure unhinged joy celebrating your special day! 🎉',
      tag: 'Big Smile',
    },
  ],
};

export function generateShareUrl(config: BirthdayConfig): string {
  try {
    const payload = {
      n: config.friendName,
      a: config.age,
      nk: config.nickname,
      s: config.senderName,
      m: config.birthdayMessage,
      c: config.favCar,
      h: config.favHamster,
    };
    const jsonStr = JSON.stringify(payload);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.searchParams.set('bday', encoded);
    return url.toString();
  } catch (err) {
    console.error('Error generating share URL', err);
    return window.location.href;
  }
}

export function loadConfigFromUrl(): BirthdayConfig {
  try {
    const url = new URL(window.location.href);
    const bdayParam = url.searchParams.get('bday');
    if (!bdayParam) return DEFAULT_CONFIG;

    const decoded = decodeURIComponent(atob(bdayParam));
    const data = JSON.parse(decoded);

    return {
      friendName: data.n || DEFAULT_CONFIG.friendName,
      age: data.a || DEFAULT_CONFIG.age,
      nickname: data.nk || DEFAULT_CONFIG.nickname,
      senderName: data.s || DEFAULT_CONFIG.senderName,
      birthdayMessage: data.m || DEFAULT_CONFIG.birthdayMessage,
      favCar: data.c || DEFAULT_CONFIG.favCar,
      favHamster: data.h || DEFAULT_CONFIG.favHamster,
      seedsFed: 0,
      photos: DEFAULT_CONFIG.photos,
    };
  } catch (err) {
    console.error('Failed to parse URL bday param', err);
    return DEFAULT_CONFIG;
  }
}

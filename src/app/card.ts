export class Card {
  id: number;
  name: string;
  card_set: string;
  type: string;
  profession: string;
  rarity: string;
  cost: number;
  description: string;
  artist: string;
  collectible: boolean;
  img: string;
  img_gold: string;
  locale: string;
  flavor: string;
  race: string;
  attack: number;
  health: number;

  constructor(id: number, name?: string, card_set?: string, type?: string, profession?: string, race?: string
              , rarity?: string, cost?: number, description?: string, artist?: string, collectible?: boolean
              , img?: string, img_gold?: string, locale?: string, flavor?: string, attack?: number, health?: number) {
    this.id = id;
    this.name = name;
    this.card_set = card_set;
    this.type = type;
    this.profession = profession;
    this.rarity = rarity;
    this.cost = cost;
    this.description = description;
    this.artist = artist;
    this.collectible = collectible;
    this.img = img;
    this.img_gold = img_gold;
    this.locale = locale;
    this.flavor = flavor;
    this.race = race;
    this.attack = attack;
    this.health = health;
  }
}


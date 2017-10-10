import {Pipe, PipeTransform} from '@angular/core';

import {Card} from './card';
import {FilterCondition} from './FilterCondition';


@Pipe({name: 'cardFilter'})
export class FilterPipe implements PipeTransform {
  cards: Card[];

  transform(allCards: Card[], conditions: FilterCondition) {
    this.cards = allCards;
    if (conditions.getSetChosen()) {
      this.cards = this.cards.filter(card => conditions.getSetChosen().includes(card.card_set));
    }


    if (conditions.getRarityChosen()) {
      this.cards = this.cards.filter(card => conditions.getRarityChosen().includes(card.rarity));

    }

    if (conditions.getClassChosen()) {

      this.cards = this.cards.filter(card => conditions.getClassChosen().includes(card.profession));

    }

    if (conditions.getRaceChosen()) {
      this.cards = this.cards.filter(card => conditions.getRaceChosen().includes(card.race));
    }


    return this.cards;
  }
}

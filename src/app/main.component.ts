import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CardService} from './card.service';
import {Card} from './card';
import {FilterCondition} from './FilterCondition';

@Component({
  selector: 'app-main',
  template: `
    <div id="card_set_filter">
      <label>Card Set:</label><br>
      <select id="card_set_selection">
        <option value="" selected disabled hidden>Choose card set here</option>
        <option *ngFor="let packName of packList" value="{{packName}}">
          <!--[class.selected]="set === selectedSet"-->
          <!--(click)="onSelect(set)">-->{{packName}}
        </option>
      </select>
      <div class="row">
        <fieldset id="fieldset_rarity">
          <legend>Rarity</legend>
          <input type="checkbox" id="rarity_free" value="Free">Free<br>
          <input type="checkbox" id="rarity_common" value="Common">Common<br>
          <input type="checkbox" id="rarity_rare" value="Rare">Rare<br>
          <input type="checkbox" id="rarity_epic" value="Epic">Epic<br>
          <input type="checkbox" id="rarity_legendary" value="Legendary">Legendary<br>
        </fieldset>
        <fieldset id="fieldset_class">
          <legend>Class</legend>
          <!--<input type="checkbox" id="class_Neutral" value="Neutral">Neutral<br>-->
          <!--<input type="checkbox" id="class_Druid" value="Druid">Druid<br>-->
          <!--<input type="checkbox" id="class_Hunter" value="Hunter">Hunter<br>-->
          <!--<input type="checkbox" id="class_Mage" value="Mage">Mage<br>-->
          <!--<input type="checkbox" id="class_Paladin" value="Paladin">Paladin<br>-->
          <!--<input type="checkbox" id="class_Priest" value="Priest">Priest<br>-->
          <!--<input type="checkbox" id="class_Rogue" value="Rogue">Rogue<br>-->
          <!--<input type="checkbox" id="class_Shaman" value="Shaman">Shaman<br>-->
          <!--<input type="checkbox" id="class_Warlock" value="Warlock">Warlock<br>-->
          <!--<input type="checkbox" id="class_Warrior" value="Warrior">Warrior<br>-->
          <div *ngFor='let cls of classList'>
            <input type='checkbox' id='class_{{cls}}' value='{{cls}}'>{{cls}}<br>
          </div>

        </fieldset>
      </div>
    </div>
    <h1>this is main comp</h1>
    <button (click)="filtering()">Filter</button>

    <!--<div class="row">-->
    <!--<div class="col-sm-3">item1</div>-->
    <!--<div class="col-sm-3">item2</div>-->
    <!--<div class="col-sm-3">item3</div>-->
    <!--<div class="col-sm-3">item4</div>-->
    <!--</div>-->
    <div *ngIf="cardsJSON">
      <div *ngFor="let card of cards | cardFilter:conditions | paginate: { itemsPerPage: 15, currentPage: p } let index =index;
    let isOdd=odd; let isEven=even" class="row entry-row" [class.odd]="isOdd" [class.even]="isEven" class="row">
        <div *ngIf='card.img' class="col-sm-4">
          <img src='{{card.img? card.img: "" }}' onerror="this.src='http://via.placeholder.com/307x465'"/>
        </div>
        <div class="detail-col col-sm-5">
          <h3 class="cardName">{{card.name}}</h3><br>
          <p>{{card.description}}</p>
          <ul [ngSwitch]="card.rarity">
            <li *ngIf="card.type">
              Type: {{card.type}}
            </li>
            <li *ngIf="card.rarity">
              Rarity: {{card.rarity}}
            </li>
            <li *ngIf="card.card_set">
              Set: {{card.card_set}}
            </li>
            <li *ngIf="card.race">
              Race:
            </li>
            <li *ngIf="card.profession">
              Player Class: {{card.profession}}
            </li>
            <li *ngSwitchCase="'Legendary'">
              Crafting Cost: 1600/ 3200(golden)
            </li>
            <li *ngSwitchCase="'Epic'">
              Crafting Cost: 400/ 1600(golden)
            </li>
            <li *ngSwitchCase="'Rare'">
              Crafting Cost: 100/ 800(golden)
            </li>
            <li *ngSwitchCase="'Common'">
              Crafting Cost: 40/ 400(golden)
            </li>
            <li *ngSwitchCase="'Legendary'">
              Arcane Dust Gained: 400/1600(golden)
            </li>
            <li *ngSwitchCase="'Epic'">
              Arcane Dust Gained: 100/400(golden)
            </li>
            <li *ngSwitchCase="'Rare'">
              Arcane Dust Gained: 20/100(golden)
            </li>
            <li *ngSwitchCase="'Common'">
              Arcane Dust Gained: 5/50(golden)
            </li>
            <li *ngIf="card.artist">
              Artist: {{card.artist}}
            </li>
            <li *ngIf="card.collectible">
              Collectible
            </li>
            <li *ngIf="card.flavor">
              {{card.flavor}}
            </li>
          </ul>


        </div>
      </div>


    </div>
    <pagination-controls (pageChange)="p = $event"></pagination-controls>
  `,
  providers: [CardService],
})

export class MainComponent implements OnInit {
  p: number = 1;
  packList: string[] = ['Basic', 'Classic', 'Naxxramas', 'Goblins vs Gnomes', 'Blackrock Mountain'
    , 'The Grand Tournament', 'The League of Explorers', 'Whispers of the Old Gods', 'One Night in Karazhan'
    , 'Mean Streets of Gadgetzan', 'Journey to Un\'Goro', 'Knights of the Frozen Throne'];
  classList = ['Neutral', 'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'];

  // the packlist is hard coded, due to the fact that the JSON from api call is flawed
  all_cards: Card[] = [];
  cards: Card[] = [];
  temp_cards: Card[] = [];
  cardsJSON: JSON;
  objectKeys = Object.keys;
  offset = 0;
  limit = 10;
  count: number;
  conditions: FilterCondition;
  tmp_conditions: FilterCondition;


  setChosen: string[] = [];
  classChosen: string[] = [];
  rarityChosen: string[] = [];

  constructor(private cardService: CardService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.cardService.getCards().then(res => {
      this.cardsJSON = res;
      this.count = Object.keys(this.cardsJSON).length;
      this.cardsJSON = res;
      this.count = Object.keys(res).length;

      this.conditions = new FilterCondition();



      // for (var i = 0; i < this.count; i++) {
      //     this.cards.push(new Card(this.cardsJSON[i].cardId, this.cardsJSON[i].name, this.cardsJSON[i].cardSet
      //       , this.cardsJSON[i].type, this.cardsJSON[i].playerClass, this.cardsJSON[i].rarity
      //       , this.cardsJSON[i].cost, this.cardsJSON[i].text, this.cardsJSON[i].artist
      //       , this.cardsJSON[i].collectible, this.cardsJSON[i].img, this.cardsJSON[i].imgGold
      //       , this.cardsJSON[i].locale, this.cardsJSON[i].flavor));
      //   }
      // });

      for (var i = 0; i < this.packList.length; i++) {
        // if (Object.keys(this.cardsJSON[this.packList[i]]).length !== 0) {
        for (var j = 0; j < Object.keys(this.cardsJSON[this.packList[i]]).length; j++) {
          this.all_cards.push(new Card(this.cardsJSON[this.packList[i]][j].cardId
            , this.cardsJSON[this.packList[i]][j].name, this.cardsJSON[this.packList[i]][j].cardSet
            , this.cardsJSON[this.packList[i]][j].type, this.cardsJSON[this.packList[i]][j].playerClass
            , this.cardsJSON[this.packList[i]][j].race
            , this.cardsJSON[this.packList[i]][j].rarity, this.cardsJSON[this.packList[i]][j].cost
            , this.cardsJSON[this.packList[i]][j].text, this.cardsJSON[this.packList[i]][j].artist
            , this.cardsJSON[this.packList[i]][j].collectible, this.cardsJSON[this.packList[i]][j].img
            , this.cardsJSON[this.packList[i]][j].imgGold, this.cardsJSON[this.packList[i]][j].locale
            , this.cardsJSON[this.packList[i]][j].flavor));
        }
        // }
      }

      for (let card of this.all_cards) {
        if (card.collectible === true) {
          this.cards.push(card);
        }
      }


    });


  }

  filtering(): void {

    this.tmp_conditions = new FilterCondition();
    this.conditions = new FilterCondition();

    if ((<HTMLInputElement>document.getElementById('card_set_selection')).value) {
      this.setChosen.push((<HTMLInputElement>document.getElementById('card_set_selection')).value);
    }
    if (this.setChosen.length !== 0) {
      this.tmp_conditions.setSetChosen(this.setChosen);
    }


    this.getChosenRarity();
    this.getChosenClass();


    this.conditions.setClassChosen(this.tmp_conditions.getClassChosen());
    this.conditions.setRarityChosen(this.tmp_conditions.getRarityChosen());
    this.conditions.setSetChosen(this.tmp_conditions.getSetChosen());
    this.tmp_conditions = new FilterCondition();
    // ******The conditions object has to be re-referenced, so that the pipe will recoginze the changes,
    //  therefore the temp condition object is created, and cleared every time it changes **************

    // Clear all the data residuals
    this.setChosen = [];
    this.rarityChosen = [];
    this.classChosen = [];

  }

  getChosenRarity(): void {

    if ((<HTMLInputElement>document.getElementById('rarity_free')).checked) {
      this.rarityChosen.push((<HTMLInputElement>document.getElementById('rarity_free')).value);
    }
    if ((<HTMLInputElement>document.getElementById('rarity_common')).checked) {
      this.rarityChosen.push((<HTMLInputElement>document.getElementById('rarity_common')).value);
    }
    if ((<HTMLInputElement>document.getElementById('rarity_rare')).checked) {
      this.rarityChosen.push((<HTMLInputElement>document.getElementById('rarity_rare')).value);
    }
    if ((<HTMLInputElement>document.getElementById('rarity_epic')).checked) {
      this.rarityChosen.push((<HTMLInputElement>document.getElementById('rarity_epic')).value);
    }
    if ((<HTMLInputElement>document.getElementById('rarity_legendary')).checked) {
      this.rarityChosen.push((<HTMLInputElement>document.getElementById('rarity_legendary')).value);
    }

    if (this.rarityChosen.length !== 0) {
      this.tmp_conditions.setRarityChosen(this.rarityChosen);
    }


  }
  // TODO: clean this method up later


  // getChosenClass(): void {
  //   if ((<HTMLInputElement>document.getElementById('class_Neutral')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Neutral')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Druid')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Druid')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Hunter')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Hunter')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Mage')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Mage')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Paladin')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Paladin')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Priest')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Priest')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Rogue')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Rogue')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Shaman')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Shaman')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Warlock')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Warlock')).value);
  //   }
  //   if ((<HTMLInputElement>document.getElementById('class_Warrior')).checked) {
  //     this.classChosen.push((<HTMLInputElement>document.getElementById('class_Warrior')).value);
  //   }
  // }

  getChosenClass(): void {
    for (let cls of this.classList) {
      if ((<HTMLInputElement>document.getElementById('class_' + cls)).checked) {
        this.classChosen.push((<HTMLInputElement>document.getElementById('class_' + cls)).value);
      }
    }

    if (this.classChosen.length !== 0) {
      this.tmp_conditions.setClassChosen(this.classChosen);
    }

  }
}

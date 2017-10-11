import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CardService} from './card.service';
import {Card} from './card';
import {FilterCondition} from './FilterCondition';
import {ElementRef, Renderer} from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <div id="card_set_filter">
      <div class="row">

        <div class="col-md-5" id="filter_div">
          <div class="container">
            <label>Card Set:</label><br>
            <select id="card_set_selection">
              <option value="ALL" selected disabled hidden>Choose card set here</option>
              <option value="ALL">All Cards</option>
              <option value="STANDARD">Standard Cards</option>
              <option *ngFor="let packName of packList" value="{{packName}}">
                <!--[class.selected]="set === selectedSet"-->
                <!--(click)="onSelect(set)">-->{{packName}}
              </option>
            </select>
          </div>


          <div class="container">

            <select (change)='addFilter(this.clickEvent)'>
              <option>Add a filter...</option>
              <optgroup label="Stats">
                <option value="Attack">Attack</option>
                <option value="Health">Health</option>
                <option value="Cost">Cost</option>
              </optgroup>

              <optgroup label="Mechanics">
                <option *ngFor="let mechanic of mechanicList" value="{{mechanic}}">{{mechanic}}</option>
              </optgroup>

            </select>
          </div>
        </div>

        <div class="col-md-2">
        </div>

        <div class="col-md-5">
          <div class="row" id="filter_row">
            <div>
              <legend>Race</legend>
              <fieldset id="fieldset_race">

                <div *ngFor="let race of raceList">
                  <input type="checkbox" id="race_{{race}}" value="{{race}}">{{race}}<br>
                </div>

              </fieldset>
            </div>
            <div>

              <legend>Rarity</legend>

              <fieldset id="fieldset_rarity">
                <input type="checkbox" id="rarity_free" value="Free">Free<br>
                <input type="checkbox" id="rarity_common" value="Common">Common<br>
                <input type="checkbox" id="rarity_rare" value="Rare">Rare<br>
                <input type="checkbox" id="rarity_epic" value="Epic">Epic<br>
                <input type="checkbox" id="rarity_legendary" value="Legendary">Legendary<br>
              </fieldset>
            </div>
            <div>

              <legend>Class</legend>
              <fieldset id="fieldset_class">

                <div *ngFor='let cls of classList'>
                  <input type='checkbox' id='class_{{cls}}' value='{{cls}}'>{{cls}}<br>
                </div>

              </fieldset>
            </div>

          </div>

        </div>
      </div>

      <button (click)="filtering()">Filter</button>

    </div>

    <!--<div class="row">-->
    <!--<div class="col-sm-3">item1</div>-->
    <!--<div class="col-sm-3">item2</div>-->
    <!--<div class="col-sm-3">item3</div>-->
    <!--<div class="col-sm-3">item4</div>-->
    <!--</div>-->
    <div *ngIf="cardsJSON" id="displayPanel">
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
  p = 1;
  packList: string[] = ['Basic', 'Classic', 'Naxxramas', 'Goblins vs Gnomes', 'Blackrock Mountain'
    , 'The Grand Tournament', 'The League of Explorers', 'Whispers of the Old Gods', 'One Night in Karazhan'
    , 'Mean Streets of Gadgetzan', 'Journey to Un\'Goro', 'Knights of the Frozen Throne'];
  standardPackList: string[] = ['Basic', 'Classic', 'Whispers of the Old Gods', 'One Night in Karazhan'
    , 'Mean Streets of Gadgetzan', 'Journey to Un\'Goro', 'Knights of the Frozen Throne'];
  classList = ['Neutral', 'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'];
  raceList = ['Beast', 'Demon', 'Dragon', 'Elemental', 'Mech', 'Murloc', 'Pirate', 'Totem'];
  mechanicList = ['Adapt', 'BattleCry', 'Charge', 'Choose One', 'Combo', 'Deathrattle', 'Discover', 'Divine Shield', 'Enrage'
    , 'Freeze', 'Immune', 'Inspire', 'Lifesteal', 'Overload', 'Quest', 'Secret', 'Silence', 'Spell Damage', 'Stealth', 'Taunt'
    , 'Transform', 'Windfury'];
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
  clickEvent: boolean = true;
  filter_counter = 1;


  setChosen: string[] = [];
  classChosen: string[] = [];
  rarityChosen: string[] = [];
  raceChosen: string[] = [];

  constructor(private cardService: CardService, public renderer: Renderer2) {
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

      for (let i = 0; i < this.packList.length; i++) {
        // if (Object.keys(this.cardsJSON[this.packList[i]]).length !== 0) {
        for (let j = 0; j < Object.keys(this.cardsJSON[this.packList[i]]).length; j++) {
          this.all_cards.push(new Card(this.cardsJSON[this.packList[i]][j].cardId
            , this.cardsJSON[this.packList[i]][j].name, this.cardsJSON[this.packList[i]][j].cardSet
            , this.cardsJSON[this.packList[i]][j].type, this.cardsJSON[this.packList[i]][j].playerClass
            , this.cardsJSON[this.packList[i]][j].race
            , this.cardsJSON[this.packList[i]][j].rarity, this.cardsJSON[this.packList[i]][j].cost
            , this.cardsJSON[this.packList[i]][j].text, this.cardsJSON[this.packList[i]][j].artist
            , this.cardsJSON[this.packList[i]][j].collectible, this.cardsJSON[this.packList[i]][j].img
            , this.cardsJSON[this.packList[i]][j].imgGold, this.cardsJSON[this.packList[i]][j].locale
            , this.cardsJSON[this.packList[i]][j].flavor, this.cardsJSON[this.packList[i]][j].attack
            , this.cardsJSON[this.packList[i]][j].health));
        }
        // }
      }

      for (const card of this.all_cards) {
        if (card.collectible === true) {
          this.cards.push(card);
        }
      }


    });


  }

  filtering(): void {

    this.tmp_conditions = new FilterCondition();
    this.conditions = new FilterCondition();


    this.getChosenRarity();
    this.getChosenClass();
    this.getChosenRace();
    this.getChosenSet();

    this.conditions.setClassChosen(this.tmp_conditions.getClassChosen());
    this.conditions.setRarityChosen(this.tmp_conditions.getRarityChosen());
    this.conditions.setSetChosen(this.tmp_conditions.getSetChosen());
    this.conditions.setRaceChosen(this.tmp_conditions.getRaceChosen());
    this.tmp_conditions = new FilterCondition();
    // ******The conditions object has to be re-referenced, so that the pipe will recoginze the changes,
    //  therefore the temp condition object is created, and cleared every time it changes **************

    // Clear all the data residuals
    this.setChosen = [];
    this.rarityChosen = [];
    this.classChosen = [];
    this.raceChosen = [];
  }


  getChosenSet(): void {
    switch ((<HTMLInputElement>document.getElementById('card_set_selection')).value) {
      case 'ALL': {
        this.setChosen = this.packList;
        break;
      }
      case 'STANDARD': {
        this.setChosen = this.standardPackList;
        break;
      }
      default: {
        this.setChosen.push((<HTMLInputElement>document.getElementById('card_set_selection')).value);
        break;
      }
    }

    if (this.setChosen.length !== 0) {
      this.tmp_conditions.setSetChosen(this.setChosen);

    }
  }


  getChosenRarity(): void {

    if ((<HTMLInputElement>document.getElementById('rarity_free')).checked
    ) {
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

  getChosenClass(): void {
    for (const cls of this.classList
      ) {
      if ((<HTMLInputElement>document.getElementById('class_' + cls)).checked) {
        this.classChosen.push((<HTMLInputElement>document.getElementById('class_' + cls)).value);
      }
    }

    if (this.classChosen.length !== 0) {
      this.tmp_conditions.setClassChosen(this.classChosen);
    }

  }

  getChosenRace(): void {
    for (const race of this.raceList
      ) {
      if ((<HTMLInputElement>document.getElementById('race_' + race)).checked) {
        this.raceChosen.push((<HTMLInputElement>document.getElementById('race_' + race)).value);
      }
    }

    if (this.raceChosen.length !== 0) {
      this.tmp_conditions.setRaceChosen(this.raceChosen);
    }

  }

  addFilter(clickEvent): void {
    if (clickEvent) {
      var currentNode = document.getElementById('filter_div').children[this.filter_counter];
      var newNode = currentNode.cloneNode(true);
      this.renderer.listen(newNode, 'change', (event) => this.addFilter(true));
      console.log(currentNode);
      console.log(newNode);
      document.getElementById('filter_div').appendChild(newNode);

      var operatorNode = document.createElement('select');
      var inputNode = document.createElement('input');

      operatorNode.innerHTML = '<option value=">">></option><option value=">=">>=</option><option value="=">=' +
        '</option><option value="<"><</option><option value="<="><=</option><option value="!=">!=</option>';
      // (<HTMLInputElement>document.getElementById('filter_div').children[1].children[0]).removeAttribute('onchange()');
      inputNode.setAttribute('style', 'width:5em');

      currentNode.appendChild(operatorNode);
      currentNode.appendChild(inputNode);
      this.filter_counter += 1;
      // change the currentNode to the active filter selection
      this.clickEvent = false;
      this.renderer.listen(currentNode, 'change', (event) => this.addFilter(this.clickEvent));
      console.log(currentNode);
    }
  }

}


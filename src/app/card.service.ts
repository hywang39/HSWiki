import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import {Card} from './card';

@Injectable()
export class CardService {
  cards: Card[];

  constructor(private http: Http) {
  }

  // getCards(): Promise<Card[]> {
  //   return this.http.get(this.cardsUrl)
  //     .toPromise()
  //     .then(response => response.json().data as Card[])
  //     .catch(this.handleError);
  // }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getCards(): Promise<any> {
    const CARDSURL = 'https://omgvamp-hearthstone-v1.p.mashape.com/cards';
    const KEY_NAME = 'X-Mashape-Key';
    const API_KEY_VALUE = 't1N8mtAZ2TmshYMCAZVEF3TbVUp4p1Re40wjsnScURLyP1QiI1';
    let headers = new Headers();
    headers.append(KEY_NAME, API_KEY_VALUE);
    return this.http.get(CARDSURL, {headers})
    // .map((reponse) => response.json())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);

  }

}

import {Injectable} from '@angular/core';

import {Set} from './set';
import {SETS} from './card-sets';

@Injectable()
export class SetService {
  getSets(): Promise<Set[]> {
    return Promise.resolve(SETS);
  }
}

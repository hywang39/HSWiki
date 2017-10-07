export class FilterCondition {

  private setChosen?: string[];
  private classChosen?: string[];
  private rarityChosen?: string[];


  getSetChosen(): string[] {
    return this.setChosen;
  }

  setSetChosen(value: string[]) {
    this.setChosen = value;
  }

  getClassChosen(): string[] {
    return this.classChosen;
  }

  setClassChosen(value: string[]) {
    this.classChosen = value;
  }

  getRarityChosen(): string[] {
    return this.rarityChosen;
  }

  setRarityChosen(value: string[]) {
    this.rarityChosen = value;
  }
  constructor() {

  }


}


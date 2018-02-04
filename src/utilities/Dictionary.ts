import { Http } from '@angular/http';
import { Points } from '../models/wordTypes';

export default class Dictionary {
  entries: Object;
  processed: number;
  alphabet;

	constructor(public http: Http) {
		this.http = http;
    this.entries = {};
    this.processed = 0;
    this.alphabet = Points;
	}

	public buildDictionary(): Promise<string> {

		// Open all dictionary files, assign words and definitions as key-value pairs to object.
		// Return promise when all have finished.

		return new Promise<string>((resolve, reject) => {

			for (let letter in this.alphabet) {
        this.buildSubDictionary(letter, resolve, reject);
			}
		})
  }

  private buildSubDictionary(letter: string, resolve: Function, reject: Function) {

    this.http.get(`../assets/dictionaries/assets/${letter}.html`)
    .toPromise()
    .then((data) => {
      let dict = this.readDictionaryFile(data['_body'].split(/\r?\n/));
      this.entries[letter] = dict;
      this.processed++;

      if (this.processed === Object.keys(this.alphabet).length) {
        resolve("Dictionary Built!")
      }
    })
    .catch((error) => {
      reject("Error building dictionary: " + error);
    })

  }

	readDictionaryFile(dictionary: String[]) {

		let dict = {};
		let regex = new RegExp("<P><B>(.*?)</B> \\(<I>(.*?)</I>\\) (.*?)</P>", "i");

		dictionary.forEach((line) => {
			let entry: string[] = line.match(regex);

			if (entry) {
				let word: string = entry[1].replace(/[^A-Za-z]/gi, '').toUpperCase();
				let definition: string = entry[3];

				if (this.containsWord(dict, word)) {
          let definitions = dict[word];
					definitions.push(definition);
				} else {
					dict[word] = [definition];
				}
			}
		})
		return dict;
  }
  
  private containsWord(dictionary: Object, word: string): boolean {
    return dictionary[word] !== undefined;
  }
}
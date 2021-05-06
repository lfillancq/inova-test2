class Country implements Country {
  //object Country that match the database attribute
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  flag: string;
  nativeName: string;
  capital: string;
  population: number;
  languages: Array<Map<string, string>>;
  timezones: Array<string>;
  currencies: string;
  borders: string;

  constructor(
    //constructor to associate object attributes to attributes of the instances of the database
    name: string,
    alpha2Code: string,
    alpha3Code: string,
    flag: string,
    nativeName: string,
    capital: string,
    population: number,
    languages: Array<Map<string, string>>,
    timezones: Array<string>,
    currencies: string,
    borders: string
  ) {
    this.name = name;
    this.alpha2Code = alpha2Code;
    this.alpha3Code = alpha3Code;
    this.flag = flag;
    this.nativeName = nativeName;
    this.capital = capital;
    this.population = population;
    this.languages = languages;
    this.timezones = timezones;
    this.currencies = currencies;
    this.borders = borders;
  }
}

function getCountries(): Promise<Country[]> {
  // we are gonna get the data stored on the rest api
  return (
    fetch("https://restcountries.eu/rest/v2/all")
      // the JSON body is taken from the response
      .then((res) => res.json())
      .then((res) => {
        // The response has an 'any' type, so we need to cast
        // it to the 'Country' type, and return it from the promise
        return res as Country[];
      })
  );
}

function chop(n: number, str: string) {
  //function to chop chunks of the names of countries that could be the researched country
  let chopped: string[] = [];
  for (let i = 0; i < str.length - n; i++) {
    //we go through the string
    chopped.push(str.substring(i, i + n)); //we put every chunks of the size n of the input that are in the string
  }
  return chopped;
}

function codeToName(code: String) {
  //function that returns the name of a country by associating it with its alpha3Code
  getCountries().then((countries) => {
    for (let i: number = 0; i < countries.length; i++) {
      if (code === countries[i].alpha3Code) {
        return countries[i].name;
      }
    }
  });
  return "";
}

function builDetails(selected: HTMLElement) {
  //function that will build the text of the container according to what country is selected
  document
    .querySelectorAll("li")
    .forEach(
      (el) =>
        (el.style.backgroundColor = el.id === selected.id ? "#aaa" : "#ddd")
    );
  getCountries().then((countries) => {
    for (let i: number = 0; i < countries.length; i++) {
      //we go through all the countries in the database (here the list of 'Country' objects)
      if (selected.id === countries[i].name) {
        document.getElementById("name").innerHTML = countries[i].name;
        document.getElementById("flag").innerHTML = countries[i].flag;
        document.getElementById("nativeName").innerHTML =
          countries[i].nativeName;
        document.getElementById("population").innerHTML = String(
          countries[i].population
        );
        document.getElementById("languages").innerHTML = countries[
          i
        ].languages[0].get("name");
        for (let j: number = 1; j < countries[i].languages.length; j++) {
          document.getElementById("languages").innerHTML +=
            ", " + countries[i].languages[j].get("name");
        }
        document.getElementById("currencies").innerHTML =
          countries[i].currencies;
        document.getElementById("borders").innerHTML = codeToName(
          countries[i].borders[0]
        );
        for (let j: number = 1; j < countries[i].borders.length; j++) {
          document.getElementById("borders").innerHTML +=
            ", " + codeToName(countries[i].borders[j]);
        }
        document.getElementById("timezones").innerHTML =
          countries[i].timezones[0];
        for (let j: number = 1; j < countries[i].timezones.length; j++) {
          document.getElementById("timezones").innerHTML +=
            ", " + countries[i].timezones[j];
        }
      }
    }
  });
}

function buildListCountry(input: string) {
  //function that will build the list of resulting countries according to the input submitted
  //we get the data from the rest api and we convert it into a list of 'Country' objects
  getCountries().then((countries) => {
    var list = document.getElementById("list"); //we store the parent element of the list in a variable called list
    alert("voila l'input" + input);
    for (let i: number = 0; i < countries.length; i++) {
      //we go through all the countries in the database (here the list of 'Country' objects)
      if (
        input.toLowerCase() in
        chop(input.length, countries[i].name.toLowerCase())
      ) {
        //if a chunk of the name of the country is equal to the input then we create a 'li' element that will be part of the resulting list
        var item = document.createElement("li");
        //this element will hold a text with the name and ISO 3166-1 Code of the country
        item.innerHTML =
          "<h2>" + countries[i].name + "<h2> \n " + countries[i].alpha2Code;
        item.id = countries[i].name;
        item.appendChild(document.createTextNode("Item " + i.toString));
        list.appendChild(item);
      }
    }
  });
}

// var input = <HTMLInputElement>document.getElementById("searchCountry");
//buildList(input.value);
//document.getElementById('searchbutton').addEventListener ("click", buildList(input.value), false);

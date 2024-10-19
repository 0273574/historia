import React, { useState, useEffect } from 'react';

interface Opcja {
  zmianaSil: number;
  zmianaMorale: number;
  info?: string;
}

interface Wydarzenie {
  nazwa: string;
  opis: string;
  opcje: Record<string, Opcja>;
}

const wydarzenia: Wydarzenie[] = [
  {
    nazwa: "Kocioł pod Smoleńskiem",
    opis: "Niemieckie wojska, nacierające w kierunku Moskwy w ramach operacji Barbarossa, otoczyły siły radzieckie w rejonie Smoleńska. Mimo twardego oporu, Armia Czerwona została okrążona, co doprowadziło do ogromnych strat po stronie ZSRR.",
    opcje: {
      "Przebić się": { zmianaSil: -1, zmianaMorale: 2 },
      "Bronić pozycji": { zmianaSil: -2, zmianaMorale: 1 },
      "Poddać się": { zmianaSil: -3, zmianaMorale: 0 },
      "Zrzuty zaopatrzenia": { zmianaSil: -1, zmianaMorale: 3, info: "Zrzuty zaopatrzenia pozwalają na dłuższą obronę i podtrzymanie morale okrążonych wojsk." },
      "Ataki bombowe na linie niemieckie": { zmianaSil: -2, zmianaMorale: 4, info: "Ataki bombowe osłabiają niemieckie okrążenie, dając szansę na przebicie się." }
    }
  },
  {
    nazwa: "Kocioł pod Kijowem",
    opis: "Jedna z największych i najkrwawszych operacji okrążających na froncie wschodnim. Niemcy zdołali otoczyć i zniszczyć główne siły radzieckie wokół Kijowa.",
    opcje: {
      "Kontratakować": { zmianaSil: -2, zmianaMorale: 3 },
      "Ewakuować": { zmianaSil: -1, zmianaMorale: 1 },
      "Utrzymać Kijów": { zmianaSil: -3, zmianaMorale: 2 },
      "Wsparcie pancerne": { zmianaSil: -2, zmianaMorale: 4, info: "Użycie rezerw pancernych może pomóc w przebiciu się z okrążenia, ale wiąże się z ryzykiem ich utraty." },
      "Zrzuty zaopatrzenia": { zmianaSil: -1, zmianaMorale: 2, info: "Zrzuty zaopatrzenia przedłużają obronę i dają czas na zorganizowanie kontrataku." }
    }
  },
  {
    nazwa: "Oblężenie Leningradu",
    opis: "Leningrad (obecny Petersburg) został otoczony przez wojska niemieckie i fińskie. Mieszkańcy miasta przez prawie 900 dni cierpieli głód, zimno i bombardowania, broniąc się zaciekle.",
    opcje: {
      "Wzmocnić obronę": { zmianaSil: 0, zmianaMorale: 2 },
      "Ewakuować cywilów": { zmianaSil: -1, zmianaMorale: 1 },
      "Przerwać okrążenie": { zmianaSil: -2, zmianaMorale: 3 },
      "Produkcja czołgów w mieście": { zmianaSil: -1, zmianaMorale: 4, info: "Fabryki Leningradu kontynuują produkcję czołgów, wzmacniając obronę miasta." },
      "Zrzuty zaopatrzenia": { zmianaSil: -1, zmianaMorale: 3, info: "Zrzuty zaopatrzenia przez Jezioro Ładoga ('Droga Życia') pomagają przetrwać oblężenie." }
    }
  },
  {
    nazwa: "Bitwa na Łuku Kurskim",
    opis: "Największa bitwa pancerna w historii. Niemcy planują w ramach operacji 'Cytadela' rozbić siły radzieckie, ale czy radzieckie przygotowania i obrona skutecznie zniweczą te plany?",
    opcje: {
      "Przygotować obronę": { zmianaSil: 0, zmianaMorale: 3 },
      "Zaatakować pierwsi": { zmianaSil: -2, zmianaMorale: 4 },
      "Wycofać się": { zmianaSil: -1, zmianaMorale: 1 },
      "Skierowanie lotnictwa na niemieckie kolumny pancerne": { zmianaSil: -2, zmianaMorale: 5, info: "Ataki lotnicze na niemieckie czołgi znacząco osłabiają siłę uderzeniową wroga." },
      "Koncentracja czołgów w kluczowym miejscu": { zmianaSil: -1, zmianaMorale: 4, info: "Skoncentrowanie sił pancernych pozwala na skuteczne odparcie niemieckiego natarcia." }
    }
  },
  {
    nazwa: "Oblężenie Stalingradu",
    opis: "Stalingrad był areną jednej z najkrwawszych i najważniejszych bitew II wojny światowej. Niemcy, chcąc zdobyć miasto nad Wołgą, napotkali na zaciekły opór Armii Czerwonej.",
    opcje: {
      "Bronić miasta za wszelką cenę": { zmianaSil: -2, zmianaMorale: 4 },
      "Kontratak": { zmianaSil: -3, zmianaMorale: 5 },
      "Wycofać się za Wołgę": { zmianaSil: -1, zmianaMorale: 0 },
      "Przerzut czołgów z rezerw": { zmianaSil: -2, zmianaMorale: 6, info: "Wzmocnienie obrony Stalingradu czołgami z rezerw znacząco zwiększa szanse na utrzymanie miasta." },
      "Ataki bombowe na linie niemieckie": { zmianaSil: -1, zmianaMorale: 3, info: "Bombardowania osłabiają niemieckie natarcie i utrudniają dostawy zaopatrzenia dla wroga." }
    }
  },
  {
    nazwa: "Walki o Dyneburg",
    opis: "Dyneburg w Łotwie był jednym z kluczowych punktów obrony radzieckiej na Dźwinie w czasie niemieckiej inwazji na ZSRR. Jeśli Niemcy szybko przełamią obronę, zdobywając miasto otworzy im to drogę na dalsze terytoria ZSRR.",
    opcje: {
      "Wzmocnić garnizon": { zmianaSil: -1, zmianaMorale: 2 },
      "Wysadzić mosty": { zmianaSil: 0, zmianaMorale: 1 },
      "Ewakuować miasto": { zmianaSil: -2, zmianaMorale: 0 },
      "Kontruderzenie": { zmianaSil: -2, zmianaMorale: 3, info: "Szybkie kontruderzenie może zaskoczyć niemieckie siły i opóźnić ich postęp." },
      "Mobilizacja cywilów": { zmianaSil: -1, zmianaMorale: 2, info: "Zaangażowanie cywilów w obronę miasta zwiększa szanse na jego utrzymanie, ale może prowadzić do większych strat." }
    }
  },
  {
    nazwa: "Obrona Dźwiny",
    opis: "Rzeka Dźwina stanowi ważną linię obrony dla sił radzieckich podczas niemieckiej inwazji. Obrona tej naturalnej bariery ma opóźnić postępy wroga i umożliwić mobilizację większych sił Armii Czerwonej.",
    opcje: {
      "Zaminować przeprawy": { zmianaSil: 0, zmianaMorale: 2 },
      "Kontratak": { zmianaSil: -2, zmianaMorale: 3 },
      "Wycofać się na drugą linię obrony": { zmianaSil: -1, zmianaMorale: 1 },
      "Wzmocnienie artylerii": { zmianaSil: -1, zmianaMorale: 3, info: "Skoncentrowanie artylerii wzdłuż rzeki może skutecznie powstrzymać niemieckie próby przeprawy." },
      "Taktyka spalonej ziemi": { zmianaSil: -2, zmianaMorale: 2, info: "Zniszczenie infrastruktury i zasobów spowolni niemiecki postęp, ale odbije się na ludności cywilnej." }
    }
  }
];

const Alert: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
    <p className="font-bold">{title}</p>
    <p>{children}</p>
  </div>
);

const GraFrontWschodni: React.FC = () => {
  const [punkty, setPunkty] = useState(10);
  const [morale, setMorale] = useState(5);
  const [tura, setTura] = useState(1);
  const [wydarzenie, setWydarzenie] = useState<Wydarzenie | null>(null);
  const [koniecGry, setKoniecGry] = useState(false);
  const [komunikat, setKomunikat] = useState("");
  const [historycznaInformacja, setHistorycznaInformacja] = useState("");

  useEffect(() => {
    if (tura <= 10 && punkty > 0 && morale > 0) {
      setWydarzenie(wydarzenia[Math.floor(Math.random() * wydarzenia.length)]);
    } else {
      zakonczGre();
    }
  }, [tura, punkty, morale]);

  const wykonajAkcje = (zmianaSil: number, zmianaMorale: number, info: string = "") => {
    setPunkty((prev) => Math.max(0, prev + zmianaSil));
    setMorale((prev) => Math.max(0, prev + zmianaMorale));
    setTura((prev) => prev + 1);
    setKomunikat(`Zmiana sił: ${zmianaSil}, Zmiana morale: ${zmianaMorale}`);
    setHistorycznaInformacja(info);
  };

  const zakonczGre = () => {
    setKoniecGry(true);
    if (punkty <= 0) {
      setKomunikat("Twoje siły zostały rozbite. Niemcy zwyciężyli.");
    } else if (morale <= 0) {
      setKomunikat("Morale twojej armii upadło. Żołnierze masowo dezerterują.");
    } else if (punkty > 15 && morale > 7) {
      setKomunikat("Gratulacje! Udało Ci się powstrzymać niemiecką inwazję i odnieść zwycięstwo!");
    } else if (punkty > 10 || morale > 5) {
      setKomunikat("Udało Ci się przetrwać inwazję, ale straty są ogromne.");
    } else {
      setKomunikat("Przetrwałeś, ale sytuacja jest krytyczna. Przyszłość ZSRR stoi pod znakiem zapytania.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Front Wschodni 1941</h1>
      <div className="mb-4">
        <p className="text-lg">Tura: {tura}/10</p>
        <p className="text-lg">Siły: {punkty}</p>
        <p className="text-lg">Morale: {morale}</p>
      </div>
      {!koniecGry && wydarzenie && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-2xl font-semibold mb-2">{wydarzenie.nazwa}</h2>
          <p className="mb-4">{wydarzenie.opis}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(wydarzenie.opcje).map(([opcja, { zmianaSil, zmianaMorale, info }]) => (
              <button
                key={opcja}
                onClick={() => wykonajAkcje(zmianaSil, zmianaMorale, info || "")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {opcja}
              </button>
            ))}
          </div>
        </div>
      )}
      {komunikat && (
        <Alert title="Wynik akcji">
          {komunikat}
        </Alert>
      )}
      {historycznaInformacja && (
        <Alert title="Informacja historyczna">
          {historycznaInformacja}
        </Alert>
      )}
      {koniecGry && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4">Koniec gry</h2>
          <p className="text-xl mb-2">Końcowy wynik:</p>
          <p>Siły: {punkty}</p>
          <p>Morale: {morale}</p>
          <p>Liczba przetrwanych tur: {tura - 1}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Zagraj ponownie
          </button>
        </div>
      )}
    </div>
  );
};

export default GraFrontWschodni;
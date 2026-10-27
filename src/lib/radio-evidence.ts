export const RADIO_SOURCE = "https://www.rockstargames.com/VI/music";
export const RADIO_REVIEWED_AT = "2026-10-27";
/** Reviewed on Rockstar's public page; no inferred tracks or frequencies. */
export const officialRadioStations = [
  {
    id: "cocoteo",
    name: "Cocoteo",
    genre: "Modern Latin",
    host: "El Martillo and La Gata",
  },
  {
    id: "back-country",
    name: "Back Country",
    genre: "Country",
    host: "MW and Delta Dawne",
  },
  {
    id: "afro-bank-fm",
    name: "Afro Bank FM",
    genre: "Amapiano and African music",
    host: "Burna and Palmsy",
  },
  {
    id: "the-chamber",
    name: "The Chamber",
    genre: "Metal",
    host: "DJ Kerry and DJ Tom",
  },
  { id: "flash-fm", name: "Flash FM", genre: "Pop", host: "Robyn and Alex" },
  {
    id: "dirty-south-classics",
    name: "Dirty South Classics",
    genre: "Southern rap and hip-hop",
    host: "Trick and Trina",
  },
] as const;

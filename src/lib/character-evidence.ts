export const CHARACTER_SOURCE =
  "https://www.rockstargames.com/VI/only-in-leonida";
export const CHARACTER_REVIEWED_AT = "2026-10-30";
type CharacterEvidence = {
  name: string;
  summary: string;
  context: string;
  question: string;
  answer: string;
  related: { label: string; href: string }[];
};
export const characterEvidence: Record<
  string,
  CharacterEvidence
> = {
  jason: {
    name: "Jason Duval",
    summary:
      "Jason previously served in the Army and now works with drug runners in the Keys.",
    context: "Jason is one of the two people at the centre of Rockstar's story setup, alongside Lucia. Reading his profile together with Brian's gives context for the Keys connection; it does not establish which properties or businesses the player can own.",
    question: "Does Jason's Army background confirm a gameplay ability?",
    answer: "No. A biographical detail is not a measured character statistic. We do not infer a combat bonus, weapon proficiency, starting loadout or skill tree from his military service. Those claims need their own gameplay evidence. A trailer scene also cannot establish which character is controlled throughout the final game.",
    related: [
      { label: "Lucia Caminos: Jason's story partner", href: "/characters/lucia" },
      { label: "Brian Heder and the boat yard", href: "/characters/brian-heder" },
      { label: "Leonida Keys: official destination background", href: "/regions/leonida-keys" },
    ],
  },
  lucia: {
    name: "Lucia Caminos",
    summary:
      "Lucia is recently released from Leonida Penitentiary and is planning a different future with Jason.",
    context: "Lucia is the other central figure in Rockstar's story setup. Her published background is a starting point for understanding the story, rather than a walkthrough of what happens next. Read Jason's profile alongside hers to keep the two characters' backgrounds distinct.",
    question: "Does Lucia's prison background reveal the opening missions?",
    answer: "No. Her biography provides story context, not an ordered mission list. We do not turn trailer editing into a confirmed sequence of playable events, prison missions or rewards. Any description of her abilities, progression or the outcome of her relationship with Jason needs separate evidence.",
    related: [
      { label: "Jason Duval: Lucia's story partner", href: "/characters/jason" },
      { label: "Explore the official Leonida destinations", href: "/regions" },
      { label: "Release date and platform planning", href: "/news/gta-6-release-date-pre-order-editions" },
    ],
  },
  cal: {
    name: "Cal Hampton",
    summary:
      "Cal is Jason’s friend and an associate of Brian, with an interest in Coast Guard communications.",
    context: "Cal connects two other published character backgrounds: Jason and Brian. That relationship is a useful way to follow the supporting cast without treating every named person as a mission giver. The official biography describes his interests; the links below explain the people in that circle.",
    question: "Does Cal's interest in communications confirm a scanner mechanic?",
    answer: "No. A character listening to communications is different from a player-controlled scanning feature. This profile does not establish a hacking ability, purchasable tool, police-evasion bonus or mission reward. For such a claim we would need an explicit gameplay explanation or an identifiable demonstration, rather than a biographical inference.",
    related: [
      { label: "Jason Duval: Cal's friend", href: "/characters/jason" },
      { label: "Brian Heder: the shared associate", href: "/characters/brian-heder" },
      { label: "Cal Hampton: the longer source-linked article", href: "/news/gta-6-cal-hampton" },
    ],
  },
  "boobie-ike": {
    name: "Boobie Ike",
    summary:
      "Boobie’s Vice City businesses include property, a club and a recording studio.",
    context: "Boobie's background connects the cast to Vice City's business and music setting. The related profiles follow that music connection through Dre'Quan and Real Dimez. Keep the ownership described in a character biography separate from a list of businesses available to the player.",
    question: "Can the player buy Boobie's businesses?",
    answer: "This source does not establish that. A named club or studio may provide story setting without functioning as a purchasable asset. We do not infer purchase prices, passive income, management missions or investment returns from Boobie's business interests. Our money-planning tools use example inputs rather than a verified business economy.",
    related: [
      { label: "Dre'Quan Priest and the music connection", href: "/characters/drequan-priest" },
      { label: "Real Dimez: the recording artists", href: "/characters/real-dimez" },
      { label: "Vice City: official setting and places", href: "/regions/vice-city" },
    ],
  },
  "drequan-priest": {
    name: "Dre’Quan Priest",
    summary:
      "Dre’Quan pursues a music career through Only Raw Records and has signed Real Dimez.",
    context: "Dre'Quan is part of the music side of the supporting cast. Reading his profile with Real Dimez helps distinguish the label connection from the performers themselves. This is character and setting information, rather than confirmation of a music-management system.",
    question: "Does the record-label story confirm a player business?",
    answer: "No. A business named in the narrative is not evidence of a purchasable business, revenue stream or management interface. We do not provide a studio price, payout ranking or unlock requirement from this biography. A soundtrack appearance would also need its own music source; a character connection alone is insufficient.",
    related: [
      { label: "Real Dimez: the duo signed to the label", href: "/characters/real-dimez" },
      { label: "Boobie Ike: business and music background", href: "/characters/boobie-ike" },
      { label: "Vice City: the wider setting", href: "/regions/vice-city" },
    ],
  },
  "real-dimez": {
    name: "Real Dimez",
    summary:
      "Bae-Luxe and Roxy form Real Dimez, a rap duo signed to Only Raw Records.",
    context: "Real Dimez is a duo, so the name refers to two performers rather than a single character. The related profiles trace the recording connection through Dre'Quan and Boobie. That context helps distinguish the story's musicians from a confirmed in-game radio playlist.",
    question: "Does this profile confirm radio tracks or voice actors?",
    answer: "No. A fictional music act's biography does not establish which recordings are playable on the radio, who performs each voice, or whether the player can interact with the group in a specific mission. Each of those questions needs an appropriate announcement, credit or gameplay source. We avoid guessing identities from a voice or likeness.",
    related: [
      { label: "Dre'Quan Priest: the label connection", href: "/characters/drequan-priest" },
      { label: "Boobie Ike: the broader music setting", href: "/characters/boobie-ike" },
      { label: "Radio: announcements and source limits", href: "/radio" },
    ],
  },
  "raul-bautista": {
    name: "Raul Bautista",
    summary:
      "Raul is an experienced bank robber recruiting people willing to take risks.",
    context: "Raul's background places him on the robbery side of the supporting cast. His biography is useful story context, but it is not a heist guide. The central characters and the setting pages provide a safer introduction than an invented sequence of jobs or rewards.",
    question: "Does Raul's biography confirm heist payouts or crew selection?",
    answer: "No. An experienced robber in the cast does not establish a player-facing crew system, a number of heists, repeatability, entry costs or guaranteed earnings. We do not rank his missions or prescribe an optimal approach before those systems are verified. Narrative descriptions and numerical gameplay instructions require different evidence.",
    related: [
      { label: "Jason Duval: central character background", href: "/characters/jason" },
      { label: "Lucia Caminos: central character background", href: "/characters/lucia" },
      { label: "Money guide: verified context and open questions", href: "/money-guide" },
    ],
  },
  "brian-heder": {
    name: "Brian Heder",
    summary:
      "Brian runs a smuggling operation from a boat yard in the Keys and provides Jason a place to live.",
    context: "Brian's boat-yard background connects Jason's living arrangements with the Leonida Keys setting. Cal is another person in the same published character circle. Follow those links to understand the relationships without turning a story location into a confirmed map coordinate.",
    question: "Does Jason's accommodation confirm an ownable safehouse?",
    answer: "No. A place to stay in a biography does not establish property ownership, storage capacity, rental costs or a usable garage. The boat yard's narrative role also does not verify its exact position on our fan map. We keep location names, provisional map pins and purchasable-property claims separate until each has supporting evidence.",
    related: [
      { label: "Jason Duval: the accommodation connection", href: "/characters/jason" },
      { label: "Cal Hampton: another associate", href: "/characters/cal" },
      { label: "Leonida Keys: the destination guide", href: "/regions/leonida-keys" },
    ],
  },
};

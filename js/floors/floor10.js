/*
 * Floor 10 — The Rooms (prologue / tutorial floor)
 *
 * Everyone wakes up on the top floor. They meet, find the rule sheet and the
 * Handlers, and learn how the elevator works. Nobody has to die yet.
 * Quota: open every door on the floor.
 */
Game.registerFloor({
  number: 10,
  title: "The Rooms",
  background: "linear-gradient(180deg, #2a2420 0%, #15110f 100%)",
  start: "wake",
  hub: "hall",
  rule: {
    text: "Quota: open every door on this floor. (10B, 10C, 10D and the door marked STAFF.)",
    requires: { flag: ["open_b", "open_c", "open_d", "open_staff"] },
  },
  nodes: {
    // ---------- Waking up ----------
    wake: {
      show: [],
      text: "You wake up on a bed that isn't yours.\n\nWhite sheets. White walls. A window that's been bricked over from the outside. Someone is holding your wrist.",
      next: "wake2",
    },

    wake2: {
      show: ["mira"],
      speaker: "mira",
      text: "Hey. Hey, easy. You're breathing, that's good. Don't sit up too fast, whatever they gave us leaves a headache.",
      effects: { meet: "mira" },
      next: "wake3",
    },

    wake3: {
      speaker: "mira",
      text: "You're the last one to wake up. The others are in the hallway.\n\nOh, and check your pocket. We all woke up with one.",
      choices: [
        { text: "\"Where are we?\"", next: "mira_where", requires: { notFlag: "asked_where" } },
        { text: "\"Who are you?\"", next: "mira_who", requires: { notFlag: "asked_who" } },
        { text: "Check your pocket.", next: "phone_first" },
      ],
    },

    phone_first: {
      show: [],
      text: "A phone. Not yours. Cheap, black, no brand. One bar of battery that never seems to go down.\n\nAs you hold it, it buzzes.",
      effects: { sms: { from: "game", text: "WELCOME TO THE BUILDING.\nThis phone will receive the rules of every floor.\nKeep it with you. Do not lose it." } },
      next: "hallway_first",
    },

    mira_where: {
      speaker: "mira",
      text: "Some apartment building. Top floor, I think. There's a sign by the elevator that says 10.\n\nThe windows are all bricked up. Every one of them.",
      effects: { set: "asked_where" },
      next: "wake3",
    },

    mira_who: {
      speaker: "mira",
      text: "Mira. I'm a nurse, St. Anna's, nights. I checked everyone while you were out. No injuries. No needle marks.\n\nWhoever brought us here was very careful with us. I don't like that.\n\nOne more thing. One of the women out there is badly dehydrated. Lips cracked like she's been in a desert for a week. She wouldn't let me look at her.",
      effects: { set: "asked_who" },
      next: "wake3",
    },

    // ---------- The hallway & the Handlers ----------
    hallway_first: {
      show: ["bram", "tess", "odile", "jun", "elias", "noor"],
      text: "A long hallway. Doors marked 10A to 10D. Six strangers, standing as far apart from each other as the hallway allows.\n\nA big man pacing. A girl shaking a dead phone. An old woman knitting under a wide-brimmed hat. A guy with glasses reading something on the wall. And two people standing apart from everyone, a boy with his hood up and a girl with her cap pulled low.",
      next: "handlers_first",
    },

    handlers_first: {
      show: ["h1", "h2", "h3"],
      text: "At the end of the hall, beside the elevator, three figures stand perfectly still.\n\nBlack leather from head to toe. Gloves. Masks like mirrors. You can see yourself in all three of them.",
      next: "bram_yell",
    },

    bram_yell: {
      show: ["bram", "h1", "h2", "h3"],
      speaker: "bram",
      text: "HEY. I'm talking to you! Where the hell are we? Who put us here?!",
      effects: { meet: "bram" },
      next: "handlers_silent",
    },

    handlers_silent: {
      speaker: "h1",
      text: "...",
      next: "jun_rules",
    },

    jun_rules: {
      show: ["jun", "bram"],
      speaker: "jun",
      text: "They won't answer you. Look. It's written right here.",
      effects: { meet: "jun" },
      next: "rule_sheet",
    },

    rule_sheet: {
      show: [],
      speaker: "sign",
      text: "RULES OF THE BUILDING\n\n1. The elevator goes down one floor at a time.\n2. The elevator only goes down when the floor's quota is met.\n3. The elevator may always go back up.\n4. The Handlers do not speak. A Handler who speaks will die.\n5. There is no other way out.\n\nFLOOR 10 — THE ROOMS\nQuota: open every door on this floor.",
      effects: { set: "read_rules", sms: { from: "game", text: "FLOOR 10 — THE ROOMS\nQuota: open every door on this floor." } },
      next: "bram_grab",
    },

    bram_grab: {
      show: ["bram", "h1", "h2"],
      text: "Bram reads it, laughs once, and grabs the nearest Handler by the collar.\n\nThe Handler doesn't fight back. The one beside it raises a gloved finger and taps the sheet. Rule 4.",
      next: "bram_threat",
    },

    bram_threat: {
      speaker: "bram",
      text: "So if I make this guy talk, he drops dead? Let's find out.",
      choices: [
        { text: "\"Stop. Let him go. We don't know anything yet.\"", next: "stop_bram" },
        { text: "Say nothing. Watch.", next: "watch_bram" },
      ],
    },

    stop_bram: {
      speaker: "bram",
      text: "...Fine. FINE. But if they don't let us out, I'm coming back for him.",
      effects: { set: "stopped_bram" },
      next: "intro_round",
    },

    watch_bram: {
      show: ["bram", "h1", "odile"],
      text: "Bram twists the Handler's arm behind its back. Further. Further. You hear something in the shoulder give.\n\nThe leather sleeve rides up. For a second you see a tattoo on the wrist: a broken chain. Then the glove covers it again.\n\nThe Handler doesn't make a single sound.\n\nBram lets go, breathing hard.",
      effects: { set: ["watched_bram", "saw_tattoo"], bio: { h1: "Black leather, mirrored mask. Follows the rules. Does not speak. One of them has a broken-chain tattoo on the wrist." } },
      next: "odile_comment",
    },

    odile_comment: {
      speaker: "odile",
      text: "He'd rather break than speak. Isn't that interesting.",
      effects: { meet: "odile" },
      next: "intro_round",
    },

    intro_round: {
      show: ["mira", "bram", "odile", "tess", "jun", "elias", "noor"],
      speaker: "mira",
      text: "Okay. Okay. Whatever this is, we're in it together. Can we at least learn each other's names?",
      next: "contact_first",
    },

    contact_first: {
      show: [],
      text: "Your phone buzzes again. Not THE GAME this time. A number you don't recognise.\n\nNobody else's phone made a sound.",
      effects: {
        set: "got_contact",
        meet: "contact",
        sms: { from: "contact", text: "hello?? is anyone getting this\ni woke up somewhere dark. theres a phone taped to my hand\nit only has one number in it. yours" },
      },
      next: "hall",
    },

    // ---------- Hub ----------
    hall: {
      show: ["h1", "h2", "h3"],
      text: "The hallway of floor 10. Doors 10B, 10C and 10D. At the end, the elevator, and beside it a narrow door marked STAFF.\n\nThe Handlers stand in front of it. Waiting.",
      elevator: true,
      choices: [
        { text: "Talk to the others.", next: "talk" },
        { text: "Answer the unknown number.", next: "reply", requires: { flag: "got_contact", notFlag: "replied" } },
        { text: "Read the rule sheet again.", next: "rules_again" },
        { text: "Try door 10B.", next: "b_door", requires: { notFlag: "open_b" } },
        { text: "Try door 10C.", next: "c_locked", requires: { notFlag: "open_c", notItem: "brass key" } },
        { text: "Open 10C with the brass key.", next: "c_open", requires: { notFlag: "open_c", item: "brass key" } },
        { text: "Try the keypad on 10D.", next: "d_keypad", requires: { notFlag: "open_d" } },
        { text: "Try the STAFF door.", next: "staff_locked", requires: { notFlag: "open_staff" } },
      ],
    },

    rules_again: {
      show: [],
      speaker: "sign",
      text: "1. The elevator goes down one floor at a time.\n2. The elevator only goes down when the floor's quota is met.\n3. The elevator may always go back up.\n4. The Handlers do not speak. A Handler who speaks will die.\n5. There is no other way out.\n\nQuota: open every door on this floor.",
      next: "rules_jun",
    },

    rules_jun: {
      show: ["jun"],
      speaker: "jun",
      text: "Notice what's missing? It never says what happens if we don't meet the quota.\n\nThat's the part that scares me.",
      next: "hall",
    },

    // ---------- The unknown number ----------
    reply: {
      show: [],
      text: "The cursor blinks. Everyone else is busy. Nobody's watching you type.",
      choices: [
        { text: "\"Who are you?\"", next: "reply_who" },
        { text: "\"Where are you?\"", next: "reply_where" },
        { text: "Don't answer. This could be part of the game.", next: "reply_ignore" },
      ],
    },

    reply_who: {
      text: "Three dots. They disappear. They come back.",
      effects: {
        set: "replied",
        sms: { from: "contact", text: "sam. i think. my head really hurts\nwho are YOU? are you the one who put me here??" },
        bio: { contact: "Says their name is Sam. Woke up in the dark with a phone taped to their hand. Yours is the only number in it." },
      },
      next: "hall",
    },

    reply_where: {
      text: "Three dots. They disappear. They come back.",
      effects: {
        set: "replied",
        sms: { from: "contact", text: "dark. small room. no windows\nsometimes i hear an elevator. it goes right past my wall" },
        bio: { contact: "Somewhere dark, in a small room with no windows. Can hear an elevator going past their wall." },
      },
      next: "hall",
    },

    reply_ignore: {
      text: "You put the phone back in your pocket.\n\nIt buzzes once more. You don't look.",
      effects: {
        set: ["replied", "ignored_contact"],
        sms: { from: "contact", text: "please. please answer. i dont know where i am" },
      },
      next: "hall",
    },

    // ---------- Talking ----------
    talk: {
      show: ["mira", "bram", "odile", "tess", "jun", "elias", "noor"],
      text: "Who do you want to talk to?",
      choices: [
        { text: "Mira", next: "talk_mira" },
        { text: "Bram", next: "talk_bram" },
        { text: "Odile", next: "talk_odile" },
        { text: "Tess", next: "talk_tess" },
        { text: "Jun", next: "talk_jun" },
        { text: "Elias", next: "talk_elias", requires: { notFlag: "saw_tv" } },
        { text: "Elias", next: "talk_elias2", requires: { flag: "saw_tv" } },
        { text: "Noor", next: "talk_noor", requires: { notFlag: "saw_tv" } },
        { text: "Noor", next: "talk_noor2", requires: { flag: "saw_tv" } },
        { text: "Never mind.", next: "hall" },
      ],
    },

    talk_mira: {
      show: ["mira"],
      speaker: "mira",
      text: "Everyone's physically fine. Mentally... ask me again in an hour.\n\nI keep thinking about the last thing I remember. A night shift. A man at the nurses' station asking which way to the West Wing. That's all.",
      effects: { meet: "mira" },
      next: "talk",
    },

    talk_bram: {
      show: ["bram"],
      speaker: "bram",
      text: "Bram. I build things. Walls, doors. You know what that means? I know how they come apart.\n\nGive me ten minutes alone with one of these doors.",
      effects: { meet: "bram" },
      next: "talk",
    },

    talk_odile: {
      show: ["odile"],
      speaker: "odile",
      text: "Odile. Sit down, dear, you're making me dizzy.\n\nWhat am I knitting? Something long. A scarf, maybe. For whoever's left at the end.\n\nThe hat? No, dear. The hat stays on. A lady never takes off her hat indoors. Or was it the other way round?",
      effects: { meet: "odile", bio: { odile: "Old woman, always knitting. Wears a wide-brimmed hat and won't take it off. Her lips are very dry." } },
      next: "talk",
    },

    talk_tess: {
      show: ["tess"],
      speaker: "tess",
      text: "Tess. Tessfromtheeast? Two hundred thousand followers? ...Nobody? Wow. Okay.\n\nWeird thing, though. My phone has no signal, but the clock still works. And the date's wrong. It says it's three weeks later than it should be.",
      effects: { meet: "tess", set: "tess_date" },
      next: "talk",
    },

    talk_jun: {
      show: ["jun"],
      speaker: "jun",
      text: "Jun. I teach maths. Taught. Teach.\n\nEight of us. Ten floors. Three Handlers. I keep doing the numbers and I don't like any of them.",
      effects: { meet: "jun" },
      next: "talk",
    },

    talk_elias: {
      show: ["elias", "noor"],
      speaker: "elias",
      text: "...Elias.\n\nWhere am I from? Around.\n\n(He looks over at Noor when he thinks nobody's watching. She never looks back.)",
      effects: { meet: "elias" },
      next: "talk",
    },

    talk_noor: {
      show: ["noor"],
      speaker: "noor",
      text: "Noor. Why do you want to know? What would you do with it?\n\n...Sorry. I'm not good at strangers.",
      effects: { meet: "noor" },
      next: "talk",
    },

    talk_elias2: {
      show: ["elias"],
      speaker: "elias",
      text: "Don't. Don't look at me like that. You saw the TV, so did everyone. That's exactly why you shouldn't look at me like that.\n\nIf someone in here is worth more than the rest of us... what do you think the others do with that?",
      effects: { meet: "elias", bio: { elias: "Got very defensive after the news broadcast. Warned you that being 'worth more' is dangerous in here." } },
      next: "talk",
    },

    talk_noor2: {
      show: ["noor"],
      speaker: "noor",
      text: "The West and the East have been one breath away from joining for fifty years. Somebody always stops it.\n\nI'm just saying. If I wanted to stop it, I wouldn't need to kill anyone. I'd just need to make two people disappear for a while.",
      effects: { meet: "noor", bio: { noor: "Knows a lot about the Unification. More than a normal person should." } },
      next: "talk",
    },

    // ---------- 10B: the child's room ----------
    b_door: {
      show: ["bram"],
      speaker: "bram",
      text: "Locked? Ha. Stand back.",
      next: "b_kick",
    },

    b_kick: {
      text: "One kick. Two. On the third, the frame splits and the door swings in.\n\nA child's bedroom. Perfectly made bed. Stuffed animals lined up by size. Not a speck of dust. On the nightstand, a music box.",
      next: "b_inside",
    },

    b_inside: {
      show: ["odile", "mira"],
      text: "Odile winds the music box before anyone can stop her. A small tinny melody fills the room.",
      next: "b_song",
    },

    b_song: {
      speaker: "mira",
      text: "I know that song. That's the Unification anthem. They've been playing it on every channel since they announced the date.\n\nWho puts that in a kid's room?",
      next: "b_key",
    },

    b_key: {
      speaker: "odile",
      text: "Someone who wanted us to find this, dear.\n\n(She lifts the little dancer out of the box. Underneath: a brass key.)",
      effects: { give: "brass key", set: "open_b", meet: "odile" },
      next: "hall",
    },

    // ---------- 10C: the TV ----------
    c_locked: {
      text: "10C. Locked. An old-fashioned brass keyhole.",
      next: "hall",
    },

    c_open: {
      show: ["tess", "jun", "elias", "noor"],
      text: "The brass key turns. 10C is a living room, set up like someone still lives here. Slippers by the couch. A cold cup of tea. Tess picks it up, sniffs it, offers it around. Everyone shakes their head. Odile actually steps back from it.\n\nThe moment the last of you steps inside, the old TV in the corner switches itself on.",
      effects: { take: "brass key" },
      next: "tv",
    },

    tv: {
      speaker: "tv",
      text: "...three weeks now since all contact with the southern island was lost. The government still refuses to comment on what residents of Port Selm saw in the sky that night...\n\n...and in other news. The heirs of the West and the East, who are to sign the Unification Accord on the nineteenth of April, have not been seen in public since...",
      effects: { set: "saw_tv" },
      next: "tv_cut",
    },

    tv_cut: {
      text: "Static. Then nothing.\n\nNobody says anything for a long moment. Then everybody looks at everybody.",
      next: "c_reaction",
    },

    c_reaction: {
      show: ["tess", "jun"],
      speaker: "tess",
      text: "Okay, but... the sky thing? In the south? Are they saying it's... like... aliens?",
      next: "c_jun",
    },

    c_jun: {
      speaker: "jun",
      text: "That's not the part I'm thinking about. They said heirs. Two of them. Missing.\n\nAnd there are eight of us.",
      next: "c_watch",
    },

    c_watch: {
      show: ["elias", "noor"],
      text: "The room gets very quiet.",
      choices: [
        { text: "Watch Elias.", next: "watch_elias", requires: { notFlag: "watched_elias" } },
        { text: "Watch Noor.", next: "watch_noor", requires: { notFlag: "watched_noor" } },
        { text: "Look around the room instead.", next: "calendar" },
      ],
    },

    watch_elias: {
      show: ["elias"],
      text: "Elias pulls his hood further down and looks at the floor. His hands are shaking. He puts them in his pockets so nobody sees.\n\nYou saw.",
      effects: { set: "watched_elias", meet: "elias", bio: { elias: "Hood up. Hands shook when the TV mentioned the missing heirs. Hid them in his pockets." } },
      next: "c_watch",
    },

    watch_noor: {
      show: ["noor"],
      text: "Noor doesn't react at all. Not even a blink. She's watching everyone else, the same way you are.\n\nThen her eyes meet yours, and she smiles a little, like you've been caught at something.",
      effects: { set: "watched_noor", meet: "noor", bio: { noor: "Didn't react to the news at all. Watched everyone else's reaction instead. Caught you watching her." } },
      next: "c_watch",
    },

    calendar: {
      show: [],
      text: "On the wall: a paper calendar, open on April. The nineteenth is circled in red marker, again and again, until the paper tore.\n\nUnder it, in the same marker: 10D.",
      effects: { set: ["saw_calendar", "open_c"] },
      next: "hall",
    },

    // ---------- 10D: the keypad ----------
    d_keypad: {
      show: ["bram", "jun"],
      text: "10D has no keyhole. Just a keypad. Four digits.",
      choices: [
        { text: "Enter 1-9-0-4.", next: "d_open", requires: { flag: "saw_calendar" } },
        { text: "Enter 0-0-0-0.", next: "d_wrong" },
        { text: "Let Bram break it.", next: "d_bram" },
        { text: "Step back.", next: "hall" },
      ],
    },

    d_wrong: {
      speaker: "jun",
      text: "(The keypad buzzes. Somewhere inside the wall, something clicks into place.)\n\nI wouldn't guess too many times if I were you.",
      next: "d_keypad",
    },

    d_bram: {
      show: ["bram", "h2"],
      text: "Bram draws his fist back. Before it lands, a Handler is suddenly between him and the keypad. You didn't see it move.\n\nIt doesn't touch him. It just stands there, mask an inch from his face, until Bram lowers his arm.",
      next: "d_keypad",
    },

    d_open: {
      show: ["bram", "mira", "jun"],
      text: "Green light. The door unlocks.\n\nA bathroom. White tiles, everything spotless. The tap is dripping; there's a thin layer of water on the floor.\n\nOdile stops in the doorway and doesn't come in.\n\nAcross the mirror, in red lipstick, in big careful letters:\n\nTWO OF YOU ARE WORTH MORE THAN ALL THE REST.",
      next: "d_choice",
    },

    d_choice: {
      speaker: "bram",
      text: "What's that supposed to mean?",
      choices: [
        { text: "Wipe it off before the others see it.", next: "d_wipe" },
        { text: "Call everyone over to see.", next: "d_share" },
      ],
    },

    d_wipe: {
      show: ["jun"],
      text: "You grab a towel and smear the words into a red blur. Bram shrugs. Mira says nothing.\n\nJun watches you do it. He doesn't say anything either, but he doesn't stop watching.",
      effects: { set: ["open_d", "wiped_mirror"], bio: { jun: "Saw you wipe the message off the mirror in 10D. Hasn't said anything about it. Yet." } },
      next: "hall",
    },

    d_share: {
      show: ["tess", "elias", "noor", "odile"],
      text: "Everyone crowds in. Tess reads it out loud, twice. Nobody looks at Elias or Noor.\n\nWhich is how you know everyone's thinking about them.",
      effects: { set: ["open_d", "shared_mirror"] },
      next: "hall",
    },

    // ---------- STAFF door & the special room ----------
    staff_locked: {
      text: "The STAFF door has no handle on this side.",
      choices: [
        { text: "Wait. Something's clicking.", next: "staff_open", requires: { flag: ["open_b", "open_c", "open_d"] } },
        { text: "Step back.", next: "hall" },
      ],
    },

    staff_open: {
      show: ["h1", "h2", "h3"],
      text: "With a soft click, the STAFF door swings open on its own.\n\nBehind it, a tiny room. A desk. On the desk, an old teleprinter, already clattering, printing something line by line.",
      next: "staff_print",
    },

    staff_print: {
      text: "The first Handler tears the paper off and reads it. Folds it. Puts it away.\n\nAt the back of the little room is a second elevator, a narrow metal cage just big enough for three. The Handlers step in, one after the other.",
      next: "staff_look",
    },

    staff_look: {
      show: ["h3"],
      text: "The last one turns before the cage closes. Its mask points straight at you for a long second. You see yourself in it, small and pale.\n\nThen the cage drops out of sight, and the STAFF door shuts behind it.",
      effects: {
        set: "open_staff",
        sms: { from: "contact", text: "something just went past my wall. going DOWN\nlike a little elevator. i heard people breathing in it" },
      },
      next: "staff_ding",
    },

    staff_ding: {
      show: ["mira", "bram", "odile", "tess", "jun", "elias", "noor"],
      text: "Behind you, the main elevator dings. Its doors slide open.",
      next: "staff_after",
    },

    staff_after: {
      speaker: "bram",
      text: "Down. Down is out. Let's go.",
      next: "staff_odile",
    },

    staff_odile: {
      show: ["odile"],
      speaker: "odile",
      text: "Down is just down, dear.",
      next: "hall",
    },
  },
});

Game.registerFloor({
  number: 12,
  title: "Home",
  start: "wake",
  nodes: {
    wake: {
      text: "You wake up on the couch. The TV is off. Everything is off.\n\nThe only light in the apartment is the green glow of the emergency sign in the hallway, leaking under your front door.",
      choices: [
        { text: "Check your phone.", next: "phone" },
        { text: "Get up.", next: "apartment" },
      ],
    },

    phone: {
      text: "3:12 AM. No signal. Battery at 1%.\n\nOne notification, from the building app, sent at 2:58:\n\n\"RESIDENTS ARE ASKED TO REMAIN IN THEIR UNITS. DO NOT USE THE STAIRWELLS. DO NOT OPEN YOUR DOOR.\"\n\nThe screen goes black.",
      effects: { sanity: -5 },
      next: "intercom",
    },

    intercom: {
      speaker: "intercom",
      text: "...ksshh... remain in your units... ksshh... remain... remain...",
      next: "apartment",
    },

    apartment: {
      text: "Apartment 12B. Living room, kitchen, the hallway closet, the front door.\n\nIt's very quiet. Too quiet for a building with two hundred people in it.",
      choices: [
        { text: "Search the kitchen.", next: "kitchen", requires: { notFlag: "searched_kitchen" } },
        { text: "Search the hallway closet.", next: "closet", requires: { notFlag: "searched_closet" } },
        { text: "Go to the front door.", next: "door" },
      ],
    },

    kitchen: {
      text: "You run the tap. The water comes out brown, then stops with a dry cough from somewhere deep in the pipes.\n\nYou take the big knife from the block. You feel a little stupid holding it. Only a little.",
      effects: { give: "kitchen knife", set: "searched_kitchen" },
      next: "apartment",
    },

    closet: {
      text: "Behind the vacuum and the box of winter clothes: the flashlight you bought after the last blackout and never used.\n\nIt works.",
      effects: { give: "flashlight", set: "searched_closet" },
      next: "apartment",
    },

    door: {
      text: "Before you reach the door, someone knocks. Three soft knocks.\n\nThen a voice you know.",
      next: "okafor_knock",
    },

    okafor_knock: {
      speaker: "okafor",
      text: "12B? It's Adaeze, from across the hall. Please. Are you awake? I don't want to be alone out here.",
      choices: [
        { text: "Look through the peephole.", next: "peephole", requires: { notFlag: "peeped" } },
        { text: "Open the door.", next: "open_door" },
        { text: "Stay quiet. Don't open the door.", next: "stay_quiet" },
      ],
    },

    peephole: {
      text: "It's Mrs. Okafor. Bathrobe, reading glasses on a chain, her phone held up like a candle.\n\nShe looks fine. She looks completely fine.\n\nYou just can't shake the feeling that she was looking straight at the peephole before you got there.",
      effects: { sanity: -5, set: "peeped" },
      next: "okafor_knock",
    },

    // ---- Open the door: Mrs. Okafor helps you ----
    open_door: {
      speaker: "okafor",
      text: "Oh, thank God. Thank God. I've been knocking on doors for twenty minutes. Nobody answers. Nobody.",
      next: "okafor_talk",
    },

    okafor_talk: {
      speaker: "okafor",
      text: "Tomas went down to the lobby to find out what's happening. That was an hour ago.",
      choices: [
        { text: "\"What did the intercom mean, don't use the stairs?\"", next: "ask_stairs", requires: { notFlag: "asked_stairs" } },
        { text: "\"Has anyone else come up from downstairs?\"", next: "ask_others", requires: { notFlag: "asked_others" } },
        { text: "\"I'm going down. Come with me.\"", next: "ask_come" },
      ],
    },

    ask_stairs: {
      speaker: "okafor",
      text: "I don't know. The fire door's been locked since the renovation anyway. I'm floor rep, so I have the key.\n\nTomas didn't take it. He took the elevator. Before the power went.",
      effects: { set: "asked_stairs" },
      next: "okafor_talk",
    },

    ask_others: {
      speaker: "okafor",
      text: "No. But I've heard people. Through the floor. Walking. Back and forth, back and forth, under my bed, for an hour now.\n\n...Somebody is on eleven who doesn't know how to stop walking.",
      effects: { sanity: -10, set: "asked_others" },
      next: "okafor_talk",
    },

    ask_come: {
      speaker: "okafor",
      text: "No. No, I'm waiting for Tomas. If he comes back and I'm gone...\n\nHere. Take the stairwell key. And this, you'll need it more than me, I was a nurse for thirty years and I still cut myself opening cans.",
      effects: { give: ["stairwell key", "bandage"], set: "met_okafor" },
      next: "okafor_bye",
    },

    okafor_bye: {
      speaker: "okafor",
      text: "If you see him... tell him I'm upstairs. Tell him not to take too long.",
      next: "hallway",
    },

    // ---- Stay quiet: she leaves a key, but you never meet her ----
    stay_quiet: {
      text: "You don't move. You barely breathe.\n\nShe knocks again. And again. Then, very quietly, she starts to cry.\n\nAfter a long time, something slides under the door. Footsteps go away down the hall. You don't hear a door close.",
      effects: { sanity: -10 },
      next: "note",
    },

    note: {
      text: "A key on a paper tag. Handwriting, shaky:\n\n\"Stairwell. Tomas went down and didn't come back. I'm going to find him. Don't take the elevator.\"",
      effects: { give: "stairwell key", set: "ignored_okafor" },
      next: "hallway",
    },

    // ---- The 12th floor hallway ----
    hallway: {
      text: "The hallway is lit green and red by the exit signs. Twelve doors, all shut. At one end, the elevator. At the other, the stairwell fire door.",
      choices: [
        { text: "Check the elevator.", next: "elevator", requires: { notFlag: "saw_shaft" } },
        { text: "Knock on 12C.", next: "knock_12c", requires: { flag: "ignored_okafor", notFlag: "knocked_12c" } },
        { text: "Go to the stairwell.", next: "stairwell" },
      ],
    },

    knock_12c: {
      text: "Mrs. Okafor's door is open. Just a crack.\n\nInside, her phone is lying on the carpet, flashlight still on, pointing at the ceiling.\n\nYou don't go in.",
      effects: { sanity: -10, set: "knocked_12c" },
      next: "hallway",
    },

    elevator: {
      text: "The elevator doors are open. There's no car behind them. Just the shaft, and the cold air rising out of it.\n\nFrom very far down, someone calls your name.",
      choices: [
        { text: "Step back from the edge.", next: "elevator_back" },
        { text: "Lean in and call back.", next: "elevator_lean" },
      ],
    },

    elevator_back: {
      text: "You step back. The voice calls again, closer this time, patient.\n\nYou walk away before it can call a third time.",
      effects: { sanity: -10, set: "saw_shaft" },
      next: "hallway",
    },

    elevator_lean: {
      death: "You lean into the dark and say \"Hello?\"\n\nThe voice says \"Hello?\" back, in your voice, right next to your ear.\n\nSomething takes hold of your collar, very gently, and pulls.",
    },

    stairwell: {
      text: "The fire door. A sign: STAIRWELL A — NO RE-ENTRY ON FLOORS 2–11.",
      choices: [
        {
          text: "Unlock it and go through.",
          next: "stairs",
          requires: { item: "stairwell key" },
        },
        { text: "Go back.", next: "hallway" },
      ],
    },

    stairs: {
      text: "The lock turns. Concrete steps go down into the dark, wrapping around and around the open center of the stairwell.\n\nIt smells like wet cement and something sweeter underneath.",
      descend: true,
      descendText: "Go down.",
    },
  },
});

Game.registerFloor({
  number: 11,
  title: "The Barricade",
  start: "landing",
  nodes: {
    landing: {
      text: "One flight down, the stairs end.\n\nThe next flight is buried under a heap of furniture: mattresses, dining chairs, a whole bookcase, jammed in tight from below. Somebody didn't want anyone coming up.\n\nThe door to floor 11 is propped open with a shoe.",
      next: "corridor",
    },

    corridor: {
      text: "Floor 11 is darker than yours. The exit signs are out. Stairwell B is at the far end of the hall, if you can get there.",
      choices: [
        { text: "Turn on the flashlight.", next: "lit", requires: { item: "flashlight" } },
        { text: "Feel your way along the wall.", next: "dark_walk", requires: { notItem: "flashlight" } },
      ],
    },

    dark_walk: {
      text: "Wallpaper. Door frame. Wallpaper. Door frame. Something wet.\n\nSomething that moves under your fingers, and then isn't there.\n\nYou snatch your hand back and stumble into a pile of furniture, hard. You taste blood.",
      effects: { sanity: -15, health: -15 },
      next: "barricade",
    },

    lit: {
      text: "The beam finds a long hallway, carpet stained dark in patches. Halfway down, someone has built a wall of furniture from one side to the other, with a gap at the bottom just big enough to crawl through.",
      next: "barricade",
    },

    barricade: {
      speaker: "dez",
      text: "Stop. Stop right there. Don't come any closer to my wall.",
      next: "dez_test",
    },

    dez_test: {
      speaker: "dez",
      text: "Say something. Something it wouldn't say. It's good at voices, but it's bad at... it's bad at being a person. So say something a person would say.",
      choices: [
        { text: "\"I'm scared and I really have to pee.\"", next: "dez_laugh" },
        { text: "\"My name's on the mailbox in the lobby. 12B. I just want to get out.\"", next: "dez_honest" },
        {
          text: "Show him the knife. \"Let me through.\"",
          next: "dez_threat",
          requires: { item: "kitchen knife" },
        },
        { text: "Say nothing.", next: "dez_silent" },
      ],
    },

    dez_laugh: {
      speaker: "dez",
      text: "...Yeah. Yeah, okay. It doesn't do jokes. Get in here, quick.",
      effects: { sanity: 10, set: "dez_friend" },
      next: "dez_inside",
    },

    dez_honest: {
      speaker: "dez",
      text: "Everybody wants to get out, 12B. Fine. You sound real enough. Crawl through. Slowly.",
      effects: { set: "dez_friend" },
      next: "dez_inside",
    },

    dez_threat: {
      speaker: "dez",
      text: "Whoa. Okay. Okay! Real person, definitely, the thing doesn't need knives.\n\nGo. Go past. Just don't stop at my door and don't ever come back up here.",
      effects: { set: "dez_hostile" },
      next: "past_barricade",
    },

    dez_silent: {
      speaker: "dez",
      text: "...No? Nothing? Then you stay out there with it.\n\nI'm not opening up for something that won't talk.",
      effects: { sanity: -10 },
      choices: [
        { text: "\"Wait! Wait. I'm sorry. I'm real. Please.\"", next: "dez_honest" },
      ],
    },

    dez_inside: {
      text: "Behind the barricade: a guy in his twenties with a hoodie and a split lip, sitting against the wall with a baseball bat across his knees. His leg is wrapped in a towel that's soaked through.",
      next: "dez_talk",
    },

    dez_talk: {
      speaker: "dez",
      text: "Dez. 11F. Don't ask about the leg.",
      choices: [
        { text: "\"What is it? The thing out there?\"", next: "dez_what", requires: { notFlag: "asked_what" } },
        { text: "\"Did a man named Tomas come through here?\"", next: "dez_tomas", requires: { flag: "met_okafor", notFlag: "asked_tomas" } },
        { text: "Give him your bandage.", next: "dez_bandage", requires: { item: "bandage" } },
        { text: "\"How do I get down?\"", next: "dez_route" },
      ],
    },

    dez_what: {
      speaker: "dez",
      text: "I don't know. It came up out of the elevator shaft around two. It sounds like people. It sounds like people you know.\n\nOne rule. Whatever it says, don't answer. When you answer it, it learns where you are.",
      effects: { sanity: -5, set: ["asked_what", "knows_rule"] },
      next: "dez_talk",
    },

    dez_tomas: {
      speaker: "dez",
      text: "Older guy? Mustache? Yeah. He came up the stairs about an hour ago. From below. Said the lobby was \"wrong.\" Wouldn't say how.\n\nHe went back down. He said he had to check something on ten.",
      effects: { set: "asked_tomas" },
      next: "dez_talk",
    },

    dez_bandage: {
      speaker: "dez",
      text: "Oh, man. Oh, thank you. Thank you.\n\nHere. Take this. Found it in the maintenance closet. The doors down there stick. You'll need it more than me.",
      effects: { take: "bandage", give: "crowbar", set: "dez_helped" },
      next: "dez_talk",
    },

    dez_route: {
      speaker: "dez",
      text: "Stairwell A's blocked. That was me, sorry. Stairwell B's at the end of the hall.\n\nBut it's out there. Pacing. Back and forth. You'll have to go past it.",
      next: "dez_route2",
    },

    dez_route2: {
      speaker: "dez",
      text: "If you don't have something to pry doors with, there's a maintenance closet by the trash chute. Door's open. I'd get it myself, but...",
      next: "past_barricade",
    },

    // ---- Past the barricade ----
    past_barricade: {
      text: "You crawl out the other side. The hallway keeps going. Stairwell B's door is at the end, under a dead exit sign.\n\nSomewhere ahead, footsteps. Back and forth. Back and forth.",
      choices: [
        {
          text: "Search the maintenance closet by the trash chute.",
          next: "closet",
          requires: { notItem: "crowbar" },
        },
        { text: "Head for Stairwell B.", next: "the_voice" },
      ],
    },

    closet: {
      text: "The closet smells like bleach and old mop water. In the corner, a crowbar.\n\nAs you pick it up, the pacing stops.\n\nIt starts again. Faster. Coming this way.",
      effects: { give: "crowbar", sanity: -10 },
      next: "closet_run",
    },

    closet_run: {
      text: "You run. Something brushes the back of your neck, just once, and the skin there goes numb.",
      effects: { health: -15 },
      next: "the_voice",
    },

    the_voice: {
      text: "Twenty feet from the stairwell door, the pacing stops.\n\nThen, from the dark behind you, a voice.",
      next: "the_voice2",
    },

    the_voice2: {
      speaker: "voice",
      text: "Wait. Please. It's me. You know me. You know my voice. Turn around and say my name.",
      choices: [
        { text: "Keep walking. Don't answer.", next: "ignore_voice" },
        { text: "Turn around.", next: "turn_around" },
        { text: "\"Who's there?\"", next: "answer_voice" },
      ],
    },

    ignore_voice: {
      text: "You don't answer. You don't turn around. You put one foot in front of the other.\n\nThe voice keeps talking, kind and reasonable, all the way to the door.",
      effects: { sanity: -10 },
      next: "stairwell_b",
    },

    turn_around: {
      text: "You turn.\n\nYour flashlight beam, or what's left of the light, finds the hallway. Empty. Long. Much, much longer than it was.\n\nAt the very end, something stands very still and tries to look like someone.",
      effects: { sanity: -25 },
      choices: [
        { text: "Run for the door.", next: "stairwell_b" },
      ],
    },

    answer_voice: {
      speaker: "voice",
      text: "Who's there? Who's there? Who's there?\n\nIt says it in your voice. And now it knows exactly where you are.",
      effects: { sanity: -15, health: -25 },
      deathText: "It reaches you before you reach the door.",
      next: "stairwell_b",
    },

    stairwell_b: {
      text: "You hit the door and it swings open. Stairwell B. You pull it shut behind you and lean on it until your heart slows down.\n\nNothing tries the handle.\n\nNot yet.",
      descend: true,
      descendText: "Go down to 10.",
    },
  },
});

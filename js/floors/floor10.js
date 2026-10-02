Game.registerFloor({
  number: 10,
  title: "Laundry",
  start: "landing",
  nodes: {
    landing: {
      text: "Stairwell B goes down to the tenth-floor landing and stops being stairs.\n\nBelow that, the stairwell is full of black water, still and flat as glass. It's risen almost to the landing. Something in it turns over slowly and sinks out of sight.\n\nThe only way on is through floor 10. The door is warped in its frame.",
      choices: [
        { text: "Pry it open with the crowbar.", next: "pry", requires: { item: "crowbar" } },
        { text: "Throw your shoulder into it.", next: "shoulder", requires: { notItem: "crowbar" } },
        { text: "Look closer at the water.", next: "water", requires: { notFlag: "saw_water" } },
      ],
    },

    water: {
      text: "You crouch at the edge. Your light (or what's left of it) doesn't go in. The water just swallows it.\n\nThere are shoes floating near the wall. Lots of shoes.",
      effects: { sanity: -10, set: "saw_water" },
      next: "landing",
    },

    pry: {
      text: "The door groans, then gives all at once with a crack that echoes up the whole stairwell.\n\nDown in the water, something stirs at the sound. You get through fast.",
      next: "hall",
    },

    shoulder: {
      text: "Once. Twice. The third time the frame splinters and you fall through onto the carpet, your shoulder screaming.",
      effects: { health: -20 },
      next: "hall",
    },

    hall: {
      text: "Floor 10 has emergency power. Barely. The lights buzz and flicker. Puddles in the carpet. Every apartment door hangs open.\n\nAhead, the laundry room. Through it, the service stairs. A sign says so, in cheerful blue letters: SERVICE STAIRS → STAFF ONLY.",
      next: "intercom",
    },

    intercom: {
      speaker: "intercom",
      text: "...ksshh... resident of twelve-B. You are out of your unit. Please return to your unit.",
      choices: [
        { text: "Press the TALK button. \"Who is this?\"", next: "talk" },
        { text: "Ignore it. Keep moving.", next: "laundry", effects: { sanity: -5 } },
      ],
    },

    talk: {
      speaker: "intercom",
      text: "This is building management. We are aware of the situation. We are asking all residents to remain in their units while the situation is... ksshh... resolved.",
      choices: [
        { text: "\"What situation? What's in the building?\"", next: "talk_what" },
        { text: "\"Did you see an older man come through here? Tomas?\"", next: "talk_tomas", requires: { flag: "asked_tomas" } },
        { text: "Let go of the button.", next: "laundry" },
      ],
    },

    talk_what: {
      speaker: "intercom",
      text: "The building is undergoing scheduled maintenance.\n\n...Twelve-B. You've been very quiet up there for a long time. We appreciated that.\n\nPlease go back upstairs.",
      effects: { sanity: -10 },
      next: "laundry",
    },

    talk_tomas: {
      speaker: "intercom",
      text: "Tomas Okafor, 12C, has been returned to his unit.\n\nHe's very happy there.",
      effects: { sanity: -15 },
      next: "laundry",
    },

    // ---- The laundry room puzzle ----
    laundry: {
      text: "The laundry room is ankle-deep in water. The dryers along the far wall are still running, sparking every time their drums turn. The water around them hisses.\n\nThe service stairs are on the other side. On the wall by the door, a breaker panel.",
      choices: [
        { text: "Look at the breaker panel.", next: "panel" },
        { text: "Wade straight across.", next: "wade", requires: { notFlag: "power_off" } },
        { text: "Wade across. The dryers are dead.", next: "cross", requires: { flag: "power_off" } },
      ],
    },

    wade: {
      text: "Three steps in, a dryer sparks. The water lights up blue-white and every muscle in your body locks at once.\n\nWhen it lets go, you're on your knees by the door, and you can't feel your hands.",
      effects: { health: -45 },
      deathText: "The current doesn't let go.",
      next: "cross",
    },

    panel: {
      text: "Three switches, all labels faded to near-nothing:\n\n  [ L-2 ]   [ SVC ]   [ MAIN ]",
      choices: [
        { text: "Shine the flashlight on the labels.", next: "panel_read", requires: { item: "flashlight", notFlag: "read_panel" } },
        { text: "Flip L-2.", next: "flip_l2" },
        { text: "Flip SVC.", next: "flip_svc", requires: { notFlag: "svc_off" } },
        { text: "Flip MAIN.", next: "flip_main" },
        { text: "Step back.", next: "laundry" },
      ],
    },

    panel_read: {
      text: "Under the light, the old marker shows up:\n\n  L-2 — LAUNDRY 2\n  SVC — SERVICE STAIR LIGHTS\n  MAIN — FLOOR 10 (DO NOT)",
      effects: { set: "read_panel" },
      next: "panel",
    },

    flip_l2: {
      text: "Clunk. The dryers wind down, one after another. The sparking stops. The water goes quiet.",
      effects: { set: "power_off" },
      next: "laundry",
    },

    flip_svc: {
      text: "Clunk. Through the window in the service door, the stair lights go out.\n\nThe dryers keep sparking. Great. Now the stairs are dark too.",
      effects: { sanity: -10, set: "svc_off" },
      next: "panel",
    },

    flip_main: {
      text: "Clunk. Everything goes black. The dryers, the hall lights, the buzzing. All of it.\n\nIn the silence, you hear the water in the stairwell behind you start to move. Something big is climbing out.\n\nYou wade across in total darkness, as fast as you can.",
      effects: { sanity: -25, set: "power_off" },
      next: "cross",
    },

    // ---- End of floor 10 ----
    cross: {
      text: "You reach the service door and haul it open. Narrow metal stairs, painted yellow, going down.\n\nBehind you, from the hallway, Mrs. Okafor's voice calls your name.",
      choices: [
        { text: "Don't answer. Go down.", descend: true, requires: { flag: "knows_rule" } },
        { text: "Go down.", descend: true, requires: { notFlag: "knows_rule" }, effects: { sanity: -5 } },
      ],
    },
  },
});

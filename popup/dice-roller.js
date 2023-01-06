
const input = document.getElementById("roll-string");
input.addEventListener("keypress", (e) => { if(e.key === "Enter") { inputRoll(e.target.value) }});

chrome.storage.session.get(["rolls"], (result) => {
  const rolls = result.rolls || [];
  console.log(rolls)
  for(const roll of rolls) {
    addRoll(roll);
  }
});

// Quick Rolls
const quick_rolls = document.getElementById("quick-rolls");
for(const d of [20, 4, 6, 8, 10, 100, 12]) {
  const die = document.createElement("button");
  die.setAttribute("class", `roll-button d${d}`);
  die.addEventListener("click", () => inputRoll(`1d${d}`));

  if(d === 100) {
    die.innerHTML = `<i class="fas fa-dice-d10" aria-hidden="true"></i>`+
        `<i class="fas fa-dice-d10" aria-hidden="true"></i>`;
  } else {
      die.innerHTML = `<i class="fas fa-dice-d${d}" aria-hidden="true"></i>`;
  }

  quick_rolls.appendChild(die);
}

/**
 * Store rolls in session storage
 */
export const storeRoll = (roll) => {
    const new_roll = {
        total: roll.total,
        averageTotal: roll.averageTotal,
        maxTotal: roll.maxTotal,
        minTotal: roll.minTotal,
        notation: roll.notation,
        output: roll.output,
        rolls: roll.rolls,
        total: roll.total
    };

    // Store in Chrome
    chrome.storage.session.get(["rolls"], (result) => {
        const current = result.rolls || [];
        current.push(new_roll);
        chrome.storage.session.set({ rolls: current });
    });

    // Add to HTML list
    addRoll(new_roll);
}

/**
 * Add the roll to the HTML ul 
 * @param {object} roll 
 */
export const addRoll = (roll) => {
    const list = document.getElementById("rolls");
    const li = document.createElement("li");
    li.setAttribute("class", "roll");
  
    const notation = document.createElement("div");
    notation.setAttribute("class", "roll__notation");
    notation.innerText = roll.notation;
  
    const result = document.createElement("div");
    result.setAttribute("class", "roll__result");
  
    const output = document.createElement("div");
    output.setAttribute("class", "roll__result-output");
    output.innerHTML = roll.output.replace(/.+:(.*)=.+/g, "$1").trim();

    const total = document.createElement("div");
    total.setAttribute("class", "roll__result-total");
    total.innerText = roll.total;
  
    result.appendChild(output);
    result.appendChild(total);
  
    li.appendChild(notation);
    li.appendChild(result);
  
    list.prepend(li);
}

export const inputRoll = (notation) => {
    try {
        const roll = new rpgDiceRoller.DiceRoll(notation);
        storeRoll(roll);
        document.getElementById("roll-string").value = "";
    } catch(e) {
        console.error(e);
    }
};
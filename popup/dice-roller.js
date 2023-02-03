let quickRolls = {};

const input = document.getElementById("roll-string");
input.addEventListener("keypress", (e) => { if(e.key === "Enter") { inputRoll(e.target.value) }});

chrome.storage.session.get(["rolls"], (result) => {
  const rolls = result.rolls || [];
  for(const roll of rolls) {
    addRoll(roll);
  }
});

// Quick Roll
const quick_btn = document.getElementById("quick-roll-button");
const quickRoll = (e) => {
    const rolls = [];
    for(const [die, count] of Object.entries(quickRolls)) {
        rolls.push(`${count}d${die}`);
    }
    inputRoll(rolls.join("+"));
    quickRolls = {};
    e.currentTarget.classList.add("hidden");
    const dice = document.querySelectorAll("#quick-rolls button");
    for(const die of dice) {
        const counter = die.querySelector(".count");
        if(counter) die.removeChild(counter);
    }
};
quick_btn.addEventListener("click", quickRoll);

const setQuickRoll = (e, operator) => {
    const btn = e.currentTarget;
    const die = btn.getAttribute("data-die");
    const current = quickRolls[die] || 0;

    if(operator === "-") {
        e.preventDefault();
        quickRolls[die] = (current > 0) ? current - 1 : 0;
    } else {
        quickRolls[die] = (current < 9) ? current + 1 : 9;
    }

    const counter = btn.querySelector(".count");
    if(counter) {
        if(quickRolls[die] == 0) {
            btn.removeChild(counter);
        } else {
            counter.innerText = quickRolls[die];
        }
    } else if(quickRolls[die]) {
        const count = document.createElement("div");
        count.setAttribute("class", "count");
        count.innerText = quickRolls[die];
        btn.appendChild(count);
    }

    // Show the Roll button
    if(Object.values(quickRolls).some(val => val > 0)) {
        quick_btn.classList.remove("hidden");
    } else {
        quick_btn.classList.add("hidden");
    }
};

// Quick Rolls
const quick_rolls = document.getElementById("quick-rolls");
for(const d of [20, 4, 6, 8, 10, 100, 12]) {
  const die = document.createElement("button");
  die.setAttribute("class", `roll-button d${d}`);
  die.setAttribute("data-die", d);
  die.addEventListener("click", (e) => setQuickRoll(e, "+"));
  die.addEventListener("contextmenu", (e) => setQuickRoll(e, "-"));

  if(d === 100) {
    die.innerHTML = `<i class="fas fa-dice-d10" aria-hidden="true"></i>`+
        `<i class="fas fa-dice-d10" aria-hidden="true"></i>`;
  } else {
      die.innerHTML = `<i class="fas fa-dice-d${d}" aria-hidden="true"></i>`;
  }

  quick_rolls.appendChild(die);
};

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
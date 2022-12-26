const characters = [
    {
        name: "Jake",
        source: "harmlesskey",
        avatar: "https://www.dndbeyond.com/avatars/17/415/636377885173419481.jpeg?width=150&height=150&fit=crop&quality=95&auto=webp",
        armor_class: 18,
        hit_points: 39,
        initiative: 5,
        level: 6,
        speed: 55,
        strength: 8,
        dexterity: 20,
        constitution: 13,
        intelligence: 12,
        wisdom: 16,
        charisma: 10
    },
    {
        name: "Levi",
        source: "dndbeyond",
        avatar: "https://www.dndbeyond.com/avatars/23587/772/1581111423-38281958.jpeg?width=150&height=150&fit=crop&quality=95&auto=webp",
        armor_class: 15,
        hit_points: 39,
        initiative: 4,
        level: 30,
        speed: 55,
        strength: 10,
        dexterity: 18,
        constitution: 12,
        intelligence: 13,
        wisdom: 16,
        charisma: 8
    },
];

const character_list = document.getElementById("characters");

for(const character of characters) {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.setAttribute("class", "character");

    const avatar = document.createElement("div");
    avatar.setAttribute("class", "avatar");

    if(character.avatar) {
        avatar.setAttribute("style", `background-image: url(${character.avatar});`)
    }

    const info = document.createElement("div");
    info.setAttribute("class", "info");
    const resource = document.createElement("div");
    const name = document.createElement("div");
    resource.setAttribute("class", "resource");
    name.setAttribute("class", "name truncate");

    resource.innerText = (character.source === "harmlesskey") ? "Harmless Key" : "D&D Beyond";
    name.innerText = character.name;

    info.appendChild(resource);
    info.appendChild(name);
    left.appendChild(avatar)
    left.appendChild(info);
    li.appendChild(left);


    // Add action buttons
    const actions = document.createElement("div");
    actions.setAttribute("class", "actions");

    const sync_btn = document.createElement("button");
    const delete_btn = document.createElement("button");
    sync_btn.setAttribute("class", "btn-clear");
    delete_btn.setAttribute("class", "btn-clear");
    sync_btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    delete_btn.innerHTML = '<i class="fas fa-trash-alt"></i>';

    actions.appendChild(sync_btn);
    actions.appendChild(delete_btn);

    li.appendChild(actions);
    
    // Add the li to the list
    character_list.appendChild(li);
}
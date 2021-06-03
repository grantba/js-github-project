/* <div id='github-container'>
<ul id='user-list'>
</ul>
<ul id='repos-list'> */

const divContainer = document.querySelector("#github-container");
const userArea = document.querySelector("#user-list");
const repoArea = document.querySelector("#repos-list");
const form = document.querySelector("#github-form");
form.style.display = "none";
const toggleButton = document.createElement("button");
toggleButton.id = "toggle-button";
toggleButton.innerText = "Search for a User or a User's Repos";
const h2 = document.querySelector("h2");
const br = document.createElement("br");
const p = document.createElement("p");
h2.append(br);
h2.append(p);
p.innerText = "You can search for a user or a user's repos. Just click the button below to choose the one you would like to search by."
p.appendChild(br);
p.appendChild(toggleButton);
const submit = document.getElementById("submit");

toggleButton.addEventListener("click", () => {
    const userSearchField = document.getElementById("search");

    if (toggleButton.innerText === "Search for a User or a User's Repos" || toggleButton.innerText === "Search for a User by Name") {
        form.style.display = "block";
        toggleButton.innerText = "Search for a User's Repos by User's Name";
        userSearchField.placeholder = "Enter User's Name";
    }
    else {
        form.style.display = "block";
        toggleButton.innerText = "Search for a User by Name";
        userSearchField.placeholder = "Enter User's Name";
    }
})

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let formUserValue = document.querySelector("#search").value;

    if (toggleButton.innerText === "Search for a User by Name") {
        getUserInfo(formUserValue);
    }
    else {
        getRepoInfo(formUserValue);
    }
    event.target.reset();
})

function getUserInfo(formUserValue) {
    fetch(`https://api.github.com/search/users?q=${formUserValue}`, {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json"
        }
    })
    .then(response => response.json())
    .then(users => postUserInfo(users))
}

function postUserInfo(users) {
    userArea.replaceChildren();

    users.items.forEach(user => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        const userLink = document.createElement("a");
        const img = document.createElement("img");
        const firstLetter = user.login.charAt(0).toUpperCase();
        const restOfName = user.login.slice(1);
        const name = firstLetter + restOfName;
        li.id = user.id;
        p.id = `user-name-${user.login}`;
        p.innerText = `${name.replace("-", " ")}`;
        p.style.fontWeight = "900";
        userLink.href = `${user.html_url}`;
        userLink.setAttribute('target', '_blank');
        userLink.innerText = "User GitHub Link\n\n";
        img.src = `${user.avatar_url}`;
        img.alt = "User GitHub Avatar";
        img.setAttribute('disabled', 'true');
        userArea.appendChild(li);
        li.appendChild(p);
        li.appendChild(userLink);
        li.appendChild(img);
    })
}

userArea.addEventListener('click', (event) => {
    if (event.target.id.includes('user-name')) {
        const name = event.target.id.replace("user-name-", "");
        getRepoInfo(name);
    }
})

function getRepoInfo(formUserValue) {
    fetch(`https://api.github.com/users/${formUserValue}/repos`, {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json"
        }
    })
    .then(response => response.json())
    .then(repos => postReposInfo(formUserValue, repos))
}

function postReposInfo(formUserValue, repos) {
    repoArea.replaceChildren();

    const user = formUserValue;
    const firstLetter = user.charAt(0).toUpperCase();
    const restOfName = user.slice(1);
    const name = firstLetter + restOfName;
    const p = document.createElement("p");
    repoArea.appendChild(p);
    p.innerText = `${name}'s Repos:`;
    p.style.fontWeight = "900";
    repos.forEach(repo => {
        const li = document.createElement("li");
        const updatedAt = repo.updated_at;
        const language = repo.language
        const name = repo.name;
        li.id = repo.id;
        li.innerText = `Repo Name: ${name}\n\tPrimary Language: ${language}\n\tLast Update: ${updatedAt}\n\n`;
        repoArea.appendChild(li);
    })
}
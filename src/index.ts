import { CLI } from "./CLI";

const startupParts = [
  "   __________  ____  ___       ____  ___    _   ____ __",
  "  / ____/ __ \\/ __ \\/   |     / __ )/   |  / | / / //_/",
  " / /   / / / / / / / /| |    / __  / /| | /  |/ / ,<   ",
  "/ /___/ /_/ / /_/ / ___ |   / /_/ / ___ |/ /|  / /| |  ",
  "\\____/\\____/_____/_/  |_|  /_____/_/  |_/_/ |_/_/ |_|",
  "",
  "La banque de demain, aujourd'hui.",
  "",
];

console.log(startupParts.join("\n"));


const accounts: Record<
  string,
  { password: string; balance: number; history: string[] }
> = {};
let loggedInUser: string | null = null;

const cli = new CLI([
  {
    title: "Créer un compte",
    value: "create",
    action: async () => {
      if (loggedInUser) {
        console.log("Vous êtes déjà connecté.");
        return;
      }
      const username = await CLI.askValue("Entrez un nom d'utilisateur :", "text");
      if (accounts[username]) {
        console.log("Ce nom d'utilisateur existe déjà.");
        return;
      }
      const password = await CLI.askValue("Entrez un mot de passe :", "text");
      accounts[username] = { password, balance: 0, history: [] };
      console.log("Compte créé avec succès !");
    },
  },
  {
    title: "Se connecter",
    value: "login",
    action: async () => {
      if (loggedInUser) {
        console.log("Vous êtes déjà connecté.");
        return;
      }
      const username = await CLI.askValue("Entrez votre nom d'utilisateur :", "text");
      const password = await CLI.askValue("Entrez votre mot de passe :", "text");

      if (accounts[username]?.password === password) {
        loggedInUser = username;
        console.log(`Bienvenue, ${username} !`);
      } else {
        console.log("Nom d'utilisateur ou mot de passe incorrect.");
      }
    },
  },
  {
    title: "Afficher le solde",
    value: "balance",
    action: () => {
      if (!loggedInUser) {
        console.log("Vous devez vous connecter d'abord.");
        return;
      }
      console.log(`Votre solde est de ${accounts[loggedInUser].balance}€.`);
    },
  },
  {
    title: "Déposer de l'argent",
    value: "deposit",
    action: async () => {
      if (!loggedInUser) {
        console.log("Vous devez vous connecter d'abord.");
        return;
      }
      const amount = await CLI.askValue("Entrez le montant à déposer :", "number");
      if (amount <= 0) {
        console.log("Montant invalide.");
        return;
      }
      accounts[loggedInUser].balance += amount;
      accounts[loggedInUser].history.push(`Dépôt de ${amount}€`);
      console.log(`Vous avez déposé ${amount}€. Nouveau solde : ${accounts[loggedInUser].balance}€.`);
    },
  },
  {
    title: "Retirer de l'argent",
    value: "withdraw",
    action: async () => {
      if (!loggedInUser) {
        console.log("Vous devez vous connecter d'abord.");
        return;
      }
      const amount = await CLI.askValue("Entrez le montant à retirer :", "number");
      if (amount <= 0 || amount > accounts[loggedInUser].balance) {
        console.log("Montant invalide ou fonds insuffisants.");
        return;
      }
      accounts[loggedInUser].balance -= amount;
      accounts[loggedInUser].history.push(`Retrait de ${amount}€`);
      console.log(`Vous avez retiré ${amount}€. Nouveau solde : ${accounts[loggedInUser].balance}€.`);
    },
  },
  {
    title: "Afficher l'historique",
    value: "history",
    action: () => {
      if (!loggedInUser) {
        console.log("Vous devez vous connecter d'abord.");
        return;
      }
      const history = accounts[loggedInUser].history;
      if (history.length === 0) {
        console.log("Aucune transaction pour le moment.");
        return;
      }
      console.log("Historique des transactions :");
      history.forEach((entry, index) => console.log(`${index + 1}. ${entry}`));
    },
  },
  {
    title: "Se déconnecter",
    value: "logout",
    action: () => {
      if (!loggedInUser) {
        console.log("Vous n'êtes pas connecté.");
        return;
      }
      console.log(`Au revoir, ${loggedInUser} !`);
      loggedInUser = null;
    },
  },
]);

cli.menu();

// Structuration des données en JavaScript (avec tableaux associatifs)
const entrees = [
{ nom: "Aucun", prix: 0 },
{ nom: "Salade César", prix: 8.5 },
{ nom: "Brik à l'œuf", prix: 4.0 }
];
const plats = [
{ nom: "Aucun", prix: 0 },
{ nom: "Couscous Agneau", prix: 18.0 },
{ nom: "Escalope Grillée", prix: 14.5 }
];
const desserts = [
{ nom: "Aucun", prix: 0 },
{ nom: "Tiramisu", prix: 6.5 },
{ nom: "Salade de fruits", prix: 5.0 }
];
function gererSelection(idSelect, idInputNb) {
    const selectElem = document.getElementById(idSelect);
    const inputNb = document.getElementById(idInputNb);
    const nbActuel = parseInt(inputNb.value);
    if (selectElem.selectedIndex === 0) {
        // L'item "Aucun" (index 0) est sélectionné
        inputNb.value = 0;
} else if (nbActuel === 0) {
    // Un article est choisi et le nombre était à 0 -> passe à 1
    inputNb.value = 1;
}
// Mise à jour immédiate du tarif total
calculerPrix();
}
let dessertOffertAlerte = false;
function calculerPrix() {
    const pEntree = parseFloat(document.getElementById("entree").value);
    const pPlat = parseFloat(document.getElementById("plat").value) ;
    const pDessert= parseFloat(document.getElementById("dessert").value);
    const nbE = parseInt(document.getElementById("nbEntree").value);
    const nbP = parseInt(document.getElementById("nbPlat").value);
    const nbD = parseInt(document.getElementById("nbDessert").value);
    // Vérification avant multiplication
    if (isNaN(nbE) || nbE < 0 || isNaN(nbP) || nbP < 0 || isNaN(nbD) || nbD < 0) {
        return; // Ne pas calculer si une quantité est invalide
    }
    const total = (pEntree * nbE) + (pPlat * nbP) + (pDessert * nbD);
    document.getElementById("total").value = total.toFixed(2) + " DT";
    // Vérification du seuil pour dessert gratuit (ex: 50 DT)
    if (total > 50 && !dessertOffertAlerte) {
        alert("felicitaiçon! vous avez droit a un dessert gratuit!");
        dessertOffertAlerte=True;
} else if (total <= 50) {
    dessertOffertAlerte=False;
}
}
function AdresseValide(chaine) {
if (chaine.trim().length === 0) {
    alert("erreur:veuillez saisir une adresse se livraison valide!")
}
return true;
}
function VerifierCommande() {
    const adresse=document.getElementById("adresse").value;
    if (!AdresseValide(adresse)) {
        return false;
    }
const nbE = parseInt(document.getElementById("nbEntree").value);
const nbP = parseInt(document.getElementById("nbPlat").value);
const nbD = parseInt(document.getElementById("nbDessert").value);
const MAX_PERS = 20;
// 1. Vérification des bornes [0, MAX_PERS]
if (isNaN(nbE) || nbE < 0 || nbE > MAX_PERS || isNaN(nbP) || nbP < 0 || nbP > MAX_PERS || isNaN(nbD) || nbD < 0 || nbD > MAX_PERS) {
    alert("Le nombre de personnes doit être compris entre 0 et " + MAX_PERS + ".");
    return false;
}
// 2. Vérification qu'au moins un article est commandé
if (nbE===0 && nbP===0 && nbD===0) {
    alert("votre commande est vide!veuillez choisir au moins une entrée,un plat ou un dessert");
    return false;
}
return true;
}
function envoyerCommande() {
    if (!VerifierCommande()) {
        return false; // Bloque l'envoi si la validation échoue
}
const adresse=document.getElementById("adresse").value.trim();
const total=document.getElementById("total").value;
const sujet = encodeURIComponent("Nouvelle commande en ligne");
const corps = encodeURIComponent(`Bonjour,\nVoici ma commande :\nAdresse : ${adresse}\nMontant total : ${total}`
);
// Ouverture du client mail avec les détails pré-remplis
window.location.href = `mailto:restaurant@isetgabes.tn?subject=${sujet}&body=${corps}`;
return false; // Empêche le rechargement brutal de la page
}
// Extensions : Gestion dynamique du panier et frais de livraison
function mettreAJourPanierGlobal() {
panier = []; // Réinitialise le tableau du panier pour le reconstruire selon le formulaire
const entreeSelect = document.getElementById("entree");
const nbEntree = parseInt(document.getElementById("nbEntree").value, 10) || 0;
if (entreeSelect.selectedIndex > 0 && nbEntree > 0) {
    const nom = entreeSelect.options[entreeSelect.selectedIndex].text.split('(')[0].trim();
const prix = parseFloat(entreeSelect.value);
panier.push({ nom: nom, prix: prix, qte: nbEntree });
}

const platSelect = document.getElementById("plat");
const nbPlat = parseInt(document.getElementById("nbPlat").value, 10) || 0;
if (platSelect.selectedIndex > 0 && nbPlat > 0) {
const nom = platSelect.options[platSelect.selectedIndex].text.split('(')[0].trim();
const prix = parseFloat(platSelect.value);
panier.push({ nom: nom, prix: prix, qte: nbPlat });
}

const dessertSelect = document.getElementById("dessert");
const nbDessert = parseInt(document.getElementById("nbDessert").value, 10) || 0;
if (dessertSelect.selectedIndex > 0 && nbDessert > 0) {
const nom = dessertSelect.options[dessertSelect.selectedIndex].text.split('(')[0].trim();
const prix = parseFloat(dessertSelect.value);
panier.push({ nom: nom, prix: prix, qte: nbDessert });
}

afficherPanier();
}

function supprimerDuPanier(index) {
// Remet à zéro le champ correspondant dans le formulaire selon l'article supprimé
if (index === 0 && document.getElementById("nbEntree").value > 0) {
document.getElementById("entree").selectedIndex = 0;
document.getElementById("nbEntree").value = 0;
} else {
// Logique simplifiée de suppression par index du tableau
panier.splice(index, 1);
}
calculerPrix();
afficherPanier();
}

function afficherPanier() {
const listeDOM = document.getElementById("liste-panier");
listeDOM.innerHTML = ""; // Nettoie le contenu précédent
let sousTotal = 0;

panier.forEach((item, index) => {
const totalLigne = item.prix * item.qte;
sousTotal += totalLigne;

const li = document.createElement("li");
li.innerHTML = `${item.qte}x ${item.nom} (${totalLigne.toFixed(2)} DT)
<button type="button" onclick="supprimerDuPanier(${index})">X</button>`;
listeDOM.appendChild(li);
});

// Frais de livraison : 5 DT si sous-total > 0 et < 40 DT, sinon 0 DT[cite: 159]
const fraisLivraison = (sousTotal > 0 && sousTotal < 40) ? 5 : 0;
document.getElementById("affichage-livraison").textContent = fraisLivraison.toFixed(2) + " DT";
}
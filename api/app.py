import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les données depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

# Charger les arrets avec coordonnees GPS (Lab 6)
with open("arrets.json", "r") as f:
    arrets = json.load(f)

# Lab 7 : stockage des incidents en memoire
incidents = []

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>", "/arrets", "/incidents"]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

# Lab 6 : arrets avec coordonnees GPS (pour la carte)
@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)

# Exercice 1 (renomme pour eviter le conflit avec /arrets)
@app.route("/arrets-noms")
def get_arrets_noms():
    tous_les_arrets = set()
    for ligne in lignes:
        for arret in ligne["listeArrets"]:
            tous_les_arrets.add(arret)
    return jsonify(list(tous_les_arrets))

# Exercice 2
@app.route("/stats")
def get_stats():
    nombre_lignes = len(lignes)
    total_arrets = sum(l["arrets"] for l in lignes)
    ligne_max = max(lignes, key=lambda l: l["arrets"])
    return jsonify({
        "nombre_total_lignes": nombre_lignes,
        "nombre_total_arrets": total_arrets,
        "ligne_plus_darrets": ligne_max["numero"]
    })

# Exercice 3
@app.route("/lignes/recherche")
def recherche_ligne():
    q = request.args.get("q", "")
    resultats = [
        l for l in lignes
        if q.lower() in l["depart"].lower() or q.lower() in l["arrivee"].lower()
    ]
    if not resultats:
        return jsonify({"message": "Aucune ligne trouvée"}), 404
    return jsonify(resultats)

# Lab 7 : signalement d'incidents
@app.route("/incidents", methods=["GET"])
def get_incidents():
    return jsonify(incidents)

@app.route("/incidents", methods=["POST"])
def post_incident():
    data = request.get_json()
    if not data or "ligne" not in data or "description" not in data:
        return jsonify({"erreur": "Champs requis manquants"}), 400
    incident = {
        "id": len(incidents) + 1,
        "ligne": data["ligne"],
        "description": data["description"],
        "lieu": data.get("lieu", "Non precise"),
    }
    incidents.append(incident)
    return jsonify(incident), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)
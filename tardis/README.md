# TARDIS — Prédiction des retards SNCF

Projet réalisé dans le cadre du module B-DAT-200 à Epitech.

L'objectif est d'analyser les données historiques de retards des trains SNCF, d'en extraire des tendances et de construire un modèle capable de prédire les retards avant qu'ils arrivent. Le tout est présenté dans un dashboard interactif Streamlit.

---

## Contenu du dépôt

```
TARDIS_Project/
├── data/
│   ├── project_dataset.csv
│   └── cleaned_dataset.csv
├── models/
│   ├── model.joblib
│   ├── le_dep.joblib
│   └── le_arr.joblib
├── tardis_eda.ipynb
├── tardis_model.ipynb
├── tardis_dashboard.py
├── requirements.txt
└── README.md
```

---

## Installation

Cloner le repo et installer les dépendances :

```bash
git clone <B-DAT-200-TLS-2-1-tardis-4>
cd TARDIS_Project
pip install -r requirements.txt
```

L'utilisation d'un environnement virtuel est recommandée :

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

---

## Lancer le projet

Les notebooks doivent être exécutés dans l'ordre avant de lancer le dashboard.

**1. Nettoyage et exploration des données**

```bash
jupyter notebook tardis_eda.ipynb
```

Exécuter toutes les cellules. Le notebook génère le fichier `data/cleaned_dataset.csv`.

**2. Entraînement du modèle**

```bash
jupyter notebook tardis_model.ipynb
```

Exécuter toutes les cellules. Les fichiers `.joblib` sont sauvegardés dans `models/`.

**3. Dashboard**

```bash
streamlit run tardis_dashboard.py
```

Le dashboard s'ouvre sur `http://localhost:8501`.

> Attention à bien lancer `streamlit run` depuis la racine du projet, sinon les chemins vers `data/` et `models/` ne seront pas trouvés.

---

## Ce qu'on a fait

### Step 1 — Data Exploration & Cleaning (`tardis_eda.ipynb`)

On commence par charger le dataset brut et inspecter sa structure (types, valeurs manquantes, doublons). Plusieurs colonnes numériques étaient stockées en string, on les convertit. On supprime les lignes dupliquées et on gère les valeurs aberrantes (retards négatifs extrêmes).

Feature engineering : extraction du mois, de l'année et du trimestre à partir de la colonne `Date`, et calcul d'un taux d'annulation par ligne.

Output : `data/cleaned_dataset.csv`

### Step 2 — Data Visualization & Analysis (`tardis_eda.ipynb`)

À partir du dataset nettoyé, on génère plusieurs visualisations pour comprendre les tendances :

- Distribution des retards à l'arrivée
- Retard moyen par mois (saisonnalité)
- Comparaison des retards par gare de départ
- Évolution des retards par année

Chaque graphique est accompagné d'une interprétation écrite.

### Step 3 — Predictive Modeling (`tardis_model.ipynb`)

On entraîne un modèle de régression pour prédire le retard moyen à l'arrivée (en minutes).

Les variables catégorielles (gares) sont encodées avec `LabelEncoder`. On compare trois modèles :

| Modèle | RMSE | MAE | R² |
|---|---|---|---|
| Baseline (mean) | 3.86 | 2.90 | 0.00 |
| Régression Linéaire | 3.55 | 2.61 | 0.15 |
| **Random Forest** | **2.70** | **1.90** | **0.51** |
| Gradient Boosting | 3.00 | 2.16 | 0.39 |

Le Random Forest est retenu (RMSE minimal, R² de 0.51). Il est retenu comme meilleur modèle.  Les features les plus importantes sont les gares encodées et la durée du trajet. Il est sauvegardé dans `models/model.joblib` avec les encodeurs `le_dep.joblib` et `le_arr.joblib`.

### Step 4 — Dashboard Streamlit (`tardis_dashboard.py`)

Le dashboard permet de :

- Sélectionner une gare de départ, une gare d'arrivée et une date précise
- Voir les statistiques historiques du trajet (retard moyen, médian, taux de ponctualité) mises à jour dynamiquement
- Visualiser le retard mois par mois pour l'année sélectionnée
- Lancer une prédiction IA et comparer avec la moyenne historique réelle

---

## Bonus réalisés

- Comparaison de plusieurs modèles (Régression Linéaire, Random Forest, Gradient Boosting)
- Filtres interactifs : gare de départ, gare d'arrivée, date complète
- Comparaison inter-années pour un même mois et trajet
- Affichage côte à côte de la prédiction IA et de la moyenne historique réelle

---

## Dépendances

```
pandas
numpy
matplotlib
seaborn
scikit-learn
streamlit
joblib
ruff
```

## Formatage

Le code est formaté avec **ruff** :

```bash
ruff format .
ruff check .
```
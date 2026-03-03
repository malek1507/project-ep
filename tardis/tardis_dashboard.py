import streamlit as st
import pandas as pd
import joblib
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from datetime import date

# Config de la page : on met un titre sympa et on utilise toute la largeur
st.set_page_config(page_title="TARDIS - SNCF Predictor", page_icon="🚄", layout="wide")

TARGET = "Retard moyen de tous les trains à l'arrivée"
MOIS_LABELS = {1:"Jan",2:"Fév",3:"Mar",4:"Avr",5:"Mai",6:"Juin",7:"Juil",8:"Aoû",9:"Sep",10:"Oct",11:"Nov",12:"Déc"}


def format_delay(minutes: float) -> str:
    """Convert decimal minutes to a readable 'X min YY sec' string."""
    total_seconds = int(round(minutes * 60))
    m, s = divmod(total_seconds, 60)
    return f"{m} min {s:02d} sec"

# --- Récupération des modèles et des encodeurs (fichiers racines) ---
# On charge tout ce qui a été exporté durant l'entraînement
model  = joblib.load("model.joblib")
le_dep = joblib.load("le_dep.joblib")
le_arr = joblib.load("le_arr.joblib")

# Préparation du dataset
df = pd.read_csv("dataset.csv")

# Nettoyage rapide des noms de gares pour éviter les erreurs de sélection
df["Gare de départ"] = df["Gare de départ"].astype(str).str.strip()
df["Gare d'arrivée"] = df["Gare d'arrivée"].astype(str).str.strip()

# On vire les gares vides ou les anomalies type '0'
df = df[df["Gare de départ"].str.len() > 1]
df = df[df["Gare d'arrivée"].str.len() > 1]

# Conversion des types pour être sûr que les calculs passent
df[TARGET] = pd.to_numeric(df[TARGET], errors="coerce")
for col in ["Durée moyenne du trajet","Nombre de circulations prévues","Nombre de trains annulés"]:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Extraction des infos temporelles
df["Date"]  = pd.to_datetime(df["Date"], errors="coerce")
df["mois"]  = df["Date"].dt.month
df["annee"] = df["Date"].dt.year
df["taux_annulation"] = df["Nombre de trains annulés"] / df["Nombre de circulations prévues"].replace(0, np.nan)

# On récupère les colonnes attendues par le modèle pour ne pas se planter à la prédiction
MODEL_FEATURES = list(model.feature_names_in_) if hasattr(model,"feature_names_in_") else ["dep_encoded","arr_encoded","mois"]
options_dep = sorted([g for g in df["Gare de départ"].dropna().unique() if len(g) > 1])
options_arr = sorted([g for g in df["Gare d'arrivée"].dropna().unique() if len(g) > 1])

# --- Interface Utilisateur ---
st.title("🚄 TARDIS — Prédiction de retards SNCF")
st.markdown("##### Anticipez vos trajets grâce à l'intelligence artificielle")
st.write("---")
st.subheader("🔍 Votre trajet")

# Formulaire de sélection du voyage
col1, col2, col3 = st.columns([2,2,1.5])
with col1:
    gare_dep = st.selectbox("🚉 Gare de départ", options_dep)
with col2:
    gare_arr = st.selectbox("🏁 Gare d'arrivée", options_arr)
with col3:
    date_voyage = st.date_input("📅 Date du voyage", value=date.today(),
                                min_value=date(2018,1,1), max_value=date(2030,12,31))

mois  = int(date_voyage.month)
annee = int(date_voyage.year)
trimestre = (mois - 1) // 3 + 1

st.caption(f"Trajet : **{gare_dep}** → **{gare_arr}** | **{MOIS_LABELS[mois]} {annee}**")

# On isole les données qui correspondent exactement au choix de l'utilisateur
df_route   = df[(df["Gare de départ"] == gare_dep) & (df["Gare d'arrivée"] == gare_arr)].copy()
df_annee   = df_route[df_route["annee"] == annee].copy()
df_mois    = df_annee[df_annee["mois"] == mois].copy()

# --- Affichage des chiffres clés ---
st.write("---")
st.subheader("📊 Statistiques historiques")

# Logique de repli : si on n'a pas le mois précis, on regarde l'année, sinon tout l'historique
if not df_mois.empty:
    df_stats, label_ctx = df_mois, f"{gare_dep} → {gare_arr} — {MOIS_LABELS[mois]} {annee}"
elif not df_annee.empty:
    df_stats, label_ctx = df_annee, f"{gare_dep} → {gare_arr} — {annee} (tous mois)"
    st.info(f"Pas de données pour {MOIS_LABELS[mois]} {annee}. Affichage des moyennes sur l'année.")
elif not df_route.empty:
    df_stats, label_ctx = df_route, f"{gare_dep} → {gare_arr} (toutes années)"
    st.info(f"Pas de données pour {annee}. Affichage de l'historique global du trajet.")
else:
    df_stats, label_ctx = df, "tous trajets confondus"
    st.warning("Trajet spécifique introuvable en base. Stats globales affichées.")

c1,c2,c3 = st.columns(3)
c1.metric("⏱ Retard moyen",        format_delay(df_stats[TARGET].mean()))
c2.metric("📊 Retard médian",       format_delay(df_stats[TARGET].median()))
c3.metric("✅ Ponctualité (<5 min)", f"{(df_stats[TARGET]<5).mean()*100:.1f}%")
st.caption(f"📌 Basé sur {len(df_stats)} enregistrement(s) ({label_ctx})")

# --- Graphique de saisonnalité ---
st.write("---")
st.subheader(f"📈 Retards mois par mois — {annee}")

# On prépare les données pour le graphique (on cherche l'année la plus pertinente)
if not df_annee.empty:
    df_graph   = df_annee
    titre_graph = f"{gare_dep}  →  {gare_arr}   |   {annee}"
elif not df_route.empty:
    annees_dispo = sorted(df_route["annee"].dropna().unique())
    annee_proche = int(min(annees_dispo, key=lambda a: abs(int(a)-annee)))
    df_graph    = df_route[df_route["annee"] == annee_proche].copy()
    titre_graph = f"{gare_dep}  →  {gare_arr}   |   {annee_proche}  *(Données {annee} absentes)*"
else:
    df_graph    = df[df["annee"] == annee].copy() if annee in df["annee"].values else df.copy()
    titre_graph = f"Moyenne nationale — {annee}"

# On calcule la moyenne par mois pour remplir les 12 barres
monthly = (
    df_graph.groupby("mois")[TARGET]
    .mean()
    .reindex(range(1,13))
    .reset_index()
    .rename(columns={TARGET:"val","mois":"mois_num"})
)
monthly["label"] = monthly["mois_num"].map(MOIS_LABELS)

# Création du plot avec Matplotlib
plt.style.use("dark_background")
fig, ax = plt.subplots(figsize=(13, 5))
fig.patch.set_facecolor("#1a1d27")
ax.set_facecolor("#1a1d27")

# On met en rouge le mois que l'utilisateur a choisi
colors = ["#e74c3c" if int(n)==mois else "#3a86c8" for n in monthly["mois_num"]]

bars = ax.bar(monthly["label"], monthly["val"],
              color=colors, edgecolor="#0f1117", linewidth=0.8, width=0.65, zorder=3)

# Affichage des valeurs exactes au-dessus des barres
for bar, val in zip(bars, monthly["val"]):
    if not np.isnan(val):
        ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.15,
                f"{val:.1f}", ha="center", va="bottom",
                fontsize=9, fontweight="bold", color="white")

# Ajout d'une ligne pour la moyenne annuelle
moy = monthly["val"].mean()
if not np.isnan(moy):
    ax.axhline(moy, color="#f39c12", linewidth=1.5, linestyle="--", zorder=4)
    ax.text(11.4, moy+0.2, f"moy. {moy:.1f} min",
            ha="right", va="bottom", fontsize=9, color="#f39c12", fontweight="bold")

# Cosmétique du graphique
ax.set_title(titre_graph, fontsize=13, fontweight="bold", pad=15, color="white")
ax.set_ylabel("Retard moyen (minutes)", color="#ccc")
ax.yaxis.grid(True, color="#2a2d3a", linewidth=0.6, zorder=0)

ax.legend(handles=[
    mpatches.Patch(color="#e74c3c", label=f"Mois choisi ({MOIS_LABELS[mois]})"),
    mpatches.Patch(color="#3a86c8", label="Autres mois"),
    mpatches.Patch(color="#f39c12", label="Moyenne sur l'année"),
], fontsize=9, loc="upper left", framealpha=0.15)

plt.tight_layout()
st.pyplot(fig)
plt.close()
plt.style.use("default")

# --- Section Machine Learning ---
st.write("---")
st.subheader("🔮 Prédire le retard")

if st.button("Calculer la prédiction 🚀", use_container_width=True):
    # On vérifie si les gares existent bien dans les encodeurs du modèle
    dep_match = next((c for c in le_dep.classes_ if isinstance(c,str) and c.strip()==gare_dep), None)
    arr_match = next((c for c in le_arr.classes_ if isinstance(c,str) and c.strip()==gare_arr), None)

    if dep_match is None or arr_match is None:
        st.error("⚠️ Cette gare n'est pas reconnue par le modèle. Changez de trajet.")
    else:
        # Encodage des gares pour le modèle
        dep_idx = int(le_dep.transform([dep_match])[0])
        arr_idx = int(le_arr.transform([arr_match])[0])
        
        # On crée le vecteur d'entrée avec des valeurs médianes pour les colonnes manquantes
        medians = {
            "dep_encoded": dep_idx, "arr_encoded": arr_idx, "mois": mois,
            "trimestre": trimestre, "annee": annee,
            "Durée moyenne du trajet":       float(df["Durée moyenne du trajet"].median()),
            "Nombre de circulations prévues":float(df["Nombre de circulations prévues"].median()),
            "taux_annulation":               float(df["taux_annulation"].median()),
        }
        
        # Lancement de la prédiction
        input_data = pd.DataFrame([[medians[f] for f in MODEL_FEATURES]], columns=MODEL_FEATURES)
        prediction = float(model.predict(input_data)[0])

        # Affichage du résultat avec un code couleur
        st.write("---")
        _,cr,_ = st.columns([1,2,1])
        with cr:
            if prediction < 5:
                st.success(f"### ✅ Retard estimé : {format_delay(prediction)}\nBonne nouvelle : trajet normalement fluide !")
            elif prediction < 15:
                st.warning(f"### ⚠️ Retard estimé : {format_delay(prediction)}\nAttention : de légères perturbations sont possibles.")
            else:
                st.error(f"### 🚨 Retard estimé : {format_delay(prediction)}\nPrévoyez de la marge, des retards sont probables.")
## todo
- admin indicator in app bar
- check start date <= end date
- cleanup code

## possible improvements 
- use Skeleton when loading
- improve tournament preview
- handle newlines in description




## env variable

BACKEND_URL : url to access the backend

## technos


### next.js
- Routing 
- Connais déjà
- 
### mui/ material ui 
- connais déjà 
- interface facile et compréhensible

## pages
- Accueil : 
  - liste des tournois
- recherche par mot clef, par catégorie : 
  - tournois par défaut
  - équipe
  - utilisateur
- affichage tournois, tabs
  - représentation graphique du tournois par défaut -> édition si organisateur/admin
  - équipes inscrites, possibilité en admin/organisateur d’ajuter/supprimer des équipes -> lien pour voir en détail
  - matchs prévus, modification de la date / status si admin/organisateur
- affichage équipe, tabs, édition des propriétés générales si leader/admin
  - liste des joueurs par défaut, édition si leader/admin
  - tournois inscrits
  - matchs prévus
- affichage utilisateurs
  - édition si admin/l’utilisateur 
  - présence dans les équipes
  - infos de base : pseudo, ...
- login
- register
- create team
  - description
  - name
  - redirect to team view where users can be added
- create tournament
  - type
  - size
  - description
  - game


components : 
- match summary ( + editable)
- tournament summary 
- user summary
- team summary

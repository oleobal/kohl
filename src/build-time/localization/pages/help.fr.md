Un outil pour mesurer, convertir et compiler des liquides alcooliques. Le principe de base est qu'on considère tous les liquides comme des mélanges d'eau et d'éthanol (alcool).

Cet outil vise la compatibilité totale avec la recommendation 22 de l'OIML, qui est le standard mondial actuel. De nombreux pays n'ont pas de législation appropriée, mais il est difficile de se tromper en s'en tenant à la R22.

## Fonctionnalités

**Conversion** : entrer une valeur dans chacune des colonnes gauche et droite d'un liquide calcule toutes les autres valeurs

**Compilation** : la somme de tous les liquides est affichée en bas de la liste

**Réduction & remontage** : il est possible « d'aller à l'envers », c'est à dire de spécifier le résultat pour calculer les entrées nécessaires. Il y a deux cas :

- **J'ai deux liquides. Combien me faut-il de _chaque_ pour obtenir un résultat au TAV donné ?**
  - Créez deux liquides, remplissez uniquement leurs colonnes de droite, et remplissez les colonnes gauche et droites sur le résultat
- **J'ai une quantité fixe d'un liquide. Combien faudrait-il que j'ajoute de cet _autre_ liquide pour obtenir un TAV donné ?**
  - Créez deux liquides, remplissez en un complètement, mais l'autre juste la colonne de droite. Remplisse uniquement la colonne de droite sur le résultat.

**[tables de l'OIML](/table/)** : vérifiez que le modèle est correct.. ou servez vous-en comme à l'ancienne

**[Diagrammes](/chart/)** : visualisez comment les modèles relient entre elles différentes grandeurs physiques

## Valeurs

| valeur              | nom OIML | unité            | description                                                                            |
| ------------------- | -------- | ---------------- | -------------------------------------------------------------------------------------- |
| temp                | t        | °C               | température du liquide                                                                 |
| vol                 | v        | L                | volume du liquide à la température donnée                                              |
| vol<sub>20°C</sub>  | —        | L                | volume que le liquide _aurait_ à 20°C                                                  |
| mass                | —        | kg               | masse du liquide                                                                       |
| TAV                 | q        | %<sub>vol</sub>  | volume de l'éthanol dans le liquide aurait seul, en pourcentage du volume total à 20°C |
| TAV<sub>mes</sub>   | q'       | %<sub>vol</sub>  | TAV _mesuré par un alcoomètre en verre à la température donnée_                        |
| TAV<sub>légal</sub> | q        | %<sub>vol</sub>  | synonyme de TAV (pour clarification)                                                   |
| LAP                 | —        | L                | volume de l'éthanol dans le liquide seul à 20°C                                        |
| dens                | ϱ        | g/L              | densité du liquide à la température donnée                                             |
| dens<sub>mes</sub>  | ϱ'       | g/L              | densité du liquide _tel que mesurée par un aréomètre à la température donnée_          |
| TAM                 | p        | %<sub>mass</sub> | masse de l'éthanol dans le liquide, en pourcentage de la masse totale à 20°C           |
| TAM<sub>mes</sub>   | p'       | %<sub>mass</sub> | TAM _mesuré par un alcoomètre en verre à la température donnée_                        |
| KAP                 | —        | kg               | masse de l'éthanol dans le liquide                                                     |

## Pourquoi a-t-on besoin d'un modèle physique ?

La mesure légale de quantité d'alcool dans une boisson est le taux d'alcool volumique. Le souci, c'est que mélanger 1 volume d'alcool pur et 1 volume d'eau ne donne pas deux volumes d'alcool à 50%.

L'eau et l'ethanol sont des molécules polaires et se 'connectent' l'une à l'autre, prenant un peu moins de place et produisant de la chaleur. Ce phénomène est prévisible mais il n'est pas linéaire.

De plus, la densité (et donc le volume) change également selon la température, encore une fois de manière non linéaire selon la proportion d'alcool.

Il y a encore d'autres facteurs qu'il faut corriger pour des mesures toujours plus précises, comme :

- la façon dont les instruments et les contenants eux-mêmes réagissent aux changements de température ;
- le changement de tension de surface selon la température et le taux d'alcool ;
- la pression atmosphérique.

### Détails sur le modèle

Le modèle programmé ici fait des corrections pour la température et l'expansion des instruments de mesure en verre. Il ne corrige **pas** la tension de surface.

Les valeurs de volume sont idéales et ne corrigent pas l'expansion du contenant ou autres facteurs.

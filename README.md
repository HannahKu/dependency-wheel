# Dependency Wheel

## Lokal Starten
run locally with webserver: python3 -m http.server

## Neue Kategorie hinzufügen
### 1. categories.csv:

 - Name und Farbe hinzufügen. Die Kategorien werden der Reihe nach (von oben nach unten) im Uhrezeigersinn angezeigt.
 - _Bsp.: Erster Eintrag im .csv wird bei 0° im Kreis gezeichnet._



### 2. wheel.js:

- Matrix auf Zeile 9 anpassen. 

- Funktionsweise Matrix: Jede Zeile repräsentiert eine Kategorie und ihre Verbindungen zu anderen Kategorien. Z.B.:
die Erste Zeile repräsentiert die erste Kategorie aus categories.csv und deren Verbindung (1 oder 0) zu allen anderen Kategorien. 

Erklärung Matrix: 
![matrix-example](https://user-images.githubusercontent.com/96266622/170023750-0a5ecf74-254a-4b77-9ac2-f3cf63c1600e.jpg)

## Sonstiges

### Hintergrundfarbe 

Wird im style.css angepasst: 
```
 body{
    background-color: #FFFFF;
}
```

### Opacity der Verbindungslinien
```
path.chord {
    stroke: #000;
    stroke-width: .10px;
    opacity: 0.7;
}
```


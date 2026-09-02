# Alcoholic liquid calculator

This is a calculator for compiling hydroalcoholic solutions. It is very common in small distilleries to add together liquids that are basically mixes of ethanol and water, at varying degrees. I aim to assist this process as much as possible.

It is inspired by the limitations of other tools I've used at work (such as [Labox](https://alcoholometry.labox-apps.com) or [Calco](https://calco.bazg.admin.ch)). I'm trying to remove all artificial limitations (notably number of liquids and defining parameters) into a comfortable UI.

See it running at https://oleobal.github.io/kohl/

# Intended features

- all values consistent with OIML R22
- an arbitrary number of liquids may be summed
- liquids may be defined through any combination of weight, volume, ABV, LPA, density, etc.
- whenever something _can_ be deduced through the parameters that have already been entered, it _will_ be without user intervention
- rectification (reduction and improvement, that is to say aiming for a specific result) is fully integrated and automatically calculated whenever possible
- liquids and the page itself can be labeled for the forgetful among us or for making cooperation easier
- persistence is automatic and shareable (app state is marshalled in the URL hash)
- no reloads, no submit buttons, as little clicking as possible
- usable on a phone under the midday sun

## OIML table tracker

Source document: https://www.oiml.org/en/files/pdf_r/r022-e75.pdf

Source document for practical tables: https://op.europa.eu/en/publication-detail/-/publication/05b3e747-f169-424e-af99-9a6879fb44f3

I consider the program compliant when it can reproduce the tables given by OIML.

Variables:

| variable          | description                                                  |
| ----------------- | ------------------------------------------------------------ |
| ϱ (rho)           | density (g/L)                                                |
| ϱ<sub>20°C</sub>  | density (g/L) the liquid _would have_ at 20°C                |
| ϱ<sub>meas.</sub> | density (g/L) as measured by a glass areometer               |
| p                 | alcohol fraction by mass                                     |
| p<sub>meas.</sub> | alcohol fraction by mass as measured by a glass alcoholmeter |
| t                 | temperature (°C)                                             |
| q                 | alcohol by volume[^ABV]                                      |
| q<sub>meas.</sub> | alcohol by volume as measured by a glass alcoholmeter        |
| α                 | expansion coefficient of glass                               |

Formulae:

| formula          | page | description                 |
| ---------------- | ---- | --------------------------- |
| F<sub>base</sub> | 12   | give ϱ from p, t (page 12)  |
| F<sub>ABV</sub>  | 5    | give q from p               |
| F<sub>α</sub>    | 6    | correct for glass expansion |
| F<sub>γ</sub>    | 8    | correct for surface tension |

Fundamental tables:

| table | description           | computation                             | status | note                             |
| ----- | --------------------- | --------------------------------------- | ------ | -------------------------------- |
| I     | ϱ <- p, t             | apply F<sub>base</sub>                  | done   |                                  |
| II    | ϱ <- q, t             | read p from IVb, apply F<sub>base</sub> |        |                                  |
| IIIa  | ϱ<sub>20°C</sub> <- p | apply F<sub>base</sub>                  |        |                                  |
| IIIb  | q <- p                | apply F<sub>ABV</sub>                   |        |                                  |
| IVa   | ϱ<sub>20°C</sub> <- q | read p from IVb, apply F<sub>base</sub> |        |                                  |
| IVb   | p <- q                | interpolate from IIIb                   |        |                                  |
| Va    | p <- ϱ<sub>20°C</sub> | interpolate from IIIa                   |        |                                  |
| Vb    | q <- ϱ<sub>20°C</sub> | interpolate from IVa                    |        | R22 says "interpolate from IIIb" |

Practical tables:

| table | description               | computation                                                         | status | note |
| ----- | ------------------------- | ------------------------------------------------------------------- | ------ | ---- |
| VI    | p <- ϱ, t                 | interpolate from I                                                  |        |      |
| VII   | q <- ϱ, t                 | read VI, apply F<sub>ABV</sub>                                      |        |      |
| VIIIa | p <- p<sub>meas.</sub>, t | read ϱ<sub>20°C</sub> from IIIa, apply F<sub>α</sub>, read VI       |        |      |
| VIIIb | q <- q<sub>meas.</sub>, t | read ϱ<sub>20°C</sub> from IVa, apply F<sub>α</sub> for α, read VII |        |      |
| IXa   | p <- ϱ, t                 | apply F<sub>α</sub>, read VI                                        |        |      |
| IXb   | q <- ϱ, t                 | apply F<sub>α</sub>, read VII                                       |        |      |

I'm not planning to implement tables X through XII.

[^ABV]: "the ratio between the volume of alcohol at 20°C in the mix and the total volume of that mix at that same temperature"; the total volume is not linear wrt. ABV or temperature

# Development

It is a Svelte app.

To run it:

`yarn install`

`yarn proto`

`yarn dev`

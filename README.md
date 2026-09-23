# Alcoholic liquid calculator

This is a calculator for compiling hydroalcoholic solutions. It is very common in small distilleries to add together liquids that are basically mixes of ethanol and water, at varying degrees. I aim to assist this process as much as possible.

It is inspired by the limitations of other tools I've used at work (such as [Labox](https://alcoholometry.labox-apps.com) or [Calco](https://calco.bazg.admin.ch)). I'm trying to remove all artificial limitations (notably number of liquids and defining parameters) into a comfortable UI to achieve a new "gold standard".

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

## OIML tables

We check program correctness by comparing our results with tables published by reputable institutions.[^legality] OIML R22 gives us a list of tables and the way to construct them.

Variables:

| variable          | unit             | description                                                  |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| ϱ (rho)           | g/L              | density                                                      |
| ϱ<sub>20°C</sub>  | g/L              | density the liquid _would have_ at 20°C                      |
| ϱ<sub>meas.</sub> | g/L              | density as measured by a glass areometer                     |
| p                 | %<sub>mass</sub> | alcohol fraction by mass                                     |
| p<sub>meas.</sub> | %<sub>mass</sub> | alcohol fraction by mass as measured by a glass alcoholmeter |
| t                 | °C               | temperature                                                  |
| q                 | %<sub>vol</sub>  | alcohol by volume[^ABV]                                      |
| q<sub>meas.</sub> | %<sub>vol</sub>  | alcohol by volume as measured by a glass alcoholmeter        |
| α                 |                  | expansion coefficient of glass                               |

Formulae:

| formula          | page | description                 |
| ---------------- | ---- | --------------------------- |
| F<sub>base</sub> | 12   | give ϱ from p, t (page 12)  |
| F<sub>ABV</sub>  | 5    | give q from p               |
| F<sub>α</sub>    | 6    | correct for glass expansion |
| F<sub>γ</sub>    | 8    | correct for surface tension |

Fundamental tables:

| table | description          | computation                             | status    | note                             |
| ----- | -------------------- | --------------------------------------- | --------- | -------------------------------- |
| I     | ϱ ← p, t             | apply F<sub>base</sub>                  | compliant |                                  |
| II    | ϱ ← q, t             | read p from IVb, apply F<sub>base</sub> | compliant |                                  |
| IIIa  | ϱ<sub>20°C</sub> ← p | apply F<sub>base</sub>                  | compliant |                                  |
| IIIb  | q ← p                | apply F<sub>ABV</sub>                   | compliant |                                  |
| IVa   | ϱ<sub>20°C</sub> ← q | read p from IVb, apply F<sub>base</sub> | compliant |                                  |
| IVb   | p ← q                | interpolate from IIIb                   | compliant |                                  |
| Va    | p ← ϱ<sub>20°C</sub> | interpolate from IIIa                   | compliant |                                  |
| Vb    | q ← ϱ<sub>20°C</sub> | interpolate from IVa                    | compliant | R22 says "interpolate from IIIb" |

Source document for fundamental tables: [OIML – _Recommendation 22_](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf)

Practical tables:

| table | description              | computation                                                   | status    | note                                                        |
| ----- | ------------------------ | ------------------------------------------------------------- | --------- | ----------------------------------------------------------- |
| VI    | p ← ϱ, t                 | interpolate from I                                            | unchecked | I wasn't able to find published examples to compare mine to |
| VII   | q ← ϱ, t                 | read VI, apply F<sub>ABV</sub>                                | unchecked | same as VI                                                  |
| VIIIa | p ← p<sub>meas.</sub>, t | read ϱ<sub>20°C</sub> from IIIa, apply F<sub>α</sub>, read VI | compliant |                                                             |
| VIIIb | q ← q<sub>meas.</sub>, t | read ϱ<sub>20°C</sub> from IVa, apply F<sub>α</sub>, read VII | compliant |                                                             |
| IXa   | p ← ϱ<sub>meas.</sub>, t | apply F<sub>α</sub>, read VI                                  | TBD       |                                                             |
| IXb   | q ← ϱ<sub>meas.</sub>, t | apply F<sub>α</sub>, read VII                                 | TBD       |                                                             |

Source documents for practical tables:

- VIIIb and IXb: [EC – _Practical tables_](https://op.europa.eu/en/publication-detail/-/publication/05b3e747-f169-424e-af99-9a6879fb44f3)
- VIIIa and VIIIb: [METAS – _Tables alcoométriques_](https://www.bazg.admin.ch/fr/determination-teneur-alcool-producteurs-spiritueux)
  - METAS agrees with EC on VIIIb values; but METAS only covers -10 to 35C and up to 100% measured (both vol and mass)
- I also considered P. Oudin's _Guide pratique d'alcoométrie_ but I don't have it on hand and it is known to contain errors

I'm not planning to implement tables X through XII.

[^legality]: In the EU, it is the formula that has legal weight, not the tables. In some other jurisdictions the table themselves have legal weight. However the model adopted by R22 is slightly wrong in the first place and the formula published by the EU is itself incomplete and erroneous when compared to R22. See Evelyne Chanson's report in the [July 2015 OIML bulletin](https://www.oiml.org/en/publications/oiml-bulletin/pdf/oiml_bulletin_july_2015.pdf). In truth authorities care little if their laws match reality as long as taxes are collected.

[^ABV]: "the ratio between the volume of alcohol at 20°C in the mix and the total volume of that mix at that same temperature"; the total volume is not linear wrt. ABV or temperature

# Development

It is a Svelte app.

To run it:

`yarn install`

`yarn proto`

`yarn dev`

To run tests:

`yarn test`

## implementation details

The general formula is sampled at .1%mass intervals for any requested temperature. It is stored as a list of (density, ABM, ABV) points. All three have a strict ordering and are bijections from one another, so it's easy if given one to find the others. Intermediate values are linearly interpolated.

Reference publications failed to publish implementation details or source code. This means some choices such as interpolation or rounding are left to ourselves and might or might not match those of the original publications, although the results do match the published tables.

In particular, tables VIII a and b present values above 100%, which is the case in the source material. These rely on dubious extrapolation; specifically, in my code, these break if the general formula is sampled up to 100% or up to 103%, but work if it is sampled to 101%. I believe I am reproducing an interpolation artifact.

This a calculator for measuring and compiling alcoholic liquids. It works by considering all liquids to be some mix of water and ethanol (alcohol).

It aims to be fully compliant with OIML recommendation 22, which is the current world standard. Many countries do not legislate or do so incorrectly, but it's hard to go wrong by sticking with R22.

## Features

**Converting**: entering one value in the left and right columns each will calculate all other values, allowing for easy conversion

**Compiling**: the sum of all the liquids is displayed at the bottom of the list

**Reduction & improvement**: it is possible to "work backwards", that is to say specify the result and calculate the required inputs. There are two cases:

- **I have two liquids. How much would I need of _each_ to achieve a given amount of a given ABV?**
  - Create two liquids, fill in only the right column, and fill in both right and left columns on the result.
- **I have a set amount of one liquid. How much would I need to add of this _other_ liquid to achieve a given ABV?**
  - Create two liquids, fill in one fully, but only the right column on the other. Fill in only the right column on the result.

**[OIML tables](/table)**: check for compliance, or just use them the old-fashioned way

## Quantities

| quantity            | OIML name | unit             | description                                                                                                      |
| ------------------- | --------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| temp                | t         | °C               | temperature of the liquid                                                                                        |
| vol                 | v         | L                | volume of the liquid at the current temperature                                                                  |
| vol<sub>20°C</sub>  | —         | L                | volume the liquid would have at 20°C                                                                             |
| mass                | —         | kg               | mass of the liquid                                                                                               |
| ABV                 | q         | %<sub>vol</sub>  | volume the ethanol inside the liquid would have alone, as a percentage of the total volume of the liquid at 20°C |
| ABV<sub>meas</sub>  | q'        | %<sub>vol</sub>  | ABV _as measured by a glass alcoholmeter at the current temperature_                                             |
| ABV<sub>legal</sub> | q         | %<sub>vol</sub>  | synonym of ABV, for disambiguation                                                                               |
| LPA                 | —         | L                | volume of 100% alcohol inside the liquid at 20°C                                                                 |
| dens                | ϱ         | g/L              | density of the liquid at the current temperature                                                                 |
| dens<sub>meas</sub> | ϱ'        | g/L              | density of the liquid _as measured by a glass areometer at the current temperature_                              |
| ABM                 | p         | %<sub>mass</sub> | mass of the ethanol inside the liquid as a percentage of the total mass of the liquid                            |
| ABM<sub>meas</sub>  | p'        | %<sub>mass</sub> | ABM _as measured by a glass alcoholmeter at the current temperature_                                             |
| KPA                 | —         | kg               | mass of the ethanol inside the liquid                                                                            |

## Why would I need a physical model?

The legally mandated measure of alcohol content in beverages is alcohol by volume. The issue is, mixing 1 volume of pure ethanol and 1 volume of water will not give you two volumes of 50% ethanol.

Water and ethanol are polar molecules and will 'plug' into one another, taking a bit less space and releasing heat. This phenomenon is predictable but it is not linear.

In addition, density (and therefore volume) also change in relation to temperature.. But again, this varies non-linearly depending on alcohol content.

There are still other issues for ever more precise measurements, such as:

- how instruments and containers themselves react to temperature,
- the change in surface tension depending on temperature and alcohol content,
- atmospheric pressure.

### Model details

The model implemented here performs correction for temperature and expansion of the glass measuring instrument. It does **not** correct for surface tension.

Volume values are ideal and do not adjust for expansion of the vessel or other factors.

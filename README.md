# Alcoholic liquid calculator

This is a calculator for compiling hydroalcoholic solutions. It is very common in small distilleries to add together liquids that are basically mixes of ethanol and water, at varying degrees. I aim to assist this process as much as possible.

It is inspired by the limitations of other tools I've used at work (such as [Labox](https://alcoholometry.labox-apps.com) or [Calco](https://calco.bazg.admin.ch)). I'm trying to remove all artificial limitations (notably number of liquids and defining parameters) into a comfortable UI.

See it running at https://oleobal.github.io/kohl/

# Intended features

- an arbitrary number of liquids may be summed
- liquids may be defined through any combination of weight, volume, ABV, LPA, density, etc.
- whenever something _can_ be deduced through the parameters that have already been entered, it _will_ be without user intervention
- rectification (reduction and improvement, that is to say aiming for a specific result) is fully integrated and automatically calculated whenever possible
- liquids and the page itself can be labeled for the forgetful among us or for making cooperation easier
- persistence is automatic and shareable (app state is marshalled in the URL hash)
- no reloads, no buttons, as little clicking as possible
- usable on a phone under the midday sun

# Development

It is a Svelte app.

To run it:

`yarn install`

`yarn proto`

`yarn dev`

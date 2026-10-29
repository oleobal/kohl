<script lang="ts">
  let {
    label,
    inputs,
    zebraStep,
    f,
  }: {
    label: any;
    inputs: { x: any[]; y: any[] };
    zebraStep: { x: number; y: number };
    f: (x: any, y: any) => { title: any; result: any };
  } = $props();

  let hoveredColumns: boolean[] = $state(
    // svelte-ignore state_referenced_locally (it's a prop and its length does not vary and we only need it at initialization)
    Array.from({ length: inputs.x.length }, () => false),
  );
</script>

<table>
  <thead>
    <tr>
      <td style="font-size: small; white-space: nowrap;">
        {@html label}
      </td>
      {#each inputs.x as x, xi}
        <td
          class={{
            "even-column": xi % (zebraStep.x * 2) < zebraStep.x,
            "td-highlighted-row": hoveredColumns[xi],
          }}
          style="text-align: center;"
        >
          <strong>{x}</strong>
        </td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each inputs.y as y, yi}
      <tr
        class={{ "even-row": yi % (zebraStep.y * 2) < zebraStep.y }}
        style="text-align: right; font-variant-numeric: lining-nums;"
      >
        <td>
          <strong>{y}</strong>
        </td>
        {#each inputs.x as x, xi}
          {const { title, result } = $derived(f(x, y))}
          <td
            class={{
              "even-column": xi % (zebraStep.x * 2) < zebraStep.x,
              "td-highlighted-row": hoveredColumns[xi],
            }}
            style="text-align: right; font-variant-numeric: lining-nums;"
            onmouseover={() => {
              hoveredColumns[xi] = true;
            }}
            onfocus={() => {}}
            onmouseout={() => {
              hoveredColumns[xi] = false;
            }}
            onblur={() => {}}
            {title}
          >
            {result}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  td {
    padding: 5px;
  }
  .even-row {
    background-color: light-dark(
      hsla(0, 100%, 97%, 0.667),
      hsla(0, 50%, 17%, 0.667)
    );
  }
  .even-column {
    background-color: light-dark(
      hsla(240, 100%, 97%, 0.667),
      hsla(240, 50%, 17%, 0.667)
    );
  }

  tr:hover {
    background-color: light-dark(#ffca, hsla(60, 100%, 20%, 0.667));
  }
  td:hover {
    background-color: light-dark(#eeba, hsla(60, 100%, 40%, 0.667));
  }

  .td-highlighted-row {
    background-color: light-dark(#ffca, hsla(60, 100%, 20%, 0.667));
  }
</style>

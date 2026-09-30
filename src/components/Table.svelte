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
          {const { title, result } = f(x, y)}
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
    background-color: #feea;
  }
  .even-column {
    background-color: #eefa;
  }

  tr:hover {
    background-color: #ffca;
  }
  td:hover {
    background-color: #eeba;
  }

  .td-highlighted-row {
    background-color: #ffca;
  }
</style>

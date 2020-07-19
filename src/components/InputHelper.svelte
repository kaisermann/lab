<script>
  export const mouse = {
    position: null,
    isDown: false,
  };

  export let keys = {};

  function handleKeyDown(e) {
    const key = e.key.toLowerCase();

    keys[key] = true;
  }

  function handleKeyUp(e) {
    delete keys[e.key.toLowerCase()];

    keys = keys;
  }
</script>

<svelte:window
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
  on:mousemove={(e) => (mouse.position = [e.clientX, e.clientY])}
  on:mouseup={() => (mouse.isDown = false)}
  on:mousedown={() => (mouse.isDown = true)} />

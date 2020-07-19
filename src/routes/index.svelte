<style lang="postcss">
  a {
    @apply block text-blue-900;
    @apply px-4 py-6;
    font-size: clamp(1rem, 12vw, 6rem);

    &:hover {
      @apply bg-blue-900 text-white transition-colors duration-100 ease-linear;
    }
  }
</style>

<svelte:head>
  <title>🧪 Experimental Lab</title>
</svelte:head>

<nav>
  <a href="/experiments/ray-marching">Ray Marching</a>
</nav>

<button class="app-button" on:click>
  <slot></slot>
</button>

<style>
  .app-button {
    border: gray 1px solid;
    border-radius: 4px;
    background-color: rgb(199 199 199 / 75%);
    box-shadow: 0 4px 8px 1px rgb(0 0 0 / 50%);
    padding: 2px;
    display: flex;
    cursor: pointer;
    transition: transform 250ms ease, box-shadow 250ms ease;
  }

  .app-button:active,
  .app-button:hover {
    border-color: var(--color-accent-bg);
  }

  .app-button:active {
    transform: translate(1px, 1px);
    box-shadow: 0 2px 4px 1px rgb(0 0 0 / 50%);
  }

  .app-button:focus {
    outline: coral 1px dashed;
    outline-offset: 4px;
  }
</style>
<!-- src/routes/+error.svelte -->
<script context="module">
    export const load = async ({ error, status }) => {
      return {
        status,
        errorMessage: error?.message ?? 'An unexpected error occurred'
      }
    }
  </script>
  
  <script>
    export let status
    export let errorMessage
  </script>
  
  <h1>Error {status}</h1>
  <p>{errorMessage}</p>
  <a href="/">Go back to the homepage</a>
  
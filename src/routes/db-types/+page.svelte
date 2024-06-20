<script>
    async function loadDBTypes(){
        const res = await fetch('/db-types?table=communities');
        const data = await res.json();
        console.log(data);
    
    }

</script>

<button class="btn" on:click={loadDBTypes}>loadDBTypes(Get)</button>

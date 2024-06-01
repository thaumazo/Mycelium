<script>

    async function generateDBTypes(event){
        const res = await fetch('/db-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        console.log(res);
        const data = await res.json();
        console.log(data);
    
    }

    async function loadDBTypes(event){
        const res = await fetch('/db-types');
        console.log(res);
        const data = await res.text();
        console.log(data);
    
    }

</script>


<button class="btn" on:click={generateDBTypes}>generateDBTypes</button>
<button class="btn" on:click={loadDBTypes}>loadDBTypes</button>

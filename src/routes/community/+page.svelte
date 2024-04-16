<!-- +page.svelte -->
<script>
    export let data;

    // Function to extract headers from the first entry
    let headers = [];
    if (data.community.length > 0) {
        headers = Object.keys(data.community[0]);
    }
</script>

<table class="table table-zebra">
    <thead>
        <tr>
            {#each headers as header}
                <th>{header}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data.community as person}
            <tr>
                {#each headers as header}
                    <td>{person[header]}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
<!-- end file -->

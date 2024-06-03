<script>
    export let data = {};
    export let format = {};
    export let level = 0;
    export let display = 'id'; // Key to display for nested objects

    function isObject(val) {
        return val && typeof val === 'object' && !Array.isArray(val);
    }
</script>

<div class="nested-table" style="margin-left: {level * 20}px;">
    {#if Array.isArray(data)}
        <ul>
            {#each data as item}
                <li>
                    {#if isObject(item)}
                        {#if display in item}
                            <strong>{display}:</strong> {item[display]}<br />
                        {/if}
                    {:else}
                        {item}
                    {/if}
                    ---
                </li>
            {/each}
        </ul>
    {:else if isObject(data)}
        {#if display in data}
            <strong>{display}:</strong> {data[display]}<br />
        {/if}
    {:else}
        {data}
    {/if}
</div>

<style>
    .nested-table {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>

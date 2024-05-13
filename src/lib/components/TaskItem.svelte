<!-- TaskItem.svelte -->
<script>
    export let task;
  </script>
  
  <form method="POST" action="?/edit" class="card bordered w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <input type="hidden" name="id" value={task.id} />
      {#if task.editing}
        <input class="input input-bordered w-full max-w-xs" type="text" name="name" value={task.name} />
        <select class="select select-bordered w-full max-w-xs" name="status">
          <option value="todo" selected={task.status === 'todo'}>To Do</option>
          <option value="doing" selected={task.status === 'doing'}>Doing</option>
          <option value="done" selected={task.status === 'done'}>Done</option>
        </select>
        <button type="submit" name="_action" value="save" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-ghost" on:click={() => task.editing = false}>Cancel</button>
      {:else}
        <h2 class="card-title">{task.name}</h2>
        <p>Status: {task.status}</p>
        <p>Scheduled {new Date(task.scheduled).toLocaleDateString()}</p>
        <p>Due {new Date(task.due).toLocaleDateString()}</p>
        <div class="card-actions justify-end">
          <button type="button" class="btn btn-primary" on:click={() => task.editing = true}>Edit</button>
          <button type="submit" formaction="?/delete" class="btn btn-secondary">Delete</button>
        </div>
      {/if}
    </div>
  </form>
  
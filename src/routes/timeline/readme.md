Going to any endpoint will fetch and display the data for that table. 
In order to customize the UI for a given table, make a copy of this folder and name it to the table you want to access (ex: tasks)
Then, in the +page.server.js file you can override which data is being selected/filtered.
You can customize the UI by changing the the +page.svelte file
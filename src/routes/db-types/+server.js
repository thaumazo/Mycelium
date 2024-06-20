
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
function generateSupabaseQueryWithFormat(schema, tableName, display = {}, displayId = null) {
    let query = `*`; // Start with selecting all columns from the main table
    let includedTables = new Set([tableName]); // Track included tables to avoid duplicates
    let format = {}; // Object to store format information
    const MAX_DEPTH = 1; // Maximum depth for recursion to avoid infinite loops

    // Helper function to extract the foreign table name from the description
    function extractTableName(description) {
        const match = description.match(/`(.+?)`/);
        return match ? match[1].split('.')[0] : null;
    }

    // Helper function to handle many-to-many relationships
    function getManyToManyRelationship(tableName, relatedTableName) {
        console.log(tableName, relatedTableName);
        console.log(schema[tableName])
        console.log(schema[relatedTableName]);
        const relationships = schema[relatedTableName]?.relationships || [];
        const possibleRelationships = relationships.filter(rel => rel.relationship.includes(`${relatedTableName}`));
        console.log(`Relationships for ${tableName} and ${relatedTableName}:`, possibleRelationships);
        if (possibleRelationships.length === 1) {
            return possibleRelationships[0].relationship.split(' ')[0]; // Extract the relationship part before 'using'
        } else if (possibleRelationships.length > 1) {
            // Handle the case where there are multiple possible relationships
            console.warn(`Multiple many-to-many relationships found for ${tableName} and ${relatedTableName}`);
            console.warn(`Using the first relationship found: ${possibleRelationships[0].relationship}`);
            return possibleRelationships[0].relationship.split(' ')[0]; // Default to the first one for now
        }
        return null;
    }

    // Function to add format information for a table schema
    function addFormat(tableSchema, tableName, formatObj, displayObj, depth) {
        if (depth > MAX_DEPTH) {
            console.warn(`Max depth of ${MAX_DEPTH} exceeded for table ${tableName}`);
            return;
        }

        Object.entries(tableSchema.properties).forEach(([key, value]) => {
            if (value.description && value.description.includes('Foreign Key')) {
                // Extract the foreign table name from the foreign key description
                const foreignTable = extractTableName(value.description);
                if (foreignTable && schema[foreignTable] && !includedTables.has(foreignTable)) {
                    // Add foreign table format information
                    formatObj[key] = { format: `foreign table [${foreignTable}]`, foreignKey: true, table: foreignTable };
                    includedTables.add(foreignTable); // Mark the foreign table as included to prevent infinite loops
                    addFormat(schema[foreignTable], foreignTable, formatObj[key], displayObj?.[key] || {}, depth + 1);
                } else {
                    // Add format information for the foreign key field
                    formatObj[key] = { format: value.format || null, foreignKey: true };
                }
            } else {
                // Add format information for regular fields
                formatObj[key] = { format: value.format || null, foreignKey: false };
            }
            // Merge display data
            formatObj[key].display = displayObj?.[key]?.display ?? true;
        });
    }

    // Add format information for the primary table
    if (schema[tableName]) {
        addFormat(schema[tableName], tableName, format, display, 0);
    }

    // Function to include direct foreign keys in the query and format object
    function includeDirectForeignKeys(tableName, formatObj, displayObj, depth) {
        if (depth > MAX_DEPTH) {
            console.warn(`Max depth of ${MAX_DEPTH} exceeded for table ${tableName}`);
            return;
        }

        if (schema[tableName] && schema[tableName].properties) {
            Object.entries(schema[tableName].properties).forEach(([key, value]) => {
                if (value.description && value.description.includes('Foreign Key')) {
                    const foreignTable = extractTableName(value.description);
                    if (foreignTable && schema[foreignTable] && !includedTables.has(foreignTable)) {
                        // Include the foreign table in the query with an alias
                        console.log(`Including foreign table ${foreignTable} in the query for ${tableName}`);
                        query += `, ${key}: ${foreignTable}(*)`;
                        includedTables.add(foreignTable);
                        // Add format information for the foreign table
                        addFormat(schema[foreignTable], foreignTable, formatObj[key], displayObj?.[key] || {}, depth + 1);
                        includeDirectForeignKeys(foreignTable, formatObj[key], displayObj?.[key] || {}, depth + 1);
                    }
                }
            });
        }
    }

    // Function to include related tables (like join tables) in the query and format object
    function includeJoinTables(tableName, formatObj, displayObj, depth) {
        if (depth > MAX_DEPTH) {
            console.warn(`Max depth of ${MAX_DEPTH} exceeded for table ${tableName}`);
            return;
        }

        Object.entries(schema).forEach(([key, value]) => {
            if (value.properties) {
                const relatedKeys = Object.keys(value.properties);
                const relatedTables = relatedKeys.map(key => extractTableName(value.properties[key].description || ''));
                if (relatedTables.includes(tableName)) {
                    const otherTables = relatedTables.filter(t => t !== tableName && schema[t]);
                    otherTables.forEach(t => {
                        if (t && !includedTables.has(t)) {
                            // Include the join table in the query
                            const relationship = getManyToManyRelationship(tableName, t);
                            if (relationship) {
                                console.log(`Including many-to-many relationship ${t}!${relationship} in the query`);
                                query += `, ${tableName}!${relationship}(*)`;
                            } else {
                                console.log(`Including join table ${t} in the query`);
                                query += `, ${t}(*)`;
                            }
                            includedTables.add(t);
                            // Add format information for the join table
                            if (!formatObj[t]) {
                                formatObj[t] = { format: `foreign table [${t}]`, display: true, table: t };
                            }
                            addFormat(schema[t], t, formatObj[t], displayObj?.[t] || {}, depth + 1);
                            includeDirectForeignKeys(t, formatObj[t], displayObj?.[t] || {}, depth + 1);
                        }
                    });
                }
            }
        });
    }

    // Include direct foreign keys and join tables
    includeDirectForeignKeys(tableName, format, display, 0);
    includeJoinTables(tableName, format, display, 0);

    if (displayId) {
        format.displayId = displayId;
    }

    return { query, format };
}

// going to loop through all the tables and get the foreign keys
function generateQueryFormat(definitions, tableName) {
    let query = `*`;
    let format = {};
    let foreignTables = [];
    let additionalQueries = [];

    // Top level loop - looks at all of the tables. Key is the table name, value is the table schema
    Object.entries(definitions).forEach(([key, value]) => {
        let table = key;

        // add the formats from the tableName table
        if (value.properties) {
            let tables = [];
            let include = false;
            let tableFormat = {};
            let references = [];

            // Second level loop - looks at all of the properties of the table and checks for foreign keys
            let entries = Object.entries(value.properties);
            for (let i = 0; i < entries.length; i++) {
                let [key, value] = entries[i];
                tableFormat[key] = {format: value.format, display: true};
                if (value.description && value.description.includes(`<fk`)) {
                    // Get the foreign table name from the description by looking for the section table=`table_name`
                    // ex full string: "This is a Foreign Key to `communities.id`.<fk table='communities' column='id'/>"
                    let tn = value.description.match(/table='([^']+)'/);
                    let name = tn ? tn[1] : null;
                    
                    if(references.includes(name)){
                        //TODO: handle double reference to the same table. For now just skip.
                        //currently is being added, but is incorrect as it doesn't include the query for this triggering item.
                        //ex: This is triggered on "community2" but doesn't encode community 2 as a foreign key
                        include = false; 
                        additionalQueries.push({table, key, name});
                        break;
                    };
                    //add table name to references to avoid double references
                    references.push(name);
                    if (value.description.includes(tableName)) {
                        //if the table links to the table we are looking for, include it
                        include = true;                      
                    }  
                    
                    //always add table to list -> we don't always know if we need it until later
                    tables.push(key);

                    //handle foreign key directly liked from our table 
                    if(table == tableName){
                        tableFormat[key] = {format: `foreign table [${key}]`, display: true, table: key};
                        Object.entries(definitions[name].properties).forEach(([subKey, subValue]) => {
                            // console.log(subKey, subValue.format)
                            tableFormat[key][subKey] = {format: subValue.format, display: true};
                        });
                        
                    }
                }
            }
            if(table == tableName){
                format = {...format, ...tableFormat};
                for (let i = 0; i < tables.length; i++) {
                    query += `, ${tables[i]}(*)`;
                    // format[tables[i]] = { format: `foreign table [${tables[i]}]`, display: true, table: tables[i]};

                }

            }
            if (include && table != tableName){
                format[table] = { format: `foreign table [${table}]`, display: true, table: table };
                format[table] = {...format[table], ...tableFormat};
                query += `, ${table}(`;
                for (let i = 0; i < tables.length; i++) {
                    if (i > 0) {
                        query += ",";
                    }
                    query += `${tables[i]}(*)`;
                }
                query += `)`;
                foreignTables.push({ table, tables });
            }
        }
    });
    return { foreignTables, query, format, additionalQueries };
}

export const GET = async ({ url, locals: { supabase, safeGetSession } }) => {
    console.log('db-types GET');
    let { user } = await safeGetSession();
    try {
        let res = await fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${PUBLIC_SUPABASE_ANON_KEY}`)
        let schema = await res.json();
        let table = url.searchParams.get('table');

        let { foreignTables, query, format, additionalQueries } = generateQueryFormat(schema.definitions, table);


        for (let i = 0; i < additionalQueries.length; i++) {
            let { foreignTables, query: additionalQuery, format: additionalFormat } = generateQueryFormat(schema.definitions, additionalQueries[i].table);
            additionalQueries[i] = { ...additionalQueries[i], foreignTables, query: additionalQuery, format: additionalFormat };
        }

        return new Response(JSON.stringify({foreignTables, query, schema: schema.definitions, format, additionalQueries}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {

        console.error('Error:', error.message);
        return new Response(JSON.stringify({ error: 'Error fetching types' }));
    };
};
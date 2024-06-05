import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { SECRET_SUPABASE_ACCESS_TOKEN, SECRET_OPENAI_API_KEY } from '$env/static/private';
import { OpenAI, FunctionTool, OpenAIAgent, Settings, Anthropic, AnthropicAgent } from "llamaindex";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'


function generateSupabaseQueryWithFormat(schema, tableName) {
    let query = `*`; // Start with selecting all columns from the main table
    let includedTables = new Set([tableName]); // Track included tables to avoid duplicates
    let format = {}; // Object to store format information

    // Helper function to extract the foreign table name from the description
    function extractTableName(description) {
        const match = description.match(/`(.+?)`/);
        return match ? match[1].split('.')[0] : null;
    }

    // Function to add format information for a table schema
    function addFormat(tableSchema, tableName, formatObj) {
        Object.entries(tableSchema.properties).forEach(([key, value]) => {
            if (value.description && value.description.includes('Foreign Key')) {
                // Extract the foreign table name from the foreign key description
                const foreignTable = extractTableName(value.description);
                if (foreignTable && schema[foreignTable]) {
                    // Add foreign table format information
                    formatObj[key] = { format: `foreign table [${foreignTable}]`, foreignKey: true, table: foreignTable};
                    addFormat(schema[foreignTable], foreignTable, formatObj[key]);
                } else {
                    // Add format information for the foreign key field
                    formatObj[key] = { format: value.format || null, foreignKey: true };
                }
            } else {
                // Add format information for regular fields
                formatObj[key] = { format: value.format || null, foreignKey: false };
            }
            formatObj[key].display = true;
        });
    }

    // Add format information for the primary table
    if (schema[tableName]) {
        addFormat(schema[tableName], tableName, format);
    }

    // Function to include direct foreign keys in the query and format object
    function includeDirectForeignKeys(tableName, formatObj) {
        if (schema[tableName] && schema[tableName].properties) {
            Object.entries(schema[tableName].properties).forEach(([key, value]) => {
                if (value.description && value.description.includes('Foreign Key')) {
                    const foreignTable = extractTableName(value.description);
                    if (foreignTable && schema[foreignTable] && !includedTables.has(foreignTable)) {
                        // Include the foreign table in the query with an alias
                        query += `, ${key}: ${foreignTable}(*)`;
                        includedTables.add(foreignTable);
                        // Add format information for the foreign table
                        addFormat(schema[foreignTable], foreignTable, formatObj[key]);
                        includeDirectForeignKeys(foreignTable, formatObj[key]);
                    }
                }
            });
        }
    }

    // Function to include related tables (like join tables) in the query and format object
    function includeJoinTables(tableName, formatObj) {
        Object.entries(schema).forEach(([key, value]) => {
            if (value.properties) {
                const relatedKeys = Object.keys(value.properties);
                const relatedTables = relatedKeys.map(key => extractTableName(value.properties[key].description || ''));
                if (relatedTables.includes(tableName)) {
                    const otherTables = relatedTables.filter(t => t !== tableName && schema[t]);
                    otherTables.forEach(t => {
                        if (t && !includedTables.has(t)) {
                            // Include the join table in the query
                            query += `, ${t}(*)`;
                            includedTables.add(t);
                            // Add format information for the join table
                            if (!formatObj[t]) {
                                formatObj[t] = { format: `foreign table [${t}]`, display: true, table: t};
                            }
                            addFormat(schema[t], t, formatObj[t]);
                            includeDirectForeignKeys(t, formatObj[t]);
                        }
                    });
                }
            }
        });
    }

    // Include direct foreign keys and join tables
    includeDirectForeignKeys(tableName, format);
    includeJoinTables(tableName, format);

    return { query, format };
}

export const GET = async ({ url, locals: { supabase } }) => {
  console.log('db-types GET');
  try {

    let res = await fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${PUBLIC_SUPABASE_ANON_KEY}`)
    let schema = await res.json()
    // console.log(data.definitions);
    let table = url.searchParams.get('table');

    let {query, format} = generateSupabaseQueryWithFormat(schema.definitions, table);
    // let query = 'items?select=*';
console.log(query, format);

    return new Response(JSON.stringify({query, format}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: 'Error fetching types JSON file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

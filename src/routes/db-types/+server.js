import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { SECRET_SUPABASE_ACCESS_TOKEN, SECRET_OPENAI_API_KEY } from '$env/static/private';
import { OpenAI, FunctionTool, OpenAIAgent, Settings, Anthropic, AnthropicAgent } from "llamaindex";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'


function generateSupabaseQueryWithFormats(schema, tableName) {
  // Start with the basic query for the primary table
  let query = `*`;
  let includedTables = new Set([tableName]);  // Keep track of included tables to avoid duplicates
  let formats = {};  // To store the format of each column

  // Helper function to extract the foreign table from the description
  function extractTableName(description) {
      const match = description.match(/`(.+?)`/);
      return match ? match[1].split('.')[0] : null;
  }

  // Function to add formats from a table schema
  function addFormats(tableSchema, tableName, formatsObj, nest = false) {
      if (nest && !formatsObj[tableName]) {
          formatsObj[tableName] = { format: 'foreign table' };
      }
      const targetObj = nest ? formatsObj[tableName] : formatsObj;
      Object.entries(tableSchema.properties).forEach(([key, value]) => {
          targetObj[key] = {
              format: value.format || null,
              foreignKey: false
          };
          if (value.description && value.description.includes('Foreign Key')) { 
              targetObj[key].foreignKey = true;
          }
      });
  }

  // Add formats for the primary table at the top level
  if (schema[tableName]) {
      addFormats(schema[tableName], tableName, formats);
  }

  // Helper function to recursively add foreign key related tables
  function includeRelatedTables(tableName, formatsObj) {
      if (schema[tableName] && schema[tableName].properties) {
          Object.entries(schema[tableName].properties).forEach(([key, value]) => {
              if (value.description && value.description.includes('Foreign Key')) {
                  const foreignTable = extractTableName(value.description);
                  if (foreignTable && schema[foreignTable] && !includedTables.has(foreignTable)) {
                      query += `,${foreignTable}(*)`;
                      includedTables.add(foreignTable);
                      addFormats(schema[foreignTable], foreignTable, formatsObj, true);
                      includeRelatedTables(foreignTable, formatsObj[foreignTable]);
                  }
              }
          });
      }
  }

  // Include foreign key tables
  includeRelatedTables(tableName, formats);

  // Include related data from join tables
  Object.entries(schema).forEach(([key, value]) => {
      if (value.properties) {
          const relatedKeys = Object.keys(value.properties);
          const relatedTables = relatedKeys.map(key => extractTableName(value.properties[key].description || ''));
          if (relatedTables.includes(tableName)) {
              // Identify the other table involved in the join
              const otherTables = relatedTables.filter(t => t !== tableName && schema[t]);
              otherTables.forEach(t => {
                  if (t && !includedTables.has(t)) {
                      query += `,${t}(*)`;
                      includedTables.add(t);
                      addFormats(schema[t], t, formats, true);
                      includeRelatedTables(t, formats[t]);
                  }
              });
          }
      }
  });

  return { query, format: formats };
}

export const GET = async ({ url, locals: { supabase } }) => {
  console.log('db-types GET');
  try {

    let res = await fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${PUBLIC_SUPABASE_ANON_KEY}`)
    let schema = await res.json()
    // console.log(data.definitions);
    let table = url.searchParams.get('table');

    let {query, format} = generateSupabaseQueryWithFormats(schema.definitions, table);
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

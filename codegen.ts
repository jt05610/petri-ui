import type { CodegenConfig } from "@graphql-codegen/cli";


const config: CodegenConfig = {
  schema: "petri-graph/**/*.graphqls",
  documents: ["petri-graph/**/*.graphql"],
  generates: {
    "./app/models/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql"
      }
    }
  },
  ignoreNoDocuments: true
};


export default config;
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'foodie-movie',

  projectId: 'd5tuwe83',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'es', title: 'Spanish'},
        {id: 'en', title: 'English'},
      ],
      schemaTypes: ['product'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

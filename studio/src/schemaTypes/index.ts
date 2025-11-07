import {page} from './documents/page'
import {brand} from './documents/brand'
import {manufacturer} from './documents/manufacturer'
import {vehicle} from './documents/vehicle'
import {salesRepresentative} from './documents/salesRepresentative'
import {additionalOption} from './documents/additionalOption'
import {teamMember} from './documents/teamMember'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  brand,
  manufacturer,
  vehicle,
  salesRepresentative,
  additionalOption,
  teamMember,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
]

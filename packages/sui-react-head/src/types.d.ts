export interface Tag {
  children?: string
  name?: string
  hreflang?: string
  rel?: string
  content?: string
}

interface ComponentTag {
  props: Tag
}

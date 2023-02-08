export interface Tag {
  children?: string
  name?: string
  href?: string
  hreflang?: string
  rel?: string
  content?: string
}

interface ComponentTag {
  props: Tag
}

export interface Style {
  children: string
  media?: string
  type?: string
}

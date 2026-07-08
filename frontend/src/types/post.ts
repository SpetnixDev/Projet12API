export interface Post {
  id: number
  title: string
  contentSource: string
  contentRenderedHtml?: string
  postedAt?: string
  modifiedAt?: string
  ownerId?: string
  ownerName?: string
}

export interface UpsertPostRequest {
  title: string
  contentSource: string
}

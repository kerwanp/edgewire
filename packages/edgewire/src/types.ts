export type EdgewireConfig = {
  viewPath: string
}

export type ComponentSnapshot = {
  data: any
  checksum: string
  memo: {
    id: string
    name: string
    [key: string]: any
  }
}

export type ComponentUpdates = Record<string, any>

export type ComponentCall = {
  path: string | null
  method: string
  params: any[]
}

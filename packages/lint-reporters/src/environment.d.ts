declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_REPOSITORY_ID: number
      MS_URL: string
    }
  }
}
export {}

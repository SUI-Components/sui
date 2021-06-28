import Head from './index'

const title = false

const demo: React.FC<any> = () => (
  <Head>
    {title && <title>title</title>}
    <title>title</title>
  </Head>
)

export default demo

/* eslint-disable */
interface ThingProps {
  name: string
  type?: 'inert' | 'moving'
}

export default function Thing({name, type = 'moving'}: ThingProps): React.FC {
  return <div data-type={type}>{name}</div>
}

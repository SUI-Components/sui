import {exec as execNode} from 'child_process'
import {promisify} from 'util'

import {HTTPSender} from './Sender/HTTPSender'
import type {Sender} from './Sender/Sender'

const exec = promisify(execNode)
type Repository = string

export class Reporter {
  sender: Sender = HTTPSender.create()

  async _isMaster(): Promise<boolean> {
    let branch = await exec('git rev-parse --abbrev-ref HEAD').catch(() => 'UNKNOW_BRANCH')

    if (typeof branch !== 'string') {
      branch = branch.stdout
    }

    return branch.trim() === 'master' || branch.trim() === 'main'
  }

  async _getRepository(): Promise<Repository> {
    let url = await exec('git config --get remote.origin.url').catch(() => 'git@github.com:sui/remote-url.git')

    if (typeof url !== 'string') {
      url = url.stdout
    }

    const cleanUrl = url.trim().replace('\n', '')
    const isHttp = cleanUrl.startsWith('https://')

    if (isHttp) {
      return cleanUrl.split('/')[4]?.replace('.git', '')
    } else {
      const [, address] = cleanUrl.split('@')
      return address.split('/')[1].replace('.git', '')
    }
  }
}
